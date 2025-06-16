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
import { useOutletStore } from '@/modules/outlet/store';

/**
 * Autoload route
 * Will read file with prefix .route.ts
 */
const loadAllRoutes: () => Promise<Router> = async () => {
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

  router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authenticationStore = useAuthenticationStore();
    const outletStore = useOutletStore();
    const { authentication_token } = storeToRefs(authenticationStore);
    const { outlet_currentOutlet } = storeToRefs(outletStore);

    if (to.meta.requiresAuthorization) {
      if (!authentication_token.value) {
        next({ name: 'sign-in' });
      }

      if (to.meta.requiresAuthorization) {
        const listRouteNameOfAuthentication = [
          'create-new-password',
          'sign-in',
          'sign-up',
          'forgot-password',
          'reset-password',
        ];

        if (!authentication_token.value) {
          next({ name: 'sign-in' });
        }

        if (
          listRouteNameOfAuthentication.includes(to.name as string) ||
          Object.keys(outlet_currentOutlet).length === 0
        ) {
          next({ name: 'outlet.list' });
        }

        next();
      }
    } else {
      next();
    }
  });

  return router;
};

export default loadAllRoutes;
