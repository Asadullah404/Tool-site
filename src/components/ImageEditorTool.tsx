'use client';

import { useState, useRef } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageEditorToolProps {
  toolId: string;
}

export default function ImageEditorTool({ toolId }: ImageEditorToolProps) {
  const [imgSrc, setImgSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [circularCrop, setCircularCrop] = useState(false);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [originalName, setOriginalName] = useState('image');

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const file = e.target.files[0];
      setOriginalName(file.name.split('.')[0]);
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setWidth(naturalWidth.toString());
    setHeight(naturalHeight.toString());
  };

  const handleDownload = async () => {
    if (!imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (toolId === 'crop-image' && completedCrop?.width && completedCrop?.height) {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const pixelRatio = window.devicePixelRatio;

      canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
      canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = 'high';

      const cropX = completedCrop.x * scaleX;
      const cropY = completedCrop.y * scaleY;
      const cropWidth = completedCrop.width * scaleX;
      const cropHeight = completedCrop.height * scaleY;

      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight,
      );
    } else if (toolId === 'resize-image') {
      const newWidth = parseInt(width) || image.naturalWidth;
      const newHeight = parseInt(height) || image.naturalHeight;
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx.drawImage(image, 0, 0, newWidth, newHeight);
    } else {
      return;
    }

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const previewUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.download = `processed-${originalName}.png`;
      anchor.href = previewUrl;
      anchor.click();
      window.URL.revokeObjectURL(previewUrl);
    }, 'image/png');
  };

  const title = toolId === 'crop-image' ? 'Crop Image' : 'Resize Image';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4">
      <h1 className="text-4xl font-black text-gray-900 mb-8 uppercase">{title}</h1>
      
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-4xl flex flex-col items-center">
        {!imgSrc ? (
          <div className="w-full flex flex-col items-center justify-center border-4 border-dashed border-gray-200 rounded-2xl py-20">
            <input type="file" accept="image/*" onChange={onSelectFile} className="hidden" id="image-upload" />
            <label htmlFor="image-upload" className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors">
              Choose an Image
            </label>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-8">
            <div className="w-full max-w-full overflow-hidden border border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center p-4">
              {toolId === 'crop-image' ? (
                <div className="flex flex-col w-full items-center">
                  <div className="flex flex-wrap gap-3 justify-center mb-6 w-full">
                    <button onClick={() => { setAspect(undefined); setCircularCrop(false); }} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${!aspect && !circularCrop ? 'bg-gray-900 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'}`}>Free Form</button>
                    <button onClick={() => { setAspect(1); setCircularCrop(false); }} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${aspect === 1 && !circularCrop ? 'bg-gray-900 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'}`}>1:1 Square</button>
                    <button onClick={() => { setAspect(16 / 9); setCircularCrop(false); }} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${aspect === 16 / 9 ? 'bg-gray-900 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'}`}>16:9 Landscape</button>
                    <button onClick={() => { setAspect(4 / 3); setCircularCrop(false); }} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${aspect === 4 / 3 ? 'bg-gray-900 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'}`}>4:3 Monitor</button>
                    <button onClick={() => { setAspect(1); setCircularCrop(true); }} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${circularCrop ? 'bg-gray-900 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'}`}>Circular</button>
                  </div>
                  <div className="flex justify-center items-center w-full h-auto max-h-[60vh] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-200 rounded-xl p-4 shadow-inner overflow-hidden">
                    <ReactCrop
                      crop={crop}
                      aspect={aspect}
                      circularCrop={circularCrop}
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      onComplete={(c) => setCompletedCrop(c)}
                      style={{ maxWidth: '100%', maxHeight: '55vh', display: 'flex', justifyContent: 'center' }}
                    >
                      <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imgSrc}
                        onLoad={handleImageLoad}
                        style={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain' }}
                      />
                    </ReactCrop>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center w-full h-auto max-h-[60vh] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-200 rounded-xl p-4 shadow-inner overflow-hidden">
                  <img
                    ref={imgRef}
                    alt="Resize me"
                    src={imgSrc}
                    onLoad={handleImageLoad}
                    style={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain' }}
                  />
                </div>
              )}
            </div>

            {toolId === 'resize-image' && (
              <div className="flex gap-4 items-center">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase">Width (px)</label>
                  <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="border-2 border-gray-200 rounded-lg p-2 w-24 text-center font-bold" />
                </div>
                <span className="text-gray-400 font-bold mt-4">X</span>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase">Height (px)</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="border-2 border-gray-200 rounded-lg p-2 w-24 text-center font-bold" />
                </div>
              </div>
            )}

            <div className="flex gap-4 w-full justify-center">
              <button onClick={() => setImgSrc('')} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-xl transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleDownload} 
                disabled={toolId === 'crop-image' && (!completedCrop?.width || !completedCrop?.height)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50"
              >
                Download Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
