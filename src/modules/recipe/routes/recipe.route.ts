// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

// Routes
import menuRecipeRouter from '@/modules/menu-recipe/routes/menu-recipe.router';
import prepBatchManagementRouter from '@/modules/prep-batch-management/routes/prep-batch-management.router';
import wasteLogRouter from '@/modules/waste-log/routes/waste-log.router';

const routes: RouteRecordRaw[] = [
  {
    path: '/recipe',
    component: AppBaseWrapper,
    children: [menuRecipeRouter, prepBatchManagementRouter, wasteLogRouter],
  },
];

export default routes;
