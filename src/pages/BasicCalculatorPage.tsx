import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SettingsPanel from '@/components/SettingsPanel';

const CalculatorPage: React.FC = () => {
  const [mode, setMode] = useState<'Basic' | 'School' | 'General'>('Basic');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleButtonClick = (value: string) => {
    if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === '=') {
      try {
        setResult(eval(input).toString());
      } catch {
        setResult('Error');
      }
    } else {
      setInput(input + value);
    }
  };

  const buttons: Record<string, string[]> = {
    Basic: ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '+', 'C', '='],
    School: ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '+', 'C', '(', ')', '%', '√', '='],
    General: ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '+', 'C', '(', ')', '%', '√', 'sin', 'cos', 'tan', '^', '='],
  };

  // Split all buttons except last one for 4-column grid
  const buttonRows = buttons[mode].slice(0, -1).reduce<string[][]>((rows, btn, idx) => {
    if (idx % 4 === 0) rows.push([]);
    rows[rows.length - 1].push(btn);
    return rows;
  }, []);

  const lastButton = buttons[mode][buttons[mode].length - 1];

  return (
    <div className="min-h-screen flex flex-col items-center bg-muted/10 py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Calculator</h1>

      {/* Mode Selector */}
      <div className="flex gap-4 mb-6">
        {['Basic', 'School', 'General'].map((m) => (
          <Button
            key={m}
            className={`px-6 py-2 rounded-lg font-bold ${
              mode === m ? 'bg-primary text-white shadow-lg' : 'bg-card text-foreground'
            }`}
            onClick={() => {
              setMode(m as 'Basic' | 'School' | 'General');
              setInput('');
              setResult('');
            }}
          >
            {m} Use
          </Button>
        ))}
      </div>

      {/* Display */}
      <Card className="w-full max-w-md p-4 mb-6 bg-gradient-to-br from-card/80 to-card/50 border border-white/20 shadow-2xl">
        <div className="mb-4 text-right text-xl font-mono text-foreground">{input || '0'}</div>
        <div className="text-right text-2xl font-bold text-primary">{result}</div>
      </Card>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-4 max-w-md w-full mb-4">
        {buttonRows.flat().map((btn, idx) => (
          <Button
            key={btn + idx}
            className={`px-4 py-4 rounded-xl font-bold text-lg ${
              btn === 'C'
                ? 'bg-red-500 text-white shadow-lg hover:scale-105 transform transition'
                : 'bg-card text-foreground shadow hover:scale-105 transform transition'
            }`}
            onClick={() => handleButtonClick(btn)}
          >
            {btn}
          </Button>
        ))}

        {/* Stretch = button across all 4 columns */}
        <Button
          className="col-span-4 px-4 py-4 rounded-xl font-bold text-lg bg-green-500 text-white shadow-lg hover:scale-105 transform transition"
          onClick={() => handleButtonClick(lastButton)}
        >
          {lastButton}
        </Button>
      </div>

      <SettingsPanel />
    </div>
  );
};

export default CalculatorPage;
