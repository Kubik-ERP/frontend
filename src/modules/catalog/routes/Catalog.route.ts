import type { RouteRecordRaw } from 'vue-router';

// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/catalog',
    component: AppBaseWrapper,
    children: [
      {
        path: 'categories',
        name: 'categories',
        component: () => import('../views/Category/CategoriesUI.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.DEFAULT,
        },
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('../views/Products/ProductsUI.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.DEFAULT,
        },
      },
      {
        path: 'products/add-product',
        name: 'add-product',
        component: () => import('../views/Products/AddProductUI.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.DEFAULT,
        },
      },
      {
        path: 'products/edit-product/:id',
        name: 'edit-product',
        props: route => ({ id: route.params.id }),
        component: () => import('../views/Products/EditProductUI.vue'),
        meta: {
          requiresAuthorization: false,
          layout: LAYOUT_OPTIONS.DEFAULT,
        },
      },
    ],
  },
];

export default routes;
