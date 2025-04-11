// name-generator.ts
import { firstParts, secondParts } from "./constants";

export interface GeneratorParams {
  A: number;             // Multiplier
  C: number;             // Increment
  M: number;             // Modulus
  entropyWeight: number; // Entropy weight as a multiplier (e.g. 1.0 = 100%)
}

// Global seed value. (You may want to reset this before each generation.)
let seed = Date.now();

/**
 * Advanced pseudo-random number generator using LCG with additional entropy.
 */
export function advancedRandom(max: number, params: GeneratorParams): number {
  const { A, C, M, entropyWeight } = params;
  // Get additional entropy from performance timing if available.
  const timeEntropy =
    (typeof performance !== "undefined" ? performance.now() * 1000 : Date.now()) *
    entropyWeight;
  
  // Update seed using the LCG formula.
  seed = (A * seed + C + Math.floor(timeEntropy)) % M;
  
  const hash = seed.toString(16);
  const secondaryEntropy = hash
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const combined = (seed + secondaryEntropy + timeEntropy) % M;
  
  // Return a normalized random number in [0, max).
  return Math.floor(combined % max);
}

/**
 * Helper function that applies a filtering condition to candidate indices.
 * The candidate pool (array of indices) is filtered by applying the passed filter function,
 * and a message is appended to the debugLog showing before/after counts.
 */
function applyCondition(
  conditionName: string,
  candidates: number[],
  filterFn: (firstWord: string, candidate: string) => boolean,
  firstWord: string,
  candidateWords: string[],
  debugLog: string[]
): number[] {
  const before = candidates.length;
  const filtered = candidates.filter((idx) => filterFn(firstWord, candidateWords[idx]));
  debugLog.push(`${conditionName}: filtered candidates from ${before} to ${filtered.length}.`);
  return filtered;
}

/* ================================
   Filtering Conditions (Candidates)
   ================================ */

/** 2. Explicit Consistency Rule */
function conditionExplicitConsistency(firstWord: string, candidate: string): boolean {
  const explicitTerms = ["fuck", "shit", "damn", "bitch", "ass"];
  const firstIsExplicit = explicitTerms.some((term) => firstWord.toLowerCase().includes(term));
  return firstIsExplicit
    ? explicitTerms.some((term) => candidate.toLowerCase().includes(term))
    : !explicitTerms.some((term) => candidate.toLowerCase().includes(term));
}

/** 6. Nostalgia & Retro References */
function conditionNostalgiaAndRetroReferences(firstWord: string, candidate: string): boolean {
  const retroKeywords = ["vintage", "retro"];
  const nostalgiaKeywords = ["arcade", "samurai", "grunge"];
  const isRetro = retroKeywords.some((kw) => firstWord.toLowerCase().includes(kw));
  return !isRetro || nostalgiaKeywords.some((kw) => candidate.toLowerCase().includes(kw));
}

/** 7. Tech-Infused Mythology */
function conditionTechInfusedMythology(firstWord: string, candidate: string): boolean {
  const techKeywords = ["quantum", "cyber", "algorithmic", "digital"];
  const mythKeywords = ["dragon", "phoenix", "oracle", "wizard"];
  const isTech = techKeywords.some((kw) => firstWord.toLowerCase().includes(kw));
  return !isTech || mythKeywords.some((kw) => candidate.toLowerCase().includes(kw));
}

/** 8. Subculture & Counter-Culture Twist */
function conditionSubcultureAndCounterCultureTwist(firstWord: string, candidate: string): boolean {
  const mainstreamKeywords = ["digital", "cyber"];
  const subcultureKeywords = ["punk", "grunge", "anarchist"];
  const isMainstream = mainstreamKeywords.some((kw) => firstWord.toLowerCase().includes(kw));
  return !isMainstream || subcultureKeywords.some((kw) => candidate.toLowerCase().includes(kw));
}

/** 15. Unexpected Genre-Mashups */
function conditionUnexpectedGenreMashups(firstWord: string, candidate: string): boolean {
  const sciFiKeywords = ["cyber", "quantum", "digital"];
  const contrastingKeywords = ["punk", "rebel"];
  const isSciFi = sciFiKeywords.some((kw) => firstWord.toLowerCase().includes(kw));
  return !isSciFi || contrastingKeywords.some((kw) => candidate.toLowerCase().includes(kw));
}

