import { formatCurrency } from '@/lib/currency';

interface PDFSummaryItem {
  label: string;
  value: string;
}

interface PDFMetadataItem {
  label: string;
  value: string;
}

/** Data for the dedicated "CREDIT BALANCE USAGE" block shown when credits are applied */
interface PDFCreditSection {
  startingBalance: string;  // formatted, e.g. "$800.00"
  creditsUsed: string;      // formatted, e.g. "$123.00"
  remainingBalance: string; // formatted, e.g. "$677.00"
  paymentMethod: string;    // e.g. "Credit Balance" | "Direct Payment" | "Credit Balance + Direct Payment"
  transactionId?: string;   // CreditTransaction UUID — shown in the PDF footer
}

interface PDFExportOptions {
  filename: string;
  title: string;
  subtitle?: string;
  metadata?: PDFMetadataItem[];
  summaryTitle?: string;
  summaryItems?: PDFSummaryItem[];
  creditSection?: PDFCreditSection; // optional credit balance block
  tableHeaders: string[];
  tableData: (string | number | boolean | null)[][];
  emptyMessage?: string;
}

/**
 * Loads an image from a URL asynchronously.
 */
function loadImg(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
}

/**
 * Reusable utility to generate and download a professional PDF report.
 * Uses dynamic imports internally to remain fully safe for Next.js SSR.
 */
