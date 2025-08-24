import {
  createRouter,
  createWebHistory,
  Router,
  RouteRecordRaw,
  RouteLocationNormalized,
  NavigationGuardNext,
} from 'vue-router';

// Stores
import { useAuthenticationStore } from '@/modules/authentication/store';
import { useOutletStore } from '@/modules/outlet/store';
import { useRbacStore } from '@/app/store/rbac.store';

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

      // 403 - Lazy loaded for better performance
      {
        path: '/not-authorized',
        name: 'not-authorized',
        component: () => import('../components/common/AppCommonUnauthorized.vue'),
      },

      // 404 - Lazy loaded for better performance
      {
        path: '/:catchAll(.*)',
        component: () => import('../components/common/AppCommonNotFound.vue'),
      },
    ],
  });

  router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authenticationStore = useAuthenticationStore();
    const outletStore = useOutletStore();
    const rbacStore = useRbacStore();
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

        if (!outlet_currentOutlet.value && !(typeof to.name === 'string' && to.name.includes('outlet'))) {
          next({ name: 'outlet.list' });
        }

        if (listRouteNameOfAuthentication.includes(to.name as string)) {
          next({ name: 'dashboard' });
        }

        // RBAC Permission Check
        if (to.name && rbacStore.rbac_hasRole) {
          const hasPermission = rbacStore.rbac_checkRoutePermission(to.name as string);
          if (!hasPermission) {
            next({ name: 'not-authorized' });
            return;
          }
        }

        next();
      }
    } else {
      next();
    }
  });

  // Optional: Add loading state for route changes
  router.beforeResolve((_to, from, next) => {
    // Only show route loading for different routes, not for initial load
    if (from.name !== undefined) {
      // You can use the loading store here if you want to show loading during route changes
      // const loadingStore = useLoadingStore();
      // loadingStore.setLoading(true);
    }
    next();
  });

  router.afterEach(() => {
    // Clear any route loading state
    // const loadingStore = useLoadingStore();
    // loadingStore.setLoading(false);
  });

  return router;
};

export default loadAllRoutes;
