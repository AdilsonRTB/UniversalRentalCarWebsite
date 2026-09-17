
import dayjs from 'dayjs'

export function useUtilities() {

const formatImageUrl = (url) => {
  if (!url) return null;

  // Porta local/dev de media do backend - deixada como está (ver nota no gap-analysis sobre
  // confirmar TLS deste host antes de forçar https aqui).
  if (url.includes(':5085')) return url;

  // Domínio de produção: força sempre https, seja qual for o subdomínio (www/admin) ou o
  // esquema original guardado na BD.
  if (url.includes('universalrental.cv')) {
    return url.replace(/^http:\/\//, 'https://');
  }

  // IP legado do host de media: reescreve para a porta 5085.
  if (url.includes('212.47.74.168')) {
    return url.replace('http://212.47.74.168/', 'http://212.47.74.168:5085/');
  }

  // Rede de segurança final: nunca deixar escapar uma URL http:// não tratada acima, para evitar
  // mixed-content numa página servida por https.
  return url.replace(/^http:\/\//, 'https://');
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