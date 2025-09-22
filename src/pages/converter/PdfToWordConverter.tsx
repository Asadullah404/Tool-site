import * as pdfjsLib from "pdfjs-dist";
import { Document, Packer, Paragraph } from "docx";

class PdfToWordConverter {
  static async convert(
    file: File,
    targetFormat: string,
    setProgress: (p: number) => void
  ): Promise<Blob> {
    // Load PDF
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const paragraphs: Paragraph[] = [];
    const totalPages = pdf.numPages;

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Join text items into a single string per page
      const pageText = textContent.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ");

      paragraphs.push(new Paragraph(pageText));
      setProgress(Math.floor((pageNum / totalPages) * 100));
    }

    // Create a DOCX document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    // Generate Word file as Blob
    const blob = await Packer.toBlob(doc);
    return blob;
  }
}

export default PdfToWordConverter;