/** 16. Hyperbolic Adjective Amplification */
function conditionHyperbolicAdjectiveAmplification(firstWord: string, candidate: string): boolean {
  const extremeWords = ["intergalactic", "colossal", "epic"];
  const firstIsExtreme = extremeWords.some((word) => firstWord.toLowerCase().includes(word));
  return !firstIsExtreme || extremeWords.some((word) => candidate.toLowerCase().includes(word));
}

/** 17. Nerd-Rebel Hybridization */
function conditionNerdRebelHybridization(firstWord: string, candidate: string): boolean {
  const nerdTerms = ["algorithm", "quantum", "digital"];
  const rebelTerms = ["rogue", "outlaw", "anarchist"];
  const hasNerdElement = nerdTerms.some((term) => firstWord.toLowerCase().includes(term));
  return !hasNerdElement || rebelTerms.some((term) => candidate.toLowerCase().includes(term));
}

/** 21. Subcultural Archetype Alignment */
function conditionSubculturalArchetypeAlignment(firstWord: string, candidate: string): boolean {
  const subcultureKeywords = ["grunge", "punk", "boho"];
  const archetypes = ["skater", "anarchist", "vagrant"];
  const isSubculture = subcultureKeywords.some((kw) => firstWord.toLowerCase().includes(kw));
  return !isSubculture || archetypes.some((term) => candidate.toLowerCase().includes(term));
}

/** 28. Surreal Visual Imagery */
function conditionSurrealVisualImagery(firstWord: string, candidate: string): boolean {
  const surrealKeywords = ["ghost", "mirage", "phantom"];
  const required = ["vapor", "glitch"];
  const isSurreal = surrealKeywords.some((kw) => firstWord.toLowerCase().includes(kw));
  return !isSurreal || required.some((kw) => candidate.toLowerCase().includes(kw));
}

/** 29. Dynamic Cultural Juxtaposition */
function conditionDynamicCulturalJuxtaposition(firstWord: string, candidate: string): boolean {
  const refinedTerms = ["renaissance", "classical"];
  const lowbrowTerms = ["dank", "lame", "savage"];
  const isRefined = refinedTerms.some((kw) => firstWord.toLowerCase().includes(kw));
  return !isRefined || lowbrowTerms.some((kw) => candidate.toLowerCase().includes(kw));
}

/** 30. Synesthetic Pairing Principle */
function conditionSynestheticPairing(firstWord: string, candidate: string): boolean {
  const brightKeywords = ["luminous", "vibrant", "radiant"];
  const sensoryWords = ["crunch", "silk", "spice"];
  const isBright = brightKeywords.some((kw) => firstWord.toLowerCase().includes(kw));
  return !isBright || sensoryWords.some((kw) => candidate.toLowerCase().includes(kw));
}

// ==========
// cringe ideas for pre-processing
// ==========

// /** 1. Meme and Trend Alignment */
// function conditionMemeAlignment(firstWord: string, candidate: string): boolean {
//   const memeKeywords = ["glitch", "vapor", "neon", "cyber"];
//   const firstIsMeme = memeKeywords.some((kw) => firstWord.toLowerCase().includes(kw));
//   // If first is meme-inspired, require candidate to include a meme keyword.
//   return !firstIsMeme || memeKeywords.some((kw) => candidate.toLowerCase().includes(kw));
// }

// /** 3. Multi-Word Balance Requirement */
// function conditionMultiWordBalance(firstWord: string, candidate: string): boolean {
//   const firstIsMulti = firstWord.trim().includes(" ");
//   const candidateIsMulti = candidate.trim().includes(" ");
//   // If first is multi-word, favor candidates that are single-word.
//   return firstIsMulti ? !candidateIsMulti : true;
// }

// /** 4. Abstract vs. Down-to-Earth Contrast */
// function conditionAbstractVersusDownToEarth(firstWord: string, candidate: string): boolean {
//   const abstractKeywords = ["celestial", "nebular", "quantum", "singularity", "ethereal"];
//   const tangibleKeywords = ["clown", "ninja", "rogue", "guerilla"];
//   const isAbstract = abstractKeywords.some((kw) => firstWord.toLowerCase().includes(kw));
//   return !isAbstract || tangibleKeywords.some((kw) => candidate.toLowerCase().includes(kw));
// }

