import { defineStore } from 'pinia';
import type { IRbacStateStore, IRole, IModulePermissions } from '../interfaces/rbac.interface';
import { DEFAULT_ROLES, RBAC_CONSTANTS, ROUTE_PERMISSION_MAPPING } from '../constants/rbac.constant';
import { useAuthenticationStore } from '@/modules/authentication/store';

/**
 * @description Map authentication role ID to RBAC role ID
 */
const mapAuthRoleToRbacRole = (authRoleId: number, authRoleName: string, availableRoles: IRole[]): string => {
  // Map authentication role IDs to RBAC role IDs
  const roleMapping: Record<number, string> = {
    1: 'owner', // Owner - highest level business owner
    2: 'super-admin', // Super Admin - technical administrator
    3: 'manager', // Manager - operational manager
    4: 'staff', // Staff - regular employees
    5: 'cashier', // Cashier - point of sale operators
  };

  // If we have a direct mapping, use it
  if (roleMapping[authRoleId]) {
    return roleMapping[authRoleId];
  }

  // Fallback: try to match by name (case-insensitive)
  const normalizedName = authRoleName.toLowerCase().replace(/\s+/g, '-');
  const matchingRole = availableRoles.find(
    role => role.name.toLowerCase().replace(/\s+/g, '-') === normalizedName,
  );

  return matchingRole?.id || 'staff'; // Default to staff if no match
};

