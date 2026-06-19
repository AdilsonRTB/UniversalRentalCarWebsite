import { useHead } from '@vueuse/head'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * Composable para gerenciar meta tags SEO dinâmicas
 * @param {Object} options - Opções de SEO
 * @param {string} options.title - Título da página
 * @param {string} options.description - Descrição da página
 * @param {string} options.keywords - Palavras-chave (opcional)
 * @param {string} options.image - URL da imagem para compartilhamento (opcional)
 * @param {string} options.url - URL canônica (opcional)
 */
export function useSeo(options = {}) {
  const { locale } = useI18n()
  
  const baseUrl = 'https://www.universalrental.cv'
  const defaultImage = `${baseUrl}/og-image.jpg`
  
  const metaTags = computed(() => {
    const title = options.title || 'Universal Rent-a-Car - Aluguer de Veículos Online'
    const description = options.description || 'Alugue veículos de forma simples e rápida. Encontre o carro perfeito para sua viagem.'
    const image = options.image || defaultImage
    const url = options.url || baseUrl
    const keywords = options.keywords || 'aluguer de carros, rent a car, aluguel de veículos, carros para alugar'
    
    return {
      title,
      meta: [
        // Basic SEO
        { name: 'description', content: description },
        { name: 'keywords', content: keywords },
        
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: url },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:locale', content: getOgLocale(locale.value) },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: url },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ],
      link: [
        { rel: 'canonical', href: url }
      ]
    }
  })
  
  useHead(metaTags)
  
  return {
    metaTags
  }
}

/**
 * Converte locale do i18n para formato Open Graph
 */
function getOgLocale(locale) {
  const localeMap = {
    'pt': 'pt_PT',
    'en': 'en_US',
    'fr': 'fr_FR'
  }
  return localeMap[locale] || 'pt_PT'
}
