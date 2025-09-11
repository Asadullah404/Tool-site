import React, { useCallback, useState } from 'react';
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

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-full max-w-2xl">
      <div
        className={`upload-zone relative p-12 rounded-xl text-center transition-all duration-300 ${
          dragActive ? 'dragover' : ''
        } ${isConverting ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          disabled={isConverting}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {!selectedFile ? (
          <>
            <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Drop your file here
            </h3>
            <p className="text-muted-foreground mb-4">
              or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports: {acceptedTypes.join(', ')}
            </p>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <File className="w-8 h-8 text-primary" />
              <div className="text-left">
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {!isConverting && (
                <Button
                  onClick={clearFile}
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
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