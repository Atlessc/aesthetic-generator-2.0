'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { generateFunnyNameWithDebug, resetSeed, GeneratorParams } from "@/lib/name-generator";
import { Copy, Check } from "lucide-react";
import { 
  // runStackedConfetti,
  createNeonAnimation
 } from "@/lib/confetti";
import { NeonText } from "@/components/neon-text";

export default function Home() {
  // State for generated name, debug log, and history.
  const [generatedName, setGeneratedName] = useState("Click to generate a name!");
  const [debugLog, setDebugLog] = useState("");
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  // const [animationCount, setAnimationCount] = useState(0);
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});
  const nameRef = useRef<HTMLParagraphElement>(null);

  // Generator parameters (adjustable via sliders in the popover).
  const [multiplier, setMultiplier] = useState<number>(1664525);
  const [increment, setIncrement] = useState<number>(1013904223);
  const [modulus, setModulus] = useState<number>(4294967296);
  const [entropyWeight, setEntropyWeight] = useState<number>(100); // as percent

  const handleReset = useCallback(() => {
    setGeneratedNames([]);
    setGeneratedName("Click to generate a name!");
    setDebugLog("");
    // setAnimationCount(0);
  }, []);

  const handleCopy = useCallback((text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({
      ...prev,
      [index !== undefined ? `list-${index}` : 'current']: true
    }));
    setTimeout(() => {
      setCopiedStates(prev => ({
        ...prev,
        [index !== undefined ? `list-${index}` : 'current']: false
      }));
    }, 2000);
  }, []);

  const handleGenerateName = useCallback(() => {
    // if (animationCount >= 10) return;



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
    // setAnimationCount(prev => Math.min(prev + 1, 10));

    // runStackedConfetti(() => {
    //   setAnimationCount(prev => Math.max(prev - 1, 0));
    // });
    if (nameRef.current) {
      createNeonAnimation(nameRef.current);
    }
  }, [
    // animationCount, 
    nameRef,
    multiplier, 
    increment, 
    modulus, 
    entropyWeight]);

  return (
    <div className="min-h-screen py-6 px-4 ">
        <h1 className="p-3 lg:text-6xl sm:text-3xl font-bold text-center mb-3 ">
          Aesthetic Generator
        </h1>
      <div className="max-w-screen mx-auto bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        {/* <h1 className="p-3 text-5xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
          Aesthetic Generator
        </h1> */}
        <p ref={nameRef} className="lg:text-4xl sm:text-2xl font-extrabold text-gray-100 text-center mt-6">{generatedName && <NeonText text={generatedName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} />}
          &nbsp; &nbsp;
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleCopy(generatedName)}
              >
                {copiedStates['current'] ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button></p>
        <div className="p-8 md:max-2xl:flex sm:flex-col justify-between" id="main-content">
          <div id="left" className="space-y-6 w-full">

            {/* Settings popover for adjustable parameters */}
            <div className="w-[300px] mx-auto flex-col ">

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
              // disabled={animationCount >= 10}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 mt-4"
              >
              {/* {animationCount >= 10 ? "Animation busy..." : "Generate Name"} */}
              Generate Name
            </Button>

              </div>
            <div id="generated-names" className="border-t border-gray-100 max-w-[600px] mx-auto">
              <div className="p-6 space-y-3">
                <h2 className="text-lg font-semibold text-gray-300 mb-4">
                  Generated Names ({generatedNames.length}/1000)
                  {generatedNames.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50 bg-slate-800"
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
          {/* <div id="right" className='w-full flex flex-col items-center'>
            <div className="text-center">
              {debugLog && (
                <pre className="p-2 bg-slate-900 text-xs text-left whitespace-pre-wrap border rounded w-full h-full">
                  {debugLog}
                </pre>
              )}
            </div>
          </div> */}

        </div>
      </div>
    </div>
  );
}
