// Stores
import { storeToRefs } from 'pinia';
import { useAuthenticationStore } from '@/modules/authentication/store';

/**
 * @description RBAC composable service for permission management
 * Now uses backend permissions array from authentication store
 */
export const useRbac = () => {
  const authenticationStore = useAuthenticationStore();
  const { authentication_permissions } = storeToRefs(authenticationStore);

  /**
   * @description Check if user has specific permission based on backend permission key
   */
  const hasPermission = (permissionKey: TPermissions): boolean => {
    return authentication_permissions.value.includes(permissionKey);
  };

  /**
   * @description Check if user has any of the specified permissions
   */
  const hasAnyPermission = (permissionKeys: TPermissions[]): boolean => {
    return permissionKeys.some(key => hasPermission(key));
  };

  /**
   * @description Check if user has all of the specified permissions
   */
  const hasAllPermissions = (permissionKeys: TPermissions[]): boolean => {
    return permissionKeys.every(key => hasPermission(key));
  };

  /**
   * @description Get all current user permissions
   */
  const getCurrentUserPermissions = (): string[] => {
    return authentication_permissions.value;
  };

  return {
    // Core permission checking methods
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getCurrentUserPermissions,
  };
};

/**
 * @description RBAC directive for v-if usage in templates
 */
export const useRbacDirective = () => {
  const rbac = useRbac();

  return {
    /**
     * @description Check permission directive
     * Usage: v-if="checkPermission('set_up_cash_drawer')"
     */
    checkPermission: (permissionKey: TPermissions): boolean => {
      return rbac.hasPermission(permissionKey);
    },

    /**
     * @description Check if has any of the specified permissions
     * Usage: v-if="checkAnyPermission(['set_up_cash_drawer', 'close_cash_register'])"
     */
    checkAnyPermission: (permissionKeys: TPermissions[]): boolean => {
      return rbac.hasAnyPermission(permissionKeys);
    },

    /**
     * @description Check if has all of the specified permissions
     * Usage: v-if="checkAllPermissions(['set_up_cash_drawer', 'close_cash_register'])"
     */
    checkAllPermissions: (permissionKeys: TPermissions[]): boolean => {
      return rbac.hasAllPermissions(permissionKeys);
    },
  };
};
