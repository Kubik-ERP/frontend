import { ref } from 'vue';
import { IStorageLocationImport, IStorageLocationImportProvided, IStorageLocationImportResponse } from '../interfaces/storage-location-import.interface';
import eventBus from '@/plugins/mitt';
import { STORAGE_LOCATION_LIST_COLUMNS_IMPORT } from '../contants';
export const useStorageLocationImportService = (): IStorageLocationImportProvided => {
  // State
  const storageLocationImport_step = ref<number>(1);
  const storageLocationImport_isLoading = ref<boolean>(false);
  const storageLocationImport_values = ref<IStorageLocationImportResponse>();

  // Simpan file sementara
  const uploadedFile = ref<File | null>(null);

  // Handler
  const storageLocationImport_onSubmit = () => {
    // Submit hasil import (misalnya kirim ke API)
    console.log('Submitting import values:', storageLocationImport_values.value);
  };


  const storageLocationImport_onClose = () => {
    storageLocationImport_step.value = 1;
    storageLocationImport_isLoading.value = false;
    storageLocationImport_values.value = undefined;
    uploadedFile.value = null;

     eventBus.emit('AppBaseDialog', {
      id: 'storage-location-import-modal',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    });
  };

  const storageLocationImport_handleDownloadTemplate = () => {
    // Contoh download file template
    const link = document.createElement('a');
    link.href = '/templates/brand-import.xlsx';
    link.download = 'storage-import-template.xlsx';
    link.click();
  };

  const storageLocationImport_handleDropFile = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      uploadedFile.value = acceptedFiles[0];
      console.log('File dropped:', uploadedFile.value);

      // langsung proses upload setelah file diterima
       void storageLocationImport_handleUpload();
    }
  };

  const storageLocationImport_triggerUpload = () => {
    // Membuat input file secara dinamis
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.csv';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files: FileList | null = target.files;

      if (files && files.length > 0) {
        storageLocationImport_handleDropFile([files[0]]);
      }
    };

    input.click();
  };

  const storageLocationImport_handleUpload = async () => {
    if (!uploadedFile.value) {
      console.warn('No file selected for upload');
      return;
    }
     storageLocationImport_step.value = 2;
     storageLocationImport_isLoading.value = true;
    try {
      // TODO: Panggil API upload di sini
      await new Promise(resolve => setTimeout(resolve, 2000)); // simulasi API
      storageLocationImport_values.value = {
        statusCode: 400,
        message: 'File uploaded successfully',
        data: {
          items: [] as IStorageLocationImport[],
          meta: {
            page: 1,
            pageSize: 10,
            total: 0,
            totalPages: 1,
          },
        },
      } as IStorageLocationImportResponse;

      storageLocationImport_step.value = 3;
    } catch (error) {
      storageLocationImport_step.value = 1;
      console.error('Upload failed:', error);
    } finally {
      storageLocationImport_isLoading.value = false;
    }
  };

  return {
    storageLocationImport_onSubmit,
    storageLocationImport_onClose,
    storageLocationImport_step,
    storageLocationImport_isLoading,
    storageLocationImport_values: storageLocationImport_values,
    storageLocationImport_handleDownloadTemplate,
    storageLocationImport_handleDropFile,
    storageLocationImport_handleUpload,
    storageLocationImport_triggerUpload,
    storageLocationImport_columns: STORAGE_LOCATION_LIST_COLUMNS_IMPORT
  };
};
