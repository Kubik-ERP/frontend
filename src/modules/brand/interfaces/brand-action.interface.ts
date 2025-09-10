import { Validation } from "@vuelidate/core";
import { IBrandCreateUpdatePayload } from ".";
import { Reactive } from "vue";

export interface IBrandFormData {
  brandName: string;
  code: string;
  notes: string;
}

export interface IBrandActionProvided {
  brand_formOnLoading: globalThis.Ref<boolean>;
  brand_formData: Reactive<IBrandFormData>;
  brand_onSubmit: (payload: IBrandFormData,mode: 'create' | 'edit', id?: string) => Promise<void>;
  brand_onCancel: () => void;
  brand_formValidation: globalThis.Ref<Validation>;
  brand_createUpdatePayload: globalThis.Ref<IBrandCreateUpdatePayload>;
  brand_formValid: globalThis.ComputedRef<boolean>;
}
