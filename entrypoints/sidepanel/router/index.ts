import { createWebHashHistory, createRouter, type RouteRecordRaw } from "vue-router";
import SidepanelLayout from "../layouts/default.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: SidepanelLayout,
    children: [
      {
        path: "",
        name: "Upload",
        component: () => import("../views/upload.vue"),
      },
      {
        path: "manage",
        name: "Manage",
        component: () => import("../views/manage.vue"),
      },
      {
        path: "settings",
        name: "Settings",
        component: () => import("../views/settings.vue"),
      },
    ],
  },
];

export const sidepanelRouter = createRouter({
  history: createWebHashHistory(),
  routes,
});
