// src/utils/PdfToImageConverter.ts
// Full TypeScript + optimized for lazy loading

// Helper: convert dataURL → Blob
// function dataURLtoBlob(dataurl: string): Blob {
//   const [header, base64] = dataurl.split(",");
//   const mimeMatch = header.match(/:(.*?);/);
//   const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
//   const bstr = atob(base64);
//   const u8arr = new Uint8Array(bstr.length);
//   for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
//   return new Blob([u8arr], { type: mime });
// }

// export type PdfTargetFormat = "png" | "jpg";

// class PdfToImageConverter {
//   static async convert(
//     file: File,
//     targetFormat: PdfTargetFormat,
//     setProgress: (progress: number) => void
//   ): Promise<Blob> {
//     // Lazy load heavy libraries
//     const pdfjsLib = (await import("pdfjs-dist/legacy/build/pdf")).default;
//     const pdfWorker = (await import("pdfjs-dist/build/pdf.worker?url")).default;
//     const JSZip = (await import("jszip")).default;

//     pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

//     const arrayBuffer = await file.arrayBuffer();
//     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
//     const zip = new JSZip();

//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const scale = 2; // resolution scale
//       const viewport = page.getViewport({ scale });

//       const canvas = document.createElement("canvas");
//       canvas.width = Math.floor(viewport.width);
//       canvas.height = Math.floor(viewport.height);
//       const ctx = canvas.getContext("2d")!;
      
//       await page.render({ canvas, canvasContext: ctx, viewport }).promise;

//       const mime = targetFormat === "jpg" ? "image/jpeg" : "image/png";
//       const dataUrl = canvas.toDataURL(mime, 0.92);
//       zip.file(`page_${i}.${targetFormat}`, dataURLtoBlob(dataUrl));

//       setProgress(Math.round((i / pdf.numPages) * 90));
//     }

//     return zip.generateAsync({ type: "blob" });
//   }
// }

// export default PdfToImageConverter;


import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/src/display/api";

function dataURLtoBlob(dataurl: string): Blob {
  const [header, base64] = dataurl.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  const bstr = atob(base64);
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
  return new Blob([u8arr], { type: mime });
}

export type PdfTargetFormat = "png" | "jpg";

class PdfToImageConverter {
  static async convert(
    file: File,
    targetFormat: string,
    setProgress: (progress: number) => void,
    scale = 2
  ): Promise<Blob> {
    if (targetFormat !== "jpg" && targetFormat !== "png") {
      throw new Error(`Unsupported target format: ${targetFormat}`);
    }

    // Lazy-load heavy libs
    const pdfjsLib = (await import("pdfjs-dist/legacy/build/pdf")).default;
    const pdfWorker = (await import("pdfjs-dist/build/pdf.worker?url")).default;
    const JSZip = (await import("jszip")).default;

    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

    const arrayBuffer = await file.arrayBuffer();
    const pdf: PDFDocumentProxy = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const zip = new JSZip();

    const baseName = file.name.replace(/\.[^/.]+$/, "");

    for (let i = 1; i <= pdf.numPages; i++) {
      const page: PDFPageProxy = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      // ✅ FIX: only pass canvasContext + viewport
      await page.render({
        canvasContext: ctx,
        viewport,
        canvas, // 👈 required for legacy typings
      }).promise;

      const mime = targetFormat === "jpg" ? "image/jpeg" : "image/png";
      const dataUrl = canvas.toDataURL(mime, 0.92);

      zip.file(`${baseName}_page_${i}.${targetFormat}`, dataURLtoBlob(dataUrl));

      // cleanup memory
      canvas.width = 0;
      canvas.height = 0;

      setProgress(Math.round((i / pdf.numPages) * 90));
    }

    // Final step (last 10%)
    return zip.generateAsync({ type: "blob" }, (meta) => {
      setProgress(90 + Math.round((meta.percent / 100) * 10));
    });
  }
}

export default PdfToImageConverter;




// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf"; // use legacy build for TypeScript
// import pdfWorker from "pdfjs-dist/build/pdf.worker?url"; // local worker

// // Helper: convert dataURL → Blob
// function dataURLtoBlob(dataurl: string): Blob {
//   const [header, base64] = dataurl.split(",");
//   const mimeMatch = header.match(/:(.*?);/);
//   const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
//   const bstr = atob(base64);
//   const u8arr = new Uint8Array(bstr.length);
//   for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
//   return new Blob([u8arr], { type: mime });
// }

// class PdfToImageConverter {
//   static async convert(
//     file: File,
//     targetFormat: "png" | "jpg",
//     setProgress: (progress: number) => void
//   ): Promise<Blob> {
//     // Set local worker
//     pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

//     // Read PDF
//     const arrayBuffer = await file.arrayBuffer();
//     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

//     // Lazy-load JSZip to reduce initial bundle size
//     const JSZip = (await import("jszip")).default;
//     const zip = new JSZip();

//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const scale = 2;
//       const viewport = page.getViewport({ scale });
//       const canvas = document.createElement("canvas");
//       canvas.width = Math.floor(viewport.width);
//       canvas.height = Math.floor(viewport.height);
//       const ctx = canvas.getContext("2d")!;
//       await page.render({
//         canvas,
//         canvasContext: ctx,
//         viewport
//       }).promise;

//       const mime = targetFormat === "jpg" ? "image/jpeg" : "image/png";
//       const dataUrl = canvas.toDataURL(mime, 0.92);
//       const imgBlob = dataURLtoBlob(dataUrl);

//       zip.file(`page_${i}.${targetFormat}`, imgBlob);

//       setProgress(Math.round((i / pdf.numPages) * 90));
//     }

//     const zipBlob = await zip.generateAsync({ type: "blob" });
//     return zipBlob;
//   }
// }

// export default PdfToImageConverter;
