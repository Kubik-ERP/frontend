import { IRole } from "@/modules/role/interfaces/index.interface";
import { IAccessControlPermissionCategory } from "./index.interface";

export interface IAccessControlPermissionProvided {
  accessControlPermission_listValue: globalThis.Ref<IAccessControlPermissionCategory[] | []>;
  accessControlPermission_isLoading: globalThis.Ref<boolean>;
  accessControlPermission_listRole: globalThis.Ref<IRole[]>;
  accessControlPermission_onEdit: () => void;
  accessControlPermission_fetchList: () => Promise<void>;
}
