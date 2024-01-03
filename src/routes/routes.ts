import { RouteRecordRaw } from "vue-router";
import { WelcomeView, FavouritesView } from "../views";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Map View",
    component: WelcomeView,
  },
  {
    path: "/favourites",
    name: "Favourite routes",
    component: FavouritesView,
  },
];
