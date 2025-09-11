import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FileUploadZone from "@/components/FileUploadZone";
import { useToast } from "@/hooks/use-toast";
import { Download, ArrowUp, ArrowDown, Trash2 } from "lucide-react";

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
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 space-y-6">
          <h1 className="text-3xl font-bold">PDF Merger</h1>

          {/* File Upload */}
          <FileUploadZone
            acceptedTypes={[".pdf"]}
            onFileSelect={handleFileSelect}
            isConverting={isConverting}
            progress={progress}
          />

          {/* File List with order + controls */}
          {files.length > 0 && (
            <div className="space-y-2">
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
            <Button onClick={handleMerge} disabled={isConverting}>
              {isConverting
                ? `Merging... (${progress}%)`
                : `Merge ${files.length} PDFs`}
            </Button>
          )}

          {/* Download Button */}
          {mergedFile && (
            <Button onClick={handleDownload}>
              <Download className="w-5 h-5 mr-2" /> Download Merged PDF
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PdfMergerPage;
