/**
 * Script to generate Portuguese word lists from IME-USP dictionary
 * Source: https://www.ime.usp.br/~pf/dicios/br-utf8.txt
 * License: CC BY
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const URL = 'https://www.ime.usp.br/~pf/dicios/br-utf8.txt';
const OUTPUT_DIR = path.join(__dirname, '../src/data/words/pt');

// Portuguese valid characters (including accents)
const validChars = /^[a-záàâãéêíóôõúç]+$/;

console.log('Fetching Portuguese dictionary from IME-USP...');

https.get(URL, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Downloaded ${data.length} bytes`);

    const words = data.split('\n')
      .map(w => w.trim().toLowerCase())
      .filter(w => validChars.test(w));

    console.log(`Found ${words.length} valid Portuguese words`);

    // Group by length
    const byLength = {};
    for (let len = 4; len <= 10; len++) {
      byLength[len] = [...new Set(words.filter(w => w.length === len))].sort();
    }

    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Generate TypeScript files for each length
    for (const [len, wordList] of Object.entries(byLength)) {
      const content = `/**
 * Portuguese ${len}-letter word list
 * Source: IME-USP (https://www.ime.usp.br/~pf/dicios/)
 * License: CC BY
 */
export const WORD_LIST_PT_${len}: string[] = [
${wordList.map(w => `  "${w}",`).join('\n')}
];

export const WORD_SET_PT_${len}: Set<string> = new Set(WORD_LIST_PT_${len});
`;
      fs.writeFileSync(path.join(OUTPUT_DIR, `words${len}.ts`), content);
      console.log(`Created words${len}.ts with ${wordList.length} words`);
    }

    console.log('Done!');
  });
}).on('error', (err) => {
  console.error('Error fetching dictionary:', err.message);
  process.exit(1);
});
