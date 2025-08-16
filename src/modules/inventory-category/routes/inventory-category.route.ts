import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/inventory-category",
    name: "inventory-category",
    component: () => import("../views/InventoryCategoryListUI.vue"),
    meta: {
      requiresAuthorization: true,
      layout: LAYOUT_OPTIONS.DEFAULT,
      title: "Inventory Category",
      breadcrumb: "Inventory Category",
    },
  },

];

export default routes;
