
// src/App.tsx
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ConversionPage from "./pages/ConversionPage";
import NotFound from "./pages/NotFound";
import CursorTracker from "./components/CursorTracker";
import ThemeProvider from "./components/ThemeProvider";
import PdfMergerPage from "./pages/converter/PdfMergerPage";
import PdfSplitterPage from "./pages/converter/PdfSplitterPage";

const queryClient = new QueryClient();

// Lazy load heavy pages
const AdvancedBmiCalculator = React.lazy(() => import("./pages/Calculators/AdvancedBmiCalculator"));
const BasicCalculatorPage = React.lazy(() => import("./pages/Calculators/BasicCalculatorPage"));
const GraphingCalculatorPage = React.lazy(() => import("./pages/Calculators/GraphingCalculatorPage"));
const FinancialCalculator = React.lazy(() => import("./pages/Calculators/FinancialCalculator"));
const ProgrammableCalculatorPage = React.lazy(() => import("./pages/Calculators/ProgrammableCalculator"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <div className="min-h-screen animated-bg">
          <CursorTracker />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
              <Routes>
                {/* Home */}
                <Route path="/" element={<Index />} />

                {/* Conversion routes */}
                <Route path="/convert-pdf-to-word" element={<ConversionPage from="pdf" to="word" />} />
                <Route path="/convert-word-to-pdf" element={<ConversionPage from="word" to="pdf" />} />
                <Route path="/convert-text-to-pdf" element={<ConversionPage from="text" to="pdf" />} />
                <Route path="/convert-excel-to-text" element={<ConversionPage from="excel" to="text" />} />
                <Route path="/convert-text-to-excel" element={<ConversionPage from="text" to="excel" />} />
                <Route path="/convert-jpg-to-jpg" element={<ConversionPage from="jpg" to="jpg" />} />
                <Route path="/convert-pdf-to-jpg" element={<ConversionPage from="pdf" to="jpg" />} />
                <Route path="/pdf-merger" element={<PdfMergerPage />} />
                <Route path="/pdf-splitter" element={<PdfSplitterPage />} />
                <Route path="/convert-png-to-jpg" element={<ConversionPage from="png" to="jpg" />} />
                <Route path="/convert-jpg-to-png" element={<ConversionPage from="jpg" to="png" />} />
                <Route path="/convert-jpg-to-pdf" element={<ConversionPage from="jpg" to="pdf" />} />

                {/* Calculators (lazy loaded) */}
                <Route path="/bmi-calculator" element={<AdvancedBmiCalculator />} />
                <Route path="/basic-calculator" element={<BasicCalculatorPage />} />
                <Route path="/graphing-calculator" element={<GraphingCalculatorPage />} />
                {/* <Route path="/financial-calculator" element={<FinancialCalculator />} /> */}
                <Route path="/financial-calculator/:type" element={<FinancialCalculator />} />
                {/* <Route path="/programmable-calculator" element={<ProgrammableCalculatorPage />} /> */}
                <Route path="/programmable-calculator/:mode" element={<ProgrammableCalculatorPage />} />

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
