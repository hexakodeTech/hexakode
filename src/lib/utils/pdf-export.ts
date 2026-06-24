interface PDFSummaryItem {
  label: string;
  value: string;
}

interface PDFMetadataItem {
  label: string;
  value: string;
}

interface PDFExportOptions {
  filename: string;
  title: string;
  subtitle?: string;
  metadata?: PDFMetadataItem[];
  summaryTitle?: string;
  summaryItems?: PDFSummaryItem[];
  tableHeaders: string[];
  tableData: any[][];
  emptyMessage?: string;
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

  // 1. Draw Document Header
  // Subtitle (HexaKode Engineering)
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(13, 148, 136); // HexaKode Teal: #0d9488
  doc.text(subtitle.toUpperCase(), margin, currentY);
  currentY += 6;

  // Title (e.g. Referral Code Report)
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // Slate 900: #0f172a
  doc.text(title, margin, currentY);
  currentY += 8;

  // 2. Draw Metadata (e.g. Generated On)
  if (metadata.length > 0) {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // Slate 500: #64748b

    const metaStrings = metadata.map(item => `${item.label}: ${item.value}`);
    doc.text(metaStrings.join('   |   '), margin, currentY);
    currentY += 6;
  }

  // Horizontal Brand Separator Line
  doc.setDrawColor(13, 148, 136);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 10;

  // 3. Draw Summary Section (as a modern card with a left colored bar)
  if (summaryItems.length > 0) {
    // Calculate heights & layout
    const itemHeight = 6;
    const padding = 6;
    const numRows = Math.ceil(summaryItems.length / 2);
    const cardHeight = 10 + (numRows * itemHeight) + (padding * 2);

    // Draw card background
    doc.setFillColor(248, 250, 252); // Slate 50: #f8fafc
    doc.rect(margin, currentY, pageWidth - (margin * 2), cardHeight, 'F');

    // Draw card left accent border
    doc.setFillColor(13, 148, 136); // Teal 600
    doc.rect(margin, currentY, 3, cardHeight, 'F');

    let summaryY = currentY + padding;

    // Draw Summary Title inside card
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(summaryTitle.toUpperCase(), margin + 8, summaryY + 3);
    summaryY += 8;

    // Draw Items in a 2-column grid
    doc.setFontSize(9);
    const col1X = margin + 8;
    const col2X = pageWidth / 2 + 10;

    for (let i = 0; i < summaryItems.length; i += 2) {
      // Column 1
      const item1 = summaryItems[i];
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(71, 85, 105); // Slate 600
      doc.text(`${item1.label}:`, col1X, summaryY);

      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      const val1X = col1X + doc.getTextWidth(`${item1.label}: `) + 1;
      doc.text(item1.value, val1X, summaryY);

      // Column 2 (if present)
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

    currentY += cardHeight + 10;
  }

  // 4. Draw Enquiries Section Header
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('ASSOCIATED ENQUIRIES', margin, currentY);
  currentY += 6;

  // 5. Draw Table
  if (tableData.length === 0) {
    // Empty state table using jspdf-autotable
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
    // Normal table using jspdf-autotable
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

  // 6. Draw Footer & Page Numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400: #94a3b8

    // Left footer text
    doc.text('CONFIDENTIAL - FOR INTERNAL USE ONLY', margin, pageHeight - 10);

    // Right footer text (Page X of Y)
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  }

  // Save/Download PDF
  doc.save(filename);
}
