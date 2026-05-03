const fs = require('fs');
const path = require('path');
const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(f => {
  const fp = path.join(dir, f);
  let lines = fs.readFileSync(fp, 'utf-8').split('\n');
  let updated = false;

  lines = lines.map(line => {
    if (line.includes('<input') || line.includes('<textarea')) {
      // Find className="
      return line.replace(/className="([^"]+)"/, (match, cls) => {
        if (!cls.includes('text-gray-900') && !cls.includes('text-white') && !cls.includes('text-green-400') && !cls.includes('hidden')) {
          updated = true;
          return `className="${cls} text-gray-900"`;
        }
        return match;
      });
    }
    return line;
  });

  if (updated) {
    fs.writeFileSync(fp, lines.join('\n'));
    console.log('Updated ' + f);
  }
});
