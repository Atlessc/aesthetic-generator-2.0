import { firstParts, secondParts } from "./constants";

// Custom Linear Congruential Generator parameters
const M = 4294967296; // 2^32
const A = 1664525;
const C = 1013904223;

let seed = Date.now();

// Advanced pseudo-random number generator using LCG with additional entropy
export function advancedRandom(max: number): number {
  // Get additional entropy from performance timing if available
  const timeEntropy = typeof performance !== 'undefined' 
    ? performance.now() * 1000 
    : Date.now();
  
  // Update seed using LCG formula
  seed = (A * seed + C + Math.floor(timeEntropy)) % M;
  
  // Apply additional transformations
  const hash = seed.toString(16);
  const secondaryEntropy = hash.split('').reduce((acc, char) => 
    acc + char.charCodeAt(0), 0);
  
  // Combine multiple sources of randomness
  const combined = (seed + secondaryEntropy + timeEntropy) % M;
  
  // Normalize to range
  return Math.floor(combined % max);
}

export function generateFunnyName(): string {
  const firstIndex = advancedRandom(firstParts.length);
  
  // Add more entropy by using the first selection
  seed = (seed + (firstParts[firstIndex]?.length ?? 0) * 31) % M;
  
  const secondIndex = advancedRandom(secondParts.length);
  
  return `${firstParts[firstIndex]} ${secondParts[secondIndex]}`;
}