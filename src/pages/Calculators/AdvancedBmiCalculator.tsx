import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SettingsPanel from "@/components/SettingsPanel";
import { useTheme } from "@/components/ThemeProvider";

const Modern3DBMICalculator: React.FC = () => {
  const { theme, themeColor } = useTheme();

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [unit, setUnit] = useState("metric");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [needleAngle, setNeedleAngle] = useState(0);
  const [animatedAngle, setAnimatedAngle] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const gaugeRef = useRef<SVGSVGElement>(null);

  const colorMap: Record<string, string> = {
    blue: "#3b82f6",
    purple: "#A855F7",
    green: "#10B981",
    orange: "#F97316",
    red: "#EF4444",
  };

  const calculateBMI = async () => {
    if (!weight || !height) return;
    setIsCalculating(true);
    setShowResult(false);

    await new Promise((r) => setTimeout(r, 800)); // dramatic effect

    let bmiValue: number;
    if (unit === "metric") {
      const heightInM = parseFloat(height) / 100;
      bmiValue = parseFloat(weight) / (heightInM * heightInM);
    } else {
      bmiValue = (parseFloat(weight) * 703) / (parseFloat(height) * parseFloat(height));
    }

    const roundedBmi = parseFloat(bmiValue.toFixed(2));
    setBmi(roundedBmi);

    if (bmiValue < 18.5) setCategory("Underweight");
    else if (bmiValue < 25) setCategory("Normal weight");
    else if (bmiValue < 30) setCategory("Overweight");
    else setCategory("Obese");

    const angle = Math.min((roundedBmi / 40) * 180 - 90, 90);
    setNeedleAngle(angle);

    setIsCalculating(false);
    setTimeout(() => setShowResult(true), 200);
  };

  // Animate needle smoothly
  useEffect(() => {
    if (needleAngle === 0) return;
    let frame: number;
    const step = () => {
      setAnimatedAngle((prev) => {
        if (Math.abs(prev - needleAngle) < 0.5) return needleAngle;
        return prev + (needleAngle - prev) * 0.08;
      });
      frame = requestAnimationFrame(step);
    };
    step();
    return () => cancelAnimationFrame(frame);
  }, [needleAngle]);

  const getCategoryColor = () => {
    if (!bmi) return colorMap[themeColor];
    if (bmi < 18.5) return colorMap.blue;
    if (bmi < 25) return colorMap.green;
    if (bmi < 30) return colorMap.orange;
    return colorMap.red;
  };

  const getBgColor = () => (theme === "dark" ? "bg-gray-900" : "bg-gray-50");
  const getTextColor = () => (theme === "dark" ? "text-white" : "text-gray-900");
  const getPlaceholderColor = () => (theme === "dark" ? "placeholder-gray-300" : "placeholder-gray-500");
  const getCardBg = () =>
    theme === "dark" ? "bg-gray-800/60 backdrop-blur-md" : "bg-white/60 backdrop-blur-md";

  const getCategoryGradient = () => {
    if (!bmi) return `from-${themeColor}-500 to-${themeColor}-700`;
    if (bmi < 18.5) return "from-blue-500 to-cyan-500";
    if (bmi < 25) return "from-green-500 to-emerald-500";
    if (bmi < 30) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  return (
    <div className={`${getBgColor()} min-h-screen relative overflow-hidden`}>
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob bg-purple-500"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 bg-yellow-500"></div>
        <div className="absolute top-40 left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 bg-pink-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Settings Panel */}
      <SettingsPanel />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-black ${getTextColor()}`}>
            BMI
          </h1>
          <p className={`text-lg sm:text-xl ${getTextColor()}`}>
            Ultra-modern 3D BMI Calculator
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Input Card */}
          <Card className={`${getCardBg()} border border-white/20 shadow-2xl rounded-3xl p-6`}>
            <div className="space-y-6">
              {/* Unit Selector */}
              <div className="flex gap-2">
                {["metric", "imperial"].map((u) => (
                  <Button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`flex-1 ${
                      unit === u
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : getTextColor()
                    }`}
                  >
                    {u === "metric" ? "Metric (kg/cm)" : "Imperial (lb/in)"}
                  </Button>
                ))}
              </div>

              {/* Weight/Height Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={unit === "metric" ? "Weight (kg)" : "Weight (lb)"}
                  className={`w-full rounded-xl px-4 py-3 ${getCardBg()} border border-white/20 ${getTextColor()} ${getPlaceholderColor()}`}
                />
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={unit === "metric" ? "Height (cm)" : "Height (inches)"}
                  className={`w-full rounded-xl px-4 py-3 ${getCardBg()} border border-white/20 ${getTextColor()} ${getPlaceholderColor()}`}
                />
              </div>

              {/* Age/Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Age (optional)"
                  className={`w-full rounded-xl px-4 py-3 ${getCardBg()} border border-white/20 ${getTextColor()} ${getPlaceholderColor()}`}
                />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`w-full rounded-xl px-4 py-3 ${getCardBg()} border border-white/20 ${getTextColor()}`}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <Button
                onClick={calculateBMI}
                disabled={isCalculating || !weight || !height}
                className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600`}
              >
                {isCalculating ? "Calculating..." : "Calculate BMI"}
              </Button>
            </div>
          </Card>

          {/* Result Card */}
          <Card
            className={`${getCardBg()} border border-white/20 shadow-2xl rounded-3xl p-6 transition-all duration-1000 ${
              showResult ? "opacity-100 scale-100" : "opacity-70 scale-95"
            }`}
          >
            {bmi ? (
              <div className="text-center space-y-6">
                <div
                  className={`text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r ${getCategoryGradient()}`}
                >
                  {bmi}
                </div>
                <div className={`text-xl font-bold ${getTextColor()}`}>{category}</div>

                {/* Gauge */}
                <div className="relative mx-auto w-64 h-64">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                      <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="25%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>

                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="12"
                      strokeDasharray="440"
                      transform="rotate(-90 100 100)"
                    />

                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="url(#gaugeGradient)"
                      strokeWidth="12"
                      strokeDasharray={`${(Math.min(bmi, 40) / 40) * 440} 440`}
                      strokeLinecap="round"
                      transform="rotate(-90 100 100)"
                    />

                    <line
                      x1="100"
                      y1="100"
                      x2={100 + 60 * Math.cos((animatedAngle * Math.PI) / 180)}
                      y2={100 + 60 * Math.sin((animatedAngle * Math.PI) / 180)}
                      stroke={getCategoryColor()}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    <circle cx="100" cy="100" r="6" fill={getCategoryColor()} />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-16">
                Enter your details to calculate BMI
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Modern3DBMICalculator;
