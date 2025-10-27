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
    {
      path: 'create',
      name: 'menu-recipe.create',
      component: () => import('../views/MenuRecipeCreateEditUI.vue'),
      meta: {
        layout: LAYOUT_OPTIONS.SIMPLE_NAVBAR,
        requiresAuthorization: true,
        title: 'Add New Recipe',
        breadcrumb: 'Add New Recipe',
      },
    },
    {
      path: 'edit/:id',
      name: 'menu-recipe.edit',
      component: () => import('../views/MenuRecipeCreateEditUI.vue'),
      meta: {
        layout: LAYOUT_OPTIONS.SIMPLE_NAVBAR,
        requiresAuthorization: true,
        title: 'Edit Recipe',
        breadcrumb: 'Edit Recipe',
      },
    },
    {
      path: 'detail/:id',
      name: 'menu-recipe.detail',
      component: () => import('../views/MenuRecipeDetailUI.vue'),
      meta: {
        layout: LAYOUT_OPTIONS.SIMPLE_NAVBAR,
        requiresAuthorization: true,
        title: 'Recipe Detail',
        breadcrumb: 'Recipe Detail',
      },
    },
  ],
  meta: {
    breadcrumb: 'Menu Recipe',
    requiresAuthorization: true,
  },
} as RouteRecordRaw;
