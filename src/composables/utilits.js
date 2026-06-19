
import dayjs from 'dayjs'

export function useUtilities() {

const formatImageUrl = (url) => {

  console.log('URL original:', url);
  if (!url) return null;

  // Verifica se a URL já contém a porta 5085
  if (url.includes(':5085')) return url;

  // Se a URL contiver 'https://www.universalrental.cv/', substitui por 'https://admin.universalrental.cv/'
  if (url.includes('http://www.universalrental.cv/')) {

    return url.replace('http://www.universalrental.cv/', 'https://admin.universalrental.cv/');
  }

  if (url.includes('http://www.universalrental.cv/')) {

    return url.replace('http://admin.universalrental.cv/', 'https://admin.universalrental.cv/');
  }
  // Se a URL já contiver os domínios especificados, retorna a URL sem alterações
  if (url.includes('https://admin.universalrental.cv/')) return url;

  // Caso contrário, substitui 'http://212.47.74.168/' por 'http://212.47.74.168:5085/'
  return url.replace('http://212.47.74.168/', 'http://212.47.74.168:5085/');
}

/**
 * Calcula o número de dias de aluguel com base nas datas
 * Regras:
 * - Cada diária = 24 horas
 * - Tolerância configurável (padrão: 12 horas)
 * - Mais que a tolerância = diária completa
 * 
 * @param {string|Date|dayjs.Dayjs} startDate - Data de início
 * @param {string|Date|dayjs.Dayjs} endDate - Data de término
 * @param {number} toleranceHours - Horas de tolerância (padrão: 12)
 * @returns {number} Número de dias calculados
 */
const calculateRentalDays = (startDate, endDate, toleranceHours = 12) => {
  if (!startDate || !endDate) return 0

  const start = dayjs(startDate)
  const end = dayjs(endDate)

  // Calcular diferença total em horas
  const totalHours = end.diff(start, 'hour', true)

  // Se for menos de 24 horas, considerar 1 dia
  if (totalHours <= 24) return 1

  // Calcular dias completos e horas restantes
  const completeDays = Math.floor(totalHours / 24)
  const remainingHours = totalHours % 24

  // Se as horas restantes forem mais que a tolerância, adicionar mais um dia
  if (remainingHours > toleranceHours) {
    return completeDays + 1
  }

  return completeDays
}


return {
  formatImageUrl,
  calculateRentalDays
}

}