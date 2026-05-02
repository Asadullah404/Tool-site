import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ToolsX | Free Media, PDF & Calculation Tools",
  description: "Merge, split, compress, convert PDF. Scientific calculators, math solvers. Download YouTube, Instagram, Facebook videos and audio. All-in-one SEO optimized tool hub.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-6 group">
                <img src="/favicon.ico" alt="ToolsX Logo" className="w-8 h-8" />
                <span className="text-xl font-black text-white tracking-tighter uppercase">
                  ToolsX<span className="text-indigo-500">.site</span>
                </span>
              </Link>
              <p className="text-xs leading-relaxed max-w-xs">
                The world's most versatile free tool platform. We provide professional-grade PDF, Image, and Calculation utilities for everyone, everywhere.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">PDF Tools</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/tools/merge-pdf" className="hover:text-white transition-colors">Merge PDF</Link></li>
                <li><Link href="/tools/split-pdf" className="hover:text-white transition-colors">Split PDF</Link></li>
                <li><Link href="/tools/compress-pdf" className="hover:text-white transition-colors">Compress PDF</Link></li>
                <li><Link href="/tools/pdf-to-word" className="hover:text-white transition-colors">PDF to Word</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Calculators</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/tools/basic-calculator" className="hover:text-white transition-colors">Scientific Calculator</Link></li>
                <li><Link href="/tools/bmi-calculator" className="hover:text-white transition-colors">BMI Calculator</Link></li>
                <li><Link href="/tools/financial-calculator" className="hover:text-white transition-colors">Financial Calculator</Link></li>
                <li><Link href="/tools/math-solve" className="hover:text-white transition-colors">Equation Solver</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Social</h3>
              <div className="flex gap-4">
                <a href="https://www.linkedin.com/in/muhammad-asadullah-93a0b22a3/" target="_blank" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center cursor-pointer hover:bg-indigo-600 transition-all">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-[10px] font-bold tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} TOOLSX.SITE — ALL RIGHTS RESERVED
          </div>
        </footer>
      </body>
    </html>
  );
}
