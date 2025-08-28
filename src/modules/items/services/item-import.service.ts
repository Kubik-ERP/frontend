import eventBus from "@/plugins/mitt";
import { IInventoryItemImport, IInventoryItemImportProvided, IInventoryItemImportResponse } from "../interfaces/item-import.interface";
import { ITEMS_LIST_COLUMS_IMPORT } from "../constants";

export const useInventoryItemImportService = (): IInventoryItemImportProvided => {
  // State
  const inventoryItem_step = ref<number>(1);
  const inventoryItem_isLoading = ref<boolean>(false);
  const inventoryItem_values = ref<IInventoryItemImportResponse>();

  // Simpan file sementara
  const uploadedFile = ref<File | null>(null);

  // Handler
  const inventoryItem_onSubmit = () => {
    // Submit hasil import (misalnya kirim ke API)
    console.log('Submitting import values:', inventoryItem_values.value);
  };

  const inventoryItem_onClose = () => {
    inventoryItem_step.value = 1;
    inventoryItem_isLoading.value = false;
    inventoryItem_values.value = undefined;
    uploadedFile.value = null;

     eventBus.emit('AppBaseDialog', {
      id: 'inventory-item-import-modal',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    });
  };

  const inventoryItem_handleDownloadTemplate = () => {
    // Contoh download file template
    const link = document.createElement('a');
    link.href = '/templates/brand-import.xlsx'; // ganti dengan API/URL template
    link.download = 'brand-import-template.xlsx';
    link.click();
  };

  const inventoryItem_handleDropFile = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      uploadedFile.value = acceptedFiles[0];
      console.log('File dropped:', uploadedFile.value);

      // langsung proses upload setelah file diterima
       void inventoryItem_handleUpload();
    }
  };

  const inventoryItem_triggerUpload = () => {
    // Membuat input file secara dinamis
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.csv';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files: FileList | null = target.files;

      if (files && files.length > 0) {
        inventoryItem_handleDropFile([files[0]]);
      }
    };

    input.click();
  };

  const inventoryItem_handleUpload = async () => {
    if (!uploadedFile.value) {
      console.warn('No file selected for upload');
      return;
    }
     inventoryItem_step.value = 2;
     inventoryItem_isLoading.value = true;
    try {
      // TODO: Panggil API upload di sini
      await new Promise(resolve => setTimeout(resolve, 2000)); // simulasi API
      inventoryItem_values.value = {
        statusCode: 400,
        message: 'File uploaded successfully',
        data: {
          items:   [] as IInventoryItemImport[],
          meta: {
            page: 1,
            pageSize: 10,
            total: 0,
            totalPages: 1,
          },
        },
      } as IInventoryItemImportResponse;

      inventoryItem_step.value = 3;
    } catch (error) {
      inventoryItem_step.value = 1;
      console.error('Upload failed:', error);
    } finally {
      inventoryItem_isLoading.value = false;
    }
  };

  return {
    inventoryItem_onSubmit,
    inventoryItem_onClose,
    inventoryItem_step,
    inventoryItem_isLoading,
    inventoryItem_values: inventoryItem_values,
    inventoryItem_handleDownloadTemplate,
    inventoryItem_handleDropFile,
    inventoryItem_handleUpload,
    inventoryItem_triggerUpload,
    inventoryItem_columns: ITEMS_LIST_COLUMS_IMPORT
  };
};