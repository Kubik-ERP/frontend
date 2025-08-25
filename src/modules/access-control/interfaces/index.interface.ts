// export interface
export interface IAccessControlPermissionCategory {
  id: string;
  name: string;
  permissions: IAccessControlPermission[]
}

export interface IAccessControlPermission{
  id: string;
  name: string;
  code: string;
  storeRolePermissions: IAccessControlPermissionRole[]
}

export interface IAccessControlPermissionRole{
  roleId: string;
}

export interface IAccessControlPermissionListResponse{
  statusCode: number;
  message: string;
  data: IAccessControlPermissionCategory[]
}
export interface IAccessControlPermissionActionResponse{
  statusCode: number;
  message: string;
  data: IAccessControlPermission
}
