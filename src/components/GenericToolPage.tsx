'use client';

import { useState, useEffect } from 'react';
import { TOOLS } from '@/constants/tools';
import { auth } from '@/lib/firebase';

interface GenericToolPageProps {
  toolId: string;
}

export default function GenericToolPage({ toolId }: GenericToolPageProps) {
  const tool = TOOLS.find((t) => t.id === toolId);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Finance state
  const [financePrincipal, setFinancePrincipal] = useState('300000');
  const [financeRate, setFinanceRate] = useState('5');
  const [financeTime, setFinanceTime] = useState('30');

  if (!tool) {
    return <div className="py-20 text-center font-bold text-gray-400 uppercase tracking-widest">Tool not found</div>;
  }

  // Theme colors mapping
  const themeColors: { [key: string]: string } = {
    PDF: 'bg-red-600 hover:bg-red-700 border-red-100 text-red-600',
    Media: 'bg-blue-600 hover:bg-blue-700 border-blue-100 text-blue-600',
    Image: 'bg-green-600 hover:bg-green-700 border-green-100 text-green-600',
    AI: 'bg-purple-600 hover:bg-purple-700 border-purple-100 text-purple-600',
    Finance: 'bg-yellow-600 hover:bg-yellow-700 border-yellow-100 text-yellow-700',
    Dev: 'bg-indigo-600 hover:bg-indigo-700 border-indigo-100 text-indigo-600',
  };

  const currentTheme = themeColors[tool.category] || 'bg-red-600 hover:bg-red-700 border-red-100 text-red-600';
  const mainColor = currentTheme.split(' ')[0];

  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    console.log(`Starting process for tool: ${tool.id}`);

    try {
      const idToken = await auth.currentUser?.getIdToken();
      const headers: any = {};
      if (idToken) headers['Authorization'] = `Bearer ${idToken}`;

      let body: any;
      
      if (['PDF', 'Image'].includes(tool.category) || tool.id === 'ai-summarizer' || fileBasedMediaTools.includes(tool.id)) {
        if (!file) throw new Error("Please upload a file first.");
        body = new FormData();
        body.append('file', file);
        body.append('toolId', tool.id);
      } else {
        headers['Content-Type'] = 'application/json';
        const jsonBody: any = { toolId: tool.id };
        if (tool.category === 'AI' || tool.category === 'Dev') {
          if (!text) throw new Error("Please enter some text first.");
          jsonBody.input = text;
        }
        if (tool.category === 'Media') {
          if (!url) throw new Error("Please enter a valid URL or URLs.");
          if (tool.id === 'link-dumper') {
            jsonBody.urls = url.split('\n').map(u => u.trim()).filter(Boolean);
            jsonBody.format = 'mp4';
          } else {
            jsonBody.url = url;
          }
        }
        if (tool.category === 'Finance') {
          jsonBody.principal = financePrincipal;
          jsonBody.rate = financeRate;
          jsonBody.time = financeTime;
        }
        body = JSON.stringify(jsonBody);
      }

      console.log("Calling backend endpoint...");
      const getEndpoint = (category: string) => {
        switch (category) {
          case 'AI': return 'https://toolsx-backend.vercel.app/api/ai/process';
          case 'Media': return tool.id === 'link-dumper' ? 'https://toolsx-backend.vercel.app/api/media/bulk-download' : 'https://toolsx-backend.vercel.app/api/media/download';
          case 'PDF': return 'https://toolsx-backend.vercel.app/api/pdf/process';
          case 'Image': return 'https://toolsx-backend.vercel.app/api/image/process';
          case 'Finance': return 'https://toolsx-backend.vercel.app/api/finance/process';
          case 'Dev': return 'https://toolsx-backend.vercel.app/api/dev/process';
          default: return 'https://toolsx-backend.vercel.app/api/process';
        }
      };
      const endpoint = getEndpoint(tool.category);
      
      let response;
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body,
        });
      } catch (fetchErr: any) {
        throw new Error(fetchErr.message || "Could not connect to the processing server. Please ensure the backend is running on port 5000.");
      }

      console.log("Response received:", response.status);

      // Handle file downloads (PDF, Image, Media)
      if (['PDF', 'Image', 'Media'].includes(tool.category)) {
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to process file');
        }
        
        const blob = await response.blob();
        if (blob.size === 0) throw new Error("The processed file is empty.");
        
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = `processed-file`;
        if (contentDisposition && contentDisposition.includes('filename=')) {
          fileName = contentDisposition.split('filename=')[1].replace(/"/g, '');
        } else {
          // Fallback extension based on tool
          const ext = tool.id.includes('mp3') ? 'mp3' : tool.id.includes('mp4') ? 'mp4' : 'file';
          fileName = `${tool.id}-${Date.now()}.${ext}`;
        }
        
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
        setResult("File downloaded successfully!");
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'LOGIN_REQUIRED') {
          window.location.href = '/login?msg=limit_reached';
          return;
        }
        throw new Error(data.error || 'Failed to process');
      }

      setResult(data.result);
    } catch (err: any) {
      console.error("Process Error:", err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const renderUrlInput = () => (
    <div className="py-12">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Paste URL here (YouTube, Facebook, etc.)..."
          className="flex-grow p-5 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none text-lg font-medium"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button 
          onClick={handleProcess}
          disabled={loading || !url}
          className={`px-12 py-5 ${mainColor} text-white font-black rounded-2xl uppercase tracking-widest text-sm shadow-xl hover:shadow-2xl transition-all active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Processing...' : 'Download'}
        </button>
      </div>
      <p className="text-gray-400 text-xs italic text-center">Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ</p>
    </div>
  );

  const renderTextInput = () => (
    <div className="py-8">
      <textarea 
        placeholder="Paste your text or code here..."
        className="w-full h-64 p-6 border-2 border-gray-100 rounded-3xl focus:ring-4 focus:ring-indigo-100 outline-none text-lg font-mono mb-6"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button 
        onClick={handleProcess}
        disabled={loading || !text}
        className={`w-full py-5 ${mainColor} text-white font-black rounded-2xl uppercase tracking-widest text-sm shadow-xl hover:shadow-2xl transition-all active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Processing...' : `Run ${tool.name}`}
      </button>
    </div>
  );

  const renderFinanceInput = () => (
    <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{tool.id === 'crypto-profit' ? 'Investment ($)' : 'Principal Amount ($)'}</label>
          <input type="number" value={financePrincipal} onChange={(e) => setFinancePrincipal(e.target.value)} className="w-full p-4 border-2 border-gray-100 rounded-xl outline-none focus:border-yellow-600 font-bold" />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{tool.id === 'crypto-profit' ? 'Expected Return (%)' : 'Interest Rate (%)'}</label>
          <input type="number" value={financeRate} onChange={(e) => setFinanceRate(e.target.value)} className="w-full p-4 border-2 border-gray-100 rounded-xl outline-none focus:border-yellow-600 font-bold" />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Time Period (Years)</label>
          <input type="number" value={financeTime} onChange={(e) => setFinanceTime(e.target.value)} className="w-full p-4 border-2 border-gray-100 rounded-xl outline-none focus:border-yellow-600 font-bold" />
        </div>
        <button 
          onClick={handleProcess}
          disabled={loading}
          className={`w-full py-5 ${mainColor} text-white font-black rounded-2xl uppercase tracking-widest text-sm shadow-xl hover:shadow-2xl transition-all active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Calculating...' : `Calculate`}
        </button>
      </div>
      <div className="bg-yellow-50 rounded-3xl p-10 flex flex-col justify-center items-center text-center border border-yellow-100">
        <span className="text-xs font-black text-yellow-600 uppercase tracking-widest mb-2">Results</span>
        {result ? (
           <p className="text-2xl font-black text-gray-900">{result}</p>
        ) : (
           <p className="text-gray-400 text-sm mt-4 font-medium">Enter values and click calculate.</p>
        )}
      </div>
    </div>
  );

  const fileBasedMediaTools = ['video-to-mp4', 'video-to-gif', 'mp4-to-mp3', 'audio-to-mp3', 'wav-to-mp3', 'mp3-to-wav'];

  const renderInput = () => {
    if ((['PDF', 'Image'].includes(tool.category) || tool.id === 'ai-summarizer' || fileBasedMediaTools.includes(tool.id)) && tool.id !== 'html-to-image') {
      const isSummarizer = tool.id === 'ai-summarizer';
      let acceptTypes = '*/*';
      if (tool.category === 'Image') acceptTypes = 'image/*';
      if (tool.category === 'PDF' || isSummarizer) acceptTypes = '.pdf';
      if (fileBasedMediaTools.includes(tool.id)) acceptTypes = 'video/*,audio/*';
      
      return (
        <div className="flex flex-col items-center py-10">
          {!file ? (
            <div 
              className="border-4 border-dashed border-gray-100 rounded-3xl py-24 px-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50/50 transition-all duration-300 group w-full"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
              }}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = acceptTypes;
                input.onchange = (e: any) => setFile(e.target.files[0]);
                input.click();
              }}
            >
              <div className={`w-24 h-24 ${mainColor} rounded-full flex items-center justify-center text-white text-4xl font-bold mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                +
              </div>
              <p className="text-3xl font-black text-gray-900 mb-2 tracking-tight uppercase">Select {isSummarizer ? 'PDF' : fileBasedMediaTools.includes(tool.id) ? 'Media' : tool.category} file</p>
              <p className="text-gray-400 font-medium">or drop file here</p>
            </div>
          ) : (
            <>
              <div className={`bg-gray-50 p-8 rounded-3xl mb-8 w-full max-w-md border-2 ${currentTheme.split(' ')[2]} flex items-center gap-6`}>
                <div className={`w-16 h-16 ${mainColor} rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-inner`}>
                  {file.name.split('.').pop()?.toUpperCase()}
                </div>
                <div className="text-left overflow-hidden">
                  <p className="font-black text-gray-900 truncate uppercase tracking-tight text-lg">{file.name}</p>
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <div className="flex gap-4 w-full max-w-md">
                <button onClick={() => setFile(null)} className="flex-grow py-5 bg-gray-100 text-gray-600 font-black rounded-2xl hover:bg-gray-200 transition-colors uppercase tracking-wider text-xs">Cancel</button>
                <button onClick={handleProcess} disabled={loading} className={`flex-[2] py-5 ${mainColor} text-white font-black rounded-2xl transition-all shadow-xl hover:shadow-2xl active:scale-95 uppercase tracking-widest text-xs ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {loading ? 'Working...' : isSummarizer ? 'Export PDF' : `Process File`}
                </button>
              </div>
            </>
          )}
        </div>
      );
    }

    if (tool.category === 'Media' || tool.id === 'html-to-image') return renderUrlInput();
    switch (tool.category) {
      case 'AI':
      case 'Dev': return renderTextInput();
      case 'Finance': return renderFinanceInput();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-gray-50 border-b border-gray-100 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className={`w-4 h-4 rounded-full ${mainColor} animate-pulse`}></span>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">{tool.category}</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 uppercase tracking-tighter leading-none">{tool.name}</h1>
          <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-3xl mx-auto font-medium">{tool.description}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16">
        <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-gray-100 p-12 text-center overflow-hidden relative">
          <div className={`absolute top-0 left-0 w-full h-3 ${mainColor}`}></div>
          {renderInput()}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Results Section for Non-Finance (Finance has its own built-in) */}
        {result && tool.category !== 'Finance' && tool.category !== 'PDF' && tool.category !== 'Image' && tool.category !== 'Media' && (
          <div className="mt-12 bg-white rounded-[2rem] shadow-xl border border-gray-100 p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-gray-900 uppercase tracking-tighter text-xl">Success! Here is your result:</h3>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  alert('Copied to clipboard!');
                }}
                className={`px-4 py-2 ${mainColor} text-white font-bold rounded-lg text-xs uppercase tracking-widest`}
              >
                Copy Text
              </button>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-left overflow-auto max-h-[500px]">
              <pre className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                {result}
              </pre>
            </div>
          </div>
        )}

        {/* Feature Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-20">
          <div className="group">
            <div className={`w-16 h-16 rounded-3xl ${mainColor} flex items-center justify-center text-white mb-8 shadow-lg group-hover:rotate-12 transition-transform`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <h3 className="font-black text-gray-900 mb-4 uppercase tracking-tighter text-2xl">End-to-End Encryption</h3>
            <p className="text-gray-400 leading-relaxed font-semibold">Your files are encrypted at every step. We use the same security standards as banks to protect your data.</p>
          </div>
          <div className="group">
            <div className={`w-16 h-16 rounded-3xl ${mainColor} flex items-center justify-center text-white mb-8 shadow-lg group-hover:rotate-12 transition-transform`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h3 className="font-black text-gray-900 mb-4 uppercase tracking-tighter text-2xl">Hyper-Fast Engine</h3>
            <p className="text-gray-400 leading-relaxed font-semibold">Powered by our custom processing engine to give you results in seconds, not minutes.</p>
          </div>
          <div className="group">
            <div className={`w-16 h-16 rounded-3xl ${mainColor} flex items-center justify-center text-white mb-8 shadow-lg group-hover:rotate-12 transition-transform`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
            </div>
            <h3 className="font-black text-gray-900 mb-4 uppercase tracking-tighter text-2xl">Global Platform</h3>
            <p className="text-gray-400 leading-relaxed font-semibold">100% cloud-based. No software to install. Access your professional tools from any device, anywhere.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
