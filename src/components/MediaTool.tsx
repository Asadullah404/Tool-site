'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';

interface MediaToolProps {
  title: string;
  description: string;
  format: 'mp3' | 'mp4';
  buttonText: string;
}

export default function MediaTool({ title, description, format, buttonText }: MediaToolProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [coupon, setCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  const handleApplyCoupon = async () => {
    if (!coupon) return;
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await fetch('https://toolsx-backend.vercel.app/api/coupon/apply', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ couponCode: coupon }),
      });
      const data = await response.json();
      if (response.ok) {
        setCouponMsg(data.message);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to apply coupon.');
    }
  };

  const handleDownload = async () => {
    if (!url) {
      setError('Please paste a valid URL.');
      return;
    }

    setLoading(true);
    setError('');
    setCouponMsg('');

    try {
      const idToken = await auth.currentUser?.getIdToken();
      const headers: any = { 'Content-Type': 'application/json' };
      if (idToken) headers['Authorization'] = `Bearer ${idToken}`;

      const response = await fetch('https://toolsx-backend.vercel.app/api/media/download', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ url, format }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process the request.');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `multitool-hub-${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-gray-600 mb-8">{description}</p>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Paste your link here (YouTube, Instagram, Facebook...)"
            className="flex-grow p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleDownload}
            disabled={loading}
            className={`px-8 py-4 bg-red-600 text-white font-bold rounded-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
          >
            {loading ? 'Processing...' : buttonText}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4 text-sm font-semibold">{error}</p>}
        {couponMsg && <p className="text-green-600 mt-4 text-sm font-semibold">{couponMsg}</p>}
        <p className="text-xs text-gray-400 mt-6 italic">
          By using our service you are accepting our Terms of Use and Privacy Policy.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
        <h3 className="font-bold mb-2">Have a coupon?</h3>
        <div className="flex gap-2 max-w-sm mx-auto">
          <input 
            type="text" 
            placeholder="Enter code" 
            className="flex-grow p-2 border border-gray-300 rounded"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button 
            onClick={handleApplyCoupon}
            className="bg-gray-800 text-white px-4 py-2 rounded text-sm font-bold hover:bg-gray-900"
          >
            APPLY
          </button>
        </div>
      </div>
    </div>
  );
}
