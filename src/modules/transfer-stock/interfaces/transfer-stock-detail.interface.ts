// Interfaces
import type { Validation } from '@vuelidate/core';
import type {
  ITransferStock,
  ITransferStockApprovePayload,
  ITransferStockCancelPayload,
  ITransferStockShipPayload,
  ITransferStockReceivePayload,
} from './transfer-stock-store.interface';
import type { TransferStockShippingDocumentPdfData } from './transfer-stock-shipping-document.interface';

export interface ITransferStockDetailProvided {
  transferStockDetail_data: globalThis.Ref<ITransferStock | null>;
  transferStockDetail_dynamicButtonAction: (status: string) => void;
  transferStockDetail_dynamicButtonLabel: (status: string) => string;
  transferStockDetail_fetchDetails: (id: string) => Promise<unknown>;
  transferStockDetail_formDataOfApprove: globalThis.Ref<ITransferStockApprovePayload>;
  transferStockDetail_formDataOfCancel: globalThis.Ref<ITransferStockCancelPayload>;
  transferStockDetail_formDataOfShip: globalThis.Ref<ITransferStockShipPayload>;
  transferStockDetail_formDataOfReceive: globalThis.Ref<ITransferStockReceivePayload>;
  transferStockDetail_formValidationsOfApprove: globalThis.Ref<Validation>;
  transferStockDetail_formValidationsOfCancel: globalThis.Ref<Validation>;
  transferStockDetail_formValidationsOfShip: globalThis.Ref<Validation>;
  transferStockDetail_formValidationsOfReceive: globalThis.Ref<Validation>;
  transferStockDetail_isLoading: globalThis.Ref<boolean>;
  transferStockDetail_onApprove: () => Promise<void>;
  transferStockDetail_onCancel: () => void;
  transferStockDetail_onCloseDialogApprove: () => void;
  transferStockDetail_onCloseDialogCancel: () => void;
  transferStockDetail_onCloseDialogShip: () => void;
  transferStockDetail_onCloseDialogReceive: () => void;
  transferStockDetail_onLoadInitialData: (id: string) => Promise<void>;
  transferStockDetail_onReceive: () => Promise<void>;
  transferStockDetail_onShip: () => Promise<void>;
  transferStockDetail_onShowDialogApprove: () => void;
  transferStockDetail_onShowDialogCancel: () => void;
  transferStockDetail_onShowDialogShip: () => void;
  transferStockDetail_onShowDialogReceive: () => void;
  transferStockDetail_onSubmitApprove: () => Promise<void>;
  transferStockDetail_onSubmitCancel: () => Promise<void>;
  transferStockDetail_onSubmitShip: () => Promise<void>;
  transferStockDetail_onSubmitReceive: () => Promise<void>;
  // PDF export functionality
  handleExportShippingDocumentToPdf: () => void;
  shippingDocumentData: globalThis.Ref<TransferStockShippingDocumentPdfData | null>;
}