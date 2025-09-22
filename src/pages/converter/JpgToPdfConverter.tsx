// src/converters/JpgToPdfConverter.ts
import { jsPDF } from "jspdf";

const JpgToPdfConverter = {
  convert: async (
    file: File,
    to: string,
    setProgress: (p: number) => void
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const imgData = e.target?.result as string;
          const pdf = new jsPDF();

          // Get image dimensions
          const img = new Image();
          img.src = imgData;
          img.onload = () => {
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            let imgWidth = img.width;
            let imgHeight = img.height;

            // Scale to fit page
            if (imgWidth > pageWidth || imgHeight > pageHeight) {
              const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
              imgWidth *= ratio;
              imgHeight *= ratio;
            }

            pdf.addImage(imgData, "JPEG", (pageWidth - imgWidth) / 2, (pageHeight - imgHeight) / 2, imgWidth, imgHeight);

            setProgress(100);
            const blob = pdf.output("blob");
            resolve(blob);
          };
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },
};

export default JpgToPdfConverter;
