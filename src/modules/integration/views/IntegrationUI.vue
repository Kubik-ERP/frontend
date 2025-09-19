<script setup lang="ts">
// Components
import IntegrationStaticQrCodeContent from '../components/IntegrationStaticQrCodeContent.vue';

// Services
import { useIntegrationService } from '../services/integration.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
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
} = useIntegrationService();

/**
 * @description Provide all the data and methods what we need
 */
provide('integration', {
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
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  await integration_fetchGetIntegration();
});
</script>

<template>
  <section id="integration" class="grid-wrapper gap-4">
    <IntegrationStaticQrCodeContent />
  </section>
</template>
