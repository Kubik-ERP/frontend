export interface IAccessControlPermissionPayload {
  permissions: IPayloadPermission[];
}

export interface IPayloadPermission {
  id: string;
  roles: string[];
}

export interface IAccesscControlPermissionProvided {
  accessControlPermission_formData: IAccessControlPermissionPayload;
  accessControlPermission_isLoading: globalThis.Ref<boolean>;
  accessControlPermission_onSubmit: (payload: IAccessControlPermissionPayload) => void;
  accessControlPermission_onCancel: () => void;
  accessControlPermission_setData: (data: IPayloadPermission[]) => void;
}