// /** 5. Rhythm and Sound Matching */
// function conditionRhythmAndSoundMatching(firstWord: string, candidate: string): boolean {
//   // Match by last character.
//   const lastChar = firstWord.trim().slice(-1).toLowerCase();
//   return candidate.trim().slice(-1).toLowerCase() === lastChar;
// }

// /** 10. Contextual Irony Injection */
// function conditionContextualIronyInjection(firstWord: string, candidate: string): boolean {
//   const seriousKeywords = ["divine", "celestial", "infinite"];
//   const ironicKeywords = ["clown", "dude", "goof"];
//   const isSerious = seriousKeywords.some((kw) => firstWord.toLowerCase().includes(kw));
//   return !isSerious || ironicKeywords.some((kw) => candidate.toLowerCase().includes(kw));
// }

// /** 18. Literal vs. Figurative Play */
// function conditionLiteralVsFigurativePlay(firstWord: string, candidate: string): boolean {
//   const figurativeKeywords = ["abstract", "surreal", "mystic"];
//   const literalKeywords = ["robot", "ninja", "samurai", "clown"];
//   const isFigurative = figurativeKeywords.some((kw) => firstWord.toLowerCase().includes(kw));
//   return !isFigurative || literalKeywords.some((kw) => candidate.toLowerCase().includes(kw));
// }

// /** 25. Phonetic Alliteration or Rhyme Priority */
// function conditionPhoneticAlliterationOrRhyme(firstWord: string, candidate: string): boolean {
//   const firstLetter = firstWord.trim()[0].toLowerCase();
//   return candidate.trim()[0].toLowerCase() === firstLetter;
// }

/* ================================
   cringe Post-Processing Modifiers
   ================================ */

/** 9. Randomized Mood Modifiers */
// function applyRandomizedMoodModifiers(name: string): string {
//   const modifiers = ["vibes", "no cap", "smh"];
//   if (Math.random() < 0.2) { // 20% chance
//     const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
//     return `${name} ${modifier}`;
//   }
//   return name;
// }

// /** 11. Emoji and Emoticon Inspirations */
// function applyEmojiEmoticonInspirations(name: string): string {
//   const emojis = ["😎", "😂", "🤖", "🔥"];
//   // If the name is short and playful, append an emoji.
//   if (name.length < 20 && Math.random() < 0.3) {
//     const emoji = emojis[Math.floor(Math.random() * emojis.length)];
//     return `${name} ${emoji}`;
//   }
//   return name;
// }

// /** 12. Internet Slang Integration */
// function applyInternetSlangIntegration(name: string): string {
//   const slangTerms = ["lit", "savage", "yeet"];
//   if (Math.random() < 0.25) {
//     const slang = slangTerms[Math.floor(Math.random() * slangTerms.length)];
//     return `${name} ${slang}`;
//   }
//   return name;
// }

// /** 13. Early Internet Nostalgia */
// function applyEarlyInternetNostalgia(name: string): string {
//   const retroAdditions = ["dial-up", "retro net"];
//   if (name.toLowerCase().includes("analog") && Math.random() < 0.3) {
//     const addition = retroAdditions[Math.floor(Math.random() * retroAdditions.length)];
//     return `${name} ${addition}`;
//   }
//   return name;
// }

// /** 14. Self-Awareness and Meta Commentary */
// function applySelfAwarenessMetaCommentary(name: string): string {
//   if (Math.random() < 0.15) {
//     return `${name} (error 404: identity not found)`;
//   }
//   return name;
// }

// /** 19. Word Count Variability */
// function applyWordCountVariability(name: string): string {
//   const extras = ["the", "of", "and"];
//   if (Math.random() < 0.2) {
//     const words = name.split(" ");
//     if (words.length === 2) {
//       const extra = extras[Math.floor(Math.random() * extras.length)];
//       return `${words[0]} ${extra} ${words[1]}`;
//     }
//   }
//   return name;
// }

// // /** 20. Hyper-Specific Pop Culture Reference */
// function applyHyperSpecificPopCultureReference(name: string): string {
//   const popCultureReference = "rickroll";
//   if (name.toLowerCase().includes("retro") && Math.random() < 0.2) {
//     return `${name} ${popCultureReference}`;
//   }
//   return name;
// }

