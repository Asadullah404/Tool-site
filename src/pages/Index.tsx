
import React from 'react';
import {
  FileText,
  Image,
  File,
  Grid3X3,
  Calculator,
  Scissors,
  Layers,
  ArrowRight,
  Upload,
  Download,
  Shield,
  Zap,
  Globe,
  Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import SettingsPanel from '@/components/SettingsPanel';

const Index = () => {
  // Conversion tools
  const conversions = [
    { name: 'PDF to JPG', path: '/convert-pdf-to-jpg', icon: FileText, desc: 'Convert PDF pages to JPG images' },
    { name: 'JPG to PDF', path: '/convert-jpg-to-pdf', icon: Image, desc: 'Convert JPG images to PDF' },
    { name: 'PDF to Word', path: '/convert-pdf-to-word', icon: File, desc: 'Convert your PDF file to Word' },
    { name: 'Text to PDF', path: '/convert-text-to-pdf', icon: FileText, desc: 'Convert text files to PDF' },
    { name: 'Excel to Text', path: '/convert-excel-to-text', icon: Grid3X3, desc: 'Extract text from Excel files' },
    { name: 'Split PDF', path: '/pdf-splitter', icon: Scissors, desc: 'Split PDF into separate pages' },
    { name: 'Merge PDF', path: '/pdf-merger', icon: Layers, desc: 'Combine multiple PDFs into one' },
    { name: 'Text to Excel', path: '/convert-text-to-excel', icon: Grid3X3, desc: 'Convert text data to Excel' },
    { name: 'PNG to JPG', path: '/convert-png-to-jpg', icon: Image, desc: 'Convert PNG images to JPG' },
    { name: 'JPG to PNG', path: '/convert-jpg-to-png', icon: Image, desc: 'Convert JPG images to PNG' },
    { name: 'Word to PDF', path: '/convert-word-to-pdf', icon: File, desc: 'Convert Word to PDF' }
  ];

  // Calculator tools
  const calculators = [
    { name: 'BMI Calculator', path: '/bmi-calculator' },
    { name: 'Basic Calculator', path: '/basic-calculator' },
    { name: 'Graphing Calculator', path: '/graphing-calculator' },
    { name: 'Financial Calculator', path: '/financial-calculator' },
    { name: 'Programmable Calculator', path: '/programmable-calculator' }
  ];

  // Features section
  const features = [
    { icon: Zap, text: 'Lightning Fast' },
    { icon: Shield, text: 'Secure & Private' },
    { icon: Globe, text: 'Works Anywhere' },
    { icon: Clock, text: 'No Signup Required' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[hsl(var(--primary))] rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Convert, Calculate, and Simplify Your Tasks
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#tools" className="text-gray-600 dark:text-gray-300 hover:text-[hsl(var(--primary))] font-medium">Tools</a>
            <a href="#calculators" className="text-gray-600 dark:text-gray-300 hover:text-[hsl(var(--primary))] font-medium">Calculators</a>
            <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-[hsl(var(--primary))] font-medium">How it Works</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Every tool you need to work with
            <span className="text-[hsl(var(--primary))] block">PDFs and More</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Convert, merge, split and compress PDF files in just a few clicks. 
            100% free, secure and easy to use.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((f, i) => (
              <div key={i} className="flex items-center space-x-2 bg-white dark:bg-gray-700 rounded-full px-4 py-2 shadow-sm">
                <f.icon className="w-4 h-4 text-[hsl(var(--primary))]" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conversion Tools */}
      <section id="tools" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">PDF Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {conversions.map((tool, i) => (
              <Link key={i} to={tool.path}>
                <Card className="p-6 shadow-sm hover:shadow-xl transition rounded-xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 cursor-pointer group h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-[hsl(var(--primary))] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                      <tool.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-[hsl(var(--primary))]">{tool.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{tool.desc}</p>
                  </div>
                  <div className="mt-4 flex items-center text-[hsl(var(--primary))] opacity-0 group-hover:opacity-100 transition">
                    <span className="text-sm font-medium">Try it now</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Calculator Tools */}
          <h2 id="calculators" className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">Calculator Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {calculators.map((calc, i) => (
              <Link key={i} to={calc.path}>
                <Card className="p-6 shadow-sm hover:shadow-xl transition rounded-xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 cursor-pointer group h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-[hsl(var(--primary))] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                      <Calculator className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-[hsl(var(--primary))] line-clamp-2">
                      {calc.name}
                    </h3>
                  </div>
                  <div className="mt-4 flex items-center text-[hsl(var(--primary))] opacity-0 group-hover:opacity-100 transition">
                    <span className="text-sm font-medium">Calculate</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-[hsl(var(--primary))] rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Upload</h3>
              <p className="text-gray-600 dark:text-gray-300">Select your files from your computer, Google Drive, or Dropbox</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-[hsl(var(--primary))] rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Convert</h3>
              <p className="text-gray-600 dark:text-gray-300">Our tools will automatically process your files in seconds</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-[hsl(var(--primary))] rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Download</h3>
              <p className="text-gray-600 dark:text-gray-300">Download your converted files instantly and securely</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2024 Universal Tools. All rights reserved.
          </p>
        </div>
      </footer>

      <SettingsPanel />
    </div>
  );
};

export default Index;

