import eventBus from "@/plugins/mitt";
import { ISupplierImport, ISupplierImportProvided, ISupplierImportResponse } from "../interfaces/supplier-import.interface";
import { SUPPLIER_LIST_COLUMNS_IMPORT } from "../constants";

export const useSupplierImportService = (): ISupplierImportProvided => {
  // State
  const supplierImport_step = ref<number>(1);
  const supplierImport_isLoading = ref<boolean>(false);
  const supplierImport_values = ref<ISupplierImportResponse>();

  // Simpan file sementara
  const uploadedFile = ref<File | null>(null);

  // Handler
  const supplierImport_onSubmit = () => {
    // Submit hasil import (misalnya kirim ke API)
    console.log('Submitting import values:', supplierImport_values.value);
  };

  const supplierImport_onClose = () => {
    supplierImport_step.value = 1;
    supplierImport_isLoading.value = false;
    supplierImport_values.value = undefined;
    uploadedFile.value = null;

     eventBus.emit('AppBaseDialog', {
      id: 'supplier-import-modal',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    });
  };

  const supplierImport_handleDownloadTemplate = () => {
    // Contoh download file template
    const link = document.createElement('a');
    link.href = '/templates/brand-import.xlsx'; // ganti dengan API/URL template
    link.download = 'brand-import-template.xlsx';
    link.click();
  };

  const supplierImport_handleDropFile = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      uploadedFile.value = acceptedFiles[0];
      console.log('File dropped:', uploadedFile.value);

      // langsung proses upload setelah file diterima
       void supplierImport_handleUpload();
    }
  };

  const supplierImport_triggerUpload = () => {
    // Membuat input file secara dinamis
    const input: HTMLInputElement = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.csv';

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files: FileList | null = target.files;

      if (files && files.length > 0) {
        supplierImport_handleDropFile([files[0]]);
      }
    };

    input.click();
  };

  const supplierImport_handleUpload = async () => {
    if (!uploadedFile.value) {
      console.warn('No file selected for upload');
      return;
    }
     supplierImport_step.value = 2;
     supplierImport_isLoading.value = true;
    try {
      // TODO: Panggil API upload di sini
      await new Promise(resolve => setTimeout(resolve, 2000)); // simulasi API
      supplierImport_values.value = {
        statusCode: 400,
        message: 'File uploaded successfully',
        data: {
          items:  [] as ISupplierImport[],
          meta: {
            page: 1,
            pageSize: 10,
            total: 0,
            totalPages: 1,
          },
        },
      } as ISupplierImportResponse;

      supplierImport_step.value = 3;
    } catch (error) {
      supplierImport_step.value = 1;
      console.error('Upload failed:', error);
    } finally {
      supplierImport_isLoading.value = false;
    }
  };

  return {
    supplierImport_onSubmit,
    supplierImport_onClose,
    supplierImport_step,
    supplierImport_isLoading,
    supplierImport_values: supplierImport_values,
    supplierImport_handleDownloadTemplate,
    supplierImport_handleDropFile,
    supplierImport_handleUpload,
    supplierImport_triggerUpload,
    supplierImport_columns: SUPPLIER_LIST_COLUMNS_IMPORT
  };
};