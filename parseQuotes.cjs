const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('quotes_raw.txt', 'utf-8');
const lines = content.split('\n').filter(line => line.trim().length > 0);

const quotes = lines.map(line => {
  // Regex to match optionally a number like "1. ", then the quote in quotes, then mdash, then author
  // e.g. '21. "Growth is painful..." — Mandy Hale'
  // or '"Success is not final..." — Winston Churchill'
  
  const match = line.match(/^(?:\d+\.\s*)?"(.*?)"\s*—\s*(.*)$/);
  if (match) {
    return {
      text: match[1],
      author: match[2]
    };
  }
  return null;
}).filter(q => q !== null);

const tsContent = `export const quotes = ${JSON.stringify(quotes, null, 2)};\n`;

const dir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'quotes.ts'), tsContent);

console.log(`Parsed ${quotes.length} quotes.`);
