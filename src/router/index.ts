import { createRouter, createWebHistory, type RouterHistory } from "vue-router";
import type { Pinia } from "pinia";
import { useSessionStore } from "../stores/session";
import EventsPage from "../pages/EventsPage.vue";

declare module "vue-router" {
  interface RouteMeta {
    organiserOnly?: boolean;
  }
}

export const routes = [
  { path: "/", name: "events", component: EventsPage },
  // TODO A1: add these routes. Lazy-load each page: component: () => import("../pages/....vue")
  //   /events/new    name "event-new"     NewEventPage      meta: { organiserOnly: true }
  { path: "/events/new", name: "event-new", component: () => import("../pages/NewEventPage.vue"), meta: { organiserOnly: true } },
  //   /events/:id    name "event-detail"  EventDetailPage   props: true, and only digits: ":id(\\d+)"
  { path: "/events/:id(\\d+)", name: "event-detail", component: () => import("../pages/EventDetailPage.vue"), props: true },
  //   /my-bookings   name "my-bookings"   MyBookingsPage
  { path: "/my-bookings", name: "my-bookings", component: () => import("../pages/MyBookingsPage.vue") },
  //   anything else  name "not-found"     NotFoundPage      path: "/:pathMatch(.*)*"
  { path: "/:pathMatch(.*)*", name: "not-found", component: () => import("../pages/NotFoundPage.vue") },
  // Question: why must "/events/new" come before "/events/:id" if :id had no (\\d+)?
  /* 
        because then 'new' in /events/new will become the 'id' of /events/:id
        since there is no regex to verify digits (\\d+) then id will accept any string 
        and 'new' happens to be a string so it would match and cause error
    */
];

export function makeRouter(history: RouterHistory = createWebHistory(), pinia?: Pinia) {
  const router = createRouter({ history, routes });

  // TODO A2: a global guard (router.beforeEach).
  // If the route has meta.organiserOnly and the session is not an organiser,
  // redirect to { name: "events", query: { denied: "1" } }.
  router.beforeEach((to) => {
    const session = useSessionStore(pinia);
    if (to.meta.organiserOnly && !session.isOrganiser) {
      return { name: "events", query: { denied: "1" } };
    }
  });
  return router;
}
