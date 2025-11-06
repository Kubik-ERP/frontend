// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

export default {
  path: 'prep-batch-management',
  name: 'prep-batch-management',
  component: AppBaseWrapper,
  children: [
    {
      path: '',
      name: 'prep-batch-management.index',
      component: () => import('../views/PrepBatchManagementListUI.vue'),
      meta: {
        layout: LAYOUT_OPTIONS.DEFAULT,
        requiresAuthorization: true,
        title: 'Prep & Batch Management',
      },
    },
    {
      path: 'create',
      name: 'prep-batch-management.create',
      component: () => import('../views/PrepBatchManagementCreateEditUI.vue'),
      meta: {
        layout: LAYOUT_OPTIONS.SIMPLE_NAVBAR,
        requiresAuthorization: true,
        title: 'Add New Batch',
        breadcrumb: 'Add New Batch',
      },
    },
    {
      path: 'edit/:id',
      props: route => ({ id: route.params.id }),
      name: 'prep-batch-management.edit',
      component: () => import('../views/PrepBatchManagementCreateEditUI.vue'),
      meta: {
        layout: LAYOUT_OPTIONS.SIMPLE_NAVBAR,
        requiresAuthorization: true,
        title: 'Edit Batch',
        breadcrumb: 'Edit Batch',
      },
    },
    {
      path: 'details/:id',
      props: route => ({ id: route.params.id }),
      name: 'prep-batch-management.details',
      component: () => import('../views/PrepBatchManagementDetailsUI.vue'),
      meta: {
        layout: LAYOUT_OPTIONS.SIMPLE_NAVBAR,
        requiresAuthorization: true,
        title: 'Details Batch',
        breadcrumb: 'Details Batch',
      },
    },
  ],
  meta: {
    breadcrumb: 'Prep & Batch Management',
    requiresAuthorization: true,
  },
} as RouteRecordRaw;
