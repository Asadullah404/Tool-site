// import React, { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import SettingsPanel from "@/components/SettingsPanel";
// import Plot from "react-plotly.js";
// import Algebrite from "algebrite";

// const GraphingCalculatorPage: React.FC = () => {
//   const [equation, setEquation] = useState("x^2");
//   const [data, setData] = useState<{ x: number[]; y: number[] } | null>(null);

//   const handlePlot = () => {
//     try {
//       const xValues = Array.from({ length: 200 }, (_, i) => i / 10 - 10); // range -10..10
//       const yValues = xValues.map((x) => {
//         try {
//           // Replace x in the equation with the numeric value
//           const expr = equation.replace(/x/g, `(${x})`);
//           const result = Algebrite.run(expr); // evaluate with Algebrite
//           return Number(result); // convert to number
//         } catch {
//           return NaN; // handle invalid eval
//         }
//       });

//       if (yValues.every((val) => isNaN(val))) {
//         alert("Invalid equation! Use valid math expressions.");
//         return;
//       }

//       setData({ x: xValues, y: yValues });
//     } catch (err) {
//       alert("Something went wrong with parsing!");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-muted/10 py-12 px-4">
//       <h1 className="text-4xl font-bold mb-8 text-foreground">
//         Graphing Calculator
//       </h1>

//       <Card className="w-full max-w-2xl p-6 mb-6 bg-gradient-to-br from-card/80 to-card/50 border border-white/20 shadow-2xl">
//         <label className="text-lg font-semibold text-foreground mb-2 block">
//           Enter equation (use variable x):
//         </label>
//         <input
//           type="text"
//           value={equation}
//           onChange={(e) => setEquation(e.target.value)}
//           placeholder="e.g. x^2, sin(x), x^3 - 2*x"
//           className="w-full p-3 mb-4 rounded-lg border border-border bg-card text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
//         />
//         <Button
//           onClick={handlePlot}
//           className="w-full py-3 bg-gradient-to-r from-primary via-primary-glow to-accent text-primary-foreground font-bold rounded-xl shadow-lg hover:scale-105 transform transition"
//         >
//           Plot Graph
//         </Button>
//       </Card>

//       {data && (
//         <Card className="w-full max-w-3xl p-6 mb-12 bg-gradient-to-br from-card/80 to-card/50 border border-white/20 shadow-2xl">
//           <Plot
//             data={[
//               {
//                 x: data.x,
//                 y: data.y,
//                 type: "scatter",
//                 mode: "lines",
//                 marker: { color: "#6366F1" },
//               },
//             ]}
//             layout={{
//               title: `y = ${equation}`,
//               xaxis: { title: "x" },
//               yaxis: { title: "y" },
//               width: 700,
//               height: 450,
//               plot_bgcolor: "rgba(255,255,255,0)",
//               paper_bgcolor: "rgba(255,255,255,0)",
//             }}
//           />
//         </Card>
//       )}

//       <SettingsPanel />
//     </div>
//   );
// };

// export default GraphingCalculatorPage;


import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SettingsPanel from "@/components/SettingsPanel";
import Plot from "react-plotly.js";

// Dynamic Algebrite import
let Algebrite: typeof import('algebrite') | null = null;
async function getAlgebrite() {
  if (!Algebrite) {
    const module = await import('algebrite');
    Algebrite = module.default;
  }
  return Algebrite;
}

const GraphingCalculatorPage: React.FC = () => {
  const [equation, setEquation] = useState("x^2");
  const [data, setData] = useState<{ x:number[]; y:number[] } | null>(null);

  const handlePlot = async () => {
    try {
      const Algebrite = await getAlgebrite();
      const xValues = Array.from({length:200}, (_,i)=>i/10-10);
      const yValues = xValues.map(x=>{
        try{
          const expr = equation.replace(/x/g, `(${x})`);
          const res = Algebrite.run(expr);
          return Number(res);
        }catch{
          return NaN;
        }
      });

      if(yValues.every(v=>isNaN(v))){
        alert("Invalid equation!");
        return;
      }

      setData({x:xValues, y:yValues});
    } catch(err){
      alert("Error parsing equation!");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-muted/10 py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Graphing Calculator</h1>

      <Card className="w-full max-w-2xl p-6 mb-6 bg-gradient-to-br from-card/80 to-card/50 border border-white/20 shadow-2xl">
        <label className="text-lg font-semibold text-foreground mb-2 block">Enter equation (use x):</label>
        <input
          type="text"
          value={equation}
          onChange={(e)=>setEquation(e.target.value)}
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
            data={[{x:data.x,y:data.y,type:"scatter",mode:"lines",marker:{color:"#6366F1"}}]}
            layout={{title:`y = ${equation}`,xaxis:{title:"x"},yaxis:{title:"y"},width:700,height:450,plot_bgcolor:"rgba(255,255,255,0)",paper_bgcolor:"rgba(255,255,255,0)"}}
          />
        </Card>
      )}

      <SettingsPanel />
    </div>
  );
};

export default GraphingCalculatorPage;
