// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Constants
import { LAYOUT_OPTIONS } from '@/app/constants';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/report/financial-report',
    name: 'report',
    component: AppBaseWrapper,
    children: [
      // financial-report
      {
        path: '/report/financial-report',
        name: 'report.financial-report',
        component: () => import('../views/FinancialReportUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Financial Report',
          breadcrumb: 'Financial Report',
        },
      },
      // loss-report
      {
        path: '/report/loss-report',
        name: 'report.loss-report',
        component: () => import('../views/LossReportUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Loss Report',
          breadcrumb: 'Loss Report',
        },
      },
      // sales-report
      {
        path: '/report/sales-report',
        name: 'report.sales-report',
        component: () => import('../views/SalesReportUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Sales Report',
          breadcrumb: 'Sales Report',
        },
      },
      // inventory-report
      {
        path: '/report/inventory-report',
        name: 'report.inventory-report',
        component: () => import('../views/InventoryReportUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Inventory Report',
          breadcrumb: 'Inventory Report',
        },
      },
      // raw-material-report
      {
        path: '/report/raw-material-report',
        name: 'report.raw-material-report',
        component: () => import('../views/RawMaterialReportUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Raw Material Report',
          breadcrumb: 'Raw Material Report',
        },
      },
      // marketing-report
      {
        path: '/report/marketing-report',
        name: 'report.marketing-report',
        component: () => import('../views/MarketingReportUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Marketing Report',
          breadcrumb: 'Marketing Report',
        },
      },
      // staff-report
      {
        path: '/report/staff-report',
        name: 'report.staff-report',
        component: () => import('../views/StaffReportUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Staff Report',
          breadcrumb: 'Staff Report',
        },
      },
      // customer-report
      {
        path: '/report/customer-report',
        name: 'report.customer-report',
        component: () => import('../views/CustomerReportUI.vue'),
        meta: {
          layout: LAYOUT_OPTIONS.DEFAULT,
          requiresAuthorization: true,
          title: 'Customer Report',
          breadcrumb: 'Customer Report',
        },
      },
    ],
    meta: {
      breadcrumb: 'Report',
      requiresAuthorization: true,
    },
  },
];

export default routes;
