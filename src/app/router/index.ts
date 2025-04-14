import {
  createRouter,
  createWebHistory,
  Router,
  RouteRecordRaw,
  RouteLocationNormalized,
  NavigationGuardNext,
} from 'vue-router';

// Components
import AppCommonNotFound from '../components/common/AppCommonNotFound.vue';
import AppCommonUnauthorized from '../components/common/AppCommonUnauthorized.vue';

// Stores
import { useAuthenticationStore } from '@/modules/authentication/store';

/**
 * Autoload route
 * Will read file with prefix .route.ts
 */
const loadAllRoutes = async (): Promise<Router> => {
  const routes: RouteRecordRaw[] = [];
  const modules: Record<string, () => Promise<unknown>> = import.meta.glob('/**/*.route.ts');

  for (const path in modules) {
    const module = await modules[path]();
    routes.push(...(module as { default: RouteRecordRaw[] }).default);
  }

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        redirect: { name: 'dashboard' },
      },

      // Auto register routes
      ...routes,

      // 403
      {
        path: '/not-authorized',
        name: 'not-authorized',
        component: AppCommonUnauthorized,
      },

      // 404
      {
        path: '/:catchAll(.*)',
        component: AppCommonNotFound,
      },
    ],
  });

  router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authenticationStore = useAuthenticationStore();
    const { authentication_token } = storeToRefs(authenticationStore);

    if (to.meta.requiresAuthorization && !authentication_token.value) {
      next({ name: 'sign-in' });
    } else {
      next();
    }
  });

  return router;
};

export default loadAllRoutes;
