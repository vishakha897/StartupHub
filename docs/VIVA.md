# StartupHub — Viva / Oral Exam Prep

Simple, honest answers you can give in a viva about this project.

---

**What is MERN?**
A stack made of four technologies: MongoDB (database), Express (backend
web framework), React (frontend UI library), and Node.js (JavaScript
runtime that runs the backend). All four use JavaScript, so a single
language spans the whole application.

**Why React?**
React lets you build the UI out of small, reusable components (forms,
cards, buttons) and efficiently re-renders only what changed when data
updates — useful here because a saved plan, a toast, or a dashboard stat
can all change independently.

**Why Node.js?**
Node runs JavaScript outside the browser, so the same language (and many
of the same libraries) work on both frontend and backend. Its
non-blocking I/O model also suits this app well, since most backend work
here is waiting on MongoDB or the AI provider rather than doing heavy
CPU computation.

**Why Express?**
Express is a minimal, unopinionated web framework on top of Node's HTTP
module. It gives us routing, middleware (functions that run before a
request reaches its handler — used here for auth, validation, and rate
limiting), and a simple way to structure a REST API.

**Why MongoDB?**
MongoDB stores JSON-like documents instead of rigid rows and columns.
That fits this project well because the AI-generated business plan
(`planData`) has a nested, semi-variable structure — storing it as a
document is far simpler than splitting it across a dozen relational
tables.

**Why Mongoose?**
Mongoose sits on top of MongoDB's driver and adds schemas (so we can
require fields like `email` or `businessIdea`), validation, and
convenience methods (like `comparePassword` on the User model). It turns
"just JSON in a database" into something closer to a typed model.

**Why JWT?**
JWT (JSON Web Token) lets the server verify who a user is without storing
session state in memory or a session store. After login, the server signs
a token containing the user's id; the client sends it back on every
request; the server verifies the signature and trusts the id inside it.
This scales easily and works well for a stateless REST API.

**Why bcrypt?**
Passwords must never be stored as plain text. bcrypt hashes the password
with a random "salt" before saving it, and the hashing is deliberately
slow — this makes both database leaks and brute-force guessing far less
dangerous, because an attacker can't simply reverse the hash back into
the original password.

**What is a REST API?**
An API where resources (users, business plans) are addressed by URLs
(`/api/plans/:id`) and manipulated using standard HTTP methods — GET to
read, POST to create, PUT to update, DELETE to remove — with the server
responding in a predictable format (JSON here).

**What is middleware?**
A function that runs between the incoming request and the final route
handler, with the ability to inspect/modify the request, respond early,
or call `next()` to continue. This project uses middleware for JWT
verification (`protect`), rate limiting, and centralized error handling.

**What is authentication?**
Confirming *who* is making the request — in this app, verifying the JWT
in the `Authorization` header and loading the matching user from the
database.

**What is authorization?**
Confirming *what* an authenticated user is allowed to do — in this app,
checking that the business plan being read/edited/deleted actually
belongs to the logged-in user (`plan.userId === req.user._id`), not just
that they're logged in at all.

**How does the frontend communicate with the backend?**
The React app uses Axios to send HTTP requests to the Express API's
`/api/...` routes, attaching the JWT as a Bearer token on every request.
Responses come back as JSON and update React state, which re-renders the UI.

**How is AI integrated?**
The frontend never talks to the AI provider directly. It sends the user's
business idea, budget, and target customers to the backend
(`POST /api/plans/generate`). The backend's `aiService.js` builds a
prompt instructing the model to return structured JSON, calls the AI
provider's chat-completions endpoint, and returns the parsed result to
the frontend.

**Where is the API key stored?**
Only in `server/.env` as `AI_API_KEY`, read via `process.env` on the
backend. It is never included in any response sent to the browser and
never appears in frontend code or environment variables.

**How is AI output validated?**
`aiService.js` parses the AI's response as JSON (failing cleanly with a
friendly error if it isn't valid JSON), then checks that it's an object
and normalizes every expected field — filling in an empty string/array
for anything the AI omitted — rather than trusting the shape blindly.

**How are users' plans separated?**
Every `BusinessPlan` document stores a `userId`. Every list query filters
by `{ userId: req.user._id }`, and every single-plan operation
(view/edit/delete/duplicate/regenerate) loads the plan first and checks
its `userId` against the logged-in user before proceeding — returning
403 Forbidden if they don't match.

**How does MongoDB store plans?**
Each business plan is one document in the `businessplans` collection,
with scalar fields (title, businessIdea, budget, targetCustomers, ...)
plus a `planData` field holding the full structured AI output as a
nested JSON object.

**How does PDF generation work?**
The frontend uses the `jsPDF` library to build a real PDF document
client-side — writing headings and paragraphs section by section from
the plan's data, wrapping long text, and paginating automatically. This
is a generated document, not a screenshot of the page.

**What happens if the AI API fails?**
`aiService.js` catches network errors, non-2xx responses, empty
responses, and invalid JSON, and turns each into a clean `AppError` with
an appropriate status code (429 for rate limits, 502 for provider
errors). The frontend shows a friendly message: "Unable to generate the
business plan right now. Please try again." — never a raw stack trace or
the provider's raw error.

**What happens if MongoDB fails?**
On startup, if the initial connection fails, the server logs the error
and exits rather than running in a broken state. If MongoDB disconnects
later, Mongoose logs the disconnect; queries made during that time reject
with an error that flows through the same centralized error handler,
producing a clean `500` response instead of crashing the process.

**What security measures are implemented?**
Password hashing (bcrypt), JWT authentication, per-resource authorization
checks, Helmet (sensible HTTP security headers), CORS restricted to the
configured client URL, rate limiting (general API, stricter on auth, and
on AI generation), server-side input validation on every write endpoint
(never trusting frontend validation alone), and secrets kept exclusively
in environment variables.
