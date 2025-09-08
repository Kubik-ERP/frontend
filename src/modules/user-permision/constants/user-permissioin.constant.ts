import AccessControlListUI from "@/modules/access-control/views/AccessControlListUI.vue";
import RoleListUI from "@/modules/role/views/RoleListUI.vue";

export const LIST_TABS_USER_PERMISSION: ITabs[] = [
  {
    component: AccessControlListUI,
    label: 'Access Control Permissions',
    value: 'ACCESS-CONTROL',
  },
  {
    component: RoleListUI,
    label: 'Role Management',
    value: 'ROLE-MANAGEMENT',
  },
];
