// Constants
import { APP_BASE_BUCKET_URL } from '@/app/constants';
import { INTEGRATION_GET_REQUEST, INTEGRATION_UPDATE_REQUEST } from '../constants/integration-api.constant';

// Interfaces
import type { IIntegrationFormData, IIntegrationProvided } from '../interfaces/integration.interface';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useIntegrationStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useIntegrationService = (): IIntegrationProvided => {
  /**
   * @description Injected variables
   */
  const store = useIntegrationStore();
  const { httpAbort_registerAbort } = useHttpAbort();
  const { integration_isLoading, integration_data } = storeToRefs(store);

  /**
   * @description Reactive data binding
   */
  const integration_formData = reactive<IIntegrationFormData>({
    isEnabled: false,
    isStatic: false,
    qrCodeFile: undefined,
    qrCodeUrl: '',
  });
  const integration_previewUrl = ref<string>('');

  /**
   * @description Form validations
   */
  const integration_formRules = computed(() => ({
    isEnabled: { required },
    isStatic: { required },
  }));
  const integration_formValidations = useVuelidate(integration_formRules, {
    isEnabled: toRef(integration_formData, 'isEnabled'),
    isStatic: toRef(integration_formData, 'isStatic'),
  });

  /**
   * @description Handle fetch api integration get data
   */
  const integration_fetchGetIntegration = async (): Promise<void> => {
    try {
      await store.fetchIntegration_getIntegration({
        ...httpAbort_registerAbort(INTEGRATION_GET_REQUEST),
      });

      if (integration_data.value) {
        integration_mappingFormData();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api integration update
   */
  const integration_fetchUpdateIntegration = async (payload: IIntegrationFormData): Promise<void> => {
    try {
      if (!integration_data.value?.id) {
        throw new Error('Integration ID not found');
      }

      const formData = new FormData();
      formData.append('isStatic', payload.isStatic.toString());

      if (payload.qrCodeFile) {
        formData.append('image', payload.qrCodeFile);
      }

      await store.fetchIntegration_updateIntegration(integration_data.value.id, formData, {
        ...httpAbort_registerAbort(INTEGRATION_UPDATE_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Static QR Code configuration updated successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      // Refresh data after update
      await integration_fetchGetIntegration();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for mapping form data
   */
  const integration_mappingFormData = () => {
    if (integration_data.value) {
      // Map API is_static to both isEnabled and isStatic in form
      integration_formData.isEnabled = integration_data.value.is_static;
      integration_formData.isStatic = integration_data.value.is_static;

      // Set QR code URL with bucket URL if image exists
      const imageUrl = integration_data.value.image ? `${APP_BASE_BUCKET_URL}${integration_data.value.image}` : '';

      integration_formData.qrCodeUrl = imageUrl;
      integration_previewUrl.value = imageUrl;
    }
  };

  /**
   * @description Handle file selection
   */
  const integration_onFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      integration_onFileUpload(file);
    }
  };

  /**
   * @description Handle file upload action
   */
  const integration_onFileUpload = async (file: File): Promise<void> => {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        const argsEventEmitter: IPropsToast = {
          isOpen: true,
          type: EToastType.DANGER,
          message: 'Please upload a valid image file',
          position: EToastPosition.TOP_RIGHT,
        };
        eventBus.emit('AppBaseToast', argsEventEmitter);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        const argsEventEmitter: IPropsToast = {
          isOpen: true,
          type: EToastType.DANGER,
          message: 'File size must be less than 5MB',
          position: EToastPosition.TOP_RIGHT,
        };
        eventBus.emit('AppBaseToast', argsEventEmitter);
        return;
      }

      // Create preview URL
      const objectUrl = URL.createObjectURL(file);

      integration_formData.qrCodeFile = file;
      integration_formData.qrCodeUrl = objectUrl;
      integration_previewUrl.value = objectUrl;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle drag and drop
   */
  const integration_onDrop = (event: DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer?.files;

    if (files && files.length > 0) {
      integration_onFileUpload(files[0]);
    }
  };

  const integration_onDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const integration_onDragLeave = (event: DragEvent) => {
    event.preventDefault();
  };

  /**
   * @description Handle remove file action
   */
  const integration_onRemoveFile = () => {
    integration_previewUrl.value = '';
    integration_formData.qrCodeUrl = '';
    integration_formData.qrCodeFile = undefined;

    // Clean up object URL if it exists
    if (integration_previewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(integration_previewUrl.value);
    }
  };

  /**
   * @description File input reference for triggering file selection
   */
  const integration_fileInputRef = ref<HTMLInputElement>();

  /**
   * @description Trigger file input click
   */
  const integration_triggerFileInput = () => {
    integration_fileInputRef.value?.click();
  };

  /**
   * @description Handle action on submit form
   */
  const integration_onSubmit = async (): Promise<void> => {
    try {
      await integration_formValidations.value.$touch();

      if (integration_formValidations.value.$invalid) {
        return;
      }

      await integration_fetchUpdateIntegration(integration_formData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  return {
    integration_fetchGetIntegration,
    integration_fetchUpdateIntegration,
    integration_fileInputRef,
    integration_formData,
    integration_formValidations,
    integration_isLoading,
    integration_onDragLeave,
    integration_onDragOver,
    integration_onDrop,
    integration_onFileSelect,
    integration_onFileUpload,
    integration_onRemoveFile,
    integration_onSubmit,
    integration_previewUrl,
    integration_triggerFileInput,
  };
};
