const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'mocks', 'contacts.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix the corrupted file by restoring proper structure
// Add ownerId after createdBy for all entries that don't have it

const lines = content.split('\n');
const output = [];
let i = 0;

while (i < lines.length) {
  const line = lines[i];
  output.push(line);
  
  // Look for createdBy lines and add ownerId if next line isn't already ownerId
  if (line.trim().match(/^createdBy:/) && !lines[i+1]?.trim().match(/^ownerId:/)) {
    // Extract the user ID from createdBy
    const match = line.match(/createdBy:\s*'([^']+)'/);
    if (match) {
      const userId = match[1];
      output.push(`    ownerId: '${userId}',`);
    }
  }
  
  i++;
}

fs.writeFileSync(filePath, output.join('\n'), 'utf8');
console.log('File fixed successfully');
