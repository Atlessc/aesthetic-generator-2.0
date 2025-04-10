'use client';

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { generateFunnyName } from "@/lib/name-generator";
import { runStackedConfetti } from "@/lib/confetti";

export default function Home() {
  const [generatedName, setGeneratedName] = useState("Click to generate a name!");
  const [animationCount, setAnimationCount] = useState(0);
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);

  const handleReset = useCallback(() => {
    setGeneratedNames([]);
    setGeneratedName("Click to generate a name!");
    setAnimationCount(0);
  }, []);

  const handleGenerateName = useCallback(() => {
    // Use the current animationCount in the logic.
    if (animationCount >= 10) return;

    const newName = generateFunnyName();
    setGeneratedName(newName);
    setGeneratedNames(prev => [newName, ...prev].slice(0, 1000));

    // Increase the animation count by one, up to a maximum value
    setAnimationCount(prev => Math.min(prev + 1, 10));

    // Launch the confetti, then decrease the animation count when complete
    runStackedConfetti(() => {
      setAnimationCount(prev => Math.max(prev - 1, 0));
    });
  }, [animationCount]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Aesthetic Generator
          </h1>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">
                {generatedName}
              </p>
            </div>
            <Button
              onClick={handleGenerateName}
              disabled={animationCount >= 10}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              {animationCount >= 10 ? "Animation busy..." : "Generate Name"}
            </Button>
          </div>
        </div>
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
    </div>
  );
}
