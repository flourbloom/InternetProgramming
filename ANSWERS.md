# Week 05 Questions and Answers

### 1. You refresh the browser on `/events/2` and the page loads. Which program answered that request in development, and what must the production server do so it still works after deployment?
In development, the Vite dev server answered the request by serving `index.html` regardless of the path. In production, a static web server (such as Nginx, Apache, or a cloud host) must be configured with a fallback rule that redirects or rewrites all non-file route requests back to `index.html` (e.g. `try_files $uri $uri/ /index.html;`), allowing Vue Router on the client to handle the path instead of returning a 404 HTTP error.

### 2. The guard stops students from opening `/events/new`. Can a student still create an event? How, and what must stop them?
Yes, a student can bypass the client-side router guard by sending an HTTP POST request directly to the API endpoint (e.g. using `curl`, Postman, or `fetch` in the browser console). Client-side navigation guards are strictly UI convenience mechanisms; authorization and role checks must be enforced by the backend server on incoming write requests.

### 3. EventDetailPage loads its event in a `watch` on the `id` with `immediate: true`, not in `onMounted`. What bug would `onMounted` alone cause?
Vue reuses the same component instance when navigating between routes that use the same component (such as navigating from `/events/2` to `/events/3`), so `onMounted` only executes on the initial creation and will not run again when the ID param changes. Using `onMounted` alone would leave the page showing stale data from the previous event instead of fetching and rendering the newly requested event.

### 4. Why does EventsPage use `storeToRefs(store)` instead of `const { events } = store`?
A Pinia store is a reactive object, and standard ES6 destructuring (`const { events } = store`) extracts the property values directly, severing reactivity so the local variable never reflects subsequent store updates. `storeToRefs(store)` wraps each state property and getter into a Vue `ref`, preserving reactivity so the component updates whenever the store changes.

### 5. Booking makes two requests: POST the booking, then PATCH the seat count. What happens to the data if the second one fails? How could the server avoid this?
If the PATCH fails after the POST succeeds, the booking record is created but the event's `booked` count remains unchanged, resulting in data inconsistency, phantom bookings, and potential overbooking. The server can prevent this by exposing a single endpoint (e.g., `POST /events/:id/bookings`) that performs both actions atomically inside a database transaction, rolling back everything if any part fails.

