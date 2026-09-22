# StartupHub — Architecture

## High-level overview

StartupHub is a standard three-tier MERN application: a React SPA talks to
an Express REST API over HTTPS/JSON, the API talks to MongoDB via Mongoose,
and a dedicated service module talks to an external AI provider on the
API's behalf. The browser never talks to MongoDB or the AI provider
directly.

```mermaid
flowchart LR
    Browser["React (Vite) SPA"] -- "Axios / REST (JWT)" --> API["Express API"]
    API -- "Mongoose" --> DB[(MongoDB)]
    API -- "server-side only, AI_API_KEY never sent to browser" --> AI["AI Provider (OpenAI-compatible)"]
```

## Request flow (general)

```mermaid
sequenceDiagram
    participant U as User
    participant R as React SPA
    participant E as Express API
    participant M as MongoDB

    U->>R: Interacts with a page
    R->>E: Axios request + Authorization: Bearer <JWT>
    E->>E: Rate limiter → auth middleware → validators
    E->>M: Mongoose query/write (scoped to req.user._id)
    M-->>E: Document(s)
    E-->>R: JSON response
    R-->>U: Updated UI
```

## AI business-plan generation flow

```mermaid
sequenceDiagram
    participant U as User
    participant R as React SPA
    participant E as Express API
    participant S as aiService.js
    participant AI as AI Provider

    U->>R: Submits business idea + budget + target customers
    R->>R: Frontend validation
    R->>E: POST /api/plans/generate
    E->>E: express-validator (backend validation)
    E->>E: JWT auth middleware
    E->>S: generateBusinessPlan(input)
    alt AI_API_KEY not set
        S-->>E: { configured: false, message }
        E-->>R: 200 { aiConfigured: false, message }
        R-->>U: "AI not configured" notice
    else AI_API_KEY set
        S->>AI: POST /chat/completions (structured-JSON prompt)
        AI-->>S: JSON (or malformed text)
        S->>S: parse + validate + normalize required fields
        S-->>E: { configured: true, planData }
        E-->>R: 200 { aiConfigured: true, planData }
        R-->>U: Renders generated plan (not yet saved)
        U->>R: Clicks "Save Plan"
        R->>E: POST /api/plans { ...input, planData }
        E->>M: BusinessPlan.create({ userId, ...input, planData })
        M-->>E: Saved document
        E-->>R: 201 { plan }
        R-->>U: Redirected to /plans/:id
    end
```

## Backend layering

```
routes/        → only route definitions + which middleware/validators apply
controllers/    → HTTP request/response handling; calls services & models
services/       → business logic that isn't pure CRUD (aiService.js)
models/         → Mongoose schemas (User, BusinessPlan)
middleware/     → auth (JWT), centralized error handler, rate limiting
validators/     → express-validator rule sets, reused between routes
utils/          → small stateless helpers (JWT signing)
```

This separation means, for example, that swapping the AI provider only
touches `services/aiService.js` — no controller, route, or model changes
are needed.

## Frontend layering

```
api/           → single Axios instance (base URL, JWT interceptor, 401 handling)
services/      → one function per API call (authService, planService) — 
                 pages never call Axios directly
context/       → AuthContext (user/token/loading), ToastContext
hooks/         → useAuth (re-export of AuthContext for the "hooks/" convention)
layouts/       → PublicLayout (marketing nav+footer), DashboardLayout (app nav+sidebar)
components/    → reusable, presentation-focused pieces (Button, Card, PlanCard, ...)
pages/         → route-level screens; compose components + services + context
utils/         → formatters.js, pdfGenerator.js (pure functions, no side effects
                 beyond triggering a download)
```

## Data ownership & security model

- Every `BusinessPlan` document has a `userId` field.
- Every plan-scoped controller function (`getPlanById`, `updatePlan`,
  `deletePlan`, `duplicatePlan`, `regeneratePlan`) loads the plan and then
  checks `plan.userId.toString() === req.user._id.toString()` before doing
  anything else — returning `403` immediately if it doesn't match.
- The JWT itself only encodes a user id; `protect` middleware re-fetches
  the user from MongoDB on every request, so a deleted/deactivated user's
  token stops working immediately rather than staying valid until expiry.
- `AI_API_KEY`, `MONGODB_URI`, and `JWT_SECRET` only ever exist in
  `server/.env` — they are never sent to, or readable by, the frontend.

## Why these choices

- **Mongoose `Mixed` type for `planData`:** the AI's JSON shape is
  normalized by `aiService.js` before it ever reaches the model layer, but
  keeping the DB field itself as `Mixed` means a slightly-richer AI
  response (an extra field, a nested object) doesn't get silently dropped
  by a rigid sub-schema.
- **A separate `generate` vs `create` endpoint:** generating a plan is the
  expensive, rate-limited, non-idempotent operation; saving it is a cheap
  DB write. Splitting them lets the user regenerate a few times before
  committing to a save, without creating throwaway database rows for each
  attempt.
- **`app.js` / `server.js` split:** `app.js` exports a pure Express app
  with no side effects, which is what you'd import into a test suite
  (e.g. with Supertest) without also opening a real DB connection or
  starting a listener — `server.js` is the only file that does that.
