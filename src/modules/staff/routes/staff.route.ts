// Components
import AppBaseWrapper from '@/app/components/base/AppBaseWrapper.vue';

// Interfaces
import type { RouteRecordRaw } from 'vue-router';

// Routes
import attendanceRouter from '@/modules/attendance/routes/attendance.router';
import staffMemberRouter from '@/modules/staff-member/routes/staff-member.router';
import workingHoursRouter from '@/modules/working-hours/routes/working-hours.router';

const routes: RouteRecordRaw[] = [
  {
    path: '/staff',
    component: AppBaseWrapper,
    children: [attendanceRouter, staffMemberRouter, workingHoursRouter],
  },
];

export default routes;