export async function exportToPDF({
  filename,
  title,
  subtitle = 'HexaKode Engineering',
  metadata = [],
  summaryTitle = 'Report Summary',
  summaryItems = [],
  creditSection,
  tableHeaders,
  tableData,
  emptyMessage = 'No records found.'
}: PDFExportOptions) {
  if (typeof window === 'undefined') return;

  // Dynamically import client-only libraries
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  // Create jsPDF instance (A4, portrait, units in mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let currentY = 20;

  // Load Logo Image
  let img: HTMLImageElement | null = null;
  try {
    img = await loadImg('/logo.png');
  } catch (err) {
    console.error('Failed to load primary logo, trying fallback...', err);
    try {
      img = await loadImg('/logo-icon.png');
    } catch (fallbackErr) {
      console.error('Failed to load fallback logo', fallbackErr);
    }
  }

  // Draw Logo (height approx 10mm -> 38px)
  const logoHeight = 10;
  let logoWidth = 10;
  if (img) {
    const aspectRatio = img.width / img.height;
    logoWidth = logoHeight * aspectRatio;
    doc.addImage(img, 'PNG', margin, currentY, logoWidth, logoHeight);
  }

  // Draw Brand Name next to the logo
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // Slate 900
  const textX = img ? margin + logoWidth + 4 : margin;
  doc.text(subtitle, textX, currentY + 6.25);

  // Draw Website URL on the right
  const linkText = 'www.hexakode.in';
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(13, 148, 136); // Teal 600: #0d9488
  const linkY = currentY + 6.25;
  doc.text(linkText, pageWidth - margin, linkY, { align: 'right' });
  
  // Add clickable hyperlink bounding box over the right text
  const linkWidth = doc.getTextWidth(linkText);
  doc.link(pageWidth - margin - linkWidth, linkY - 3.5, linkWidth, 5, { url: 'https://www.hexakode.in' });

  // Move Y down past the header block
  currentY += logoHeight + 8;

  // Title
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text(title, margin, currentY);
  currentY += 6;

  // Metadata items printed line-by-line
  if (metadata.length > 0) {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139); // Slate 500
    
    metadata.forEach((item) => {
      doc.text(`${item.label}: ${item.value}`, margin, currentY);
      currentY += 4.5;
    });
  }
  currentY += 2;

  // Divider line using HexaKode brand blue (Teal #0d9488)
  doc.setDrawColor(13, 148, 136);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 10;

  // ── Invoice Summary card (2-column grid layout) ──────────────────────────────
  if (summaryItems.length > 0) {
    const itemHeight = 6;
    const padding = 6;
    const numRows = Math.ceil(summaryItems.length / 2);
    const cardHeight = 10 + (numRows * itemHeight) + (padding * 2);
    
    // Card background
    doc.setFillColor(248, 250, 252); // Slate 50
    doc.rect(margin, currentY, pageWidth - (margin * 2), cardHeight, 'F');
    
    // Left accent bar
    doc.setFillColor(13, 148, 136); // Teal 600
    doc.rect(margin, currentY, 3, cardHeight, 'F');

    let summaryY = currentY + padding;
    
    // Summary Title inside card
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(summaryTitle.toUpperCase(), margin + 8, summaryY + 3);
    summaryY += 8;

    // Items in a 2-column grid
    doc.setFontSize(9);
    const col1X = margin + 8;
    const col2X = pageWidth / 2 + 10;

    for (let i = 0; i < summaryItems.length; i += 2) {
      const item1 = summaryItems[i];
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(71, 85, 105); // Slate 600
      doc.text(`${item1.label}:`, col1X, summaryY);
      
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      const val1X = col1X + doc.getTextWidth(`${item1.label}: `) + 1;
      doc.text(item1.value, val1X, summaryY);

      if (i + 1 < summaryItems.length) {
        const item2 = summaryItems[i + 1];
        doc.setFont('Helvetica', 'bold');
        doc.setTextColor(71, 85, 105);
        doc.text(`${item2.label}:`, col2X, summaryY);

        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        const val2X = col2X + doc.getTextWidth(`${item2.label}: `) + 1;
        doc.text(item2.value, val2X, summaryY);
      }

      summaryY += itemHeight;
    }

    currentY += cardHeight + 8;
  }

  // ── Credit Balance Usage card (only when credits were applied) ───────────────
  if (creditSection) {
    const creditRows = [
      { label: 'Starting Credit Balance', value: creditSection.startingBalance },
      { label: 'Credits Used',             value: creditSection.creditsUsed },
      { label: 'Remaining Credit Balance', value: creditSection.remainingBalance },
      { label: 'Payment Method',           value: creditSection.paymentMethod },
    ];

    const itemHeight = 6;
    const padding = 6;
    const cardHeight = 10 + (creditRows.length * itemHeight) + (padding * 2);

    // Card background (slightly green tint to distinguish from Invoice Summary)
    doc.setFillColor(240, 253, 250); // Teal 50
    doc.rect(margin, currentY, pageWidth - (margin * 2), cardHeight, 'F');

    // Left accent bar (darker teal to differentiate)
    doc.setFillColor(15, 118, 110); // Teal 700
    doc.rect(margin, currentY, 3, cardHeight, 'F');

    let creditY = currentY + padding;

    // Section title
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('CREDIT BALANCE USAGE', margin + 8, creditY + 3);
    creditY += 8;

    // Single-column list for clarity
    doc.setFontSize(9);
    const labelX = margin + 8;
    const valueX = margin + 90; // right-aligned value column

    creditRows.forEach((row) => {
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text(`${row.label}:`, labelX, creditY);

      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(row.value, valueX, creditY);

      creditY += itemHeight;
    });

    currentY += cardHeight + 8;
  }

  // ── Line-item table section header ───────────────────────────────────────────
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('ASSOCIATED ENQUIRIES', margin, currentY);
  currentY += 6;

  // ── Line-item table ───────────────────────────────────────────────────────────
  if (tableData.length === 0) {
    autoTable(doc, {
      startY: currentY,
      head: [tableHeaders],
      body: [
        [{ 
          content: emptyMessage, 
          colSpan: tableHeaders.length, 
          styles: { halign: 'center', textColor: [100, 116, 139], fontStyle: 'italic', cellPadding: 12 } 
        }]
      ],
      theme: 'plain',
      headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
      styles: { lineColor: [226, 232, 240], lineWidth: 0.1 },
      margin: { left: margin, right: margin }
    });
  } else {
    autoTable(doc, {
      startY: currentY,
      head: [tableHeaders],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { textColor: [15, 23, 42], fontSize: 8.5 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { cellPadding: 5, valign: 'middle' },
      margin: { left: margin, right: margin }
    });
  }

  // ── Footer & Page Numbers ─────────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400

    // Left footer — branding
    doc.text('Generated by HexaKode Engineering | www.hexakode.in', margin, pageHeight - 14);

    // Credit transaction audit note (only on last page, below main footer line)
    if (i === totalPages && creditSection?.transactionId) {
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Credit Balance Transaction ID: ${creditSection.transactionId}`,
        margin,
        pageHeight - 10
      );
    }

    // Right footer — page numbers
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 14, { align: 'right' });
  }

  // Save/Download PDF
  doc.save(filename);
}

// ── Roboto Font Loader for Indian Rupee Symbol support ───────────────────────

let robotoNormalBase64: string | null = null;
let robotoBoldBase64: string | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

async function ensureRobotoFonts() {
  if (robotoNormalBase64 && robotoBoldBase64) return;
  try {
    const [resNormal, resBold] = await Promise.all([
      fetch('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf'),
      fetch('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf')
    ]);
    const [bufNormal, bufBold] = await Promise.all([
      resNormal.arrayBuffer(),
      resBold.arrayBuffer()
    ]);
    robotoNormalBase64 = arrayBufferToBase64(bufNormal);
    robotoBoldBase64 = arrayBufferToBase64(bufBold);
  } catch (err) {
    console.error('Failed to load Roboto fonts from CDN', err);
  }
}

// ── Dedicated Invoice PDF Exporter ──────────────────────────────────────────

export interface InvoicePDFOptions {
  filename: string;
  invoiceNumber: string;
  issuedDate: string;
  dueDate: string;
  clientName: string;
  projectName?: string | null;
  status: "Paid" | "Pending" | "Overdue";
  paymentMethod?: string | null;
  subtotal: number;
  discountType: 'amount' | 'percentage';
  discountValue: number;
  discountAmount: number;
  creditApplied: number;
  finalAmountDue: number;
  startingCreditBalance?: number | null;
  creditTransactionId?: string | null;
  maintenanceLogs?: { title: string; description?: string | null }[];
}

export async function exportInvoicePDF({
  filename,
  invoiceNumber,
  issuedDate,
  dueDate,
  clientName,
  projectName,
  status,
  paymentMethod,
  subtotal,
  discountType,
  discountValue,
  discountAmount,
  creditApplied,
  finalAmountDue,
  startingCreditBalance,
  creditTransactionId,
  maintenanceLogs = []
}: InvoicePDFOptions) {
  if (typeof window === 'undefined') return;

  // Dynamically import client-only libraries
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  // Create jsPDF instance
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let currentY = 20;

  // Load Roboto font from CDN for unicode Rupee symbol support
  let hasRoboto = false;
  await ensureRobotoFonts();
  if (robotoNormalBase64 && robotoBoldBase64) {
    doc.addFileToVFS('Roboto-Regular.ttf', robotoNormalBase64);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.addFileToVFS('Roboto-Bold.ttf', robotoBoldBase64);
    doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
    hasRoboto = true;
  }

  const primaryFont = hasRoboto ? 'Roboto' : 'Helvetica';

  // Currency helper formatting inside the PDF (uses Rs. fallback if offline/no Roboto)
  const formatVal = (val: number) => {
    const formatted = formatCurrency(val);
    if (!hasRoboto) {
      return formatted.replace('₹', 'Rs. ');
    }
    return formatted;
  };

  // Load Logo Image
  let img: HTMLImageElement | null = null;
  try {
    img = await loadImg('/logo.png');
  } catch (err) {
    console.error('Failed to load primary logo, trying fallback...', err);
    try {
      img = await loadImg('/logo-icon.png');
    } catch (fallbackErr) {
      console.error('Failed to load fallback logo', fallbackErr);
    }
  }

  // Draw Logo (height approx 10mm)
  const logoHeight = 10;
  let logoWidth = 10;
  if (img) {
    const aspectRatio = img.width / img.height;
    logoWidth = logoHeight * aspectRatio;
    doc.addImage(img, 'PNG', margin, currentY, logoWidth, logoHeight);
  }

  // Draw Brand Name next to the logo
  doc.setFont(primaryFont, 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // Slate 900
  const textX = img ? margin + logoWidth + 4 : margin;
  doc.text('HexaKode Billing System', textX, currentY + 6.25);

  // Draw Website URL on the right
  const linkText = 'www.hexakode.in';
  doc.setFont(primaryFont, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(13, 148, 136); // Teal 600
  const linkY = currentY + 6.25;
  doc.text(linkText, pageWidth - margin, linkY, { align: 'right' });
  const linkWidth = doc.getTextWidth(linkText);
  doc.link(pageWidth - margin - linkWidth, linkY - 3.5, linkWidth, 5, { url: 'https://www.hexakode.in' });

  currentY += logoHeight + 8;

  // Title
  doc.setFont(primaryFont, 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text(`INVOICE: ${invoiceNumber}`, margin, currentY);
  currentY += 6;

  // Metadata
  doc.setFont(primaryFont, 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // Slate 500

  const metadata = [
    { label: 'Invoice Number', value: invoiceNumber },
    { label: 'Issue Date', value: issuedDate },
    { label: 'Due Date', value: dueDate },
    { label: 'Client Name', value: clientName },
  ];
  if (projectName) {
    metadata.push({ label: 'Linked Project', value: projectName });
  }

  metadata.forEach((item) => {
    doc.text(`${item.label}: ${item.value}`, margin, currentY);
    currentY += 4.5;
  });
  currentY += 2;

  // Divider line (Teal #0d9488)
  doc.setDrawColor(13, 148, 136);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 10;

  // Draw Table Section Title
  doc.setFont(primaryFont, 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('LINE ITEMS', margin, currentY);
  currentY += 6;

  // Build table headers and data
  const tableHeaders = ['Description', 'Qty', 'Unit Price', 'Total'];
  let tableData: string[][] = [];

  if (maintenanceLogs && maintenanceLogs.length > 0) {
    const N = maintenanceLogs.length;
    // Calculate split subtotal using standard integer distribution to match subtotal exactly
    const baseSubtotalCents = Math.floor(subtotal * 100);
    const splitBaseCents = Math.floor(baseSubtotalCents / N);
    const remainderCents = baseSubtotalCents % N;

    tableData = maintenanceLogs.map((log, index) => {
      // distribute remainder to the last item
      const itemCents = index === N - 1 ? splitBaseCents + remainderCents : splitBaseCents;
      const itemPrice = itemCents / 100;

      return [
        log.title,
        '1',
        formatVal(itemPrice),
        formatVal(itemPrice)
      ];
    });
  } else {
    const desc = projectName 
      ? `Development & maintenance services for project: ${projectName}`
      : 'Development & maintenance services';
    tableData = [
      [
        desc,
        '1',
        formatVal(subtotal),
        formatVal(subtotal)
      ]
    ];
  }

  // Draw Table
  autoTable(doc, {
    startY: currentY,
    head: [tableHeaders],
    body: tableData,
    theme: 'striped',
    headStyles: { 
      fillColor: [13, 148, 136], 
      textColor: [255, 255, 255], 
      fontStyle: 'bold', 
      fontSize: 9,
      font: primaryFont
    },
    bodyStyles: { 
      textColor: [15, 23, 42], 
      fontSize: 8.5,
      font: primaryFont
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { cellPadding: 5, valign: 'middle' },
    margin: { left: margin, right: margin }
  });

  currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // Prepare calculations for summary block
  const summaryRows: { label: string; value: string; isBold?: boolean; isLarge?: boolean; isDivider?: boolean }[] = [];

  summaryRows.push({ label: 'Subtotal', value: formatVal(subtotal) });

  if (discountAmount > 0) {
    const discountLabel = discountType === 'percentage' 
      ? `Discount (${discountValue}%)` 
      : 'Discount';
    summaryRows.push({ label: discountLabel, value: `-${formatVal(discountAmount)}` });
  }

  if (creditApplied > 0) {
    summaryRows.push({ label: 'Credits Applied', value: `-${formatVal(creditApplied)}` });
  }

  // Divider line before Amount Due
  summaryRows.push({ label: '', value: '', isDivider: true });

  summaryRows.push({ 
    label: 'Amount Due', 
    value: formatVal(finalAmountDue), 
    isBold: true, 
    isLarge: true 
  });

  // Check height needed for summary block (each row is approx 5.5mm, divider is 3mm)
  const estimatedSummaryHeight = summaryRows.length * 5.5 + 15;
  if (currentY + estimatedSummaryHeight > pageHeight - 20) {
    doc.addPage();
    currentY = 20;
  }

  // Determine actual payment method
  const actualPaymentMethod = paymentMethod || (creditApplied > 0
    ? (finalAmountDue > 0 ? 'Credit Balance + Direct Payment' : 'Credit Balance')
    : 'Direct Payment');

  // Draw payment info block (left-aligned) & calculation block (right-aligned) side-by-side
  const blockStartY = currentY;

  // --- Left Side: Payment Info ---
  doc.setFont(primaryFont, 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105); // Slate 600
  doc.text('PAYMENT INFORMATION', margin, currentY);
  currentY += 6;

  doc.setFont(primaryFont, 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text('Payment Status:', margin, currentY);
  doc.setFont(primaryFont, 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(status.toUpperCase(), margin + 28, currentY);
  currentY += 5.5;

  if (actualPaymentMethod) {
    doc.setFont(primaryFont, 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text('Payment Method:', margin, currentY);
    doc.setFont(primaryFont, 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(actualPaymentMethod, margin + 28, currentY);
  }

  // --- Right Side: Calculations ---
  let calcY = blockStartY;
  const rightLabelX = pageWidth - margin - 60; // Align label columns
  const rightValueX = pageWidth - margin;      // Align value columns (right-aligned)

  summaryRows.forEach((row) => {
    if (row.isDivider) {
      calcY += 1.5;
      doc.setDrawColor(226, 232, 240); // Slate 200
      doc.setLineWidth(0.4);
      doc.line(rightLabelX, calcY, rightValueX, calcY);
      calcY += 4.5;
      return;
    }

    const fontSize = row.isLarge ? 11 : 9;
    const fontType = row.isBold ? 'bold' : 'normal';
    const textColor = row.isLarge ? [15, 23, 42] : (row.label.startsWith('Discount') ? [245, 158, 11] : [71, 85, 105]);

    doc.setFont(primaryFont, fontType);
    doc.setFontSize(fontSize);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    // Draw label
    doc.text(`${row.label}:`, rightLabelX, calcY);

    // Draw value right-aligned
    doc.text(row.value, rightValueX, calcY, { align: 'right' });

    calcY += 5.5;
  });

  // Set currentY to max of payment info and calculations ending
  currentY = Math.max(currentY, calcY) + 10;

  // --- Credit Balance Usage audit card ---
  if (creditApplied > 0 && startingCreditBalance != null) {
    const remainingBal = startingCreditBalance - creditApplied;
    const creditRows = [
      { label: 'Starting Credit Balance', value: formatVal(startingCreditBalance) },
      { label: 'Credits Used',             value: formatVal(creditApplied) },
      { label: 'Remaining Credit Balance', value: formatVal(remainingBal) },
      { label: 'Payment Method',           value: actualPaymentMethod },
    ];

    const itemHeight = 6;
    const padding = 6;
    const cardHeight = 10 + (creditRows.length * itemHeight) + (padding * 2);

    if (currentY + cardHeight > pageHeight - 20) {
      doc.addPage();
      currentY = 20;
    }

    // Card background (Teal 50)
    doc.setFillColor(240, 253, 250);
    doc.rect(margin, currentY, pageWidth - (margin * 2), cardHeight, 'F');

    // Left accent bar (Teal 700)
    doc.setFillColor(15, 118, 110);
    doc.rect(margin, currentY, 3, cardHeight, 'F');

    let creditY = currentY + padding;

    // Section title
    doc.setFont(primaryFont, 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('CREDIT BALANCE USAGE', margin + 8, creditY + 3);
    creditY += 8;

    // List details
    doc.setFontSize(9);
    const labelX = margin + 8;
    const valueX = margin + 90;

    creditRows.forEach((row) => {
      doc.setFont(primaryFont, 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text(`${row.label}:`, labelX, creditY);

      doc.setFont(primaryFont, 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(row.value, valueX, creditY);

      creditY += itemHeight;
    });

    currentY += cardHeight + 8;
  }

  // --- Footer & Page Numbers ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont(primaryFont, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400

    // Left footer — branding
    doc.text('Generated by HexaKode Engineering | www.hexakode.in', margin, pageHeight - 14);

    // Credit transaction audit note (only on last page)
    if (i === totalPages && creditTransactionId) {
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Credit Balance Transaction ID: ${creditTransactionId}`,
        margin,
        pageHeight - 10
      );
    }

    // Right footer — page numbers
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 14, { align: 'right' });
  }

  // Save/Download PDF
  doc.save(filename);
}

