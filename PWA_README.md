# PWA - Universal Rent a Car

## ✅ Configuração Concluída

O projeto foi configurado como uma Progressive Web App (PWA). As seguintes alterações foram feitas:

### 1. Plugin PWA Instalado
- `@vue/cli-plugin-pwa` foi adicionado ao projeto
- Service Worker configurado com estratégias de cache otimizadas

### 2. Arquivos Criados/Modificados

#### Configuração
- ✅ `vue.config.js` - Configuração PWA com manifest e workbox
- ✅ `src/service-worker.js` - Service worker customizado com cache strategies
- ✅ `src/registerServiceWorker.js` - Registro do service worker
- ✅ `src/main.js` - Import do registerServiceWorker

#### Assets
- ✅ `public/img/icons/` - Diretório criado para ícones PWA
- ✅ `public/img/icons/README.md` - Guia completo sobre ícones PWA
- ✅ `public/img/icons/generate-icons.html` - Ferramenta para gerar ícones

#### HTML
- ✅ `public/index.html` - Meta tags PWA e links para ícones atualizados

## 🎨 Próximo Passo: Gerar Ícones

Os ícones PWA precisam ser gerados. Você tem 3 opções:

### Opção 1: Gerador HTML Local (Recomendado para teste rápido)
1. Abra o arquivo no navegador:
   ```
   public/img/icons/generate-icons.html
   ```
2. Clique em "Gerar Ícones Básicos" para criar ícones com a letra "U"
3. Ou faça upload do logo da Universal Rent a Car para criar ícones customizados
4. Os ícones serão baixados automaticamente
5. Mova todos os arquivos para a pasta `public/img/icons/`

### Opção 2: Ferramenta Online (Recomendado para produção)
1. Acesse https://realfavicongenerator.net/
2. Faça upload de um logo da empresa (mínimo 512x512px)
3. Configure as opções:
   - Theme color: `#FE7743`
   - Background: `#FFFFFF`
4. Baixe o pacote de ícones
5. Extraia para `public/img/icons/`

### Opção 3: PWA Asset Generator (Linha de comando)
```bash
npm install -g pwa-asset-generator
pwa-asset-generator [seu-logo.png] public/img/icons --background "#FE7743" --splash-only false --icon-only false
```

## 📋 Ícones Necessários

Os seguintes ícones devem estar em `public/img/icons/`:

- ✅ `favicon-16x16.png` (16x16px)
- ✅ `favicon-32x32.png` (32x32px)
- ✅ `apple-touch-icon-152x152.png` (152x152px)
- ✅ `msapplication-icon-144x144.png` (144x144px)
- ✅ `android-chrome-192x192.png` (192x192px)
- ✅ `android-chrome-512x512.png` (512x512px)
- ✅ `android-chrome-maskable-192x192.png` (192x192px, com safe zone)
- ✅ `android-chrome-maskable-512x512.png` (512x512px, com safe zone)

## 🚀 Como Testar a PWA

### 1. Build de Produção
```bash
npm run build
```

### 2. Servir a Aplicação (HTTPS Necessário)
O PWA requer HTTPS. Use um dos seguintes métodos:

**Opção A: http-server com SSL**
```bash
npm install -g http-server
http-server dist -p 8080 -S -C cert.pem -K key.pem
```

**Opção B: serve com SSL**
```bash
npm install -g serve
serve -s dist -l 8080 --ssl-cert cert.pem --ssl-key key.pem
```

**Opção C: ngrok (mais fácil para teste)**
```bash
npm install -g ngrok
cd dist
npx http-server -p 8080
# Em outro terminal:
ngrok http 8080
```

### 3. Testar no Navegador

#### Chrome/Edge DevTools
1. Abra DevTools (F12)
2. Vá para a aba "Application"
3. Verifique:
   - ✅ Manifest carregado corretamente
   - ✅ Service Worker registrado
   - ✅ Cache Storage populado
   - ✅ Todos os ícones presentes

#### Lighthouse
1. Abra DevTools (F12)
2. Vá para a aba "Lighthouse"
3. Selecione "Progressive Web App"
4. Clique em "Generate report"
5. Meta: Score > 90

#### Teste de Instalação
1. No Chrome, clique no ícone ➕ na barra de endereço
2. Ou vá em Menu > Instalar Universal Rent a Car
3. Verifique se o app aparece na lista de aplicativos instalados

### 4. Testar no Dispositivo Móvel

#### Android
1. Abra o Chrome no celular
2. Acesse a URL (deve ser HTTPS)
3. Toque no menu (⋮) > "Adicionar à tela inicial"
4. Verifique:
   - ✅ Ícone aparece na tela inicial
   - ✅ Splash screen ao abrir
   - ✅ Barra de navegação com theme color
   - ✅ Funciona offline (após cache)

#### iOS
1. Abra o Safari no iPhone/iPad
2. Acesse a URL (deve ser HTTPS)
3. Toque no botão Compartilhar
4. Selecione "Adicionar à Tela de Início"
5. Verifique o ícone e funcionamento

## 🎯 Recursos PWA Implementados

### Cache Strategies
- **App Shell**: Cache First (HTML, CSS, JS)
- **Imagens**: Cache First com expiração de 30 dias
- **API**: Network First com fallback para cache (5 min)
- **Static Resources**: Stale While Revalidate

### Características
- ✅ Instalável no desktop e mobile
- ✅ Funciona offline (páginas em cache)
- ✅ Splash screen customizada
- ✅ Theme color (#FE7743)
- ✅ Standalone mode (sem barra do navegador)
- ✅ Atualização automática do service worker
- ✅ Ícones adaptativos para Android

### Configurações
- **Nome**: Universal Rent a Car
- **Nome Curto**: Universal Rent
- **Display**: standalone
- **Orientação**: portrait
- **Theme Color**: #FE7743 (laranja)
- **Background**: #FFFFFF (branco)

## 📊 Verificação Final

Antes de fazer deploy, verifique:

- [ ] Todos os 8 ícones foram gerados e estão em `public/img/icons/`
- [ ] `npm run build` executa sem erros
- [ ] Lighthouse PWA score > 90
- [ ] App instala corretamente no Chrome desktop
- [ ] App instala corretamente no Chrome Android
- [ ] App funciona offline (recarrega páginas em cache)
- [ ] Theme color aparece corretamente
- [ ] Splash screen mostra o ícone e cores corretas

## 🔧 Troubleshooting

### Service Worker não registra
- Certifique-se de estar em produção (`npm run build`)
- Verifique se está usando HTTPS ou localhost
- Limpe o cache do navegador e recarregue

### Ícones não aparecem
- Verifique se os arquivos existem em `public/img/icons/`
- Confirme que os nomes dos arquivos estão corretos
- Limpe o cache e force reload (Ctrl+Shift+R)

### PWA não oferece instalação
- Verifique se todos os critérios PWA são atendidos (Lighthouse)
- Certifique-se de ter manifest.json válido
- Use HTTPS (exceto localhost)
- Tenha service worker registrado

### App não funciona offline
- Verifique se o service worker está ativo (DevTools > Application)
- Confirme que os arquivos estão no Cache Storage
- Teste desconectando a rede nas DevTools

## 📚 Referências

- [Vue CLI PWA Plugin](https://cli.vuejs.org/core-plugins/pwa.html)
- [Workbox](https://developers.google.com/web/tools/workbox)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

---

**Criado em**: 26 de Junho, 2025  
**Versão**: 1.0  
**Status**: ✅ Configuração completa - Aguardando geração de ícones
