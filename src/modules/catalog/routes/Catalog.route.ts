import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

// Routes
import customerRoutes from './customer.router';
import productRoutes from './product.router';

const routes: RouteRecordRaw[] = [
  {
    path: '/catalog',
    component: AppBaseWrapper,
    meta: {
      requiresAuthorization: false,
    },
    children: [
      {
        path: 'categories',
        name: 'categories',
        component: () => import('../views/Category/CategoriesUI.vue'),
        meta: {
          title: 'Categories',
          breadcrumb: 'Categories',
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: false,
        },
      },
      customerRoutes,
      productRoutes,
    ],
  },
];

export default routes;
