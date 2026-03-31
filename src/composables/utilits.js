
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

  // Se a URL já contiver os domínios especificados, retorna a URL sem alterações
  if (url.includes('https://admin.universalrental.cv/')) return url;

  // Caso contrário, substitui 'http://212.47.74.168/' por 'http://212.47.74.168:5085/'
  return url.replace('http://212.47.74.168/', 'http://212.47.74.168:5085/');
}


return {
  formatImageUrl
}

}