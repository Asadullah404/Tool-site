import * as pdfjsLib from "pdfjs-dist";
// Import the worker locally so it works offline
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

// Helper: dataURL → Blob
function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}

class PdfToImageConverter {
  static async convert(
    file: File,
    targetFormat: string,
    setProgress: (progress: number) => void
  ): Promise<Blob> {
    // Use local worker instead of Cloudflare
    (pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfWorker;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await (pdfjsLib as any).getDocument({ data: arrayBuffer }).promise;

    // Create a ZIP file to store all pages
    const zip = new (await import("jszip")).default();

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const scale = 2; // Increase for better resolution
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport }).promise;

      const mime = targetFormat === "jpg" ? "image/jpeg" : "image/png";
      const dataUrl = canvas.toDataURL(mime, 0.92);
      const imgBlob = dataURLtoBlob(dataUrl);

      // Add each page to the ZIP
      zip.file(`page_${i}.${targetFormat}`, imgBlob);

      setProgress(Math.round((i / pdf.numPages) * 90));
    }

    // Generate final ZIP blob
    const zipBlob = await zip.generateAsync({ type: "blob" });
    return zipBlob;
  }
}

export default PdfToImageConverter;
