// import React, { useState } from 'react';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import SettingsPanel from '@/components/SettingsPanel';
// import Algebrite from 'algebrite';

// const ProgrammableCalculatorPage: React.FC = () => {
//   const [expression, setExpression] = useState('');
//   const [result, setResult] = useState<string>('');
//   const [mode, setMode] = useState<'Evaluate' | 'Simplify' | 'Factor' | 'Expand' | 'Derivative' | 'Integrate' | 'Solve'>('Evaluate');

//   const handleCalculate = () => {
//     try {
//       let res = '';
//       switch (mode) {
//         case 'Evaluate':
//           res = Algebrite.run(expression).toString();
//           break;
//         case 'Simplify':
//           res = Algebrite.simplify(expression).toString();
//           break;
//         case 'Factor':
//           res = Algebrite.factor(expression).toString();
//           break;
//         case 'Expand':
//           res = Algebrite.expand(expression).toString();
//           break;
//         case 'Derivative':
//           res = Algebrite.derivative(expression, 'x').toString();
//           break;
//         case 'Integrate':
//           res = Algebrite.integral(expression, 'x').toString();
//           break;
//         case 'Solve':
//           res = Algebrite.run(`roots(${expression})`).toString();
//           break;
//         default:
//           res = 'Invalid mode';
//       }
//       setResult(res);
//     } catch (err) {
//       console.error(err);
//       setResult('Error in calculation');
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-muted/10 py-12 px-4">
//       <h1 className="text-4xl font-bold mb-8 text-foreground">Programmable / CAS Calculator</h1>

//       {/* Mode Selector */}
//       <div className="flex gap-4 mb-6 flex-wrap justify-center">
//         {['Evaluate', 'Simplify', 'Factor', 'Expand', 'Derivative', 'Integrate', 'Solve'].map((m) => (
//           <Button
//             key={m}
//             className={`px-6 py-2 rounded-lg font-bold ${
//               mode === m ? 'bg-primary text-white shadow-lg' : 'bg-card text-foreground'
//             }`}
//             onClick={() => {
//               setMode(m as any);
//               setResult('');
//             }}
//           >
//             {m}
//           </Button>
//         ))}
//       </div>

//       {/* Input Card */}
//       <Card className="w-full max-w-2xl p-6 mb-6 bg-gradient-to-br from-card/80 to-card/50 border border-white/20 shadow-2xl space-y-4">
//         <label className="text-lg font-semibold text-foreground mb-2 block">
//           Enter Expression:
//         </label>
//         <input
//           type="text"
//           value={expression}
//           onChange={(e) => setExpression(e.target.value)}
//           placeholder="e.g. 2*x^2 + 3*x - 5"
//           className="w-full p-3 mb-4 rounded-lg border border-border bg-card text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
//         />

//         <Button
//           onClick={handleCalculate}
//           className="w-full py-3 bg-gradient-to-r from-primary via-primary-glow to-accent text-primary-foreground font-bold rounded-xl shadow-lg hover:scale-105 transform transition"
//         >
//           Calculate
//         </Button>

//         {result && (
//           <div className="mt-4 text-xl font-bold text-primary whitespace-pre-wrap">{result}</div>
//         )}
//       </Card>

//       <SettingsPanel />
//     </div>
//   );
// };

// export default ProgrammableCalculatorPage;


import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SettingsPanel from '@/components/SettingsPanel';
import Algebrite from 'algebrite';
import { useParams, useNavigate } from 'react-router-dom';

const ProgrammableCalculatorPage: React.FC = () => {
  const { mode: routeMode } = useParams<{ mode?: string }>();
  const navigate = useNavigate();

  const validModes = ['Evaluate', 'Simplify', 'Factor', 'Expand', 'Derivative', 'Integrate', 'Solve'] as const;
  type Mode = typeof validModes[number];

  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string>('');
  const [mode, setMode] = useState<Mode>('Evaluate');

  // Sync mode with route
  useEffect(() => {
    if (routeMode && validModes.includes(routeMode as Mode)) {
      setMode(routeMode as Mode);
    }
  }, [routeMode]);

  const handleCalculate = () => {
    try {
      let res = '';
      switch (mode) {
        case 'Evaluate':
          res = Algebrite.run(expression).toString();
          break;
        case 'Simplify':
          res = Algebrite.simplify(expression).toString();
          break;
        case 'Factor':
          res = Algebrite.factor(expression).toString();
          break;
        case 'Expand':
          res = Algebrite.expand(expression).toString();
          break;
        case 'Derivative':
          res = Algebrite.derivative(expression, 'x').toString();
          break;
        case 'Integrate':
          res = Algebrite.integral(expression, 'x').toString();
          break;
        case 'Solve':
          res = Algebrite.run(`roots(${expression})`).toString();
          break;
        default:
          res = 'Invalid mode';
      }
      setResult(res);
    } catch (err) {
      console.error(err);
      setResult('Error in calculation');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-muted/10 py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-foreground">
        Programmable / CAS Calculator
      </h1>

      {/* Mode Selector */}
      <div className="flex gap-4 mb-6 flex-wrap justify-center">
        {validModes.map((m) => (
          <Button
            key={m}
            className={`px-6 py-2 rounded-lg font-bold ${
              mode === m ? 'bg-primary text-white shadow-lg' : 'bg-card text-foreground'
            }`}
            onClick={() => {
              navigate(`/programmable-calculator/${m}`);
              setMode(m);
              setResult('');
            }}
          >
            {m}
          </Button>
        ))}
      </div>

      {/* Input Card */}
      <Card className="w-full max-w-2xl p-6 mb-6 bg-gradient-to-br from-card/80 to-card/50 border border-white/20 shadow-2xl space-y-4">
        <label className="text-lg font-semibold text-foreground mb-2 block">
          Enter Expression:
        </label>
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="e.g. 2*x^2 + 3*x - 5"
          className="w-full p-3 mb-4 rounded-lg border border-border bg-card text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <Button
          onClick={handleCalculate}
          className="w-full py-3 bg-gradient-to-r from-primary via-primary-glow to-accent text-primary-foreground font-bold rounded-xl shadow-lg hover:scale-105 transform transition"
        >
          Calculate
        </Button>

        {result && (
          <div className="mt-4 text-xl font-bold text-primary whitespace-pre-wrap">
            {result}
          </div>
        )}
      </Card>

      <SettingsPanel />
    </div>
  );
};

export default ProgrammableCalculatorPage;
