'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { TOOLS, Tool } from '@/constants/tools';
import { useSearchParams } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

function HomeContent() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<string>('all');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setFilter(category);
    } else {
      setFilter('all');
    }
  }, [searchParams]);

  const filteredTools = filter === 'all' 
    ? TOOLS 
    : TOOLS.filter(tool => tool.category.toLowerCase() === filter.toLowerCase());

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="bg-gray-50 py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {user ? `Welcome back, ${user.email?.split('@')[0]}!` : 'Every tool you need for PDF, Image & Calculations'}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          ToolsX provides professional-grade tools for free. Merge, split, compress, convert PDF. Access our advanced Casio-style scientific calculator and download media with ease.
        </p>
      </section>

      {/* Tool Grid */}
      <section className="max-w-7xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.url}
              className="group block p-6 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col h-full">
                <span className={`text-[10px] font-black uppercase mb-2 px-2 py-1 rounded self-start ${
                  tool.category === 'PDF' ? 'bg-red-100 text-red-600' : 
                  tool.category === 'Media' ? 'bg-blue-100 text-blue-600' :
                  tool.category === 'Image' ? 'bg-green-100 text-green-600' :
                  tool.category === 'AI' ? 'bg-purple-100 text-purple-600' :
                  tool.category === 'Finance' ? 'bg-yellow-100 text-yellow-700' :
                  tool.category === 'Dev' ? 'bg-indigo-100 text-indigo-600' :
                  tool.category === 'Calculator' ? 'bg-indigo-100 text-indigo-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {tool.category}
                </span>
                <h2 className="text-lg font-bold mb-2 group-hover:text-red-600 transition-colors">
                  {tool.name}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed flex-grow">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {filteredTools.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No tools found in this category.</p>
          </div>
        )}
      </section>

      {/* Footer Info */}
      <section className="bg-indigo-600 py-12 px-4 text-white text-center mt-12">
        <h2 className="text-3xl font-bold mb-6">The professional solution for all your digital needs</h2>
        <p className="max-w-3xl mx-auto text-indigo-100 mb-8">
          ToolsX.site is your number one web app for editing media, managing PDFs, and performing complex scientific calculations with ease. Enjoy all the tools you need to work efficiently while keeping your data safe and secure.
        </p>
        <div className="flex justify-center gap-4">
          <Link href={user ? "/dashboard" : "/login"} className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-md hover:bg-gray-100 transition-colors">
            {user ? "Go to Dashboard" : "Get Started"}
          </Link>
          <Link href="/about" className="px-8 py-3 bg-indigo-700 text-white font-bold rounded-md hover:bg-indigo-800 transition-colors">
            Learn More
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading tools...</div>}>
      <HomeContent />
    </Suspense>
  );
}
