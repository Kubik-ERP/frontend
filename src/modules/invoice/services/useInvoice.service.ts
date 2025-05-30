// html2pdf.js
import html2pdf from 'html2pdf.js';

// Interfaces
import { IInvoiceInvoiceData, IInvoiceProvided } from '../interfaces';
import { useInvoiceStore } from '../store';

export const useInvoiceService = (): IInvoiceProvided => {
  const store = useInvoiceStore();

  const route = useRoute();

  const invoice_activeInvoice = ref(1);

  const invoice_handlePrint = (
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

    switch (invoice_activeInvoice.value) {
      case 1:
        print(invoiceRef);
        break;
      case 2:
        print(kitchenRef);
        break;
      case 3:
        print(cashierRef);
        break;
      default:
        console.error('Unknown invoice type selected');
        return;
    }
  };

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

  const invoice_handleOtherOptions = (type: 'copy' | 'email' | 'whatsapp') => {
    const email = 'ramadwiyantara1@gmail.com';
    const subject = 'Invoice Details';
    const body = `Please find the invoice details at: ${window.location.href}`;

    const whatsappNumber = '6281234567890';
    const whatsappMessage = `Please find the invoice details at: ${window.location.href}`;

    switch (type) {
      case 'copy':
        navigator.clipboard.writeText(window.location.href);
        break;
      case 'email':
        window.open(
          `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
          '_blank',
        );
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
        break;
      default:
        console.error('Unknown option selected');
    }
  };

  const invoice_invoiceData = ref<IInvoiceInvoiceData>({
    isLoading: false,
    data: {},
  });

  const invoice_handleFetchInvoiceById = async (invoiceId: string): Promise<void> => {
    try {
      const response = await store.invoice_fetchInvoiceById(invoiceId);

      invoice_invoiceData.value.data = response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  invoice_handleFetchInvoiceById(route.params.invoiceId as string);

  return {
    invoice_activeInvoice,

    invoice_invoiceData,

    invoice_handleDownload,
    invoice_handlePrint,
    invoice_handleOtherOptions,
  };
};
