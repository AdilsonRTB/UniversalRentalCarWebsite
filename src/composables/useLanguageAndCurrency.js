import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const currentCurrency = ref(localStorage.getItem('currency') || 'CVE')
const currentLanguage = ref(localStorage.getItem('language') || 'pt') // Correção: usar 'pt' minúsculo

const currencies = {
  CVE: { symbol: '$', code: 'CVE', name: 'Escudos' },
  USD: { symbol: '$', code: 'USD', name: 'Dollar' },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro' },

}

const exchangeRates = {
  USD: 0.97,
  EUR: 110.0,
  CVE: 104.5
}

export function useLanguageAndCurrency() {
  const { locale, t } = useI18n()

  // Sync locale with currentLanguage
  watch(currentLanguage, (newLang) => {
    //console.log('Changing language to:', newLang) // Debug
    locale.value = newLang
    localStorage.setItem('language', newLang)
    document.documentElement.lang = newLang
  }, { immediate: true })

  const languages = computed(() => [
    { code: 'pt', name: t('languages.portuguese'), flag: require('@/assets/icons/portugal.png') },
    { code: 'en', name: t('languages.english'), flag: require('@/assets/icons/united-kingdom.png') },
    { code: 'fr', name: t('languages.french'), flag: require('@/assets/icons/france.png') }
  ])

  const changeLanguage = (lang) => {
    currentLanguage.value = lang
  }

  const changeCurrency = (currency) => {
    currentCurrency.value = currency
    localStorage.setItem('currency', currency)
  }

  const formatCurrency = (amount, currency = currentCurrency.value) => {
    const currencyInfo = currencies[currency]
    if (!currencyInfo) return amount

    // Convert amount based on exchange rates just when currency is not CVE
    const convertedAmount = amount * exchangeRates[currency]

    if (currency === 'CVE') {
      return `${convertedAmount.toLocaleString('pt-PT')} ${currencyInfo.symbol}`
    } else if (currency === 'EUR') {
      return `${convertedAmount.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}${currencyInfo.symbol}`
    } else {
      return `${currencyInfo.symbol}${convertedAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`
    }
  }

  const getCurrencySymbol = (currency = currentCurrency.value) => {
    return currencies[currency]?.symbol || '$'
  }

  /*const getCurrencies = () => {
    return Object.keys(currencies).map(code => ({
      code,
      ...currencies[code]
    }))
  }*/


  const getLanguageByCode = (code) => {
    return languages.value.find(lang => lang.code === code).name
  }

  return {
    // Language
    currentLanguage,
    languages,
    changeLanguage,
    t,
    currentCurrency,
    changeCurrency,
    formatCurrency,
    getCurrencySymbol,
    currencies,
    // Utils
    getLanguageByCode
  }
}
