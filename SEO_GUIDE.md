# Guia de SEO - Universal Rent-a-Car

## Implementação Completa ✅

### 1. Meta Tags Estáticas (index.html)

O arquivo `public/index.html` contém todas as meta tags essenciais:
- Description e Keywords
- Open Graph (Facebook/WhatsApp)
- Twitter Cards
- Schema.org (Structured Data)
- Links canônicos
- Suporte multilíngue (pt-PT, en-US, fr-FR)

### 2. Arquivos de SEO

#### robots.txt
Localização: `public/robots.txt`
- Permite todos os bots
- Define Sitemap
- Configurado para Google, Bing e outros

#### sitemap.xml
Localização: `public/sitemap.xml`
- Lista todas as páginas principais
- Inclui prioridades e frequências de atualização
- Suporta múltiplos idiomas com hreflang

**⚠️ IMPORTANTE:** Atualizar o sitemap.xml quando:
- Adicionar novas rotas
- Mudar estrutura de URLs
- Atualizar data de modificação (lastmod)
- Para sitemap dinâmico, considerar gerar automaticamente no backend

### 3. Meta Tags Dinâmicas (@vueuse/head)

#### Composable useSeo
Localização: `src/composables/useSeo.js`

**Como usar:**

```javascript
import { useSeo } from '../composables/useSeo.js'

// Uso básico
useSeo({
  title: 'Título da Página',
  description: 'Descrição da página para SEO',
  keywords: 'palavra1, palavra2, palavra3',
  url: 'https://www.universalrentacar.com/sua-rota',
  image: 'https://www.universalrentacar.com/imagem.jpg'
})

// SEO dinâmico (baseado em dados)
watch(() => vehicle.value, (newVehicle) => {
  if (newVehicle && newVehicle.brand) {
    useSeo({
      title: `${newVehicle.brand} ${newVehicle.model}`,
      description: `Descrição com dados: ${newVehicle.description}`,
      keywords: `${newVehicle.brand}, ${newVehicle.model}`
    })
  }
}, { deep: true })
```

#### Páginas com SEO Implementado:
- ✅ VehicleSearch.vue - Pesquisa de veículos
- ✅ DashboardPage.vue - Dashboard do usuário
- ✅ VehicleDetails.vue - Detalhes dinâmicos de veículos

#### Para adicionar em outras páginas:
1. Importar o composable: `import { useSeo } from '../composables/useSeo.js'`
2. Chamar dentro do `<script setup>` com as informações da página
3. Para conteúdo dinâmico, usar `watch` ou `computed`

### 4. Checklist de Otimização

#### ✅ Implementado:
- [x] Meta tags básicas (description, keywords)
- [x] Open Graph completo
- [x] Twitter Cards
- [x] Schema.org (AutoRental)
- [x] robots.txt
- [x] sitemap.xml
- [x] Meta tags dinâmicas por rota
- [x] Suporte multilíngue
- [x] Links canônicos

#### ⚠️ Recomendações Futuras:
- [ ] **Imagens OG:** Criar imagens específicas para compartilhamento (og-image.jpg, twitter-image.jpg)
- [ ] **Alt text:** Verificar todas as imagens têm atributo alt descritivo
- [ ] **URL do domínio:** Atualizar URLs de `https://www.universalrentacar.com` para o domínio real
- [ ] **Prerendering/SSR:** Considerar Vue SSR ou serviço de prerendering para melhor indexação
- [ ] **Google Analytics:** Adicionar tracking
- [ ] **Google Search Console:** Configurar e submeter sitemap
- [ ] **Sitemap dinâmico:** Gerar automaticamente para veículos individuais
- [ ] **Rich Snippets:** Adicionar mais Schema.org (Vehicle, Review, Offer)
- [ ] **Performance:** Otimizar Core Web Vitals (LCP, FID, CLS)
- [ ] **Breadcrumbs:** Adicionar navegação estruturada com Schema
- [ ] **Títulos H1-H6:** Auditar hierarquia de títulos
- [ ] **Links internos:** Melhorar linkagem entre páginas

### 5. URLs Importantes

Atualizar em todos os arquivos quando o domínio for definido:
- `public/index.html` - Meta tags OG, Twitter, canonical
- `public/sitemap.xml` - Todas as URLs
- `public/robots.txt` - URL do sitemap
- `src/composables/useSeo.js` - baseUrl

### 6. Teste de SEO

Ferramentas recomendadas:
1. **Google Search Console** - Verificar indexação
2. **PageSpeed Insights** - Performance e Core Web Vitals
3. **Facebook Sharing Debugger** - Testar Open Graph
4. **Twitter Card Validator** - Testar Twitter Cards
5. **Schema.org Validator** - Validar structured data
6. **Lighthouse** - Auditoria completa (SEO, Performance, Accessibility)

### 7. Manutenção

**Quando atualizar sitemap.xml:**
- Deploy de novas features com novas rotas
- Mudanças significativas em páginas existentes
- Pelo menos 1x por mês (atualizar lastmod)

**Monitoramento:**
- Verificar Google Search Console semanalmente
- Analisar palavras-chave que trazem tráfego
- Ajustar meta descriptions com base em CTR
- Adicionar novas keywords relevantes

---

## Como o Cache Busting Funciona com SEO

O projeto já possui cache busting configurado (vue.config.js):
- Arquivos JS/CSS têm hash único baseado no conteúdo
- index.html nunca é cacheado
- Meta tags sempre atualizadas após deploy
- Nginx configurado para cache otimizado

Isso garante que:
1. Usuários sempre veem meta tags atualizadas
2. Bots de busca indexam conteúdo mais recente
3. Compartilhamentos sociais usam dados corretos
