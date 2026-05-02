'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-gray-50 border-b border-gray-100 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 uppercase tracking-tighter leading-none">About ToolsX</h1>
          <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-3xl mx-auto font-medium">The all-in-one professional tool suite designed for efficiency and precision.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-16 space-y-12">
        <section className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-3 bg-indigo-600"></div>
          <h2 className="text-3xl font-black text-gray-900 mb-6 uppercase tracking-tight">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-8">
            ToolsX was born out of a simple need: to provide high-quality, professional-grade digital tools that are 100% free and accessible to everyone. From advanced PDF manipulation to high-precision scientific calculations, we've built a platform that simplifies complex tasks without compromising on power.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-100">
              <h3 className="font-black text-indigo-900 uppercase tracking-widest text-xs mb-2">Privacy First</h3>
              <p className="text-indigo-700 text-sm">Your data is processed securely and never stored on our servers longer than necessary.</p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-100">
              <h3 className="font-black text-indigo-900 uppercase tracking-widest text-xs mb-2">High Performance</h3>
              <p className="text-indigo-700 text-sm">Built using cutting-edge technology for lightning-fast conversions and calculations.</p>
            </div>
          </div>
        </section>

        <section className="bg-gray-900 rounded-3xl shadow-2xl p-12 text-white">
          <h2 className="text-3xl font-black mb-6 uppercase tracking-tight">Connect with the Creator</h2>
          <p className="text-gray-400 leading-relaxed text-lg mb-10">
            Have questions, feedback, or custom tool requests? I'd love to hear from you.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">LinkedIn</p>
                <a 
                  href="https://www.linkedin.com/in/muhammad-asadullah-93a0b22a3/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xl font-bold hover:text-indigo-400 transition-colors"
                >
                  Muhammad Asadullah
                </a>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] mb-1">Email</p>
                <a 
                  href="mailto:m.asadullah.10.0.0.01@gmail.com" 
                  className="text-xl font-bold hover:text-rose-400 transition-colors"
                >
                  m.asadullah.10.0.0.01@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center pt-10">
          <Link href="/" className="px-10 py-5 bg-white border-4 border-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-50 transition-all uppercase tracking-widest text-xs shadow-xl inline-block">
            Back to Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
