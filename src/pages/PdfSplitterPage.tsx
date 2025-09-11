import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FileUploadZone from "@/components/FileUploadZone";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";

const PdfSplitterPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [splitFiles, setSplitFiles] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const { toast } = useToast();

  const handleFileSelect = (f: File) => {
    setFile(f);
    setSplitFiles([]);
    setProgress(0);
    setSelectedPages([]);
  };

  const handleSplit = async () => {
    if (!file) return;
    try {
      setIsConverting(true);
      setProgress(0);

      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      const urls: string[] = [];
      for (let i = 0; i < pdf.getPageCount(); i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdf, [i]);
        newPdf.addPage(copiedPage);

        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        urls.push(URL.createObjectURL(blob));

        // update progress
        setProgress(Math.round(((i + 1) / pdf.getPageCount()) * 100));
      }

      setSplitFiles(urls);
      toast({ title: "PDF Split", description: "Pages split successfully!" });
    } catch (err) {
      toast({
        title: "Split Failed",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = (url: string, index: number) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `page_${index + 1}.pdf`;
    link.click();
  };

  const togglePageSelect = (index: number) => {
    setSelectedPages((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleDownloadSelected = async () => {
    if (!file || selectedPages.length === 0) return;

    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      const newPdf = await PDFDocument.create();
      for (const i of selectedPages.sort((a, b) => a - b)) {
        const [page] = await newPdf.copyPages(pdf, [i]);
        newPdf.addPage(page);
      }

      const mergedBytes = await newPdf.save();
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "selected_pages.pdf";
      link.click();

      toast({ title: "Download Ready", description: "Selected pages saved!" });
    } catch (err) {
      toast({
        title: "Failed",
        description: "Could not create custom PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="p-8 space-y-6">
          <h1 className="text-3xl font-bold">PDF Splitter</h1>

          {/* File Upload */}
          <FileUploadZone
            acceptedTypes={[".pdf"]}
            onFileSelect={handleFileSelect}
            isConverting={isConverting}
            progress={progress}
          />

          {/* Split Button */}
          {file && !splitFiles.length && (
            <Button onClick={handleSplit} disabled={isConverting}>
              {isConverting ? "Splitting..." : "Split PDF"}
            </Button>
          )}

          {/* Thumbnails Grid */}
          {splitFiles.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {splitFiles.map((url, i) => (
                  <div
                    key={i}
                    className={`border rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white flex flex-col relative ${
                      selectedPages.includes(i) ? "ring-4 ring-primary" : ""
                    }`}
                  >
                    <div className="h-48 w-full bg-gray-100">
                      <embed
                        src={url + "#toolbar=0&navpanes=0&scrollbar=0"}
                        type="application/pdf"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedPages.includes(i)}
                          onChange={() => togglePageSelect(i)}
                        />
                        <span className="font-medium text-sm">Page {i + 1}</span>
                      </label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(url, i)}
                      >
                        <Download className="w-4 h-4 mr-1" /> Save
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Download selected pages together */}
              {selectedPages.length > 0 && (
                <div className="mt-6 text-center">
                  <Button onClick={handleDownloadSelected} className="w-full md:w-auto">
                    <Download className="w-5 h-5 mr-2" /> Download Selected Pages
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PdfSplitterPage;
