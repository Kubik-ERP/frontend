import { LAYOUT_OPTIONS } from "@/app/constants";
import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/storage-location",
    name: "storage-location",
    component: () => import("../views/StorageLocationUI.vue"),
    meta: {
      requiresAuthorization: true,
      layout: LAYOUT_OPTIONS.DEFAULT,
      title: "Storage Location",
      breadcrumb: "Storage Location",
    },
  },
];

export default routes;
