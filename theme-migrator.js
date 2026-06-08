const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-white': 'bg-card',
  'bg-slate-50': 'bg-[#0B1020]',
  'bg-gray-50': 'bg-[#0B1020]',
  'bg-gray-100': 'bg-[#111827]',
  'bg-slate-100': 'bg-[#111827]',
  
  'text-gray-900': 'text-white',
  'text-slate-900': 'text-white',
  'text-gray-800': 'text-white',
  'text-slate-800': 'text-white',
  
  'text-gray-600': 'text-slate-400',
  'text-slate-600': 'text-slate-400',
  'text-gray-500': 'text-slate-500',
  'text-slate-500': 'text-slate-500',
  
  'border-gray-100': 'border-border',
  'border-gray-200': 'border-border',
  'border-slate-100': 'border-border',
  'border-slate-200': 'border-border',
  
  'hover:bg-gray-50': 'hover:bg-[#172033]',
  'hover:bg-slate-50': 'hover:bg-[#172033]',
  'hover:bg-gray-100': 'hover:bg-[#111827]',
  
  'dark:bg-slate-900': '',
  'dark:bg-slate-800': '',
  'dark:bg-slate-900/60': '',
  'dark:bg-slate-800/40': '',
  'dark:text-white': '',
  'dark:text-slate-50': '',
  'dark:text-slate-400': '',
  'dark:text-blue-400': '',
  'dark:border-slate-700': '',
  'dark:border-slate-800': '',
  'dark:hover:bg-slate-900': '',
  'dark:hover:bg-slate-800': '',
  'dark:hover:text-slate-50': '',
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
    
    // Sort keys by length descending to prevent partial replacements (e.g. text-gray-900 before text-gray-9)
    const sortedKeys = Object.keys(replacements).sort((a, b) => b.length - a.length);

    for (const oldClass of sortedKeys) {
      const newClass = replacements[oldClass];
      const regex = new RegExp(oldClass.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '(?=[\\s`"\'])', 'g');
      content = content.replace(regex, newClass);
    }
    
    // Clean up duplicate spaces inside class strings
    content = content.replace(/className=(["`])(.*?)\1/g, (match, quote, classes) => {
      return `className=${quote}${classes.replace(/\s+/g, ' ').trim()}${quote}`;
    });

    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
