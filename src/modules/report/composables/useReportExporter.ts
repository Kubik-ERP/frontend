import html2pdf from 'html2pdf.js';

// store
import { useOutletStore } from '@/modules/outlet/store';

// Import your PDF template component directly
import reportPdfTemplate from '../components/reportPdfTemplate.vue';
import { App } from 'vue';

// Define the shape of the data needed for a report
interface ReportConfig {
  reportName: string;
  period: string;
  columns: IColumnDataTable[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableData: any[];
}

export function useReportExporter() {
  const outletStore = useOutletStore();
  const { outlet_currentOutlet } = storeToRefs(outletStore);

  const exportToCsv = (config: ReportConfig) => {
    const reportHeader = [
      // Each element in this array is a new row in the CSV
      `Report Name:,${config.reportName}`,
      `Store Name:,${outlet_currentOutlet.value?.name || ''}`,
      `Store Address:,${outlet_currentOutlet.value?.address || ''}`,
      `Period:,${config.period}`,
      `Printed On:,${useFormatDate(new Date(), 'dd MMMM yyyy, hh:MM:ss am/pm')}`,
      '', // Adds a blank row for spacing before the table
    ];
    // --- 2. CREATE THE TABLE CONTENT (Your existing logic) ---

    // Helper to escape cells
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const escapeCell = (cellData: any): string => {
      const stringValue = String(cellData ?? '');
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    // Create the table's header row
    const tableHeaderRow = config.columns.map(col => escapeCell(col.label)).join(',');

    // Create the data rows
    const dataRows = config.tableData.map(row => {
      return config.columns
        .map(col => {
          return escapeCell(row[col.value]);
        })
        .join(',');
    });

    // --- 3. COMBINE EVERYTHING ---
    const csvContent = [...reportHeader, tableHeaderRow, ...dataRows].join('\n');

    // 2. TRIGGER THE DOWNLOAD

    // Create a Blob (Binary Large Object) from the CSV string
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a temporary link element
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }

    // Create a URL for the blob and set it as the link's href
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute(
      'download',
      `[Backoffice]_${config.reportName}_${useFormatDate(new Date(), 'dd_mm_yyyy')}_${useFormatDate(new Date(), 'hh_MM_ss_am/pm')}`,
    );

    // Append the link to the body, click it, and then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const exportToPdf = async (config: ReportConfig) => {
    // --- 1. FIXED/CONSTANT DATA IS HANDLED HERE ---
    const componentProps = {
      // Data passed from the function call
      reportData: {
        reportName: config.reportName,
        storeName: outlet_currentOutlet.value?.name || '',
        storeAddress: outlet_currentOutlet.value?.address || '',
        period: config.period,
        // Automatically generated data
        printDate: useFormatDate(new Date(), 'dd MMMM yyyy'),
        printTime: useFormatDate(new Date(), 'hh:MM:ss am/pm'),
      },
      columns: config.columns,
      tableData: config.tableData,
    };

    const pdfOptions = {
      margin: 0,
      filename: `[Backoffice]_${config.reportName}_${useFormatDate(new Date(), 'dd_mm_yyyy')}_${useFormatDate(new Date(), 'hh_MM_ss_am/pm')}.pdf`,
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
    exportToPdf,
    exportToCsv,
  };
}
