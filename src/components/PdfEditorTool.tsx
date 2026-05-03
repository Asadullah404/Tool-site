'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { TOOLS } from '@/constants/tools';
import { auth } from '@/lib/firebase';
import { Document, Page, pdfjs } from 'react-pdf';

// Initialize PDF.js worker with a stable CDN version
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfEditorToolProps {
  toolId: string;
}

export default function PdfEditorTool({ toolId }: PdfEditorToolProps) {
  const tool = TOOLS.find((t) => t.id === toolId);
  const [files, setFiles] = useState<File[]>([]);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- TOOL SPECIFIC STATES ---
  const [numPages, setNumPages] = useState<number | null>(null);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [watermarkText, setWatermarkText] = useState('ToolsX.site');
  const [rotations, setRotations] = useState<Record<number, number>>({});
  const [signature, setSignature] = useState<string | null>(null);
  const [watermarkImage, setWatermarkImage] = useState<string | null>(null);
  
  // Placement: { x: %, y: %, page: 1-indexed }
  const [placement, setPlacement] = useState({ x: 50, y: 50, page: 1 });
  const [isPlacing, setIsPlacing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  if (!tool) {
    return <div className="py-20 text-center font-bold text-gray-400 uppercase tracking-widest">Tool not found</div>;
  }

  const isPageGrid = ['split-pdf', 'rotate-pdf', 'sign-pdf', 'watermark-pdf'].includes(toolId);
  const isUrlTool = toolId === 'html-to-pdf';
  const isSignTool = toolId === 'sign-pdf';
  const isWatermarkTool = toolId === 'watermark-pdf';

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      setError(null);
    }
  };

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setWatermarkImage(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    if (files.length <= 1) setNumPages(null);
  };

  const togglePage = (pageNumber: number) => {
    setSelectedPages(prev => 
      prev.includes(pageNumber) ? prev.filter(p => p !== pageNumber) : [...prev, pageNumber]
    );
  };

  const rotatePage = (pageNumber: number, delta: number) => {
    setRotations(prev => ({
      ...prev,
      [pageNumber]: ((prev[pageNumber] || 0) + delta + 360) % 360
    }));
  };

  // --- SIGNATURE PAD LOGIC ---
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setSignature(null);
    }
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL('image/png'));
    }
  };

  const handleProcess = async () => {
    if (files.length === 0 && !isUrlTool) return;
    setLoading(true);
    setError(null);

    try {
      const idToken = await auth.currentUser?.getIdToken();
      const headers: any = {};
      if (idToken) headers['Authorization'] = `Bearer ${idToken}`;

      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      formData.append('toolId', tool.id);

      if (isUrlTool) formData.append('url', url);
      if (isWatermarkTool) {
        formData.append('watermarkText', watermarkText);
        if (watermarkImage) formData.append('watermarkImage', watermarkImage);
      }
      if (toolId === 'split-pdf') formData.append('pagesToKeep', JSON.stringify(selectedPages));
      if (toolId === 'rotate-pdf') formData.append('rotations', JSON.stringify(rotations));
      if (isSignTool && signature) formData.append('signatureImage', signature);

      if (isSignTool || isWatermarkTool) {
        formData.append('placement', JSON.stringify(placement));
      }

      const response = await fetch('https://toolsx-backend.vercel.app/api/pdf/process', {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Processing failed' }));
        throw new Error(data.error || 'Server error');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      const cd = response.headers.get('Content-Disposition');
      a.download = cd?.split('filename=')[1]?.replace(/"/g, '') || 'processed.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlacementMove = (e: React.MouseEvent, pageNum: number) => {
    if (!isPlacing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPlacement({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)), page: pageNum });
  };

  const renderHelperUI = () => {
    if (isWatermarkTool) {
      return (
        <div className="w-full max-w-4xl bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-8 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Watermark Text</label>
            <input 
              type="text" 
              value={watermarkText} 
              onChange={(e) => setWatermarkText(e.target.value)}
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-red-100 outline-none font-bold mb-4 text-sm"
            />
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 text-left">OR Upload Logo (PNG/JPG)</label>
            <input type="file" accept="image/*" onChange={onLogoChange} className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-red-50 file:text-red-700 hover:file:bg-red-100 text-gray-900" />
            {watermarkImage && <p className="mt-2 text-green-500 font-bold text-[10px]">✓ Logo uploaded!</p>}
          </div>
          <div className="flex-1 bg-red-50 p-6 rounded-2xl border-2 border-red-100 flex flex-col items-center justify-center text-center">
             <h4 className="font-black text-red-600 uppercase tracking-widest text-xs mb-3">Placement Guide</h4>
             <p className="text-gray-600 text-[10px] font-medium mb-4">Click "Set Position", then drag the red box on the PDF preview.</p>
             <button 
               onClick={() => setIsPlacing(!isPlacing)}
               className={`px-6 py-2 rounded-lg font-black uppercase tracking-widest text-[10px] transition-all ${isPlacing ? 'bg-red-600 text-white shadow-md' : 'bg-white text-red-600 border-2 border-red-200 hover:bg-red-50'}`}
             >
               {isPlacing ? 'Done' : 'Set Position'}
             </button>
          </div>
        </div>
      );
    }
    if (isSignTool) {
      return (
        <div className="w-full max-w-4xl bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-8 flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col items-center">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 w-full text-left">Draw signature</label>
            <canvas 
              ref={canvasRef}
              width={300}
              height={150}
              className="border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 cursor-crosshair mb-4 shadow-inner"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={() => setIsDrawing(false)}
              onMouseLeave={() => setIsDrawing(false)}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={() => setIsDrawing(false)}
            />
            <div className="flex gap-3">
              <button onClick={clearSignature} className="px-4 py-2 bg-gray-100 text-gray-600 font-black rounded-lg uppercase text-[10px] tracking-widest">Clear</button>
              <button onClick={saveSignature} className="px-4 py-2 bg-red-600 text-white font-black rounded-lg uppercase text-[10px] tracking-widest shadow-md">Save</button>
            </div>
            {signature && <p className="mt-2 text-green-500 font-bold text-[10px]">✓ Signature saved!</p>}
          </div>
          <div className="flex-1 bg-red-50 p-6 rounded-2xl border-2 border-red-100 flex flex-col items-center justify-center text-center">
             <h4 className="font-black text-red-600 uppercase tracking-widest text-xs mb-3">Placement Guide</h4>
             <p className="text-gray-600 text-[10px] font-medium mb-4">After saving, click "Set Position" and drag the box on the PDF preview.</p>
             <button 
               onClick={() => setIsPlacing(!isPlacing)}
               className={`px-6 py-2 rounded-lg font-black uppercase tracking-widest text-[10px] transition-all ${isPlacing ? 'bg-red-600 text-white shadow-md' : 'bg-white text-red-600 border-2 border-red-200 hover:bg-red-50'}`}
             >
               {isPlacing ? 'Done' : 'Set Position'}
             </button>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderPageGrid = () => (
    <div className="w-full flex flex-col items-center bg-gray-50 rounded-3xl p-10 border-2 border-gray-100 mb-8 max-w-5xl shadow-inner">
      <h3 className="text-xl font-black text-gray-800 mb-8 uppercase tracking-widest">
        {isPlacing ? 'Drag Box to Set Position' : toolId === 'rotate-pdf' ? 'Rotate Pages' : toolId === 'split-pdf' ? 'Select Pages' : 'PDF Preview'}
      </h3>
      <Document
        file={files[0]}
        loading={<div className="text-red-500 font-black animate-pulse py-10">LOADING PDF...</div>}
        error={<div className="text-red-600 font-bold">FAILED TO LOAD PDF.</div>}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
          if (selectedPages.length === 0) setSelectedPages(Array.from({ length: numPages }, (_, i) => i + 1));
        }}
        className="w-full"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
          {Array.from(new Array(numPages || 0), (_, index) => {
            const pageNum = index + 1;
            const rotation = rotations[pageNum] || 0;
            const isSelected = selectedPages.includes(pageNum);
            const isPlacementPage = placement.page === pageNum && isPlacing;

            return (
              <div key={`page_${pageNum}`} className="flex flex-col items-center gap-4">
                <div 
                  onClick={() => toolId === 'split-pdf' && togglePage(pageNum)}
                  onMouseDown={(e) => isPlacing && handlePlacementMove(e, pageNum)}
                  onMouseMove={(e) => isPlacing && e.buttons === 1 && handlePlacementMove(e, pageNum)}
                  className={`relative cursor-pointer transition-all duration-300 rounded-xl overflow-hidden shadow-md border-4 ${
                    (toolId === 'split-pdf' && isSelected) || isPlacementPage ? 'border-red-600 scale-105' : 'border-transparent hover:border-red-100'
                  }`}
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  <Page pageNumber={pageNum} width={140} renderTextLayer={false} renderAnnotationLayer={false} />
                  
                  {isPlacementPage && (
                    <div 
                      className="absolute w-16 h-10 bg-red-600/40 border-2 border-red-600 flex items-center justify-center pointer-events-none rounded shadow-lg"
                      style={{ 
                        left: `${placement.x}%`, 
                        top: `${placement.y}%`, 
                        transform: 'translate(-50%, -50%)',
                        zIndex: 50
                      }}
                    >
                      <span className="text-[6px] text-white font-black uppercase tracking-widest text-center px-1">
                        {isSignTool ? 'SIGN' : 'LOGO'}
                      </span>
                    </div>
                  )}

                  <div className={`absolute top-2 left-2 w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-white shadow-lg ${isSelected ? 'bg-red-600' : 'bg-gray-400'}`}>
                    {pageNum}
                  </div>
                </div>
                {toolId === 'rotate-pdf' && (
                  <div className="flex gap-2">
                    <button onClick={() => rotatePage(pageNum, -90)} className="bg-white p-2 rounded-lg shadow hover:bg-red-50 text-red-600 font-bold transition-all text-xs">⟲</button>
                    <button onClick={() => rotatePage(pageNum, 90)} className="bg-white p-2 rounded-lg shadow hover:bg-red-50 text-red-600 font-bold transition-all text-xs">⟳</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Document>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-gray-50 border-b border-gray-100 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-4 h-4 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">{tool.category}</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 uppercase tracking-tighter leading-none">{tool.name}</h1>
          <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-3xl mx-auto font-medium">{tool.description}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 flex flex-col items-center">
        {files.length === 0 && !isUrlTool ? (
          <div 
            className="bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-gray-100 p-12 w-full relative min-h-[450px] flex items-center justify-center group cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const dropped = Array.from(e.dataTransfer.files);
              if (dropped.length > 0) setFiles(prev => [...prev, ...dropped]);
            }}
          >
            <div className="absolute top-0 left-0 w-full h-3 bg-red-600"></div>
            <label className="cursor-pointer flex flex-col items-center">
              <input type="file" multiple accept="*" onChange={onFileChange} className="hidden" />
              <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center text-white text-5xl font-black shadow-lg group-hover:scale-110 transition-transform mb-8">
                +
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase group-hover:text-red-600 transition-colors">Select Documents</h2>
              <p className="text-gray-400 font-black tracking-widest uppercase text-xs">Or drag and drop here</p>
            </label>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {isUrlTool ? (
               <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 p-12 w-full text-center relative">
                 <div className="absolute top-0 left-0 w-full h-3 bg-red-600"></div>
                 <input 
                   type="text" 
                   placeholder="Enter website URL..."
                   className="w-full p-5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-red-50 outline-none text-lg font-medium mb-6 shadow-sm text-gray-900"
                   value={url}
                   onChange={(e) => setUrl(e.target.value)}
                 />
               </div>
            ) : isPageGrid ? renderPageGrid() : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10 w-full">
                {files.map((f, i) => (
                  <div key={i} className="bg-red-50 p-6 rounded-3xl relative group border-2 border-red-100 flex flex-col items-center shadow-sm">
                    <button onClick={() => removeFile(i)} className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full font-black text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-all">×</button>
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-inner">
                      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
                    </div>
                    <p className="font-bold text-gray-800 text-[10px] truncate w-full text-center uppercase tracking-tighter">{f.name}</p>
                  </div>
                ))}
                <label className="border-4 border-dashed border-red-100 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-red-50 transition-colors h-32">
                   <input type="file" multiple accept="*" onChange={onFileChange} className="hidden" />
                   <span className="text-2xl text-red-300 font-bold">+</span>
                   <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Add more</span>
                </label>
              </div>
            )}

            {renderHelperUI()}
            
            {error && <div className="mb-8 p-5 bg-red-50 text-red-600 font-bold rounded-2xl border-2 border-red-100 text-sm shadow-md">⚠️ {error}</div>}
            
            <div className="flex gap-4">
              <button onClick={() => { setFiles([]); setRotations({}); setSignature(null); setWatermarkImage(null); setPlacement({ x: 50, y: 50, page: 1 }); setIsPlacing(false); }} className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-50 transition-all uppercase tracking-widest text-xs shadow-sm">Reset</button>
              <button 
                onClick={handleProcess} 
                disabled={loading} 
                className={`px-12 py-4 bg-red-600 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 uppercase tracking-widest text-xs flex items-center gap-4 ${loading ? 'opacity-50' : ''}`}
              >
                {loading ? 'Working...' : `Process ${tool.name}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
