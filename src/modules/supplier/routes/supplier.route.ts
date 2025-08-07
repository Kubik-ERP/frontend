import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/supplier',
    component: AppBaseWrapper,
    meta: {
      requiresAuthorization: true,
      breadcrumb: 'Master Supplier',
    },
    children: [
      {
        path: '',
        name: 'supplier-list',
        component: () => import('../views/SupplierListUI.vue'),
        meta: {
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.DEFAULT,
          title: 'Master Supplier',
        },
      },
      {
        path: 'create',
        name: 'supplier.create',
        component: () => import('@/modules/supplier/views/SupplierCreateEditUI.vue'),
        meta: {
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.DEFAULT,
          breadcrumb: 'Add Supplier',
          title: 'Add New Supplier',
        },
      },
      {
        path: 'edit/:id',
        name: 'supplier.edit',
        component: () => import('@/modules/supplier/views/SupplierCreateEditUI.vue'),
        meta: {
          requiresAuthorization: true,
          layout: LAYOUT_OPTIONS.DEFAULT,
          breadcrumb: 'Edit Supplier',
          title: 'Edit Supplier',
        },
      },
    ],
  },
];

export default routes;
