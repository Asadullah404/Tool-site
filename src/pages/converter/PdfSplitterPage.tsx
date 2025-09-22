import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FileUploadZone from "@/components/FileUploadZone";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, SplitSquareVertical, ArrowRight } from "lucide-react";

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
        // ✅ Fixed Blob issue using Uint8Array.from
        const blob = new Blob([Uint8Array.from(pdfBytes)], { type: "application/pdf" });
        urls.push(URL.createObjectURL(blob));

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
      // ✅ Fixed Blob issue
      const blob = new Blob([Uint8Array.from(mergedBytes)], { type: "application/pdf" });
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
    <div className="min-h-screen py-12 px-4 flex justify-center items-center">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center space-y-4 mb-10">
          <div className="flex justify-center items-center gap-4 text-gray-700">
            <FileText className="w-12 h-12 text-primary" />
            <ArrowRight className="w-8 h-8" />
            <SplitSquareVertical className="w-12 h-12 text-primary" />
            <ArrowRight className="w-8 h-8" />
            <div className="flex gap-2">
              <FileText className="w-10 h-10 text-green-500" />
              <FileText className="w-10 h-10 text-green-500" />
              <FileText className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <h1 className="text-3xl font-bold">Split PDF into Multiple Files</h1>
          <p className="text-gray-500">Fast. Secure. No signup required.</p>
        </div>

        {/* Main Card */}
        <Card className="p-8 mb-8 bg-card border border-border shadow-lg">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Upload */}
            <FileUploadZone
              acceptedTypes={[".pdf"]}
              onFileSelect={handleFileSelect}
              isConverting={isConverting}
              progress={progress}
            />

            {/* Split Button */}
            {file && !splitFiles.length && (
              <Button
                onClick={handleSplit}
                disabled={isConverting}
                className="btn-hero px-8 py-3 text-lg"
              >
                {isConverting ? "Splitting..." : "Split PDF"}
              </Button>
            )}

            {/* Success + Downloads */}
            {splitFiles.length > 0 && (
              <div className="w-full text-center space-y-6">
                <div className="text-green-500 font-medium">✓ Split Complete!</div>

                {/* Thumbnails */}
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

                {/* Download Selected */}
                {selectedPages.length > 0 && (
                  <Button
                    onClick={handleDownloadSelected}
                    className="btn-hero px-8 py-3 text-lg mt-4"
                  >
                    <Download className="w-5 h-5 mr-2" /> Download Selected Pages
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PdfSplitterPage;
