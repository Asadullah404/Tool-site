import React from 'react';
import {
  ArrowRight,
  FileText,
  Image,
  File,
  Grid3X3,
  Zap,
  Shield,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import SettingsPanel from '@/components/SettingsPanel';

const Index = () => {
  const conversions = [
    { from: 'PDF', to: 'JPG', path: '/convert-pdf-to-jpg', fromIcon: FileText, toIcon: Image, fromColor: 'text-red-500', toColor: 'text-purple-500' },
    { from: 'JPG', to: 'PDF', path: '/convert-jpg-to-pdf', fromIcon: Image, toIcon: FileText, fromColor: 'text-purple-500', toColor: 'text-red-500' },
    { from: 'PDF', to: 'Text', path: '/convert-pdf-to-text', fromIcon: FileText, toIcon: File, fromColor: 'text-red-500', toColor: 'text-gray-500' },
    { from: 'Text', to: 'PDF', path: '/convert-text-to-pdf', fromIcon: File, toIcon: FileText, fromColor: 'text-gray-500', toColor: 'text-red-500' },
    { from: 'Excel', to: 'Text', path: '/convert-excel-to-text', fromIcon: Grid3X3, toIcon: File, fromColor: 'text-green-500', toColor: 'text-gray-500' },
    { from: 'PDF', to: 'Split', path: '/pdf-splitter', fromIcon: FileText, toIcon: File, fromColor: 'text-red-500', toColor: 'text-gray-500' },
    { from: 'PDFs', to: 'Merge', path: '/pdf-merger', fromIcon: FileText, toIcon: FileText, fromColor: 'text-red-500', toColor: 'text-blue-500' },
    { from: 'Text', to: 'Excel', path: '/convert-text-to-excel', fromIcon: File, toIcon: Grid3X3, fromColor: 'text-gray-500', toColor: 'text-green-500' },
    { from: 'PNG', to: 'JPG', path: '/convert-png-to-jpg', fromIcon: Image, toIcon: Image, fromColor: 'text-blue-500', toColor: 'text-yellow-600' },
    { from: 'JPG', to: 'PNG', path: '/convert-jpg-to-png', fromIcon: Image, toIcon: Image, fromColor: 'text-yellow-600', toColor: 'text-blue-500' },
  ];

  const features = [
    { icon: Zap, title: 'Lightning Fast', description: 'Convert files in seconds with our optimized processing' },
    { icon: Shield, title: 'Secure & Private', description: 'Your files are processed securely and deleted after conversion' },
    { icon: Clock, title: 'No Signup Required', description: 'Start converting immediately without creating an account' },
  ];

  const calculatorButtons = [
    { title: 'BMI Calculator', path: '/bmi-calculator' },
    { title: 'School Calculator', path: '/basiccalculator' },
    { title: 'Graphing Calculator', path: '/graphing-calculator' },
    { title: 'Financial Calculator', path: '/financial-calculator' },
    { title: 'Programmable Calculator', path: '/programmable-calculator' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/10">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="relative max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Universal File
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent block">
              Converter
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Convert between PDF, Word, Excel, PowerPoint, JPG, and Text formats instantly. Fast, secure, and completely free.
          </p>

{/* Calculator Buttons */}
<div className="flex flex-wrap justify-center gap-6 mb-12">
  {calculatorButtons.map((btn) => (
    <Link key={btn.path} to={btn.path}>
      <Button
        className="
          relative
          px-6 py-4
          text-lg font-bold
          rounded-xl
          bg-primary
          text-primary-foreground
          shadow-md
          hover:shadow-lg
          hover:bg-primary/90
          transform hover:-translate-y-1 hover:scale-105
          transition-all duration-300
          flex items-center justify-center gap-2
        "
      >
        <Zap className="w-5 h-5" />
        {btn.title}
      </Button>
    </Link>
  ))}
</div>


          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition"
              >
                <feature.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground truncate">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conversion Grid */}
      <section className="py-16 px-4 flex-1">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Choose Your Conversion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conversions.map((conversion) => {
              const FromIcon = conversion.fromIcon;
              const ToIcon = conversion.toIcon;

              return (
                <Link key={conversion.path} to={conversion.path}>
                  <Card className="relative p-4 md:p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-2xl border border-white/20 group overflow-hidden rounded-2xl h-full">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div className="flex flex-col lg:flex-row items-center justify-between mb-6 space-y-4 lg:space-y-0 w-full">
                        <div className="flex items-center gap-3 md:gap-4 w-full lg:w-auto min-w-0">
                          <div className="relative p-3 md:p-4 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-white/10">
                            <FromIcon className={`w-6 h-6 md:w-10 md:h-10 ${conversion.fromColor}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-lg md:text-xl text-foreground block truncate">{conversion.from}</span>
                            <span className="text-xs md:text-sm text-muted-foreground truncate">Source format</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                          <span className="hidden md:block text-xs text-muted-foreground mt-1">Convert</span>
                        </div>

                        <div className="flex items-center gap-3 md:gap-4 w-full lg:w-auto min-w-0">
                          <div className="min-w-0 flex-1 text-left lg:text-right">
                            <span className="font-bold text-lg md:text-xl text-foreground block truncate">{conversion.to}</span>
                            <span className="text-xs md:text-sm text-muted-foreground truncate">Target format</span>
                          </div>
                          <div className="relative p-3 md:p-4 rounded-2xl bg-gradient-to-br from-card/80 to-card/40 border border-white/10">
                            <ToIcon className={`w-6 h-6 md:w-10 md:h-10 ${conversion.toColor}`} />
                          </div>
                        </div>
                      </div>

                      <Button className="w-full h-12 bg-gradient-to-r from-primary via-primary-glow to-accent text-primary-foreground font-bold text-sm md:text-base rounded-xl overflow-hidden">
                        <span className="truncate flex items-center justify-center gap-2">
                          Convert {conversion.from} to {conversion.to}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </Button>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 text-center border-t border-border">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground">
            © 2024 Universal File Converter. Convert your files with confidence.
          </p>
        </div>
      </footer>

      <SettingsPanel />
    </div>
  );
};

export default Index;
