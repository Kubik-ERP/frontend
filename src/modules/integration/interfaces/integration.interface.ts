// Interfaces
import type { Validation } from '@vuelidate/core';

// Base Integration Response from API
export interface IIntegrationData {
  id: string;
  is_static: boolean;
  image: string | null;
  stores_id: string;
}

// API Response structure
export interface IIntegrationResponse {
  statusCode: number;
  message: string;
  data: IIntegrationData;
}

// Store State
export interface IIntegrationStateStore {
  integration_isLoading: boolean;
  integration_data: IIntegrationData | null;
}

// Form Data for Integration
export interface IIntegrationFormData {
  isEnabled: boolean;
  isStatic: boolean;
  qrCodeFile?: File;
  qrCodeUrl?: string;
}

// Props for Integration Service
export interface IIntegrationProvided {
  integration_fetchGetIntegration: () => Promise<void>;
  integration_fetchUpdateIntegration: (payload: IIntegrationFormData) => Promise<void>;
  integration_fileInputRef: Ref<HTMLInputElement | undefined>;
  integration_formData: IIntegrationFormData;
  integration_formValidations: globalThis.Ref<Validation>;
  integration_isLoading: Ref<boolean>;
  integration_onDragLeave: (event: DragEvent) => void;
  integration_onDragOver: (event: DragEvent) => void;
  integration_onDrop: (event: DragEvent) => void;
  integration_onFileSelect: (event: Event) => void;
  integration_onFileUpload: (file: File) => Promise<void>;
  integration_onRemoveFile: () => void;
  integration_onSubmit: () => Promise<void>;
  integration_previewUrl: Ref<string>;
  integration_triggerFileInput: () => void;
}
