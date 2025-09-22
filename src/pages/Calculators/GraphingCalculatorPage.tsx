import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SettingsPanel from '@/components/SettingsPanel';
import Plot from 'react-plotly.js';
import { evaluate, compile } from 'mathjs';

const GraphingCalculatorPage: React.FC = () => {
  const [equation, setEquation] = useState('x^2');
  const [data, setData] = useState<{ x: number[]; y: number[] } | null>(null);

  const handlePlot = () => {
    try {
      const expr = compile(equation); // compile expression safely
      const xValues = Array.from({ length: 200 }, (_, i) => i / 10 - 10); // -10 to 10
      const yValues = xValues.map((x) => {
        return expr.evaluate({ x });
      });
      setData({ x: xValues, y: yValues });
    } catch (err) {
      alert('Invalid equation! Use valid math expressions.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-muted/10 py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Graphing Calculator</h1>

      <Card className="w-full max-w-2xl p-6 mb-6 bg-gradient-to-br from-card/80 to-card/50 border border-white/20 shadow-2xl">
        <label className="text-lg font-semibold text-foreground mb-2 block">
          Enter equation (use variable x):
        </label>
        <input
          type="text"
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          placeholder="e.g. x^2, sin(x), x^3 - 2*x"
          className="w-full p-3 mb-4 rounded-lg border border-border bg-card text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button
          onClick={handlePlot}
          className="w-full py-3 bg-gradient-to-r from-primary via-primary-glow to-accent text-primary-foreground font-bold rounded-xl shadow-lg hover:scale-105 transform transition"
        >
          Plot Graph
        </Button>
      </Card>

      {data && (
        <Card className="w-full max-w-3xl p-6 mb-12 bg-gradient-to-br from-card/80 to-card/50 border border-white/20 shadow-2xl">
          <Plot
            data={[
              {
                x: data.x,
                y: data.y,
                type: 'scatter',
                mode: 'lines',
                marker: { color: '#6366F1' },
              },
            ]}
            layout={{
              title: `y = ${equation}`,
              xaxis: { title: 'x' },
              yaxis: { title: 'y' },
              width: 700,
              height: 450,
              plot_bgcolor: 'rgba(255,255,255,0)',
              paper_bgcolor: 'rgba(255,255,255,0)',
            }}
          />
        </Card>
      )}

      <SettingsPanel />
    </div>
  );
};

export default GraphingCalculatorPage;
