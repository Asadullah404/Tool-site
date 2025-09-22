// import React, { useState } from 'react';
// import { ArrowRight, Download } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import FileUploadZone from '@/components/FileUploadZone';
// import SettingsPanel from '@/components/SettingsPanel';
// import { useToast } from '@/hooks/use-toast';

// // Import conversion handlers
// import PngToJpgConverter from './converter/PngToJpgConverter';
// import JpgToPngConverter from './converter/JpgToPngConverter';
// import PdfToWordConverter from './converter/PdfToWordConverter';
// import WordToPdfConverter from './converter/WordToPdfConverter';
// import PdfToImageConverter from './converter/PdfToImageConverter';
// import JpgToPdfConverter from './converter/JpgToPdfConverter'; // ✅ fixed
// import TextToPdfConverter from './converter/TextToPdfConverter';
// import ExcelToTextConverter from './converter/ExcelToTextConverter';
// import TextToExcelConverter from './converter/TextToExcelConverter';

// // Import format configuration
// import { formatConfig } from './formatConfig';

// interface ConversionPageProps {
//   from: string;
//   to: string;
// }

// const ConversionPage: React.FC<ConversionPageProps> = ({ from, to }) => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isConverting, setIsConverting] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [convertedFile, setConvertedFile] = useState<string | null>(null);
//   const { toast } = useToast();

//   const fromFormat = (formatConfig as any)[from] ?? { name: from, accept: ['*'] };
//   const toFormat = (formatConfig as any)[to] ?? { name: to };

//   const handleFileSelect = (file: File) => {
//     setSelectedFile(file);
//     setConvertedFile(null);
//     setProgress(0);
//   };

//   const getConverter = () => {
//     const conversionKey = `${from}_to_${to}`;
    
//     switch (conversionKey) {
//       case 'pdf_to_word':
//         return PdfToWordConverter;
//       case 'word_to_pdf':
//         return WordToPdfConverter;
//       case 'pdf_to_jpg':
//       case 'pdf_to_png':
//         return PdfToImageConverter;
//       case 'png_to_jpg':
//         return PngToJpgConverter;
//       case 'jpg_to_png':
//         return JpgToPngConverter;
//       case 'jpg_to_pdf':
//         return JpgToPdfConverter;
//       case 'text_to_pdf':
//         return TextToPdfConverter;
//       case 'excel_to_text':
//         return ExcelToTextConverter;
//       case 'text_to_excel':
//       case 'json_to_excel':
//         return TextToExcelConverter;
//       default:
//         return null;
//     }
//   };
  
  

//   const handleConvert = async () => {
//     if (!selectedFile) return;
    
//     setIsConverting(true);
//     setProgress(5);

//     try {
//       const converter = getConverter();
      
//       if (!converter) {
//         throw new Error(`Conversion from ${from} to ${to} is not supported.`);
//       }

//       const blob = await converter.convert(selectedFile, to, setProgress);
//       const url = URL.createObjectURL(blob);
//       setConvertedFile(url);
//       setProgress(100);

//       toast({
//         title: 'Conversion Complete',
//         description: `Converted ${fromFormat.name} → ${toFormat.name}.`,
//       });
//     } catch (err: any) {
//       console.error('Conversion error', err);
//       toast({
//         title: 'Conversion Failed',
//         description: err?.message || 'An error occurred during conversion.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsConverting(false);
//     }
//   };

//   const handleDownload = () => {
//     if (!convertedFile) return;
//     const link = document.createElement("a");
//     link.href = convertedFile;
  
//     let ext: string;
  
//     // Special case: JPG → PDF
//     if (from === "jpg" && to === "pdf") {
//       ext = "pdf";
//     }
//     // Special case: PDF → JPG/PNG returns a ZIP
//     else if (from === "pdf" && (to === "jpg" || to === "png")) {
//       ext = "zip";
//     } else {
//       ext =
//         to === "excel"
//           ? "xlsx"
//           : to === "word"
//           ? "docx"
//           : to === "powerpoint"
//           ? "pptx"
//           : to === "text"
//           ? "txt"
//           : to === "jpg"
//           ? "jpg"
//           : to === "png"
//           ? "png"
//           : to;
//     }
  
//     link.download = `converted_file.${ext}`;
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   };
  
  
//   return (
//     <div className="min-h-screen py-12 px-4">
//       <div className="max-w-4xl mx-auto">
//         <div className="text-center mb-12">
//           <div className="flex items-center justify-center gap-4 mb-6">
//             <div className="flex items-center gap-2">
//               <fromFormat.icon className={`w-8 h-8 ${fromFormat.color}`} />
//               <span className="text-2xl font-bold text-foreground">{fromFormat.name}</span>
//             </div>
//             <ArrowRight className="w-6 h-6 text-primary" />
//             <div className="flex items-center gap-2">
//               <toFormat.icon className={`w-8 h-8 ${toFormat.color}`} />
//               <span className="text-2xl font-bold text-foreground">{toFormat.name}</span>
//             </div>
//           </div>
//           <h1 className="text-4xl font-bold text-foreground mb-4">
//             Convert {fromFormat.name} to {toFormat.name}
//           </h1>
//           <p className="text-xl text-muted-foreground">Fast. Secure. No signup required.</p>
//         </div>

