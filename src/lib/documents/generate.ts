// Server-only document generators for DOCX and PDF.
// All user input is already validated and sanitized by the time it reaches here.
import "server-only";

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import * as fs from "fs";
import type { RenderedBodyItem } from "./template";

// ============================================================================
// DOCX generation — uses the `docx` library
// ============================================================================

export async function generateDocx(
  title: string,
  items: RenderedBodyItem[]
): Promise<Buffer> {
  // Build paragraphs
  const paragraphs: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: title, bold: true, size: 32 })],
    }),
    new Paragraph({ text: "" }), // spacer
  ];

  for (const item of items) {
    if (item.type === "spacer") {
      paragraphs.push(new Paragraph({ text: "" }));
      continue;
    }

    // Defensive: cap each item text length to prevent runaway memory
    const safeText = item.text.slice(0, 5000);

    switch (item.type) {
      case "heading":
        paragraphs.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: safeText, bold: true, size: 26 })],
          })
        );
        break;
      case "subheading":
        paragraphs.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [new TextRun({ text: safeText, bold: true, size: 22 })],
          })
        );
        break;
      case "list_item":
        paragraphs.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: safeText, size: 22 })],
          })
        );
        break;
      case "paragraph":
      default:
        paragraphs.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [new TextRun({ text: safeText, size: 22 })],
          })
        );
        break;
    }
  }

  const doc = new Document({
    creator: "Adolat Marketplace",
    title,
    description: "Adolat marketplace tomonidan yaratilgan hujjat",
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 }, // 2cm
          },
        },
        children: paragraphs,
      },
    ],
  });

  return Packer.toBuffer(doc);
}

// ============================================================================
// PDF generation — uses pdf-lib (pure JS, no external font files needed)
// Embeds DejaVu Sans TTF for full Cyrillic support.
// ============================================================================

let cachedRegularFont: ArrayBuffer | null = null;
let cachedBoldFont: ArrayBuffer | null = null;

function loadFont(path: string, cache: { buf: ArrayBuffer | null }): ArrayBuffer {
  if (cache.buf) return cache.buf;
  cache.buf = fs.readFileSync(path).buffer.slice(0);
  return cache.buf;
}

export async function generatePdf(
  title: string,
  items: RenderedBodyItem[]
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(title);
  pdfDoc.setAuthor("Adolat Marketplace");
  pdfDoc.setSubject("Legal document");
  pdfDoc.setProducer("Adolat Marketplace (pdf-lib)");
  pdfDoc.setCreator("Adolat Marketplace");

  // Embed DejaVu fonts (full Cyrillic support)
  let regularFont, boldFont;
  try {
    regularFont = await pdfDoc.embedFont(
      loadFont("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", { buf: cachedRegularFont }),
      { subset: true }
    );
    boldFont = await pdfDoc.embedFont(
      loadFont("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", { buf: cachedBoldFont }),
      { subset: true }
    );
  } catch (err) {
    console.error("[generatePdf] failed to embed DejaVu fonts, falling back to Helvetica:", err);
    regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  }

  const pageWidth = 595.28; // A4 width in PDF points
  const pageHeight = 841.89; // A4 height
  const margin = 56; // ~2cm
  const contentWidth = pageWidth - 2 * margin;

  // First page
  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;
  const lineHeight = 14;

  const ensureSpace = (h: number) => {
    if (y - h < margin + 30) {
      // Add new page
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
  };

  const drawText = (
    text: string,
    opts: {
      font?: typeof regularFont;
      size?: number;
      indent?: number;
      align?: "left" | "center" | "right";
      color?: { r: number; g: number; b: number };
    } = {}
  ) => {
    const font = opts.font ?? regularFont;
    const size = opts.size ?? 11;
    const indent = opts.indent ?? 0;
    const color = opts.color
      ? rgb(opts.color.r, opts.color.g, opts.color.b)
      : rgb(0.1, 0.1, 0.1);
    const safeText = text.slice(0, 5000);

    // Word-wrap manually
    const words = safeText.split(/\s+/);
    let line = "";
    const lines: string[] = [];
    const maxWidth = contentWidth - indent;
    for (const word of words) {
      const testLine = line ? line + " " + word : word;
      try {
        const w = font.widthOfTextAtSize(testLine, size);
        if (w > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = testLine;
        }
      } catch {
        // Skip measurement failure
        line = testLine;
      }
    }
    if (line) lines.push(line);

    for (const ln of lines) {
      ensureSpace(lineHeight);
      let x = margin + indent;
      if (opts.align === "center") {
        try {
          const w = font.widthOfTextAtSize(ln, size);
          x = (pageWidth - w) / 2;
        } catch {
          // skip
        }
      } else if (opts.align === "right") {
        try {
          const w = font.widthOfTextAtSize(ln, size);
          x = pageWidth - margin - w;
        } catch {
          // skip
        }
      }
      try {
        page.drawText(ln, { x, y, size, font, color });
      } catch (err) {
        console.error("[generatePdf] drawText failed:", err);
      }
      y -= lineHeight;
    }
  };

  // Title — centered, bold, larger
  drawText(title, { font: boldFont, size: 16, align: "center" });
  y -= lineHeight;

  // Body items
  for (const item of items) {
    if (item.type === "spacer") {
      y -= lineHeight / 2;
      continue;
    }

    const safeText = item.text.slice(0, 5000);

    switch (item.type) {
      case "heading":
        y -= lineHeight / 2;
        drawText(safeText, { font: boldFont, size: 13, align: "left" });
        y -= lineHeight / 4;
        break;
      case "subheading":
        y -= lineHeight / 4;
        drawText(safeText, { font: boldFont, size: 12, align: "left" });
        y -= lineHeight / 4;
        break;
      case "list_item":
        drawText(`• ${safeText}`, { size: 11, indent: 18 });
        break;
      case "paragraph":
      default:
        drawText(safeText, { size: 11, align: "left" });
        break;
    }
    y -= 2;
  }

  // Footer — page numbers + watermark
  const pages = pdfDoc.getPages();
  const now = new Date().toLocaleDateString("uz-UZ");
  pages.forEach((p, i) => {
    try {
      p.drawText(
        `Adolat Marketplace tomonidan yaratilgan · ${now} · Sahifa ${i + 1} / ${pages.length}`,
        {
          x: margin,
          y: 30,
          size: 8,
          font: regularFont,
          color: rgb(0.6, 0.6, 0.6),
        }
      );
    } catch (err) {
      console.error("[generatePdf] footer draw failed:", err);
    }
  });

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}
