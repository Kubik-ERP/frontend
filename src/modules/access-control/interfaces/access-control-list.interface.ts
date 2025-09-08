import { IAccessControlPermissionListResponse } from "./index.interface";
import { IRoleListResponse } from "@/modules/role/interfaces/role-list.interface";

export interface IAccessControlPermissionProvided {
  accessControlPermission_listValue: globalThis.Ref<IAccessControlPermissionListResponse>;
  accessControlPermission_isLoading: globalThis.Ref<boolean>;
  accessControlPermission_listRole: globalThis.Ref<IRoleListResponse>;
  accessControlPermission_onEdit: () => void;
  accessControlPermission_fetchList: () => Promise<void>;
}
