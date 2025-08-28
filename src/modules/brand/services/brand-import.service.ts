import { ref } from 'vue';
import { IBrandImport, IBrandImportProvided, IBrandImportResponse } from '../interfaces/brand-import.interface';
import eventBus from '@/plugins/mitt';
import { BRAND_LIST_COLUMNS_IMPORT, IMPORT_BRAND_DUMMY_DATA } from '../constants';
export const useBrandImportService = (): IBrandImportProvided => {
  // State
  const brandImport_step = ref<number>(1);
  const brandImport_isLoading = ref<boolean>(false);
  const brandImport_values = ref<IBrandImportResponse>();

  // Simpan file sementara
  const uploadedFile = ref<File | null>(null);

  // Handler
  const brandImport_onSubmit = () => {
    // Submit hasil import (misalnya kirim ke API)
    console.log('Submitting import values:', brandImport_values.value);
  };

  const brandImport_onClose = () => {
    brandImport_step.value = 1;
    brandImport_isLoading.value = false;
    brandImport_values.value = undefined;
    uploadedFile.value = null;

     eventBus.emit('AppBaseDialog', {
      id: 'brand-import-modal',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    });
  };

  const brandImport_handleDownloadTemplate = () => {
    // Contoh download file template
    const link = document.createElement('a');
    link.href = '/templates/brand-import.xlsx'; // ganti dengan API/URL template
    link.download = 'brand-import-template.xlsx';
    link.click();
  };

  const brandImport_handleDropFile = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      uploadedFile.value = acceptedFiles[0];
      console.log('File dropped:', uploadedFile.value);

      // langsung proses upload setelah file diterima
       void brandImport_handleUpload();
    }
  };

  const brandImport_triggerUpload = () => {
    // Membuat input file secara dinamis
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.csv';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files: FileList | null = target.files;

      if (files && files.length > 0) {
        brandImport_handleDropFile([files[0]]);
      }
    };

    input.click();
  };

  const brandImport_handleUpload = async () => {
    if (!uploadedFile.value) {
      console.warn('No file selected for upload');
      return;
    }
     brandImport_step.value = 2;
     brandImport_isLoading.value = true;
    try {
      // TODO: Panggil API upload di sini
      await new Promise(resolve => setTimeout(resolve, 2000)); // simulasi API
      brandImport_values.value = {
        statusCode: 400,
        message: 'File uploaded successfully',
        data: {
          items: IMPORT_BRAND_DUMMY_DATA ||[] as IBrandImport[],
          meta: {
            page: 1,
            pageSize: 10,
            total: 0,
            totalPages: 1,
          },
        },
      } as IBrandImportResponse;

      brandImport_step.value = 3;
    } catch (error) {
      brandImport_step.value = 1;
      console.error('Upload failed:', error);
    } finally {
      brandImport_isLoading.value = false;
    }
  };

  return {
    brandImport_onSubmit,
    brandImport_onClose,
    brandImport_step,
    brandImport_isLoading,
    brandImport_values: brandImport_values,
    brandImport_handleDownloadTemplate,
    brandImport_handleDropFile,
    brandImport_handleUpload,
    brandImport_triggerUpload,
    brandImport_columns: BRAND_LIST_COLUMNS_IMPORT
  };
};
