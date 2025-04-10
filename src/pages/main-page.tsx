'use client';

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { generateFunnyNameWithDebug, resetSeed, GeneratorParams } from "@/lib/name-generator";
import { runStackedConfetti } from "@/lib/confetti";

export default function Home() {
  // State for generated name, debug log, and history.
  const [generatedName, setGeneratedName] = useState("Click to generate a name!");
  const [debugLog, setDebugLog] = useState("");
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [animationCount, setAnimationCount] = useState(0);

  // Generator parameters (adjustable via sliders in the popover).
  const [multiplier, setMultiplier] = useState<number>(1664525);
  const [increment, setIncrement] = useState<number>(1013904223);
  const [modulus, setModulus] = useState<number>(4294967296);
  const [entropyWeight, setEntropyWeight] = useState<number>(100); // as percent

  const handleReset = useCallback(() => {
    setGeneratedNames([]);
    setGeneratedName("Click to generate a name!");
    setDebugLog("");
    setAnimationCount(0);
  }, []);

  const handleGenerateName = useCallback(() => {
    if (animationCount >= 10) return;

    resetSeed();
    const params: GeneratorParams = {
      A: multiplier,
      C: increment,
      M: modulus,
      entropyWeight: entropyWeight / 100, // convert percentage to multiplier
    };

    const { name, debugLog: log } = generateFunnyNameWithDebug(params);
    setGeneratedName(name);
    setDebugLog(log);
    setGeneratedNames(prev => [name, ...prev].slice(0, 1000));
    setAnimationCount(prev => Math.min(prev + 1, 10));

    runStackedConfetti(() => {
      setAnimationCount(prev => Math.max(prev - 1, 0));
    });
  }, [animationCount, multiplier, increment, modulus, entropyWeight]);

  return (
    <div className="min-h-screen  py-12 px-4">
      <div className="max-w-screen mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <h1 className="p-3 text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
          Aesthetic Generator
        </h1>
        <p className="text-lg font-medium text-gray-900">{generatedName}</p>
        <div className="p-8 flex" id="main-content">
          <div id="left" className="space-y-6">

            {/* Settings popover for adjustable parameters */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300">
                  Settings
                </Button>
              </PopoverTrigger>
              <PopoverContent align="center" className="w-80 p-4">
                <div className="space-y-4">
                  {/* Multiplier (A) Slider */}
                  <label className="block text-sm font-medium text-gray-700">
                    Multiplier (A): {multiplier}
                    <input
                      type="range"
                      min="1"
                      max="20000000"
                      step="1"
                      value={multiplier}
                      onChange={(e) => setMultiplier(Number(e.target.value))}
                      className="w-full mt-1"
                    />
                    <span className="text-gray-500 text-xs">
                      Adjusts the multiplication factor in the LCG.
                    </span>
                  </label>

                  {/* Increment (C) Slider */}
                  <label className="block text-sm font-medium text-gray-700">
                    Increment (C): {increment}
                    <input
                      type="range"
                      min="1"
                      max="5000000000"
                      step="1"
                      value={increment}
                      onChange={(e) => setIncrement(Number(e.target.value))}
                      className="w-full mt-1"
                    />
                    <span className="text-gray-500 text-xs">
                      Modifies the additive constant in the LCG.
                    </span>
                  </label>

                  {/* Modulus (M) Slider */}
                  <label className="block text-sm font-medium text-gray-700">
                    Modulus (M): {modulus}
                    <input
                      type="range"
                      min="2"
                      max="10000000000"
                      step="1"
                      value={modulus}
                      onChange={(e) => setModulus(Number(e.target.value))}
                      className="w-full mt-1"
                    />
                    <span className="text-gray-500 text-xs">
                      Sets the wrapping value for the LCG (typically a power of two).
                    </span>
                  </label>

                  {/* Entropy Weight Slider */}
                  <label className="block text-sm font-medium text-gray-700">
                    Entropy Weight: {entropyWeight}%
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={entropyWeight}
                      onChange={(e) => setEntropyWeight(Number(e.target.value))}
                      className="w-full mt-1"
                    />
                    <span className="text-gray-500 text-xs">
                      Controls how much performance/timing entropy is incorporated.
                    </span>
                  </label>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              onClick={handleGenerateName}
              disabled={animationCount >= 10}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              {animationCount >= 10 ? "Animation busy..." : "Generate Name"}
            </Button>

            <div id="generated-names" className="border-t border-gray-100">
              <div className="p-6 space-y-3">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Generated Names ({generatedNames.length}/1000)
                  {generatedNames.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Clear List
                    </Button>
                  )}
                </h2>
                {generatedNames.length > 0 ? (
                  <ul className="space-y-2 max-h-96 overflow-y-auto">
                    {generatedNames.map((name, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 bg-gray-50 rounded-lg text-gray-700 font-medium"
                      >
                        <span className="text-gray-400 mr-2">#{generatedNames.length - index}.</span>
                        {name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center italic">
                    Generated names will appear here
                  </p>
                )}
              </div>
            </div>
          </div>
          <div id="right">
            <div className="text-center">
              {debugLog && (
                <pre className="mt-4 p-2 bg-gray-100 text-xs text-left whitespace-pre-wrap border rounded">
                  {debugLog}
                </pre>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
