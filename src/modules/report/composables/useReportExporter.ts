import html2pdf from 'html2pdf.js';

// store
import { useOutletStore } from '@/modules/outlet/store';

// Import your PDF template component directly
import reportPdfTemplate from '../components/reportPdfTemplate.vue';
import { App } from 'vue';

// Define the shape of the data needed for a report
export interface ReportConfig {
  reportName: string;
  period: string;
  columns: IColumnDataTable[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableData: any[];
}

export function useReportExporter() {
  const outletStore = useOutletStore();
  const { outlet_currentOutlet } = storeToRefs(outletStore);
  const exportReport = async (config: ReportConfig) => {
    // --- 1. FIXED/CONSTANT DATA IS HANDLED HERE ---
    const componentProps = {
      // Data passed from the function call
      reportData: {
        reportName: config.reportName,
        storeName: outlet_currentOutlet.value?.name || '',
        storeAddress: outlet_currentOutlet.value?.address || '',
        period: config.period,
        // Automatically generated data
        staffName: 'STAFF NAME', // Or get from a user store
        printDate: useFormatDate(new Date(), 'dd MMMM yyyy'),
        printTime: useFormatDate(new Date(), 'hh:MM:ss am/pm'),
      },
      columns: config.columns,
      tableData: config.tableData,
    };

    const pdfOptions = {
      margin: 0,
      filename: `[Backoffice]_${config.reportName}_${useFormatDate(new Date(), 'dd_mm_yyyy')}_${useFormatDate(new Date(), 'hh_MM_ss')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    // --- 2. THE RENDERING LOGIC REMAINS THE SAME ---
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);

    const app: App = createApp(reportPdfTemplate, componentProps);
    app.mount(container);

    try {
      await nextTick();
      const element = container.firstChild as HTMLElement;
      if (!element) throw new Error('PDF template failed to render.');

      console.log('Exporting to PDF...');
      await html2pdf().from(element).set(pdfOptions).save();
      console.log('PDF exported successfully.');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      app.unmount();
      document.body.removeChild(container);
    }
  };

  return {
    exportReport,
  };
}
