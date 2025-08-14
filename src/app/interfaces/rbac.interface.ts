/**
 * @description Base permissions interface that defines CRUD operations
 */
export interface IBasePermissions {
  isCanCreate: boolean;
  isCanRead: boolean;
  isCanUpdate: boolean;
  isCanDelete: boolean;
}

/**
 * @description Extended permissions interface for specific features
 */
export interface IExtendedPermissions extends IBasePermissions {
  isCanExport?: boolean;
  isCanImport?: boolean;
  isCanPrint?: boolean;
  isCanApprove?: boolean;
}

/**
 * @description Module permissions interface
 */
export interface IModulePermissions {
  // Sales modules
  cashier?: IExtendedPermissions;
  salesOrder?: IExtendedPermissions;
  queue?: IExtendedPermissions;
  kitchenQueue?: IExtendedPermissions;
  report?: IExtendedPermissions;
  catalog?: IExtendedPermissions;
  catalogCategories?: IExtendedPermissions;
  catalogProducts?: IExtendedPermissions;
  customer?: IExtendedPermissions;
  customerWaitingList?: IExtendedPermissions;
  dailySales?: IExtendedPermissions;
  invoice?: IExtendedPermissions;

  // Operations modules
  store?: IExtendedPermissions;
  inventory?: IExtendedPermissions;
  purchaseOrder?: IExtendedPermissions;
  marketing?: IExtendedPermissions;
  voucher?: IExtendedPermissions;
  staff?: IExtendedPermissions;
  staffMember?: IExtendedPermissions;

  // Settings modules
  account?: IExtendedPermissions;
  posSettings?: IExtendedPermissions;
  integrations?: IExtendedPermissions;
  outlet?: IExtendedPermissions;
  pointConfiguration?: IExtendedPermissions;

  // Dashboard
  dashboard?: IExtendedPermissions;

  // Cash drawer
  cashDrawer?: IExtendedPermissions;
  cashInOut?: IExtendedPermissions;
}

/**
 * @description Role interface
 */
export interface IRole {
  id: string;
  name: string;
  description?: string;
  permissions: IModulePermissions;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * @description RBAC store state interface
 */
export interface IRbacStateStore {
  rbac_isLoading: boolean;
  rbac_currentUserRole: IRole | null; // For testing purposes only, real role comes from auth store
  rbac_availableRoles: IRole[];
  rbac_permissions: IModulePermissions; // Deprecated, kept for backward compatibility
}

/**
 * @description RBAC service interface
 */
export interface IRbacService {
  // Permission checking methods
  hasPermission: (module: keyof IModulePermissions, action: keyof IBasePermissions) => boolean;
  hasExtendedPermission: (module: keyof IModulePermissions, action: keyof IExtendedPermissions) => boolean;
  hasAnyPermission: (module: keyof IModulePermissions) => boolean;
  hasModuleAccess: (module: keyof IModulePermissions) => boolean;

  // Role management methods
  getCurrentUserRole: () => IRole | null;
  getCurrentUserPermissions: () => IModulePermissions;
  checkRoutePermission: (routeName: string) => boolean;

  // Reactive CRUD permissions
  canCreate: (module: keyof IModulePermissions) => ComputedRef<boolean>;
  canRead: (module: keyof IModulePermissions) => ComputedRef<boolean>;
  canUpdate: (module: keyof IModulePermissions) => ComputedRef<boolean>;
  canDelete: (module: keyof IModulePermissions) => ComputedRef<boolean>;

  // Reactive extended permissions
  canExport: (module: keyof IModulePermissions) => ComputedRef<boolean>;
  canImport: (module: keyof IModulePermissions) => ComputedRef<boolean>;
  canPrint: (module: keyof IModulePermissions) => ComputedRef<boolean>;
  canApprove: (module: keyof IModulePermissions) => ComputedRef<boolean>;

  // Role state
  isOwner: ComputedRef<boolean>;
  isSuperAdmin: ComputedRef<boolean>;
  isManager: ComputedRef<boolean>;
  isStaff: ComputedRef<boolean>;
  isCashier: ComputedRef<boolean>;
  hasRole: ComputedRef<boolean>;
  getCurrentRoleName: ComputedRef<string>;
}

/**
 * @description Route permission mapping interface
 */
export interface IRoutePermissionMapping {
  [routeName: string]: {
    module: keyof IModulePermissions;
    action: keyof IBasePermissions | keyof IExtendedPermissions;
  };
}

/**
 * @description Permission check result interface
 */
export interface IPermissionCheckResult {
  hasPermission: boolean;
  message?: string;
  redirectTo?: string;
}
