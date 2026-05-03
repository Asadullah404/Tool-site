'use client';

import { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageEditorToolProps {
  toolId: string;
}

export default function ImageEditorTool({ toolId }: ImageEditorToolProps) {
  const [imgSrc, setImgSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [circularCrop, setCircularCrop] = useState(false);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [originalName, setOriginalName] = useState('image');

  // New States
  const [rotation, setRotation] = useState(0);
  const [watermarkText, setWatermarkText] = useState('Watermark');
  const [wmPos, setWmPos] = useState({ x: 50, y: 50 });
  const [isDraggingWm, setIsDraggingWm] = useState(false);
  
  const [topText, setTopText] = useState('TOP TEXT');
  const [bottomText, setBottomText] = useState('BOTTOM TEXT');
  const [topPos, setTopPos] = useState({ x: 50, y: 10 });
  const [bottomPos, setBottomPos] = useState({ x: 50, y: 80 });
  const [isDraggingTop, setIsDraggingTop] = useState(false);
  const [isDraggingBottom, setIsDraggingBottom] = useState(false);

  const [filters, setFilters] = useState({ brightness: 100, contrast: 100, grayscale: 0, sepia: 0 });

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
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

  const handlePointerDown = (e: React.PointerEvent, target: 'wm' | 'top' | 'bottom') => {
    e.preventDefault();
    if (target === 'wm') setIsDraggingWm(true);
    if (target === 'top') setIsDraggingTop(true);
    if (target === 'bottom') setIsDraggingBottom(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate percentage relative to image container for responsive dragging
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

    if (isDraggingWm) setWmPos({ x, y });
    if (isDraggingTop) setTopPos({ x, y });
    if (isDraggingBottom) setBottomPos({ x, y });
  };

  const handlePointerUp = () => {
    setIsDraggingWm(false);
    setIsDraggingTop(false);
    setIsDraggingBottom(false);
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

      ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    } else {
      // General rendering for Resize, Rotate, Watermark, Meme, Photo Editor
      let cWidth = parseInt(width) || image.naturalWidth;
      let cHeight = parseInt(height) || image.naturalHeight;
      
      // Swap width and height if rotated 90 or 270 degrees
      if (toolId === 'rotate-image' && (rotation % 180 !== 0)) {
        canvas.width = cHeight;
        canvas.height = cWidth;
      } else {
        canvas.width = cWidth;
        canvas.height = cHeight;
      }

      ctx.imageSmoothingQuality = 'high';

      if (toolId === 'photo-editor') {
        ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%)`;
      }

      if (toolId === 'rotate-image' && rotation !== 0) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(image, -cWidth / 2, -cHeight / 2, cWidth, cHeight);
        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
      } else {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      }

      ctx.filter = 'none';

      // Draw Watermark
      if (toolId === 'watermark-image' && watermarkText) {
        ctx.font = 'bold 48px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const px = (wmPos.x / 100) * canvas.width;
        const py = (wmPos.y / 100) * canvas.height;
        ctx.fillText(watermarkText, px, py);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeText(watermarkText, px, py);
      }

      // Draw Meme Text
      if (toolId === 'meme-generator') {
        ctx.font = '900 64px Impact, sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        
        if (topText) {
          const px = (topPos.x / 100) * canvas.width;
          const py = (topPos.y / 100) * canvas.height;
          ctx.fillText(topText, px, py);
          ctx.strokeText(topText, px, py);
        }
        if (bottomText) {
          const px = (bottomPos.x / 100) * canvas.width;
          const py = (bottomPos.y / 100) * canvas.height;
          ctx.fillText(bottomText, px, py);
          ctx.strokeText(bottomText, px, py);
        }
      }
    }

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

  const getTitle = () => {
    switch (toolId) {
      case 'crop-image': return 'Crop Image';
      case 'resize-image': return 'Resize Image';
      case 'rotate-image': return 'Rotate Image';
      case 'watermark-image': return 'Watermark Image';
      case 'photo-editor': return 'Photo Editor';
      case 'meme-generator': return 'Meme Generator';
      default: return 'Image Tool';
    }
  };

  return (
    <div 
      className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4 select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <h1 className="text-4xl font-black text-gray-900 mb-8 uppercase">{getTitle()}</h1>
      
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-4xl flex flex-col items-center">
        {!imgSrc ? (
          <div className="w-full flex flex-col items-center justify-center border-4 border-dashed border-gray-200 rounded-2xl py-20">
            <input type="file" accept="image/*" onChange={onSelectFile} className="hidden" id="image-upload" />
            <label htmlFor="image-upload" className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg">
              Choose an Image
            </label>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-8">
            {/* TOOL SPECIFIC CONTROLS (TOP) */}
            {toolId === 'crop-image' && (
              <div className="flex flex-wrap gap-3 justify-center w-full">
                <button onClick={() => { setAspect(undefined); setCircularCrop(false); }} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${!aspect && !circularCrop ? 'bg-gray-900 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>Free Form</button>
                <button onClick={() => { setAspect(1); setCircularCrop(false); }} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${aspect === 1 && !circularCrop ? 'bg-gray-900 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>1:1 Square</button>
                <button onClick={() => { setAspect(16 / 9); setCircularCrop(false); }} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${aspect === 16 / 9 ? 'bg-gray-900 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>16:9 Landscape</button>
                <button onClick={() => { setAspect(4 / 3); setCircularCrop(false); }} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${aspect === 4 / 3 ? 'bg-gray-900 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>4:3 Monitor</button>
                <button onClick={() => { setAspect(1); setCircularCrop(true); }} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${circularCrop ? 'bg-gray-900 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>Circular</button>
              </div>
            )}

            {toolId === 'rotate-image' && (
              <div className="flex gap-4">
                <button onClick={() => setRotation((r) => r - 90)} className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold">Rotate Left -90°</button>
                <button onClick={() => setRotation((r) => r + 90)} className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold">Rotate Right +90°</button>
              </div>
            )}

            {toolId === 'watermark-image' && (
              <div className="flex flex-col w-full max-w-sm">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1">Watermark Text (Drag on image to move)</label>
                <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} className="border-2 border-gray-200 rounded-lg p-3 font-bold text-gray-900" />
              </div>
            )}

            {toolId === 'meme-generator' && (
              <div className="flex gap-4 w-full max-w-lg">
                <div className="flex-1 flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1">Top Text (Draggable)</label>
                  <input type="text" value={topText} onChange={(e) => setTopText(e.target.value)} className="border-2 border-gray-200 rounded-lg p-2 font-bold text-gray-900" />
                </div>
                <div className="flex-1 flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1">Bottom Text (Draggable)</label>
                  <input type="text" value={bottomText} onChange={(e) => setBottomText(e.target.value)} className="border-2 border-gray-200 rounded-lg p-2 font-bold text-gray-900" />
                </div>
              </div>
            )}

            {toolId === 'photo-editor' && (
              <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                <div className="flex flex-col text-gray-900"><label className="text-xs font-bold">Brightness</label><input type="range" min="0" max="200" value={filters.brightness} onChange={e => setFilters({...filters, brightness: +e.target.value})} /></div>
                <div className="flex flex-col text-gray-900"><label className="text-xs font-bold">Contrast</label><input type="range" min="0" max="200" value={filters.contrast} onChange={e => setFilters({...filters, contrast: +e.target.value})} /></div>
                <div className="flex flex-col text-gray-900"><label className="text-xs font-bold">Grayscale</label><input type="range" min="0" max="100" value={filters.grayscale} onChange={e => setFilters({...filters, grayscale: +e.target.value})} /></div>
                <div className="flex flex-col text-gray-900"><label className="text-xs font-bold">Sepia</label><input type="range" min="0" max="100" value={filters.sepia} onChange={e => setFilters({...filters, sepia: +e.target.value})} /></div>
              </div>
            )}

            {/* IMAGE PREVIEW AREA */}
            <div className="w-full max-w-full overflow-hidden border border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center p-4 relative">
              {toolId === 'crop-image' ? (
                <div className="flex justify-center items-center w-full h-auto max-h-[60vh] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-200 rounded-xl p-4 shadow-inner overflow-hidden">
                  <ReactCrop crop={crop} aspect={aspect} circularCrop={circularCrop} onChange={(_, percentCrop) => setCrop(percentCrop)} onComplete={(c) => setCompletedCrop(c)} style={{ maxWidth: '100%', maxHeight: '55vh', display: 'flex', justifyContent: 'center' }}>
                    <img ref={imgRef} alt="Crop me" src={imgSrc} onLoad={handleImageLoad} style={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain' }} />
                  </ReactCrop>
                </div>
              ) : (
                <div 
                  ref={containerRef}
                  className="flex justify-center items-center w-auto h-auto max-h-[60vh] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-200 rounded-xl p-0 shadow-inner relative overflow-hidden"
                >
                  <img
                    ref={imgRef}
                    alt="Preview"
                    src={imgSrc}
                    onLoad={handleImageLoad}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '55vh', 
                      objectFit: 'contain',
                      transform: toolId === 'rotate-image' ? `rotate(${rotation}deg)` : 'none',
                      filter: toolId === 'photo-editor' ? `brightness(${filters.brightness}%) contrast(${filters.contrast}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%)` : 'none',
                      transition: 'transform 0.3s ease'
                    }}
                    draggable={false}
                  />

                  {/* Absolute Overlays for Dragging */}
                  {toolId === 'watermark-image' && watermarkText && (
                    <div
                      onPointerDown={(e) => handlePointerDown(e, 'wm')}
                      style={{ left: `${wmPos.x}%`, top: `${wmPos.y}%`, transform: 'translate(-50%, -50%)' }}
                      className={`absolute cursor-move px-4 py-2 ${isDraggingWm ? 'opacity-80' : 'opacity-100'}`}
                    >
                      <span className="text-3xl md:text-5xl font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] pointer-events-none opacity-70">
                        {watermarkText}
                      </span>
                    </div>
                  )}

                  {toolId === 'meme-generator' && topText && (
                    <div
                      onPointerDown={(e) => handlePointerDown(e, 'top')}
                      style={{ left: `${topPos.x}%`, top: `${topPos.y}%`, transform: 'translate(-50%, -50%)' }}
                      className="absolute cursor-move w-full text-center"
                    >
                      <span className="font-black text-4xl md:text-6xl text-white uppercase" style={{ WebkitTextStroke: '2px black', fontFamily: 'Impact, sans-serif' }}>
                        {topText}
                      </span>
                    </div>
                  )}

                  {toolId === 'meme-generator' && bottomText && (
                    <div
                      onPointerDown={(e) => handlePointerDown(e, 'bottom')}
                      style={{ left: `${bottomPos.x}%`, top: `${bottomPos.y}%`, transform: 'translate(-50%, -50%)' }}
                      className="absolute cursor-move w-full text-center"
                    >
                      <span className="font-black text-4xl md:text-6xl text-white uppercase" style={{ WebkitTextStroke: '2px black', fontFamily: 'Impact, sans-serif' }}>
                        {bottomText}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* TOOL SPECIFIC CONTROLS (BOTTOM) */}
            {toolId === 'resize-image' && (
              <div className="flex gap-4 items-center">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase">Width (px)</label>
                  <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="border-2 border-gray-200 rounded-lg p-2 w-24 text-center font-bold text-gray-900" />
                </div>
                <span className="text-gray-400 font-bold mt-4">X</span>
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-500 uppercase">Height (px)</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="border-2 border-gray-200 rounded-lg p-2 w-24 text-center font-bold text-gray-900" />
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50 shadow-lg"
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
