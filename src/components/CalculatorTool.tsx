'use client';

import { useState, useRef, useEffect } from 'react';
import { TOOLS } from '@/constants/tools';
import * as math from 'mathjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CalculatorToolProps {
  toolId: string;
}

export default function CalculatorTool({ toolId }: CalculatorToolProps) {
  const tool = TOOLS.find((t) => t.id === toolId);
  const [result, setResult] = useState<string | null>(null);

  // --- CASIO 991EX STATE ---
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState('');
  const [shift, setShift] = useState(false);
  const [alpha, setAlpha] = useState(false);
  const [isDegrees, setIsDegrees] = useState(true);

  // --- BMI STATE ---
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('70');
  const [bmiStatus, setBmiStatus] = useState<string | null>(null);

  // --- GRAPHING STATE ---
  const [equation, setEquation] = useState('x^2');
  const [graphData, setGraphData] = useState<any>(null);

  // --- PROGRAMMABLE STATE ---
  const [code, setCode] = useState('// Example: Calculate Fibonacci\nfunction fib(n) {\n  return n <= 1 ? n : fib(n-1) + fib(n-2);\n}\n\nlog("Fib(10) = " + fib(10));');
  const [logs, setLogs] = useState<string[]>([]);

  if (!tool) {
    return <div className="py-20 text-center font-bold text-gray-400 uppercase tracking-widest">Tool not found</div>;
  }

  // --- CASIO LOGIC ---
  const handleCasio = (val: string, secondary?: string, alphaVal?: string) => {
    let input = val;
    if (shift && secondary) {
      input = secondary;
      setShift(false);
    } else if (alpha && alphaVal) {
      input = alphaVal;
      setAlpha(false);
    }

    if (input === 'SHIFT') { setShift(!shift); setAlpha(false); return; }
    if (input === 'ALPHA') { setAlpha(!alpha); setShift(false); return; }
    if (input === 'AC') { setDisplay('0'); setHistory(''); return; }
    if (input === 'DEL') { setDisplay(display.length > 1 ? display.slice(0, -1) : '0'); return; }
    
    if (input === '=') {
      try {
        let cleanEq = display
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/π/g, 'pi')
          .replace(/e/g, 'e')
          .replace(/√\(/g, 'sqrt(')
          .replace(/ln\(/g, 'log(') // mathjs log is ln
          .replace(/log\(/g, 'log10(');
        
        const res = math.evaluate(cleanEq);
        setHistory(display + ' =');
        setDisplay(Number.isInteger(res) ? res.toString() : res.toFixed(8).replace(/\.?0+$/, ''));
      } catch (e) {
        setDisplay('Syntax ERROR');
      }
      return;
    }

    // Logic for appending
    const appendMap: any = {
        'x²': '^2',
        'x³': '^3',
        'x⁻¹': '^-1',
        '√': '√(',
        'sin': 'sin(',
        'cos': 'cos(',
        'tan': 'tan(',
        'ln': 'ln(',
        'log': 'log(',
    };

    const toAppend = appendMap[input] || input;
    const newDisplay = (display === '0' && !['+', '-', '×', '÷', '^'].includes(toAppend)) ? toAppend : display + toAppend;
    setDisplay(newDisplay);
  };

  // --- BMI LOGIC ---
  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const val = (w / (h * h)).toFixed(1);
      setResult(val);
      const v = parseFloat(val);
      if (v < 18.5) setBmiStatus('Underweight');
      else if (v < 25) setBmiStatus('Normal');
      else if (v < 30) setBmiStatus('Overweight');
      else setBmiStatus('Obese');
    }
  };

  // --- GRAPHING LOGIC ---
  const updateGraph = () => {
    try {
      const xValues = math.range(-10, 10, 0.5).toArray() as number[];
      const yValues = xValues.map(x => {
        try {
          return math.evaluate(equation, { x });
        } catch {
          return null;
        }
      });

      setGraphData({
        labels: xValues,
        datasets: [{
          label: `y = ${equation}`,
          data: yValues,
          borderColor: 'rgb(79, 70, 229)',
          backgroundColor: 'rgba(79, 70, 229, 0.5)',
          tension: 0.4,
          pointRadius: 2,
        }]
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { if (toolId === 'graphing-calculator') updateGraph(); }, [toolId]);

  // --- PROGRAMMABLE LOGIC ---
  const runProgram = () => {
    const output: string[] = [];
    const log = (m: any) => output.push(String(m));
    try {
      const fn = new Function('log', 'math', code);
      fn(log, math);
      setLogs(output);
    } catch (e: any) {
      setLogs([...output, `Error: ${e.message}`]);
    }
  };

  const CasioButton = ({ label, secondary, alphaLabel, className = "", onClick }: any) => (
    <div className="flex flex-col items-center group">
      <div className="flex gap-2 mb-1 h-3">
        {secondary && <span className="text-[7px] font-black text-amber-500 uppercase">{secondary}</span>}
        {alphaLabel && <span className="text-[7px] font-black text-rose-500 uppercase">{alphaLabel}</span>}
      </div>
      <button 
        onClick={() => onClick(label, secondary, alphaLabel)}
        className={`w-full py-2.5 rounded-lg font-black text-[11px] shadow-[0_4px_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center ${className}`}
      >
        {label}
      </button>
    </div>
  );

  const renderCasio = () => (
    <div className="max-w-md mx-auto bg-[#1a1a1a] p-8 rounded-[3rem] border-x-4 border-t-2 border-b-12 border-gray-900 shadow-2xl relative overflow-hidden">
      {/* Decorative Texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '10px 10px' }}></div>
      
      {/* Brand & Model */}
      <div className="flex justify-between items-center mb-6 px-2 relative z-10">
        <span className="text-gray-400 font-black italic text-sm tracking-tighter">CASIO</span>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 font-bold leading-none">ClassWiz</p>
          <p className="text-[11px] text-white font-black italic">fx-991EX</p>
        </div>
      </div>

      {/* High-Contrast LCD Screen */}
      <div className="bg-[#a8b89e] p-6 rounded-2xl mb-8 font-mono shadow-[inset_0_4px_10px_rgba(0,0,0,0.3)] border-4 border-[#8e9d85] min-h-[120px] flex flex-col justify-between relative z-10">
        <div className="flex justify-between items-center text-[10px] text-[#2a3026] font-black opacity-80 uppercase tracking-widest border-b border-[#2a3026]/10 pb-1">
          <div className="flex gap-2">
            {shift && <span className="bg-[#2a3026] text-[#a8b89e] px-1 rounded">S</span>}
            {alpha && <span className="bg-[#2a3026] text-[#a8b89e] px-1 rounded">A</span>}
            <span>{isDegrees ? 'D' : 'R'}</span>
          </div>
          <span>MathI</span>
        </div>
        <div className="mt-2">
           <div className="text-[#3c4136] text-xs h-6 truncate opacity-70 italic text-left">{history}</div>
           <div className="text-[#1a1c16] text-3xl font-black text-right truncate drop-shadow-sm">{display}</div>
        </div>
      </div>

      {/* Navigation Block */}
      <div className="grid grid-cols-4 gap-4 mb-8 px-2 relative z-10">
        <CasioButton label="SHIFT" onClick={handleCasio} className="bg-amber-500 text-black text-[9px]" />
        <CasioButton label="ALPHA" onClick={handleCasio} className="bg-rose-500 text-white text-[9px]" />
        <CasioButton label="MENU" secondary="SETUP" onClick={handleCasio} className="bg-gray-700 text-white" />
        <CasioButton label="ON" onClick={() => setDisplay('0')} className="bg-gray-700 text-white" />
      </div>

      {/* Scientific Function Grid */}
      <div className="grid grid-cols-6 gap-2 mb-8 relative z-10">
        {[
          { l: 'OPTN', s: 'QR' }, { l: 'Calc', s: '=' }, { l: '∫dx', s: 'd/dx' }, { l: 'x⁻¹', s: 'x!' }, { l: 'log', s: 'logₐb' }, { l: 'frac', s: 'b/c' },
          { l: '√', s: '∛' }, { l: 'x²', s: 'x³' }, { l: '^', s: 'ⁿ√' }, { l: 'log', s: '10ⁿ' }, { l: 'ln', s: 'eⁿ' }, { l: '(-)', s: '∠' },
          { l: 'o\'\'\'', s: '←' }, { l: 'hyp', s: 'abs' }, { l: 'sin', s: 'sin⁻¹', a: 'D' }, { l: 'cos', s: 'cos⁻¹', a: 'E' }, { l: 'tan', s: 'tan⁻¹', a: 'F' }, { l: 'STO', s: 'RECL' }
        ].map((btn, i) => (
          <CasioButton key={i} label={btn.l} secondary={btn.s} alphaLabel={btn.a} onClick={handleCasio} className="bg-[#3a3a3a] text-gray-200" />
        ))}
      </div>

      {/* Main Keypad */}
      <div className="grid grid-cols-5 gap-3 relative z-10">
        {[
          { l: '7' }, { l: '8' }, { l: '9' }, { l: 'DEL', c: 'bg-rose-700 text-white' }, { l: 'AC', c: 'bg-rose-700 text-white' },
          { l: '4' }, { l: '5' }, { l: '6' }, { l: '×', s: 'P', c: 'bg-gray-700 text-white' }, { l: '÷', s: 'C', c: 'bg-gray-700 text-white' },
          { l: '1' }, { l: '2' }, { l: '3' }, { l: '+', s: 'Σ', c: 'bg-gray-700 text-white' }, { l: '-', s: 'Δ', c: 'bg-gray-700 text-white' },
          { l: '0', s: 'Rnd' }, { l: '.', s: 'Ran#' }, { l: 'EXP', s: 'π', a: 'e' }, { l: 'Ans', s: 'DRG' }, { l: '=', c: 'bg-gray-600 text-white' }
        ].map((btn, i) => (
          <CasioButton key={i} label={btn.l} secondary={btn.s} alphaLabel={btn.a} onClick={handleCasio} className={btn.c || "bg-gray-200 text-gray-900"} />
        ))}
      </div>
    </div>
  );

  const renderGraphing = () => (
    <div className="space-y-8">
      <div className="flex gap-4">
        <div className="flex-grow relative">
           <span className="absolute left-4 top-4 font-black text-gray-400">y =</span>
           <input 
             type="text" 
             value={equation} 
             onChange={(e) => setEquation(e.target.value)}
             className="w-full p-4 pl-12 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-lg"
           />
        </div>
        <button onClick={updateGraph} className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-lg">Plot</button>
      </div>
      <div className="bg-white p-6 rounded-3xl border-2 border-gray-50 shadow-inner h-[400px] flex items-center justify-center">
        {graphData ? <Line data={graphData} options={{ 
          responsive: true, 
          maintainAspectRatio: false,
          scales: {
            x: { grid: { color: '#f3f4f6' } },
            y: { grid: { color: '#f3f4f6' } }
          }
        }} /> : <p className="text-gray-300 font-bold uppercase tracking-widest">Generating Plot...</p>}
      </div>
    </div>
  );

  const renderProgrammable = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Script Editor (JS)</label>
        <textarea 
          value={code} 
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-80 p-6 bg-gray-900 text-green-400 font-mono text-sm rounded-3xl border-4 border-gray-800 focus:ring-8 focus:ring-indigo-50 outline-none shadow-inner"
        />
        <button onClick={runProgram} className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl uppercase tracking-widest text-xs shadow-xl">Execute Script</button>
      </div>
      <div className="flex flex-col">
        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Console Output</label>
        <div className="flex-grow bg-gray-50 rounded-3xl p-6 border-2 border-gray-100 font-mono text-xs overflow-auto shadow-inner min-h-[200px]">
          {logs.length > 0 ? logs.map((l, i) => (
            <div key={i} className="mb-2 pb-2 border-b border-gray-100 last:border-0">
              <span className="text-indigo-400 mr-2">&gt;</span> {l}
            </div>
          )) : <span className="text-gray-300">Logs will appear here...</span>}
        </div>
      </div>
    </div>
  );

  const renderBMI = () => (
    <div className="flex flex-col md:flex-row gap-10 items-center">
      <div className="flex-1 space-y-6 w-full">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Height (cm)</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold" />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Weight (kg)</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold" />
        </div>
        <button onClick={calculateBMI} className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl uppercase tracking-widest text-xs shadow-lg hover:bg-indigo-700 transition-all">Calculate BMI</button>
      </div>
      <div className="flex-1 bg-indigo-50 p-10 rounded-3xl border-2 border-indigo-100 text-center w-full">
        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Your Result</span>
        <h4 className="text-6xl font-black text-indigo-900 my-4">{result || '--'}</h4>
        {bmiStatus && (
          <div className={`inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
            bmiStatus === 'Normal' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
          }`}>
            {bmiStatus}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-gray-50 border-b border-gray-100 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-4 h-4 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">{tool.category}</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 uppercase tracking-tighter leading-none italic">{tool.name}</h1>
          <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-3xl mx-auto font-medium">{tool.description}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16">
        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-gray-100 p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-3 bg-indigo-600"></div>
          {toolId === 'bmi-calculator' && renderBMI()}
          {toolId === 'basic-calculator' && renderCasio()}
          {toolId === 'graphing-calculator' && renderGraphing()}
          {toolId === 'programmable-calculator' && renderProgrammable()}
        </div>
      </div>
    </div>
  );
}
