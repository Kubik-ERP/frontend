import { Validation } from "@vuelidate/core";
import { IRoleFormData } from "./index.interface";

export interface IRoleActionProvided{
    role_formOnLoading: globalThis.Ref<boolean>;
    role_formData: globalThis.Ref<IRoleFormData>;
    role_onSubmit: (payload: IRoleFormData, id?: string) => Promise<void>;
    role_onCancel: () => void;
    role_formValidation: globalThis.Ref<Validation>;
    role_formMode: globalThis.Ref<'create' | 'update'>;
    // role_createUpdatePayload: globalThis.Ref<IRoleFormData>;
    // role_formValid: globalThis.ComputedRef<boolean>;
}
