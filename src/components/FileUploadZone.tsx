import React, { useCallback, useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FileUploadZoneProps {
  acceptedTypes: string[];
  onFileSelect: (file: File) => void;
  isConverting: boolean;
  progress?: number;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  acceptedTypes,
  onFileSelect,
  isConverting,
  progress = 0
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setSelectedFile(file);
        onFileSelect(file);
        e.target.value = ''; // reset so same file can be reselected
      }
    },
    [onFileSelect]
  );

  const clearFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (fileInputRef.current && !isConverting) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div
        className={`upload-zone relative p-12 rounded-xl text-center transition-all duration-300 border-2 border-dashed cursor-pointer ${
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        } ${isConverting ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick} // trigger input manually
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          disabled={isConverting}
          className="hidden"
        />

        {!selectedFile ? (
          <>
            <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Drop your file here
            </h3>
            <p className="text-muted-foreground mb-4">or click to browse</p>
            <p className="text-sm text-muted-foreground">
              Supports: {acceptedTypes.join(', ')}
            </p>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <File className="w-8 h-8 text-primary" />
              <div className="text-left">
                <p className="font-medium text-foreground">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {!isConverting && (
                <Button
                  onClick={clearFile}
                  variant="ghost"
                  size="icon"
                  className="ml-auto hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {isConverting && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  Converting... {progress}%
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadZone;
