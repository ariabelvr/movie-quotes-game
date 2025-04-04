const fs = require('fs');
const path = require('path');

// Read both JSON files
const existingQuotes = JSON.parse(fs.readFileSync(path.join(__dirname, 'new-quotes.json'), 'utf8'));
const newQuotes = JSON.parse(fs.readFileSync(path.join(__dirname, 'more-quotes.json'), 'utf8'));

// Combine the arrays
const combinedQuotes = [...existingQuotes, ...newQuotes];

// Write back to new-quotes.json
fs.writeFileSync(
    path.join(__dirname, 'new-quotes.json'),
    JSON.stringify(combinedQuotes, null, 2),
    'utf8'
);

console.log(`Successfully merged quotes. Total quotes: ${combinedQuotes.length}`); 