# PWA Icons

Esta pasta contém os ícones necessários para a Progressive Web App (PWA).

## Ícones Necessários

Para uma PWA completa, você precisa dos seguintes ícones:

- **favicon-16x16.png** - 16x16px (favicon pequeno)
- **favicon-32x32.png** - 32x32px (favicon padrão)
- **apple-touch-icon-152x152.png** - 152x152px (ícone iOS)
- **msapplication-icon-144x144.png** - 144x144px (ícone Windows)
- **android-chrome-192x192.png** - 192x192px (ícone Android)
- **android-chrome-512x512.png** - 512x512px (ícone Android alta resolução)
- **android-chrome-maskable-192x192.png** - 192x192px (ícone Android maskable)
- **android-chrome-maskable-512x512.png** - 512x512px (ícone Android maskable alta resolução)

## Como Gerar os Ícones

### Opção 1: Usando ferramentas online
1. Acesse https://realfavicongenerator.net/
2. Faça upload do logo da Universal Rent a Car (preferencialmente 512x512px ou maior)
3. Configure as opções para cada plataforma
4. Baixe o pacote de ícones gerado
5. Extraia os arquivos para esta pasta

### Opção 2: Usando PWA Asset Generator
```bash
npm install -g pwa-asset-generator
pwa-asset-generator [logo.png] public/img/icons -i public/index.html -m public/manifest.json
```

### Opção 3: Manualmente com editor de imagem
1. Crie um logo quadrado da Universal Rent a Car
2. Use Photoshop, GIMP, ou Figma para redimensionar para cada tamanho
3. Exporte como PNG com fundo transparente ou com a cor #FE7743

## Ícones Maskable

Ícones maskable são importantes para Android 8.0+ (API 26+). Eles permitem que o sistema operacional aplique diferentes formas de máscara.

**Requisitos:**
- A área de segurança (safe zone) deve estar no centro 80% da imagem
- Use margem de pelo menos 10% em todos os lados
- O ícone principal deve estar centralizado

## Cores do Tema
- **Primary Color**: #FE7743 (Laranja)
- **Background**: #FFFFFF (Branco)

## Teste seus ícones
Após gerar os ícones:
1. Execute `npm run build`
2. Sirva a pasta `dist` com um servidor HTTPS
3. Use o Lighthouse no Chrome DevTools para verificar a PWA
4. Teste a instalação no dispositivo móvel
