const fs = require('fs');
const path = require('path');

// Diretório de saída
const outputDir = path.join(__dirname, '..', 'public', 'img', 'icons');

// Garantir que o diretório existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Função para criar SVG
function createSVG(size, isMaskable = false) {
  const padding = isMaskable ? size * 0.15 : 0; // 15% padding para maskable
  const innerSize = size - (padding * 2);
  const fontSize = innerSize * 0.55;
  const textY = size / 2 + (fontSize * 0.35);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FE7743;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff5722;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background rounded square -->
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad${size})"/>
  
  <!-- Text -->
  <text 
    x="${size / 2}" 
    y="${textY}" 
    font-family="Arial, sans-serif" 
    font-size="${fontSize}" 
    font-weight="bold" 
    fill="white" 
    text-anchor="middle" 
    dominant-baseline="middle">U</text>
</svg>`;
}

// Tamanhos dos ícones necessários
const icons = [
  { name: 'favicon-16x16.png', size: 16, maskable: false },
  { name: 'favicon-32x32.png', size: 32, maskable: false },
  { name: 'apple-touch-icon-152x152.png', size: 152, maskable: false },
  { name: 'msapplication-icon-144x144.png', size: 144, maskable: false },
  { name: 'android-chrome-192x192.png', size: 192, maskable: false },
  { name: 'android-chrome-512x512.png', size: 512, maskable: false },
  { name: 'android-chrome-maskable-192x192.png', size: 192, maskable: true },
  { name: 'android-chrome-maskable-512x512.png', size: 512, maskable: true },
];

// Gerar SVGs
console.log('🎨 Gerando ícones SVG temporários...\n');

icons.forEach(icon => {
  const svgContent = createSVG(icon.size, icon.maskable);
  const svgFileName = icon.name.replace('.png', '.svg');
  const filePath = path.join(outputDir, svgFileName);
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ Criado: ${svgFileName}`);
});

console.log('\n✨ Ícones SVG criados com sucesso!');
console.log('\n⚠️  ATENÇÃO: Estes são ícones SVG temporários.');
console.log('Para ícones PNG de produção, use uma das seguintes opções:');
console.log('  1. Abra public/img/icons/generate-icons.html no navegador');
console.log('  2. Use https://realfavicongenerator.net/');
console.log('  3. Converta os SVGs para PNG usando ImageMagick ou Inkscape\n');
