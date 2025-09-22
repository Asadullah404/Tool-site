// import React, { useState } from "react";
// import { PDFDocument } from "pdf-lib";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import FileUploadZone from "@/components/FileUploadZone";
// import { useToast } from "@/hooks/use-toast";
// import { Download, ArrowUp, ArrowDown, Trash2, Info, File, FileText, ArrowRight, SplitSquareVertical } from "lucide-react";

// const PdfMergerPage: React.FC = () => {
//   const [files, setFiles] = useState<File[]>([]);
//   const [mergedFile, setMergedFile] = useState<string | null>(null);
//   const [isConverting, setIsConverting] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const { toast } = useToast();

//   const handleFileSelect = (file: File) => {
//     setFiles((prev) => [...prev, file]);
//     setMergedFile(null);
//     setProgress(0);
//   };

//   const moveFile = (index: number, direction: "up" | "down") => {
//     setFiles((prev) => {
//       const newFiles = [...prev];
//       const targetIndex = direction === "up" ? index - 1 : index + 1;
//       if (targetIndex < 0 || targetIndex >= newFiles.length) return prev;
//       [newFiles[index], newFiles[targetIndex]] = [
//         newFiles[targetIndex],
//         newFiles[index],
//       ];
//       return newFiles;
//     });
//   };

//   const removeFile = (index: number) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleMerge = async () => {
//     if (files.length < 2) {
//       toast({
//         title: "Need at least 2 PDFs",
//         description: "Please upload 2 or more PDF files to merge.",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       setIsConverting(true);
//       setProgress(0);

//       const mergedPdf = await PDFDocument.create();

//       for (let i = 0; i < files.length; i++) {
//         const bytes = await files[i].arrayBuffer();
//         const pdf = await PDFDocument.load(bytes);
//         const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
//         copiedPages.forEach((page) => mergedPdf.addPage(page));

//         setProgress(Math.round(((i + 1) / files.length) * 100));
//       }

//       const mergedBytes = await mergedPdf.save();
//       const blob = new Blob([mergedBytes], { type: "application/pdf" });
//       const url = URL.createObjectURL(blob);
//       setMergedFile(url);

//       toast({
//         title: "PDFs Merged",
//         description: "Your merged PDF is ready to download!",
//       });
//     } catch (err) {
//       toast({
//         title: "Merge Failed",
//         description: "Something went wrong",
//         variant: "destructive",
//       });
//     } finally {
//       setIsConverting(false);
//     }
//   };

//   const handleDownload = () => {
//     if (!mergedFile) return;
//     const link = document.createElement("a");
//     link.href = mergedFile;
//     link.download = "merged.pdf";
//     link.click();
//   };

//   return (
//     <div className="min-h-screen py-12 px-4 flex items-center justify-center bg-background">
//       <div className="w-full max-w-3xl">
//         {/* Top heading with multiple PDF icons */}
//         <div className="text-center space-y-4 mb-10">
//           <div className="flex justify-center items-center gap-4 text-gray-700">
//             <FileText className="w-12 h-12 text-primary" />
//             <FileText className="w-12 h-12 text-primary" />
//             <FileText className="w-12 h-12 text-primary" />
//             <ArrowRight className="w-8 h-8" />
//             <SplitSquareVertical className="w-12 h-12 text-primary" />
//             <ArrowRight className="w-8 h-8" />
//             <div className="flex gap-2">
//               <FileText className="w-10 h-10 text-green-500" />

//             </div>
//           </div>

//           <h1 className="text-3xl font-bold">Merge Different pdf files.</h1>
//           <p className="text-gray-500">Fast. Secure. No signup required.</p>
//         </div>
//         {/* File Upload Zone in styled Card */}
//         <Card className="p-8 mb-8 bg-card border border-border shadow-lg">
//           <div className="flex flex-col items-center justify-center space-y-6">
//             <FileUploadZone
//               acceptedTypes={[".pdf"]}
//               onFileSelect={handleFileSelect}
//               isConverting={isConverting}
//               progress={progress}
//             />

//             {/* File List with order + controls */}
//             {files.length > 0 && (
//               <div className="space-y-3 w-full">
//                 {files.map((file, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between p-3 border rounded-lg bg-muted/40"
//                   >
//                     <div className="flex flex-col">
//                       <span className="font-medium text-sm text-foreground">
//                         {index + 1} → {file.name}
//                       </span>
//                       <span className="text-xs text-muted-foreground">
//                         Position: {index + 1}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Button
//                         size="icon"
//                         variant="outline"
//                         onClick={() => moveFile(index, "up")}
//                         disabled={index === 0}
//                       >
//                         <ArrowUp className="w-4 h-4" />
//                       </Button>
//                       <Button
//                         size="icon"
//                         variant="outline"
//                         onClick={() => moveFile(index, "down")}
//                         disabled={index === files.length - 1}
//                       >
//                         <ArrowDown className="w-4 h-4" />
//                       </Button>
//                       <Button
//                         size="icon"
//                         variant="outline"
//                         onClick={() => removeFile(index)}
//                       >
//                         <Trash2 className="w-4 h-4 text-red-500" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}

