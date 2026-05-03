const fs = require('fs');
const path = require('path');
const dir = 'src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(f => {
  const fp = path.join(dir, f);
  let content = fs.readFileSync(fp, 'utf-8');
  let updated = false;

  // Since React onChange has => which breaks [^>], let's match the tag in a safer way.
  // Find all <input ...> and <textarea ...> tags.
  content = content.replace(/<(input|textarea)([\s\S]*?)>/g, (fullTag, tag, innerAttrs) => {
    if (innerAttrs.includes('className="')) {
      return fullTag.replace(/className="([^"]+)"/, (match, cls) => {
        if (!cls.includes('text-gray-900') && !cls.includes('text-white') && !cls.includes('text-green-400') && !cls.includes('hidden')) {
          updated = true;
          return `className="${cls} text-gray-900"`;
        }
        return match;
      });
    }
    return fullTag;
  });

  if (updated) {
    fs.writeFileSync(fp, content);
    console.log('Updated ' + f);
  }
});