//         <Card className="p-8 mb-8 bg-card border border-border shadow-lg">
//           <div className="flex flex-col items-center justify-center space-y-6">
//             <FileUploadZone
//               acceptedTypes={fromFormat.accept}
//               onFileSelect={handleFileSelect}
//               isConverting={isConverting}
//               progress={progress}
//             />
//             {selectedFile && !convertedFile && (
//               <Button onClick={handleConvert} disabled={isConverting} className="btn-hero px-8 py-3 text-lg">
//                 {isConverting ? 'Converting...' : `Convert to ${toFormat.name}`}
//               </Button>
//             )}
//             {convertedFile && (
//               <div className="text-center space-y-4">
//                 <div className="text-green-500 font-medium">✓ Conversion Complete!</div>
//                 <Button onClick={handleDownload} className="btn-hero px-8 py-3 text-lg">
//                   <Download className="w-5 h-5 mr-2" />
//                   Download {toFormat.name} File
//                 </Button>
//               </div>
//             )}
//           </div>
//         </Card>

//         <SettingsPanel />
//       </div>
//     </div>
//   );
// };

// export default ConversionPage;

import React, { useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FileUploadZone from "@/components/FileUploadZone";
import SettingsPanel from "@/components/SettingsPanel";
import { useToast } from "@/hooks/use-toast";

// Import conversion handlers
import PngToJpgConverter from "./converter/PngToJpgConverter";
import JpgToPngConverter from "./converter/JpgToPngConverter";
import PdfToWordConverter from "./converter/PdfToWordConverter";
import WordToPdfConverter from "./converter/WordToPdfConverter";
import PdfToImageConverter from "./converter/PdfToImageConverter";
import JpgToPdfConverter from "./converter/JpgToPdfConverter";
import TextToPdfConverter from "./converter/TextToPdfConverter";
import ExcelToTextConverter from "./converter/ExcelToTextConverter";
import TextToExcelConverter from "./converter/TextToExcelConverter";

// Format config
import { formatConfig } from "./formatConfig";

interface ConversionPageProps {
  from: string;
  to: string;
}

const ConversionPage: React.FC<ConversionPageProps> = ({ from, to }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const fromFormat = (formatConfig as any)[from] ?? { name: from, accept: ["*"] };
  const toFormat = (formatConfig as any)[to] ?? { name: to };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setConvertedFile(null);
    setProgress(0);
  };

  const getConverter = () => {
    const conversionKey = `${from}_to_${to}`;
    switch (conversionKey) {
      case "pdf_to_word":
        return PdfToWordConverter;
      case "word_to_pdf":
        return WordToPdfConverter;
      case "pdf_to_jpg":
      case "pdf_to_png":
        return PdfToImageConverter;
      case "png_to_jpg":
        return PngToJpgConverter;
      case "jpg_to_png":
        return JpgToPngConverter;
      case "jpg_to_pdf":
        return JpgToPdfConverter;
      case "text_to_pdf":
        return TextToPdfConverter;
      case "excel_to_text":
        return ExcelToTextConverter;
      case "text_to_excel":
      case "json_to_excel":
        return TextToExcelConverter;
      default:
        return null;
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setProgress(5);

    try {
      const converter = getConverter();

      if (!converter) {
        throw new Error(`Conversion from ${from} to ${to} is not supported.`);
      }

      const blob = await converter.convert(selectedFile, to, setProgress);
      const url = URL.createObjectURL(blob);
      setConvertedFile(url);
      setProgress(100);

      toast({
        title: "Conversion Complete",
        description: `Converted ${fromFormat.name} → ${toFormat.name}.`,
      });
    } catch (err: any) {
      console.error("Conversion error", err);
      toast({
        title: "Conversion Failed",
        description: err?.message || "An error occurred during conversion.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedFile || !selectedFile) return;

    let ext: string;

    if (from === "jpg" && to === "pdf") {
      ext = "pdf";
    } else if (from === "pdf" && (to === "jpg" || to === "png")) {
      ext = "zip"; // PDF → Images always returns a ZIP
    } else {
      ext =
        to === "excel"
          ? "xlsx"
          : to === "word"
          ? "docx"
          : to === "powerpoint"
          ? "pptx"
          : to === "text"
          ? "txt"
          : to === "jpg"
          ? "jpg"
          : to === "png"
          ? "png"
          : to;
    }

    const baseName = selectedFile.name.replace(/\.[^/.]+$/, "");
    const link = document.createElement("a");
    link.href = convertedFile;
    link.download = `${baseName}.${ext}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <fromFormat.icon className={`w-8 h-8 ${fromFormat.color}`} />
              <span className="text-2xl font-bold text-foreground">{fromFormat.name}</span>
            </div>
            <ArrowRight className="w-6 h-6 text-primary" />
            <div className="flex items-center gap-2">
              <toFormat.icon className={`w-8 h-8 ${toFormat.color}`} />
              <span className="text-2xl font-bold text-foreground">{toFormat.name}</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Convert {fromFormat.name} to {toFormat.name}
          </h1>
          <p className="text-xl text-muted-foreground">Fast. Secure. No signup required.</p>
        </div>

        {/* Conversion Card */}
        <Card className="p-8 mb-8 bg-card border border-border shadow-lg">
          <div className="flex flex-col items-center justify-center space-y-6">
            <FileUploadZone
              acceptedTypes={fromFormat.accept}
              onFileSelect={handleFileSelect}
              isConverting={isConverting}
              progress={progress}
            />
            {selectedFile && !convertedFile && (
              <Button
                onClick={handleConvert}
                disabled={isConverting}
                className="btn-hero px-8 py-3 text-lg"
              >
                {isConverting ? "Converting..." : `Convert to ${toFormat.name}`}
              </Button>
            )}
            {convertedFile && (
              <div className="text-center space-y-4">
                <div className="text-green-500 font-medium">✓ Conversion Complete!</div>
                <Button onClick={handleDownload} className="btn-hero px-8 py-3 text-lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download {toFormat.name} File
                </Button>
              </div>
            )}
          </div>
        </Card>

        <SettingsPanel />
      </div>
    </div>
  );
};

export default ConversionPage;
