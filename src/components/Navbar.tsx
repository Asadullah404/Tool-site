'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { TOOLS } from '@/constants/tools';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/favicon.ico" alt="Logo" className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-2xl font-black text-indigo-600 tracking-tighter">
                TOOLSX<span className="text-gray-900">.SITE</span>
              </span>
            </Link>
            
            {/* Mega Menu - Desktop */}
            <div className="hidden md:flex gap-4 text-sm font-bold text-gray-700 uppercase">
              {['PDF', 'Image', 'Media', 'AI', 'Calculator'].map((category) => (
                <div key={category} className="group relative py-4">
                  <Link href={`/?category=${category.toLowerCase()}`} className={`hover:text-red-600 transition-colors cursor-default`}>
                    {category} Tools
                  </Link>
                  <div className={`absolute top-full left-0 w-[500px] bg-white shadow-xl border border-gray-100 p-6 rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] grid grid-cols-2 gap-4`}>
                    {TOOLS.filter(t => t.category === category).slice(0, 10).map(tool => (
                      <Link key={tool.id} href={tool.url} className="text-[11px] hover:text-red-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm font-bold text-gray-700 hover:text-red-600 uppercase">Dashboard</Link>
                <button 
                  onClick={() => signOut(auth)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded font-bold text-sm hover:bg-gray-200 uppercase"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-gray-700 hover:text-red-600 uppercase">Login</Link>
                <Link href="/register" className="bg-red-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-red-700 uppercase">Sign Up</Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-4">
          <div className="flex flex-col gap-2">
            {['PDF', 'Image', 'Media', 'AI', 'Calculator'].map((category) => (
              <Link 
                key={category} 
                href={`/?category=${category.toLowerCase()}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold text-gray-700 uppercase py-2 border-b border-gray-50"
              >
                {category} Tools
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3 pt-2">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-gray-700 uppercase py-2">Dashboard</Link>
                <button 
                  onClick={() => { signOut(auth); setIsMobileMenuOpen(false); }}
                  className="bg-gray-100 text-gray-700 px-4 py-3 rounded font-bold text-sm uppercase text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-gray-700 uppercase py-2">Login</Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-red-600 text-white px-4 py-3 rounded font-bold text-sm uppercase text-center">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
