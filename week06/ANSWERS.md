# Week 6 Practice: Questions and Answers

### 1. DELETE /events/2 returns 204 and the second call returns 404. Is DELETE still idempotent? Explain with what idempotent means.

Yes, `DELETE` is still idempotent. Idempotence means that making multiple identical requests leaves the server in the exact same state as making a single request. Although the HTTP response status code changes from `204 No Content` on the first call to `404 Not Found` on subsequent calls, the end state on the server is identical: the event with ID 2 no longer exists.

### 2. The Vue app on port 5173 calls the API on port 3000. Which program blocks the response when CORS is not configured, and why can curl read it anyway?

The web browser blocks the response due to its built-in Same-Origin Policy (SOP), which prevents scripts on one origin (`localhost:5173`) from reading responses from a different origin (`localhost:3000`) without explicit CORS headers. `curl` can read the response because it is a command-line tool, not a browser, and does not enforce browser-specific security policies like SOP/CORS. Non-browser clients directly receive whatever raw HTTP response the server sends.

### 3. EventsController never writes new EventsService(). Who creates the service, when, and how many are created?

The NestJS Dependency Injection (IoC) container creates `EventsService`. It instantiates the service at application bootstrap time when resolving the dependency graph defined in `EventsModule`. By default, NestJS providers are singletons, meaning exactly one shared instance of `EventsService` is created and injected into all consumers (such as `EventsController` and `BookingsService`).

### 4. A client sends. Which line of code refuses it, and what would happen to booked without it?

The line `forbidNonWhitelisted: true` in `src/setup.ts` refuses the request with a `400 Bad Request` because `booked` is not defined as a property in `CreateEventDto`. Without this option (with only `whitelist: true`), the request would be accepted with a `201 Created`, and `"booked": 50` would be silently stripped out and discarded instead of rejected.

### 5. Why is the “not enough seats” rule in BookingsService and not in BookingsController or only in the Vue form?

The rule belongs in `BookingsService` because services hold the business logic and domain rules, keeping `BookingsController` focused purely on HTTP concerns like routing and status codes. It cannot rely only on the Vue form because client-side validation can easily be bypassed (e.g., via `curl` or Postman), and only the backend service holds the authoritative, real-time state of remaining seats to prevent race conditions and overbooking.
