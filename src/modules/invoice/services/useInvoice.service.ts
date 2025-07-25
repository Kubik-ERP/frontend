// html2pdf.js
import html2pdf from 'html2pdf.js';

// Interfaces
import {
  IInvoiceInvoiceData,
  IInvoiceModalPayData,
  IInvoiceOtherOptionsData,
  IInvoiceProvided,
} from '../interfaces';

// Store
import { useInvoiceStore } from '../store';
import { useCashierStore } from '@/modules/cashier/store';
import { useAuthenticationStore } from '@/modules/authentication/store';
import { useOutletStore } from '@/modules/outlet/store';
import { useSettingStore } from '@/modules/setting/store';

// Constant
import { CASHIER_DUMMY_PARAMS_SIMULATE_PAYMENT, CASHIER_PROVIDER } from '@/modules/cashier/constants';
import useVuelidate from '@vuelidate/core';
import { minValue, numeric, required } from '@vuelidate/validators';

export const useInvoiceService = (): IInvoiceProvided => {
  const store = useInvoiceStore();
  const storeCashier = useCashierStore();
  const storeAuthentication = useAuthenticationStore();
  const storeOutlet = useOutletStore();
  const storeSetting = useSettingStore();

  const route = useRoute();

  const invoice_activeInvoice = ref<number>(1);

  const { outlet_currentOutlet } = storeToRefs(storeOutlet);
  const { setting_invoice } = storeToRefs(storeSetting);

  const invoice_modalPay = ref<IInvoiceModalPayData>({
    show: false,
    showModalPayment: false,
    isLoading: false,
    listPayment: [],
    dataPayment: {},
    data: {
      selectedPaymentMethod: '',
      moneyReceived: 0,
      totalPrice: 0,
      change: 0,
    },
  });

  /**
   * @description Handle order type selection
   * @returns void
   */
  const invoice_handleFetchPaymentMethod = async () => {
    invoice_modalPay.value.isLoading = true;

    try {
      const response = await storeCashier.cashierProduct_fetchPaymentMethod({});

      invoice_modalPay.value.listPayment = response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      invoice_modalPay.value.isLoading = false;
    }
  };

  invoice_handleFetchPaymentMethod();

  /**
   * @description Handle printing of the invoice
   * @param invoiceRef
   * @param kitchenRef
   * @param cashierRef
   * @returns void
   * @throws Error if the print fails
   */
  const invoice_handlePrint = (
    type: string,
    invoiceRef: HTMLElement | null = null,
    kitchenRef: HTMLElement | null = null,
    cashierRef: HTMLElement | null = null,
  ) => {
    const print = (ref: HTMLElement | null) => {
      if (!ref) return;

      ref.classList.remove('hidden');

      window.print();

      setTimeout(() => {
        ref.classList.add('hidden');
      }, 1000);
    };

    switch (type) {
      case 'invoice':
        print(invoiceRef);
        break;
      case 'kitchen':
        print(kitchenRef);
        break;
      case 'table':
        print(cashierRef);
        break;
      default:
        console.error('Unknown invoice type selected');
        return;
    }
  };

  /**
   * @description Handle downloading of the invoice
   * @param invoiceRef
   * @param kitchenRef
   * @param cashierRef
   * @returns void
   * @throws Error if the download fails
   */
  const invoice_handleDownload = (
    invoiceRef: HTMLElement | null = null,
    kitchenRef: HTMLElement | null = null,
    cashierRef: HTMLElement | null = null,
  ) => {
    const download = (ref: HTMLElement | null) => {
      if (!ref) return;

      ref.classList.remove('hidden');

      html2pdf()
        .from(ref)
        .set({
          margin: 0,
          filename: 'invoice.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        })
        .save()
        .then(() => {
          ref.classList.add('hidden');
        });
    };

    switch (invoice_activeInvoice.value) {
      case 1:
        download(invoiceRef);
        break;
      case 2:
        download(kitchenRef);
        break;
      case 3:
        download(cashierRef);
        break;
      default:
        console.error('Unknown invoice type selected');
        return;
    }
  };

  const invoice_otherOptions = ref<IInvoiceOtherOptionsData>({
    isLoadingSendEmail: false,
  });

  /**
   * @description Handle other options like copy, email, or WhatsApp
   * @param type - The type of action to perform
   * @returns void
   */
  const invoice_handleOtherOptions = async (type: 'copy' | 'email' | 'whatsapp') => {
    if (invoice_invoiceData.value.data?.customer.code && invoice_invoiceData.value.data?.customer.number) {
      const whatsappNumber =
        invoice_invoiceData.value.data?.customer.code.toString() +
        invoice_invoiceData.value.data?.customer.number.toString();
      const whatsappMessage = `Please find the invoice details at: ${window.location.href}`;

      switch (type) {
        case 'copy':
          try {
            navigator.clipboard.writeText(window.location.host + '/static/invoice/' + route.params.invoiceId);
            alert('Invoice link copied to clipboard!');
          } catch (error) {
            console.error('Failed to copy text: ', error);
          }
          break;
        case 'email':
          invoice_otherOptions.value.isLoadingSendEmail = true;
          try {
            await store.invoice_sendEmail(route.params.invoiceId as string);

            alert('Email sent successfully!');
          } catch (error) {
            if (error instanceof Error) {
              return Promise.reject(error);
            } else {
              return Promise.reject(new Error(String(error)));
            }
          } finally {
            invoice_otherOptions.value.isLoadingSendEmail = false;
          }

          break;
        case 'whatsapp':
          window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
          break;
        default:
          console.error('Unknown option selected');
      }
    }
  };

  const invoice_formRules = {
    paymentAmount: {
      required,
      numeric,
      minValue: minValue(computed(() => invoice_invoiceData.value.calculate?.grandTotal || 0)),
    },
  };

  const invoice_invoiceData = ref<IInvoiceInvoiceData>({
    isLoading: false,
    data: null,
    calculate: null,
    tableKitchenTicket: null,
    currentUser: storeAuthentication.authentication_userData,
    currentOutlet: outlet_currentOutlet.value,
    configInvoice: setting_invoice.value,
    form: {
      paymentAmount: 0,
    },
  });

  const invoice_invoiceDataValidation = useVuelidate(invoice_formRules, invoice_invoiceData.value.form, {
    $autoDirty: true,
  });

  const invoice_handleCalculate = async () => {
    invoice_invoiceData.value.isLoading = true;

    const mappedProducts = invoice_invoiceData.value.data?.invoiceDetails.map(item => ({
      ...item,
      quantity: item.qty,
      variantId: item.variantId || '',
    }));

    try {
      const response = await storeCashier.cashierProduct_calculateEstimation({
        products: mappedProducts || [],
        orderType: invoice_invoiceData.value.data?.orderType,
      });

      invoice_invoiceData.value.calculate = response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      invoice_invoiceData.value.isLoading = false;
    }
  };

  /**
   * @description Fetch invoice data by ID
   * @param invoiceId - The ID of the invoice to fetch
   * @throws Error if the fetch fails
   * @returns Promise<void>
   */
  const invoice_handleFetchInvoiceById = async (invoiceId: string): Promise<void> => {
    invoice_invoiceData.value.isLoading = true;

    try {
      const response = await store.invoice_fetchInvoiceById(invoiceId);

      invoice_invoiceData.value.data = response.data;

      await storeSetting.fetchSetting_detailInvoiceSetting(invoice_invoiceData.value.currentOutlet?.id || '', {});

      invoice_invoiceData.value.configInvoice = setting_invoice.value;

      if (response.data.paymentStatus === 'unpaid') {
        await invoice_handleCalculate();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      invoice_invoiceData.value.isLoading = false;
    }
  };

  invoice_handleFetchInvoiceById(route.params.invoiceId as string);

  /**
   * @description Fetch kitchen table ticket by invoice ID
   * @param invoiceId - The ID of the invoice to fetch
   * @returns Promise<void>
   * @throws Error if the fetch fails
   */
  const invoice_handleFetchKitchenTableTicket = async (invoiceId: string): Promise<void> => {
    invoice_invoiceData.value.isLoading = true;

    try {
      const response = await store.invoice_fetchTableKitchenTicket(invoiceId);

      invoice_invoiceData.value.tableKitchenTicket = response.data;

      await storeSetting.fetchSetting_detailInvoiceSetting(invoice_invoiceData.value.currentOutlet?.id || '', {});

      invoice_invoiceData.value.configInvoice = setting_invoice.value;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      invoice_invoiceData.value.isLoading = false;
    }
  };

  invoice_handleFetchKitchenTableTicket(route.params.invoiceId as string);

  const invoice_handlePayInvoice = async () => {
    invoice_modalPay.value.isLoading = true;

    try {
      const getSelectedPaymentMethod = invoice_modalPay.value.listPayment.find(
        item => item.id === invoice_modalPay.value.data.selectedPaymentMethod,
      )?.name;

      if(getSelectedPaymentMethod?.toUpperCase() === 'CASH') {
        invoice_invoiceDataValidation.value.$touch();
        if (invoice_invoiceDataValidation.value.$invalid) return;
      }
      
      const provider = getSelectedPaymentMethod?.toUpperCase() === 'CASH' ? 'cash' : CASHIER_PROVIDER;
      
      const params = {
        provider,
        paymentMethodId: invoice_modalPay.value.data.selectedPaymentMethod,
        invoiceId: route.params.invoiceId as string,
        paymentAmount: invoice_invoiceData.value.form.paymentAmount,
      };

      const response = await storeCashier.cashierProduct_paymentUnpaid(params);

      invoice_modalPay.value.dataPayment = response.data;

      if(getSelectedPaymentMethod?.toUpperCase() === 'QRIS') {
        invoice_modalPay.value.showModalPayment = true;
      } else {
        await invoice_handleFetchInvoiceById(route.params.invoiceId as string);
      }

      invoice_modalPay.value.show = false;
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      invoice_modalPay.value.isLoading = false;
    }
  };

  /**
   * @description Handle simulating payment
   * @param {string} invoiceId - The invoice ID to simulate payment for
   * @returns void
   */
  const invoice_handleSimulatePayment = async (invoiceId: string) => {
    try {
      const params = {
        ...CASHIER_DUMMY_PARAMS_SIMULATE_PAYMENT,
        order_id: invoiceId,
      };

      await storeCashier.cashierProduct_simulatePayment(params);
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      invoice_modalPay.value.showModalPayment = false;

      invoice_handleFetchInvoiceById(route.params.invoiceId as string);
    }
  };

  

  return {
    invoice_activeInvoice,
    invoice_invoiceData,
    invoice_modalPay,
    invoice_otherOptions,
    invoice_invoiceDataValidation,

    invoice_handleDownload,
    invoice_handlePrint,
    invoice_handleOtherOptions,
    invoice_handlePayInvoice,
    invoice_handleSimulatePayment,
  };
};
