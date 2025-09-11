// JpgToPngConverter.ts
export default {
    convert: async (file: File, _to: string, setProgress: (n: number) => void): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            setProgress(50);
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject(new Error("Canvas not supported"));
            ctx.drawImage(img, 0, 0);
  
            setProgress(80);
            canvas.toBlob(
              (blob) => {
                if (!blob) return reject(new Error("Conversion failed"));
                setProgress(100);
                resolve(blob);
              },
              "image/png"
            );
          };
          img.src = event.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },
  };
  