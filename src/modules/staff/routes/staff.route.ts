// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

// Routes
import staffMemberRouter from '@/modules/staff-member/routes/staff-member.router';

const routes: RouteRecordRaw[] = [
  {
    path: '/staff',
    component: AppBaseWrapper,
    children: [staffMemberRouter],
  },
];

export default routes;
