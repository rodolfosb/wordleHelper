import './style.css';
import { WORD_LIST } from './data/words';
import { createEmptyConstraints, addGuessToConstraints } from './logic/constraints';
import { filterWords } from './logic/filter';
import { calculateLetterFrequencies, rankWordsByFrequency } from './logic/frequency';
import {
  simulateFeedback,
  calculateExpectedRemaining,
  calculateEntropy,
} from './logic/entropy';
import { rankWords } from './logic/ranking';
import type { GuessFeedback } from './types';

// Log word list loaded
console.log(`Wordle Helper loaded with ${WORD_LIST.length} words`);

// Verify Task 1: Letter frequency calculation
const frequencies = calculateLetterFrequencies(WORD_LIST);
const sortedFrequencies = [...frequencies.entries()].sort((a, b) => b[1] - a[1]);
console.log(
  'Top 5 most frequent letters:',
  sortedFrequencies.slice(0, 5).map(([letter, count]) => `${letter}: ${count}`)
);

// Verify Task 2: Word ranking by frequency
const rankedWords = rankWordsByFrequency(WORD_LIST.slice(0, 100), WORD_LIST);
console.log('Top 10 words by frequency (from first 100):', rankedWords.slice(0, 10));

// Manual verification: Test constraint engine
// Scenario: guess "CRANE" against target "APPLE"
// C = gray, R = gray, A = yellow (in word, wrong position), N = gray, E = yellow (in word, wrong position)
const testGuess: GuessFeedback = [
  { letter: 'c', position: 0, status: 'gray' },
  { letter: 'r', position: 1, status: 'gray' },
  { letter: 'a', position: 2, status: 'yellow' },
  { letter: 'n', position: 3, status: 'gray' },
  { letter: 'e', position: 4, status: 'yellow' },
];

const constraints = addGuessToConstraints(createEmptyConstraints(), testGuess);
const filteredWords = filterWords(WORD_LIST, constraints);

console.log('Test guess: CRANE against target APPLE');
console.log('Constraints:', {
  exactPositions: Object.fromEntries(constraints.exactPositions),
  requiredLetters: Object.fromEntries(
    Array.from(constraints.requiredLetters.entries()).map(([k, v]) => [k, Array.from(v)])
  ),
  excludedLetters: Array.from(constraints.excludedLetters),
});
console.log(`Filtered from ${WORD_LIST.length} to ${filteredWords.length} words`);
console.log('Sample filtered words:', filteredWords.slice(0, 10));

// Verify Task 1 (03-02): Feedback pattern simulation
console.log('\n=== Feedback Simulation Tests ===');
console.log('simulateFeedback("crane", "crane"):', simulateFeedback('crane', 'crane'));
console.log('simulateFeedback("crane", "apple"):', simulateFeedback('crane', 'apple'));
console.log('simulateFeedback("speed", "creep"):', simulateFeedback('speed', 'creep'));
console.log('simulateFeedback("speed", "eerie"):', simulateFeedback('speed', 'eerie'));
console.log('simulateFeedback("geese", "eerie"):', simulateFeedback('geese', 'eerie'));

// Verify Task 2 (03-02): Information gain scoring
console.log('\n=== Information Gain Tests ===');
// Test with a small word list
const testWords = [
  'apple',
  'ample',
  'maple',
  'grape',
  'drape',
  'shape',
  'shade',
  'blade',
  'blaze',
  'graze',
  'craze',
  'crane',
  'crate',
  'grate',
  'slate',
];
console.log(`Testing with ${testWords.length} words`);

// Compare entropy for different guesses
const testGuesses = ['crane', 'slate', 'audio', 'apple'];
for (const g of testGuesses) {
  const expectedRemaining = calculateExpectedRemaining(g, testWords);
  const entropy = calculateEntropy(g, testWords);
  console.log(
    `"${g}": expectedRemaining=${expectedRemaining.toFixed(2)}, entropy=${entropy.toFixed(3)} bits`
  );
}

// Verify Task 3 (03-02): Combined ranking
console.log('\n=== Combined Ranking Tests ===');

// Test 1: Large word list (>500) - should use frequency only
const startLarge = performance.now();
const largeRanked = rankWords(WORD_LIST.slice(0, 100), WORD_LIST);
const timeLarge = performance.now() - startLarge;
console.log(
  `Large list (${WORD_LIST.length} words): Top 5 by frequency only (${timeLarge.toFixed(1)}ms)`
);
largeRanked.slice(0, 5).forEach((w) => {
  console.log(
    `  ${w.word}: score=${w.score.toFixed(3)}, freq=${w.frequencyScore?.toFixed(3) ?? 'N/A'}`
  );
});

// Test 2: Small filtered list (<=500) - should use entropy + frequency
const smallList = testWords;
const startSmall = performance.now();
const smallRanked = rankWords(smallList, smallList);
const timeSmall = performance.now() - startSmall;
console.log(
  `\nSmall list (${smallList.length} words): Top 5 by entropy+frequency (${timeSmall.toFixed(1)}ms)`
);
smallRanked.slice(0, 5).forEach((w) => {
  console.log(
    `  ${w.word}: score=${w.score.toFixed(3)}, entropy=${w.entropyScore?.toFixed(3)}, freq=${w.frequencyScore?.toFixed(3)}`
  );
});

// Test 3: Force entropy on larger set (50 words from filtered list)
const mediumList = WORD_LIST.filter((w) => w.includes('a') && w.includes('e')).slice(0, 50);
const startMedium = performance.now();
const mediumRanked = rankWords(mediumList, mediumList, { useEntropy: true });
const timeMedium = performance.now() - startMedium;
console.log(
  `\nMedium list (${mediumList.length} words): Top 5 with forced entropy (${timeMedium.toFixed(1)}ms)`
);
mediumRanked.slice(0, 5).forEach((w) => {
  console.log(
    `  ${w.word}: score=${w.score.toFixed(3)}, entropy=${w.entropyScore?.toFixed(3)}, freq=${w.frequencyScore?.toFixed(3)}`
  );
});

// Basic app setup
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Wordle Helper</h1>
    <p>Word list loaded: ${WORD_LIST.length} words</p>
  </div>
`;