//                 {/* Helper instructions */}
//                 <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-md">
//                   <Info className="w-4 h-4 mt-0.5 text-blue-500" />
//                   <p>
//                     Tip: File Upload zone only show last file you added 
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Merge Button */}
//             {files.length > 0 && !mergedFile && (
//               <Button
//                 onClick={handleMerge}
//                 disabled={isConverting}
//                 className="btn-hero px-8 py-3 text-lg w-full"
//               >
//                 {isConverting
//                   ? `Merging... (${progress}%)`
//                   : `Merge ${files.length} PDFs`}
//               </Button>
//             )}

//             {/* Download Button */}
//             {mergedFile && (
//               <div className="text-center space-y-4 w-full">
//                 <div className="text-green-500 font-medium">
//                   ✓ Merge Complete!
//                 </div>
//                 <Button
//                   onClick={handleDownload}
//                   className="btn-hero px-8 py-3 text-lg w-full"
//                 >
//                   <Download className="w-5 h-5 mr-2" /> Download Merged PDF
//                 </Button>
//               </div>
//             )}
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// const ArrowRightIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="w-5 h-5 text-purple-500"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M9 5l7 7-7 7"
//     />
//   </svg>
// );

// export default PdfMergerPage;

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FileUploadZone from "@/components/FileUploadZone";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  ArrowUp,
  ArrowDown,
  Trash2,
  Info,
  FileText,
  ArrowRight,
  SplitSquareVertical,
} from "lucide-react";

const PdfMergerPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [mergedFile, setMergedFile] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setFiles((prev) => [...prev, file]);
    setMergedFile(null);
    setProgress(0);
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newFiles.length) return prev;
      [newFiles[index], newFiles[targetIndex]] = [
        newFiles[targetIndex],
        newFiles[index],
      ];
      return newFiles;
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        title: "Need at least 2 PDFs",
        description: "Please upload 2 or more PDF files to merge.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConverting(true);
      setProgress(0);

      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const bytes = await files[i].arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));

        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setMergedFile(url);

      toast({
        title: "PDFs Merged",
        description: "Your merged PDF is ready to download!",
      });
    } catch (err) {
      toast({
        title: "Merge Failed",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!mergedFile) return;
    const link = document.createElement("a");
    link.href = mergedFile;
    link.download = "merged.pdf";
    link.click();
  };

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center bg-background">
      <div className="w-full max-w-3xl">
        {/* Top heading with multiple PDF icons */}
        <div className="text-center space-y-4 mb-10">
          <div className="flex justify-center items-center gap-4 text-gray-700">
            <FileText className="w-12 h-12 text-primary" />
            <FileText className="w-12 h-12 text-primary" />
            <FileText className="w-12 h-12 text-primary" />
            <ArrowRight className="w-8 h-8" />
            <SplitSquareVertical className="w-12 h-12 text-primary" />
            <ArrowRight className="w-8 h-8" />
            <div className="flex gap-2">
              <FileText className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <h1 className="text-3xl font-bold">Merge Different PDF files.</h1>
          <p className="text-gray-500">Fast. Secure. No signup required.</p>
        </div>

        {/* File Upload Zone in styled Card */}
        <Card className="p-8 mb-8 bg-card border border-border shadow-lg">
          <div className="flex flex-col items-center justify-center space-y-6">
            <FileUploadZone
              acceptedTypes={[".pdf"]}
              onFileSelect={handleFileSelect}
              isConverting={isConverting}
              progress={progress}
            />

            {/* Helper instructions placed here */}
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-md w-full">
              <Info className="w-4 h-4 mt-0.5 text-blue-500" />
              <p>Tip: File Upload zone only shows the last file you added</p>
            </div>

            {/* File List with order + controls */}
            {files.length > 0 && (
              <div className="space-y-3 w-full">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg bg-muted/40"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-foreground">
                        {index + 1} → {file.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Position: {index + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => moveFile(index, "up")}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => moveFile(index, "down")}
                        disabled={index === files.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => removeFile(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Merge Button */}
            {files.length > 0 && !mergedFile && (
              <Button
                onClick={handleMerge}
                disabled={isConverting}
                className="btn-hero px-8 py-3 text-lg w-full"
              >
                {isConverting
                  ? `Merging... (${progress}%)`
                  : `Merge ${files.length} PDFs`}
              </Button>
            )}

            {/* Download Button */}
            {mergedFile && (
              <div className="text-center space-y-4 w-full">
                <div className="text-green-500 font-medium">
                  ✓ Merge Complete!
                </div>
                <Button
                  onClick={handleDownload}
                  className="btn-hero px-8 py-3 text-lg w-full"
                >
                  <Download className="w-5 h-5 mr-2" /> Download Merged PDF
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PdfMergerPage;

