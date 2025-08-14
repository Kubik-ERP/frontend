import { LAYOUT_OPTIONS } from "@/app/constants";
import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/brand",
    name: "brand",
    component: () => import("../views/BrandListUI.vue"),
    meta: {
      requiresAuthorization: true,
      layout: LAYOUT_OPTIONS.DEFAULT,
      title: "Master Brand",
      breadcrumb: "Master Brand",
    },
  },
];

export default routes;
