// import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';
import { LAYOUT_OPTIONS } from '@/app/constants';
import type { RouteRecordRaw } from 'vue-router';

export default {
  path: '/voucher',
  name: '/voucher',
  children: [
    {
      path: '',
      name: 'voucher.index',
      component: () => import('../views/VoucherListUI.vue'),
      meta: {
        layout: LAYOUT_OPTIONS.DEFAULT,
        breadcrumb: "Voucher List",
        requiresAuthorization: false,
        title: 'Vouchers',
      },
    },
    {
      path: 'create',
      name: 'voucher.create',
      component: () => import('../views/VoucherCreate.vue'),
      meta: {
        breadcrumb: 'Add Voucher',
        layout: LAYOUT_OPTIONS.NAVBAR,
        requiresAuthorization: false,
        title: 'Add New Voucher',
      },
    },
    {
      path: 'edit/:id',
      props: route => ({ id: route.params.id }),
      name: 'voucher.edit',
      component: () => import('../views/VoucherEdit.vue'),
      meta: {
        breadcrumb: 'Edit Voucher',
        layout: LAYOUT_OPTIONS.NAVBAR,
        requiresAuthorization: false,
        title: 'Edit Voucher',
      },
    },
    {
      path: 'view/:id',
      props: route => ({ id: route.params.id, name: route.params.name }),
      name: 'voucher.view',
      component: () => import('../views/VoucherViewUI.vue'),
      meta: {
        breadcrumb: 'View Voucher',
        layout: LAYOUT_OPTIONS.DEFAULT,
        requiresAuthorization: false,
        title: `View Voucher`,
      },
    }
  ],
  meta: {
    breadcrumb: 'Vouchers',
    requiresAuthorization: false,
  },
} as RouteRecordRaw;
