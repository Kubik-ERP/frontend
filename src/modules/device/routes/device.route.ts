import { LAYOUT_OPTIONS } from "@/app/constants";
import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/pos-setting/device",
    name: "device",
    component: () => import("../views/DeviceListUI.vue"),
    meta: {
      requiresAuthorization: true,
      layout: LAYOUT_OPTIONS.DEFAULT,
      title: "Device",
      breadcrumb: "Device",
    },
  },
];

export default routes;
