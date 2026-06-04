const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') {
        filelist.push(dirFile);
      } else {
        throw err;
      }
    }
  });
  return filelist;
};

const root = '/Users/subh/Documents/Compensation Intelligence System/compensation-intelligence/src';
const files = walkSync(root);

files.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.trim() === '') {
      if (file.endsWith('page.tsx')) {
        fs.writeFileSync(file, 'export default function Page() { return null; }\n');
        console.log('Fixed', file);
      } else if (file.endsWith('layout.tsx')) {
        fs.writeFileSync(file, 'export default function Layout({children}: {children: React.ReactNode}) { return <>{children}</>; }\n');
        console.log('Fixed', file);
      } else if (file.endsWith('route.ts')) {
        fs.writeFileSync(file, 'import { NextResponse } from "next/server"; export async function GET() { return NextResponse.json({ status: "ok" }); }\n');
        console.log('Fixed', file);
      } else if (file.includes('components')) {
        fs.writeFileSync(file, 'export default function Component() { return null; }\n');
        console.log('Fixed', file);
      } else {
        fs.writeFileSync(file, 'export {};\n');
        console.log('Fixed', file);
      }
    }
  }
});
