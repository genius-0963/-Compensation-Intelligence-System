const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-gray-50/30': 'bg-[#0B1020]',
  'border-gray-50': 'border-border',
  'divide-gray-50': 'divide-border',
  
  'hover:bg-blue-50/30': 'hover:bg-[#1E3A8A]/30',
  'bg-blue-50/50': 'bg-[#1E3A8A]/20',
  'border-blue-50': 'border-[#2563EB]/30',
  
  'bg-violet-50/50': 'bg-violet-900/20',
  'border-violet-50': 'border-violet-500/30',
  
  'hover:bg-blue-50': 'hover:bg-[#1E3A8A]/50',
  
  'text-gray-900': 'text-white',
  'text-gray-800': 'text-slate-200',
  'bg-gray-900': 'bg-[#1F2937]',
  'hover:bg-gray-800': 'hover:bg-[#111827]',
  'bg-slate-900': 'bg-[#0B1020]',
};

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Sort keys by length descending to prevent partial replacements
    const sortedKeys = Object.keys(replacements).sort((a, b) => b.length - a.length);

    for (const oldClass of sortedKeys) {
      const newClass = replacements[oldClass];
      const regex = new RegExp(oldClass.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '(?=[\\s`"\'])', 'g');
      content = content.replace(regex, newClass);
    }
    
    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
