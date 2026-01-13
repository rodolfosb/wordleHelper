import './style.css';
import { WORD_LIST } from './data/words';
import { createEmptyConstraints, addGuessToConstraints } from './logic/constraints';
import { filterWords } from './logic/filter';
import type { GuessFeedback } from './types';

// Log word list loaded
console.log(`Wordle Helper loaded with ${WORD_LIST.length} words`);

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

// Basic app setup
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Wordle Helper</h1>
    <p>Word list loaded: ${WORD_LIST.length} words</p>
  </div>
`;
