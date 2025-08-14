import { computed, type ComputedRef } from 'vue';
import { storeToRefs } from 'pinia';
import { useRbacStore } from '../store/rbac.store';
import type {
  IRbacService,
  IModulePermissions,
  IBasePermissions,
  IExtendedPermissions,
  IRole,
} from '../interfaces/rbac.interface';

/**
 * @description RBAC composable service for permission management
 */
export const useRbac = (): IRbacService => {
  const rbacStore = useRbacStore();
  const { rbac_currentUserRole, rbac_permissions } = storeToRefs(rbacStore);

  /**
   * @description Check if user has specific permission for a module
   */
  const hasPermission = (module: keyof IModulePermissions, action: keyof IBasePermissions): boolean => {
    return rbacStore.rbac_hasPermission(module, action);
  };

  /**
   * @description Check if user has specific extended permission for a module
   */
  const hasExtendedPermission = (
    module: keyof IModulePermissions,
    action: keyof IExtendedPermissions,
  ): boolean => {
    return rbacStore.rbac_hasPermission(module, action);
  };

  /**
   * @description Check if user has any permission for a module
   */
  const hasAnyPermission = (module: keyof IModulePermissions): boolean => {
    return rbacStore.rbac_hasAnyPermissionForModule(module);
  };

  /**
   * @description Check if user has module access (any permission)
   */
  const hasModuleAccess = (module: keyof IModulePermissions): boolean => {
    return hasAnyPermission(module);
  };

  /**
   * @description Get current user role
   */
  const getCurrentUserRole = (): IRole | null => {
    return rbac_currentUserRole.value;
  };

  /**
   * @description Get current user permissions
   */
  const getCurrentUserPermissions = (): IModulePermissions => {
    return rbac_permissions.value || {};
  };

  /**
   * @description Check route permission
   */
  const checkRoutePermission = (routeName: string): boolean => {
    return rbacStore.rbac_checkRoutePermission(routeName);
  };

  /**
   * @description Reactive permission checkers
   */
  const canCreate = (module: keyof IModulePermissions): ComputedRef<boolean> => {
    return computed(() => hasPermission(module, 'isCanCreate'));
  };

  const canRead = (module: keyof IModulePermissions): ComputedRef<boolean> => {
    return computed(() => hasPermission(module, 'isCanRead'));
  };

  const canUpdate = (module: keyof IModulePermissions): ComputedRef<boolean> => {
    return computed(() => hasPermission(module, 'isCanUpdate'));
  };

  const canDelete = (module: keyof IModulePermissions): ComputedRef<boolean> => {
    return computed(() => hasPermission(module, 'isCanDelete'));
  };

  /**
   * @description Extended permission checkers
   */
  const canExport = (module: keyof IModulePermissions): ComputedRef<boolean> => {
    return computed(() => hasExtendedPermission(module, 'isCanExport'));
  };

  const canImport = (module: keyof IModulePermissions): ComputedRef<boolean> => {
    return computed(() => hasExtendedPermission(module, 'isCanImport'));
  };

  const canPrint = (module: keyof IModulePermissions): ComputedRef<boolean> => {
    return computed(() => hasExtendedPermission(module, 'isCanPrint'));
  };

  const canApprove = (module: keyof IModulePermissions): ComputedRef<boolean> => {
    return computed(() => hasExtendedPermission(module, 'isCanApprove'));
  };

  /**
   * @description Role checkers
   */
  const isOwner = computed(() => rbacStore.rbac_isOwner);
  const isSuperAdmin = computed(() => rbacStore.rbac_isSuperAdmin);
  const isManager = computed(() => rbacStore.rbac_isManager);
  const isStaff = computed(() => rbacStore.rbac_isStaff);
  const isCashier = computed(() => rbacStore.rbac_isCashier);
  const hasRole = computed(() => rbacStore.rbac_hasRole);

  /**
   * @description Get role name
   */
  const getCurrentRoleName = computed(() => rbacStore.rbac_getCurrentRoleName);

  return {
    // Permission checking methods
    hasPermission,
    hasExtendedPermission,
    hasAnyPermission,
    hasModuleAccess,

    // Role management methods
    getCurrentUserRole,
    getCurrentUserPermissions,
    checkRoutePermission,

    // Reactive CRUD permissions
    canCreate,
    canRead,
    canUpdate,
    canDelete,

    // Reactive extended permissions
    canExport,
    canImport,
    canPrint,
    canApprove,

    // Role state
    isOwner,
    isSuperAdmin,
    isManager,
    isStaff,
    isCashier,
    hasRole,
    getCurrentRoleName,
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
     * Usage: v-if="checkPermission('purchaseOrder', 'isCanCreate')"
     */
    checkPermission: (module: keyof IModulePermissions, action: keyof IBasePermissions): boolean => {
      return rbac.hasPermission(module, action);
    },

    /**
     * @description Check extended permission directive
     * Usage: v-if="checkExtendedPermission('purchaseOrder', 'isCanApprove')"
     */
    checkExtendedPermission: (module: keyof IModulePermissions, action: keyof IExtendedPermissions): boolean => {
      return rbac.hasExtendedPermission(module, action);
    },

    /**
     * @description Check module access directive
     * Usage: v-if="checkModuleAccess('purchaseOrder')"
     */
    checkModuleAccess: (module: keyof IModulePermissions): boolean => {
      return rbac.hasModuleAccess(module);
    },

    /**
     * @description Role checkers for templates
     */
    isSuperAdmin: rbac.isSuperAdmin,
    isManager: rbac.isManager,
    isCashier: rbac.isCashier,
    hasRole: rbac.hasRole,
  };
};
