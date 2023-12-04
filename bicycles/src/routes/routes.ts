import { RouteRecordRaw } from "vue-router";
import { WelcomeView } from "../views";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Welcome",
    component: WelcomeView,
  },
];
