# StartupHub API Documentation

Base URL (local): `http://localhost:5000/api`

All request/response bodies are JSON. Protected routes require:

```
Authorization: Bearer <jwt_token>
```

All list/mutation endpoints return `{ "success": boolean, ... }`. Errors
return `{ "success": false, "message": "..." }` with an appropriate HTTP
status code.

---

## Auth

### POST /api/auth/register
Create a new account.

**Auth:** No

**Request body**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
```

**Response `201`**
```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "theme": "light", "createdAt": "..." }
}
```

**Errors:** `400` validation failure (bad email, short password, missing name) · `409` email already registered

---

### POST /api/auth/login
Log in with email and password.

**Auth:** No

**Request body**
```json
{ "email": "jane@example.com", "password": "secret123" }
```

**Response `200`:** same shape as register.

**Errors:** `400` validation failure · `401` invalid email or password

---

### GET /api/auth/me
Get the logged-in user's profile.

**Auth:** Yes

**Response `200`**
```json
{ "success": true, "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "theme": "light", "createdAt": "..." } }
```

**Errors:** `401` missing/invalid/expired token

---

### PUT /api/auth/me
Update the logged-in user's name and/or theme preference.

**Auth:** Yes

**Request body**
```json
{ "name": "Jane A. Doe", "theme": "dark" }
```

**Response `200`:** `{ "success": true, "user": { ... } }`

**Errors:** `400` invalid name/theme · `401` unauthorized

---

## Business Plans

Every route below requires `Authorization: Bearer <token>`. Every
`:id`-scoped route verifies `plan.userId === req.user._id` — a `403` is
returned if the plan belongs to a different user, `404` if it doesn't exist.

### POST /api/plans/generate
Calls the AI service and returns a structured plan **without saving it**.

**Request body**
```json
{
  "businessIdea": "Customized bottled water for cafes",
  "budget": 25000,
  "targetCustomers": "Hotels and cafes",
  "industry": "Food & Beverage",
  "location": "Jaipur, India",
  "businessType": "B2B",
  "timeline": "3 months",
  "experienceLevel": "First-time founder",
  "goals": "Reach 50 recurring clients in year one",
  "revenueModelPreference": "Wholesale + subscription"
}
```
Only `businessIdea`, `budget`, and `targetCustomers` are required.

**Response `200` (AI configured)**
```json
{
  "success": true,
  "aiConfigured": true,
  "planData": { "executiveSummary": "...", "problem": "...", "...": "..." },
  "input": { "businessIdea": "...", "budget": 25000, "...": "..." },
  "suggestedTitle": "Customized bottled water for cafes"
}
```

**Response `200` (AI not configured)**
```json
{ "success": false, "aiConfigured": false, "message": "AI business plan generation is not configured on this server. Add a valid AI_API_KEY to server/.env to enable it." }
```

**Errors:** `400` validation failure · `429` too many generation requests · `502` AI provider error or malformed AI JSON

---

### POST /api/plans
Save a (previously generated) plan.

**Request body**
```json
{
  "title": "Cafe Water Plan",
  "businessIdea": "...", "budget": 25000, "targetCustomers": "...",
  "industry": "", "location": "",
  "planData": { "executiveSummary": "...", "...": "..." }
}
```

**Response `201`:** `{ "success": true, "plan": { "_id": "...", "...": "..." } }`

**Errors:** `400` validation failure (missing title/planData/required inputs)

---

### GET /api/plans
List the current user's plans.

**Query params (all optional):**
- `search` — matches title, businessIdea, or industry (case-insensitive)
- `sort` — `newest` (default) · `oldest` · `budget_high` · `budget_low`

**Response `200`:** `{ "success": true, "count": 3, "plans": [ { ... }, ... ] }`

---

### GET /api/plans/:id
Get one plan (with full `planData`).

**Response `200`:** `{ "success": true, "plan": { ... } }`

**Errors:** `403` not your plan · `404` not found

---

### PUT /api/plans/:id
Update a plan's fields (title, businessIdea, budget, targetCustomers,
industry, location, businessType, timeline, experienceLevel, goals,
revenueModelPreference, status, planData — any subset).

**Response `200`:** `{ "success": true, "plan": { ... } }`

**Errors:** `400` validation failure · `403` / `404` as above

---

### DELETE /api/plans/:id
Delete a plan.

**Response `200`:** `{ "success": true, "message": "Business plan deleted" }`

**Errors:** `403` / `404` as above

---

### POST /api/plans/:id/duplicate
Create a copy of a plan (title gets " (Copy)" appended).

**Response `201`:** `{ "success": true, "plan": { ... } }`

**Errors:** `403` / `404` as above

---

### POST /api/plans/:id/regenerate
Re-runs the AI service using the plan's stored inputs and overwrites its
`planData`.

**Response `200` (AI configured):** `{ "success": true, "aiConfigured": true, "plan": { ... } }`
**Response `200` (AI not configured):** `{ "success": false, "aiConfigured": false, "message": "..." }`

**Errors:** `403` / `404` · `429` / `502` as in `/generate`

---

## Status codes used throughout

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request — validation failure |
| 401 | Unauthorized — missing/invalid/expired token, or bad credentials |
| 403 | Forbidden — authenticated, but not the resource owner |
| 404 | Not Found |
| 409 | Conflict — duplicate email |
| 429 | Too Many Requests — rate limit hit |
| 500 | Internal Server Error |
| 502 | Bad Gateway — the AI provider failed or returned unusable data |