export const useRbacStore = defineStore('rbac', {
  state: (): IRbacStateStore => ({
    rbac_isLoading: false,
    rbac_currentUserRole: null,
    rbac_availableRoles: [...DEFAULT_ROLES],
    rbac_permissions: {},
  }),

  getters: {
    /**
     * @description Get current user permissions from authentication store or local role
     */
    rbac_getCurrentPermissions: (state): IModulePermissions => {
      const authStore = useAuthenticationStore();

      // First try to get role from authentication store
      if (authStore.authentication_userData?.roles) {
        const mappedRoleId = mapAuthRoleToRbacRole(
          authStore.authentication_userData.roles.id,
          authStore.authentication_userData.roles.name,
          state.rbac_availableRoles,
        );
        const userRole = state.rbac_availableRoles.find(role => role.id === mappedRoleId);
        if (userRole) {
          return userRole.permissions;
        }
      }

      // Fallback to local role (for testing/manual role switching)
      return state.rbac_currentUserRole?.permissions || {};
    },

    /**
     * @description Get current user role from authentication store or local role
     */
    rbac_getCurrentUserRole: (state): IRole | null => {
      const authStore = useAuthenticationStore();

      // First try to get role from authentication store
      if (authStore.authentication_userData?.roles) {
        const mappedRoleId = mapAuthRoleToRbacRole(
          authStore.authentication_userData.roles.id,
          authStore.authentication_userData.roles.name,
          state.rbac_availableRoles,
        );
        const userRole = state.rbac_availableRoles.find(role => role.id === mappedRoleId);
        if (userRole) {
          return userRole;
        }
      }

      // Fallback to local role (for testing/manual role switching)
      return state.rbac_currentUserRole;
    },

    /**
     * @description Check if user has any role assigned
     */
    rbac_hasRole: (state): boolean => {
      const authStore = useAuthenticationStore();
      return !!(authStore.authentication_userData?.roles || state.rbac_currentUserRole);
    },

    /**
     * @description Get current role name
     */
    rbac_getCurrentRoleName: (state): string => {
      const authStore = useAuthenticationStore();

      // First try to get role name from authentication store
      if (authStore.authentication_userData?.roles) {
        return authStore.authentication_userData.roles.name;
      }

      // Fallback to local role
      return state.rbac_currentUserRole?.name || 'No Role';
    },

    /**
     * @description Check if current user is owner
     */
    rbac_isOwner: (state): boolean => {
      const authStore = useAuthenticationStore();

      // Check from authentication store first
      if (authStore.authentication_userData?.roles) {
        const mappedRoleId = mapAuthRoleToRbacRole(
          authStore.authentication_userData.roles.id,
          authStore.authentication_userData.roles.name,
          state.rbac_availableRoles,
        );
        return mappedRoleId === 'owner';
      }

      // Fallback to local role
      return state.rbac_currentUserRole?.id === 'owner';
    },

    /**
     * @description Check if current user is super admin
     */
    rbac_isSuperAdmin: (state): boolean => {
      const authStore = useAuthenticationStore();

      // Check from authentication store first
      if (authStore.authentication_userData?.roles) {
        const mappedRoleId = mapAuthRoleToRbacRole(
          authStore.authentication_userData.roles.id,
          authStore.authentication_userData.roles.name,
          state.rbac_availableRoles,
        );
        return mappedRoleId === 'super-admin';
      }

      // Fallback to local role
      return state.rbac_currentUserRole?.id === 'super-admin';
    },

    /**
     * @description Check if current user is manager
     */
    rbac_isManager: (state): boolean => {
      const authStore = useAuthenticationStore();

      // Check from authentication store first
      if (authStore.authentication_userData?.roles) {
        const mappedRoleId = mapAuthRoleToRbacRole(
          authStore.authentication_userData.roles.id,
          authStore.authentication_userData.roles.name,
          state.rbac_availableRoles,
        );
        return mappedRoleId === 'manager';
      }

      // Fallback to local role
      return state.rbac_currentUserRole?.id === 'manager';
    },

    /**
     * @description Check if current user is staff
     */
    rbac_isStaff: (state): boolean => {
      const authStore = useAuthenticationStore();

      // Check from authentication store first
      if (authStore.authentication_userData?.roles) {
        const mappedRoleId = mapAuthRoleToRbacRole(
          authStore.authentication_userData.roles.id,
          authStore.authentication_userData.roles.name,
          state.rbac_availableRoles,
        );
        return mappedRoleId === 'staff';
      }

      // Fallback to local role
      return state.rbac_currentUserRole?.id === 'staff';
    },

    /**
     * @description Check if current user is cashier
     */
    rbac_isCashier: (state): boolean => {
      const authStore = useAuthenticationStore();

      // Check from authentication store first
      if (authStore.authentication_userData?.roles) {
        const mappedRoleId = mapAuthRoleToRbacRole(
          authStore.authentication_userData.roles.id,
          authStore.authentication_userData.roles.name,
          state.rbac_availableRoles,
        );
        return mappedRoleId === 'cashier';
      }

      // Fallback to local role
      return state.rbac_currentUserRole?.id === 'cashier';
    },
  },

  actions: {
    /**
     * @description Map authentication role ID to RBAC role ID
     */
    rbac_mapAuthRoleToRbacRole(authRoleId: number, authRoleName: string): string {
      // Map authentication role IDs to RBAC role IDs
      const roleMapping: Record<number, string> = {
        1: 'owner', // Owner - highest level business owner
        2: 'super-admin', // Super Admin - technical administrator
        3: 'manager', // Manager - operational manager
        4: 'staff', // Staff - regular employees
        5: 'cashier', // Cashier - point of sale operators
      };

      // If we have a direct mapping, use it
      if (roleMapping[authRoleId]) {
        return roleMapping[authRoleId];
      }

      // Fallback: try to match by name (case-insensitive)
      const normalizedName = authRoleName.toLowerCase().replace(/\s+/g, '-');
      const matchingRole = this.rbac_availableRoles.find(
        role => role.name.toLowerCase().replace(/\s+/g, '-') === normalizedName,
      );

      return matchingRole?.id || 'staff'; // Default to staff if no match
    },

    /**
     * @description Set user role and permissions (for testing purposes only)
     */
    rbac_setUserRole(role: IRole): void {
      this.rbac_currentUserRole = role;
      this.rbac_permissions = role.permissions;
    },

    /**
     * @description Set user role by role ID
     */
    rbac_setUserRoleById(roleId: string): void {
      const role = this.rbac_availableRoles.find(r => r.id === roleId);
      if (role) {
        this.rbac_setUserRole(role);
      }
    },

    /**
     * @description Clear user role and permissions
     */
    rbac_clearUserRole(): void {
      this.rbac_currentUserRole = null;
      this.rbac_permissions = {};
    },

    /**
     * @description Check if user has specific permission
     */
    rbac_hasPermission(module: keyof IModulePermissions, action: string): boolean {
      const currentPermissions = this.rbac_getCurrentPermissions;
      const modulePermissions = currentPermissions[module];
      if (!modulePermissions) return false;

      return (modulePermissions as unknown as Record<string, boolean>)[action] === true;
    },

    /**
     * @description Check if user has any permission for a module
     */
    rbac_hasAnyPermissionForModule(module: keyof IModulePermissions): boolean {
      const currentPermissions = this.rbac_getCurrentPermissions;
      const modulePermissions = currentPermissions[module];
      if (!modulePermissions) return false;

      return Object.values(modulePermissions).some(permission => permission === true);
    },

    /**
     * @description Check route permission
     */
    rbac_checkRoutePermission(routeName: string): boolean {
      const currentRole = this.rbac_getCurrentUserRole;
      if (!currentRole) return false;

      // If super admin, allow everything
      if (this.rbac_isSuperAdmin) return true;

      const routeMapping = ROUTE_PERMISSION_MAPPING[routeName as keyof typeof ROUTE_PERMISSION_MAPPING];
      if (!routeMapping) return true; // Allow access if no mapping defined

      return this.rbac_hasPermission(routeMapping.module, routeMapping.action);
    },

    /**
     * @description Add new role (for future backend integration)
     */
    rbac_addRole(role: IRole): void {
      const existingIndex = this.rbac_availableRoles.findIndex(r => r.id === role.id);
      if (existingIndex >= 0) {
        this.rbac_availableRoles[existingIndex] = role;
      } else {
        this.rbac_availableRoles.push(role);
      }
    },

    /**
     * @description Update role (for future backend integration)
     */
    rbac_updateRole(roleId: string, updates: Partial<IRole>): void {
      const roleIndex = this.rbac_availableRoles.findIndex(r => r.id === roleId);
      if (roleIndex >= 0) {
        this.rbac_availableRoles[roleIndex] = {
          ...this.rbac_availableRoles[roleIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        // Update current user role if it's the same role
        if (this.rbac_currentUserRole?.id === roleId) {
          this.rbac_currentUserRole = this.rbac_availableRoles[roleIndex];
          this.rbac_permissions = this.rbac_currentUserRole.permissions;
        }
      }
    },

    /**
     * @description Remove role (for future backend integration)
     */
    rbac_removeRole(roleId: string): void {
      this.rbac_availableRoles = this.rbac_availableRoles.filter(r => r.id !== roleId);

      // Clear current user role if it's the removed role
      if (this.rbac_currentUserRole?.id === roleId) {
        this.rbac_clearUserRole();
      }
    },

    /**
     * @description Initialize RBAC with authentication data (called when user logs in)
     */
    rbac_initializeFromAuth(): void {
      // No longer needed since we read directly from authentication store
      // This method can be called to refresh/sync if needed
    },

    /**
     * @description Get filtered menu items based on permissions
     */
    rbac_getFilteredMenus(menus: IMenuCategory[]): IMenuCategory[] {
      const currentRole = this.rbac_getCurrentUserRole;
      if (!currentRole) return [];

      // If super admin, return all menus
      if (this.rbac_isSuperAdmin) return menus;

      return menus
        .filter(menuCategory => {
          // Filter menus within each category
          const filteredMenus = menuCategory.menus.filter((menu: IMenu) => {
            // Check if user has any permission for the menu's module
            const routeName = menu.path?.replace('/', '') || '';
            return (
              this.rbac_checkRoutePermission(routeName) ||
              this.rbac_hasAnyPermissionForModule(this.rbac_getModuleFromPath(menu.path))
            );
          });

          // Only include categories that have accessible menus
          return filteredMenus.length > 0;
        })
        .map(menuCategory => ({
          ...menuCategory,
          menus: menuCategory.menus.filter((menu: IMenu) => {
            const routeName = menu.path?.replace('/', '') || '';
            return (
              this.rbac_checkRoutePermission(routeName) ||
              this.rbac_hasAnyPermissionForModule(this.rbac_getModuleFromPath(menu.path))
            );
          }),
        }));
    },

    /**
     * @description Helper method to get module name from path
     */
    rbac_getModuleFromPath(path: string): keyof IModulePermissions {
      const pathMap: Record<string, keyof IModulePermissions> = {
        '/cashier': 'cashier',
        '/sales-order': 'salesOrder',
        '/queue': 'queue',
        '/queue/kitchen-display': 'kitchenQueue',
        '/report': 'report',
        '/catalog': 'catalog',
        '/catalog/categories': 'catalogCategories',
        '/catalog/products': 'catalogProducts',
        '/customer': 'customer',
        '/store': 'store',
        '/inventory': 'inventory',
        '/purchase-order': 'purchaseOrder',
        '/marketing': 'marketing',
        '/voucher': 'voucher',
        '/staff': 'staff',
        '/staff/staff-member': 'staffMember',
        '/account': 'account',
        '/pos-setting': 'posSettings',
        '/integrations': 'integrations',
        '/': 'dashboard',
      };

      return pathMap[path] || 'dashboard';
    },
  },

  persist: {
    key: RBAC_CONSTANTS.STORE_KEY,
    pick: ['rbac_currentUserRole'], // Only persist testing role, auth data comes from auth store
    storage: localStorage,
  },
});
