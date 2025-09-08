import { Validation } from "@vuelidate/core";
import { IStorageLocationPayload } from ".";

export interface IStorageLocationFormData{
  name: string
  code: string 
  notes: string
}


export interface IStorageLocationActionProvided {
  storageLocation_formOnLoading: globalThis.Ref<boolean>;
  storageLocation_formData: globalThis.Ref<IStorageLocationFormData>;
  storageLocation_onSubmit: (payload: IStorageLocationFormData,mode: 'create' | 'edit', id?: string) => Promise<void>;
  storageLocation_onCancel: () => void;
  storageLocation_formValidation: globalThis.Ref<Validation>;
  storageLocation_createUpdatePayload: globalThis.Ref<IStorageLocationPayload>;
  storageLocation_formValid: globalThis.ComputedRef<boolean>;
}