// /** 22. Randomized Speed and Intensity Modifiers */
// function applyRandomizedSpeedAndIntensityModifiers(name: string): string {
//   const modifiers = ["turbo", "blitz", "flash"];
//   if (Math.random() < 0.2) {
//     const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
//     return `${modifier} ${name}`;
//   }
//   return name;
// }

// /** 23. Self-Deprecating Irony */
// function applySelfDeprecatingIrony(name: string): string {
//   const seriousTerms = ["divine", "celestial", "epic"];
//   if (seriousTerms.some(term => name.toLowerCase().includes(term))) {
//     return `wannabe ${name}`;
//   }
//   return name;
// }

// /** 24. Mock-Inspirational Phrasing */
// function applyMockInspirationalPhrasing(name: string): string {
//   const inspirations = ["epic", "zen"];
//   const mundane = ["cereal", "desk"];
//   if (Math.random() < 0.2) {
//     const insp = inspirations[Math.floor(Math.random() * inspirations.length)];
//     const mun = mundane[Math.floor(Math.random() * mundane.length)];
//     return `${insp} ${mun}`;
//   }
//   return name;
// }

// // /** 26. Seasonal or Temporal Tie-Ins */
// function applySeasonalOrTemporalTieIns(name: string, season: string = "winter"): string {
//   return `${name} (${season} special)`;
// }

// /** 27. Unexpected Punctuation Influence */
// function applyUnexpectedPunctuationInfluence(name: string): string {
//   if (Math.random() < 0.2) {
//     return name.replace(" ", " - ");
//   }
//   return name;
// }

/* ================================
   Main Generator Function with Debug Log
   ================================ */

/**
 * Generates a funny name using the candidate word lists and applies all 30 conditions,
 * logging each decision in a debug log.
 */
