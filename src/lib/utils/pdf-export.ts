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
  tableData: any[][];
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

