import { Validation } from "@vuelidate/core";
import { IInventoryCategoryCreateUpdatePayload } from ".";

export interface IInventoryCategoryFormData {
  name: string;
  code: string ;
  notes: string;
}

export interface IInventoryCategoryCreateProvided {
  inventoryCategoryCreate_isLoading: globalThis.Ref<boolean>;
  inventoryCategoryCreate_formData: globalThis.Ref<IInventoryCategoryFormData>;
  inventoryCategoryCreate_onSubmit: (payload: IInventoryCategoryCreateUpdatePayload, mode: 'create' | 'edit', id?: string) => Promise<void>;
  inventoryCategoryCreate_onCancel: () => void;
  inventoryCategoryCreate_values: globalThis.Ref<IInventoryCategoryCreateUpdatePayload>;
  inverntoryCategoryCreate_Validation: globalThis.Ref<Validation>;
  inventoryCategoryCreate_isValid: globalThis.Ref<boolean>;
}
