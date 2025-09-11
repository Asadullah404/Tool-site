import * as pdfjsLib from 'pdfjs-dist';

class PdfToTextConverter {
  static async convert(file: File, targetFormat: string, setProgress: (progress: number) => void): Promise<Blob> {
    // Ensure pdf worker is available (uses CDN fallback)
    try {
      (pdfjsLib as any).GlobalWorkerOptions.workerSrc =
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjsLib as any).version || '2.16.105'}/pdf.worker.min.js`;
    } catch (e) {
      // ignore if cannot set
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await (pdfjsLib as any).getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent({ normalizeWhitespace: true });
      const pageText = content.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n\n';
      setProgress(Math.round((i / pdf.numPages) * 80));
    }
    
    return new Blob([fullText], { type: 'text/plain' });
  }
}

export default PdfToTextConverter;