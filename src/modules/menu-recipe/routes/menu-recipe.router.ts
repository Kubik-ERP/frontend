// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

export default {
  path: 'menu-recipe',
  name: 'menu-recipe',
  component: AppBaseWrapper,
  children: [
    {
      path: '',
      name: 'menu-recipe.index',
      component: () => import('../views/MenuRecipeListUI.vue'),
      meta: {
        layout: LAYOUT_OPTIONS.DEFAULT,
        requiresAuthorization: true,
        title: 'Menu Recipe',
      },
    },
  ],
  meta: {
    breadcrumb: 'Menu Recipe',
    requiresAuthorization: true,
  },
} as RouteRecordRaw;