export function generateFunnyNameWithDebug(params: GeneratorParams): { name: string; debugLog: string } {
  let debugLog: string[] = [];
  
  // --- Step 1: Select the first word.
  const firstIndex = advancedRandom(firstParts.length, params);
  const firstWord = firstParts[firstIndex];
  debugLog.push(`Selected first word: "${firstWord}" at index ${firstIndex}.`);
  
  // Update the seed with extra entropy from the first word's length.
  seed = (seed + (firstWord?.length ?? 0) * 31) % params.M;
  debugLog.push(`Seed updated with first word length: ${seed}.`);
  
  // --- Step 2: Build the candidate pool for the second word.
  let candidateIndices = secondParts.map((_, idx) => idx);
  debugLog.push(`Initial candidate pool size for second word: ${candidateIndices.length}.`);
  
  // --- Step 3: Apply filtering conditions (1, 2, 3, 4, 5, 6, 7, 8, 10, 15, 16, 17, 18, 21, 25, 28, 29, 30).
  candidateIndices = applyCondition("2. Explicit Consistency", candidateIndices, conditionExplicitConsistency, firstWord || "", secondParts, debugLog);
  candidateIndices = applyCondition("6. Nostalgia & Retro References", candidateIndices, conditionNostalgiaAndRetroReferences, firstWord || "", secondParts, debugLog);
  candidateIndices = applyCondition("7. Tech-Infused Mythology", candidateIndices, conditionTechInfusedMythology, firstWord || "", secondParts, debugLog);
  candidateIndices = applyCondition("8. Subculture & Counter-Culture Twist", candidateIndices, conditionSubcultureAndCounterCultureTwist, firstWord || "", secondParts, debugLog);
  candidateIndices = applyCondition("15. Unexpected Genre-Mashups", candidateIndices, conditionUnexpectedGenreMashups, firstWord || "", secondParts, debugLog);
  candidateIndices = applyCondition("16. Hyperbolic Adjective Amplification", candidateIndices, conditionHyperbolicAdjectiveAmplification, firstWord || "", secondParts, debugLog);
  candidateIndices = applyCondition("17. Nerd-Rebel Hybridization", candidateIndices, conditionNerdRebelHybridization, firstWord || "", secondParts, debugLog);
  candidateIndices = applyCondition("21. Subcultural Archetype Alignment", candidateIndices, conditionSubculturalArchetypeAlignment, firstWord || "", secondParts, debugLog);
  candidateIndices = applyCondition("28. Surreal Visual Imagery", candidateIndices, conditionSurrealVisualImagery, firstWord || "", secondParts, debugLog);
  candidateIndices = applyCondition("29. Dynamic Cultural Juxtaposition", candidateIndices, conditionDynamicCulturalJuxtaposition, firstWord || "", secondParts, debugLog);
  candidateIndices = applyCondition("30. Synesthetic Pairing Principle", candidateIndices, conditionSynestheticPairing, firstWord || "", secondParts, debugLog);
  // candidateIndices = applyCondition("1. Meme & Trend Alignment", candidateIndices, conditionMemeAlignment, firstWord || "", secondParts, debugLog);
  // candidateIndices = applyCondition("3. Multi-Word Balance", candidateIndices, conditionMultiWordBalance, firstWord || "", secondParts, debugLog);
  // candidateIndices = applyCondition("4. Abstract vs. Down-to-Earth", candidateIndices, conditionAbstractVersusDownToEarth, firstWord || "", secondParts, debugLog);
  // candidateIndices = applyCondition("5. Rhythm & Sound Matching", candidateIndices, conditionRhythmAndSoundMatching, firstWord || "", secondParts, debugLog);
  // candidateIndices = applyCondition("10. Contextual Irony Injection", candidateIndices, conditionContextualIronyInjection, firstWord || "", secondParts, debugLog);
  // candidateIndices = applyCondition("18. Literal vs. Figurative Play", candidateIndices, conditionLiteralVsFigurativePlay, firstWord || "", secondParts, debugLog);
  // candidateIndices = applyCondition("25. Phonetic Alliteration/Rhyme", candidateIndices, conditionPhoneticAlliterationOrRhyme, firstWord || "", secondParts, debugLog);
  
  if (candidateIndices.length === 0) {
    candidateIndices = secondParts.map((_, idx) => idx);
    debugLog.push("Candidate pool empty after filtering; reverting to full candidate pool.");
  }
  debugLog.push(`Final candidate pool size after filtering: ${candidateIndices.length}.`);
  
  // --- Step 4: Randomly select a second word from the filtered candidate pool.
  const secondRandomIndex = advancedRandom(candidateIndices.length, params);
  const secondWord = secondParts[candidateIndices[secondRandomIndex]];
  debugLog.push(`Selected second word: "${secondWord}" at index ${candidateIndices[secondRandomIndex]}.`);
  
  // --- Step 5: Combine the selected words.
  let fullName = `${firstWord} ${secondWord}`;
  debugLog.push(`Combined base name: "${fullName}".`);
  
  // --- Step 6: Apply post-processing modifiers.
  // Order here is arbitrary—you can chain them differently as desired.
  const postProcessors: { name: string; fn: (s: string) => string }[] = [
    // { name: "9. Randomized Mood Modifiers", fn: applyRandomizedMoodModifiers },
    // { name: "11. Emoji/Emoticon Inspirations", fn: applyEmojiEmoticonInspirations },
    // { name: "12. Internet Slang Integration", fn: applyInternetSlangIntegration },
    // { name: "13. Early Internet Nostalgia", fn: applyEarlyInternetNostalgia },
    // { name: "14. Self-Awareness Meta Commentary", fn: applySelfAwarenessMetaCommentary },
    // { name: "19. Word Count Variability", fn: applyWordCountVariability },
    // { name: "20. Hyper-Specific Pop Culture Reference", fn: applyHyperSpecificPopCultureReference },
    // { name: "22. Randomized Speed and Intensity Modifiers", fn: applyRandomizedSpeedAndIntensityModifiers },
    // { name: "23. Self-Deprecating Irony", fn: applySelfDeprecatingIrony },
    // { name: "24. Mock-Inspirational Phrasing", fn: applyMockInspirationalPhrasing },
    // { name: "26. Seasonal/Temporal Tie-Ins", fn: (s: string) => applySeasonalOrTemporalTieIns(s, "winter") },
    // { name: "27. Unexpected Punctuation Influence", fn: applyUnexpectedPunctuationInfluence }
  ];
  
  for (const processor of postProcessors) {
    const prevName = fullName;
    fullName = processor.fn(fullName);
    if (fullName !== prevName) {
      debugLog.push(`${processor.name}: changed name to "${fullName}".`);
    }
  }
  
  debugLog.push(`Final generated name: "${fullName}".`);
  return { name: fullName, debugLog: debugLog.join("\n") };
}

/**
 * Optional: Reset the seed (call before each generation if desired).
 */
export function resetSeed(): void {
  seed = Date.now();
}
