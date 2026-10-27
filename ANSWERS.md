# Week 4 Practice: Questions and Answers

### 1. In EventList, what goes wrong if you use the array index as :key and the list gets filtered while a card has local state (for example an open details panel)?
When using the array index as `:key`, Vue tracks and reuses DOM nodes and component instances based on their position in the array rather than their unique identity. When the list is filtered, a different event now occupies index 0, so Vue reuses the existing component instance at index 0 along with its internal state. As a result, the local state (such as an expanded details panel) stays tied to that position and is incorrectly shown on a completely different event card.

---

### 2. Why is visible a computed and not a function called from the template? What is the difference when you type in the search box?
A computed property caches its result based on its reactive dependencies (`events`, `search`, and `category`) and only recalculates when any of those dependencies change. In contrast, calling a function from the template forces that function to run on every single re-render of the component, even when completely unrelated state changes. Using computed avoids expensive redundant filtering calculations as the user types and guarantees fast, predictable updates.

---

### 3. EventCard emits book instead of changing event.booked. Give two reasons.
First, Vue strictly adheres to a one-way data flow where props are read-only; directly mutating `props.event.booked` inside a child component breaks predictability and causes Vue to log runtime warnings. Second, `EventCard` is a presentation component that does not own the master list of events or overall booking logic (like managing user quotas or persisting to `localStorage`). Emitting an event lets the root owner (`App.vue`) handle state updates safely in a centralized location.

---

### 4. You write const { booked } = reactive(event); booked++. The page does not change. Why?
Destructuring a reactive object extracts `booked` as a plain primitive JavaScript number, completely breaking reactivity. Incrementing `booked++` only modifies that independent local variable in memory and never touches the underlying proxy getters/setters of the reactive object. Because the reactive property on `event` remains unchanged, Vue's reactivity system never detects a mutation and does not trigger a DOM re-render.

---

### 5. Where does myBookings live, and why not in EventCard or EventList?
`myBookings` lives in `App.vue` because it is the common ancestor component that owns the application state, displays the global booking count in the header, and syncs data with `localStorage`. Placing it in `EventCard` would confine the state to individual cards, making it impossible to know the total bookings across all events. Placing it in `EventList` would make it inaccessible to the header in `App.vue` without awkward prop drilling or lifting, so keeping shared state in the nearest common parent (`App.vue`) is the cleanest architectural pattern.
