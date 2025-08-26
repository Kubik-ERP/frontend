import { ref } from 'vue';
import { IInventoryCategoryImport, IInventoryCategoryImportProvided, IInventoryCategoryImportResponse } from '../interfaces/inventory-category-import.interface';
import eventBus from '@/plugins/mitt';
import { INVENTORY_CATEGORY_LIST_COLUMNS_IMPORT } from '../constants';
export const useInventoryCategoryImportService = (): IInventoryCategoryImportProvided => {
  // State
  const inventoryCategoryImport_step = ref<number>(1);
  const inventoryCategoryImport_isLoading = ref<boolean>(false);
  const inventoryCategoryImport_values = ref<IInventoryCategoryImportResponse>();

  // Simpan file sementara
  const uploadedFile = ref<File | null>(null);

  // Handler
  const inventoryCategoryImport_onSubmit = () => {
    // Submit hasil import (misalnya kirim ke API)
    console.log('Submitting import values:', inventoryCategoryImport_values.value);
  };


  const inventoryCategoryImport_onClose = () => {
    inventoryCategoryImport_step.value = 1;
    inventoryCategoryImport_isLoading.value = false;
    inventoryCategoryImport_values.value = undefined;
    uploadedFile.value = null;

     eventBus.emit('AppBaseDialog', {
      id: 'inventory-category-import-modal',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    });
  };

  const inventoryCategoryImport_handleDownloadTemplate = () => {
    // Contoh download file template
    const link = document.createElement('a');
    link.href = '/templates/brand-import.xlsx';
    link.download = 'storage-import-template.xlsx';
    link.click();
  };

  const inventoryCategoryImport_handleDropFile = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      uploadedFile.value = acceptedFiles[0];
      console.log('File dropped:', uploadedFile.value);

      // langsung proses upload setelah file diterima
       void inventoryCategoryImport_handleUpload();
    }
  };

  const inventoryCategoryImport_triggerUpload = () => {
    // Membuat input file secara dinamis
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.csv';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files: FileList | null = target.files;

      if (files && files.length > 0) {
        inventoryCategoryImport_handleDropFile([files[0]]);
      }
    };

    input.click();
  };

  const inventoryCategoryImport_handleUpload = async () => {
    if (!uploadedFile.value) {
      console.warn('No file selected for upload');
      return;
    }
     inventoryCategoryImport_step.value = 2;
     inventoryCategoryImport_isLoading.value = true;
    try {
      // TODO: Panggil API upload di sini
      await new Promise(resolve => setTimeout(resolve, 2000)); // simulasi API
      inventoryCategoryImport_values.value = {
        statusCode: 400,
        message: 'File uploaded successfully',
        data: {
          items: [] as IInventoryCategoryImport[],
          meta: {
            page: 1,
            pageSize: 10,
            total: 0,
            totalPages: 1,
          },
        },
      } as IInventoryCategoryImportResponse;

      inventoryCategoryImport_step.value = 3;
    } catch (error) {
      inventoryCategoryImport_step.value = 1;
      console.error('Upload failed:', error);
    } finally {
      inventoryCategoryImport_isLoading.value = false;
    }
  };

  return {
    inventoryCategoryImport_onSubmit,
    inventoryCategoryImport_onClose,
    inventoryCategoryImport_step,
    inventoryCategoryImport_isLoading,
    inventoryCategoryImport_values: inventoryCategoryImport_values,
    inventoryCategoryImport_handleDownloadTemplate,
    inventoryCategoryImport_handleDropFile,
    inventoryCategoryImport_handleUpload,
    inventoryCategoryImport_triggerUpload,
    inventoryCategoryImport_columns: INVENTORY_CATEGORY_LIST_COLUMNS_IMPORT
  };
};
