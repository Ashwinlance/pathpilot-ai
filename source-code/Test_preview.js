const fs = require('fs');
const path = require('path');
const distDir = path.join(__dirname, 'dist');
const html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
console.log('--- HTML CHECK ---');
console.log('HTML Length:', html.length);
console.log('Root element exists:', html.includes('id="root"'));
const assetsDir = path.join(distDir, 'assets');
const files = fs.readdirSync(assetsDir);
console.log('Asset files:', files);
const jsFile = files.find(f => f.endsWith('.js'));
if (jsFile) {
  const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');
  console.log('--- JS BUNDLE VERIFICATION ---');
  console.log('JS Bundle Size:', (jsContent.length / 1024).toFixed(2), 'KB');
  console.log('Contains "START SIH DEMO":', jsContent.includes('START SIH DEMO'));
  console.log('Contains "Competency Profile":', jsContent.includes('Competency Profile'));
  console.log('Contains "Statistical Analyst":', jsContent.includes('Statistical Analyst'));
  console.log('Contains "MoSPI":', jsContent.includes('MoSPI'));
}
