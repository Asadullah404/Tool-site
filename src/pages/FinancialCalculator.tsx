import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SettingsPanel from '@/components/SettingsPanel';

type CalculationType =
  | 'EMI'
  | 'ProfitLoss'
  | 'SimpleInterest'
  | 'CompoundInterest'
  | 'ROI'
  | 'Depreciation';

const FinancialCalculatorPage: React.FC = () => {
  const [calculationType, setCalculationType] = useState<CalculationType>('EMI');
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>('');

  const handleChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
    try {
      let res = '';
      const P = parseFloat(inputs.principal || '0');
      const R = parseFloat(inputs.rate || '0');
      const T = parseFloat(inputs.time || '0');
      const N = parseFloat(inputs.n || '1'); // for compound interest
      const CP = parseFloat(inputs.costPrice || '0');
      const SP = parseFloat(inputs.sellingPrice || '0');
      const FV = parseFloat(inputs.futureValue || '0');

      switch (calculationType) {
        case 'EMI': {
          const monthlyRate = R / 12 / 100;
          const months = T * 12;
          const emi = P * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
          const totalPayment = emi * months;
          const totalInterest = totalPayment - P;
          res = `EMI: ${emi.toFixed(2)}, Total Payment: ${totalPayment.toFixed(2)}, Total Interest: ${totalInterest.toFixed(2)}`;
          break;
        }

        case 'ProfitLoss': {
          const profitLoss = SP - CP;
          const percent = ((profitLoss) / CP) * 100;
          if (profitLoss > 0) res = `Profit: ${profitLoss.toFixed(2)} (${percent.toFixed(2)}%)`;
          else res = `Loss: ${Math.abs(profitLoss).toFixed(2)} (${Math.abs(percent).toFixed(2)}%)`;
          break;
        }

        case 'SimpleInterest': {
          const si = (P * R * T) / 100;
          const total = P + si;
          res = `Simple Interest: ${si.toFixed(2)}, Total Amount: ${total.toFixed(2)}`;
          break;
        }

        case 'CompoundInterest': {
          const ci = P * Math.pow(1 + R / (100 * N), N * T) - P;
          const total = P + ci;
          res = `Compound Interest: ${ci.toFixed(2)}, Total Amount: ${total.toFixed(2)}`;
          break;
        }

        case 'ROI': {
          const roi = ((FV - P) / P) * 100;
          res = `Return on Investment: ${roi.toFixed(2)}%`;
          break;
        }

        case 'Depreciation': {
          const method = inputs.method || 'straight';
          if (method === 'straight') {
            const dep = (P - FV) / T;
            res = `Straight-line Depreciation per year: ${dep.toFixed(2)}`;
          } else if (method === 'declining') {
            const rate = R / 100;
            const schedule = [];
            let bookValue = P;
            for (let i = 1; i <= T; i++) {
              const dep = bookValue * rate;
              bookValue -= dep;
              schedule.push(`Year ${i}: ${dep.toFixed(2)}, Book Value: ${bookValue.toFixed(2)}`);
            }
            res = schedule.join(' | ');
          }
          break;
        }

        default:
          res = 'Invalid calculation';
      }

      setResult(res);
    } catch (err) {
      setResult('Error in calculation');
      console.error(err);
    }
  };

  const inputFields: Record<CalculationType, { label: string; name: string; placeholder: string }[]> = {
    EMI: [
      { label: 'Principal Amount', name: 'principal', placeholder: 'e.g. 100000' },
      { label: 'Annual Interest Rate (%)', name: 'rate', placeholder: 'e.g. 7.5' },
      { label: 'Time (Years)', name: 'time', placeholder: 'e.g. 5' },
    ],
    ProfitLoss: [
      { label: 'Cost Price', name: 'costPrice', placeholder: 'e.g. 1000' },
      { label: 'Selling Price', name: 'sellingPrice', placeholder: 'e.g. 1200' },
    ],
    SimpleInterest: [
      { label: 'Principal Amount', name: 'principal', placeholder: 'e.g. 5000' },
      { label: 'Rate (%)', name: 'rate', placeholder: 'e.g. 5' },
      { label: 'Time (Years)', name: 'time', placeholder: 'e.g. 2' },
    ],
    CompoundInterest: [
      { label: 'Principal Amount', name: 'principal', placeholder: 'e.g. 5000' },
      { label: 'Rate (%)', name: 'rate', placeholder: 'e.g. 5' },
      { label: 'Time (Years)', name: 'time', placeholder: 'e.g. 2' },
      { label: 'Compounds per year', name: 'n', placeholder: 'e.g. 4' },
    ],
    ROI: [
      { label: 'Investment Amount', name: 'principal', placeholder: 'e.g. 5000' },
      { label: 'Future Value', name: 'futureValue', placeholder: 'e.g. 6000' },
    ],
    Depreciation: [
      { label: 'Asset Cost', name: 'principal', placeholder: 'e.g. 10000' },
      { label: 'Salvage Value', name: 'futureValue', placeholder: 'e.g. 1000' },
      { label: 'Time (Years)', name: 'time', placeholder: 'e.g. 5' },
      { label: 'Rate (%) (for Declining)', name: 'rate', placeholder: 'e.g. 20' },
      { label: 'Method', name: 'method', placeholder: 'straight / declining' },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-muted/10 py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Advanced Financial Calculator</h1>

      {/* Mode Selector */}
      <div className="flex gap-4 mb-6 flex-wrap justify-center">
        {['EMI', 'ProfitLoss', 'SimpleInterest', 'CompoundInterest', 'ROI', 'Depreciation'].map((type) => (
          <Button
            key={type}
            className={`px-6 py-2 rounded-lg font-bold ${
              calculationType === type ? 'bg-primary text-white shadow-lg' : 'bg-card text-foreground'
            }`}
            onClick={() => {
              setCalculationType(type as any);
              setInputs({});
              setResult('');
            }}
          >
            {type}
          </Button>
        ))}
      </div>

      {/* Input Card */}
      <Card className="w-full max-w-md p-6 mb-6 bg-gradient-to-br from-card/80 to-card/50 border border-white/20 shadow-2xl space-y-4">
        {inputFields[calculationType].map((field) => (
          <div key={field.name}>
            <label className="text-lg font-medium text-foreground mb-1 block">{field.label}</label>
            <input
              type={field.name === 'method' ? 'text' : 'number'}
              value={inputs[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="w-full p-3 rounded-lg border border-border bg-card text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ))}

        <Button
          onClick={handleCalculate}
          className="w-full py-3 bg-gradient-to-r from-primary via-primary-glow to-accent text-primary-foreground font-bold rounded-xl shadow-lg hover:scale-105 transform transition"
        >
          Calculate
        </Button>

        {result && <div className="mt-4 text-xl font-bold text-primary whitespace-pre-wrap">{result}</div>}
      </Card>

      <SettingsPanel />
    </div>
  );
};

export default FinancialCalculatorPage;
