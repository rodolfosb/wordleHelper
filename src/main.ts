import './style.css';
import { WORD_LIST } from './data/words';
import type { Constraints } from './types';

// Log word list loaded
console.log(`Wordle Helper loaded with ${WORD_LIST.length} words`);

// Type check: empty constraints (verifies types work)
const initialConstraints: Constraints = {
  exactPositions: new Map(),
  requiredLetters: new Map(),
  excludedLetters: new Set(),
};

console.log('Initial constraints:', initialConstraints);

// Basic app setup
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Wordle Helper</h1>
    <p>Word list loaded: ${WORD_LIST.length} words</p>
  </div>
`;
