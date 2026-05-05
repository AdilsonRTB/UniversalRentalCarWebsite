import { ref } from 'vue';

/**
 * Composable para usar o reCAPTCHA v2
 * @returns {Object} - Referências e funções para o reCAPTCHA
 */
export const useRecaptcha = () => {
  const recaptchaToken = ref(null);
  const recaptchaVerified = ref(false);

  /**
   * Callback quando o reCAPTCHA é verificado com sucesso
   * @param {string} token - Token retornado pelo reCAPTCHA
   */
  const onRecaptchaVerified = (token) => {
    recaptchaToken.value = token;
    recaptchaVerified.value = true;
    console.log('reCAPTCHA verificado com sucesso');
  };

  /**
   * Callback quando o reCAPTCHA expira
   */
  const onRecaptchaExpired = () => {
    recaptchaToken.value = null;
    recaptchaVerified.value = false;
    console.log('reCAPTCHA expirou');
  };

  /**
   * Callback quando há erro no reCAPTCHA
   */
  const onRecaptchaError = () => {
    recaptchaToken.value = null;
    recaptchaVerified.value = false;
    console.error('Erro ao carregar reCAPTCHA');
  };

  /**
   * Reseta o estado do reCAPTCHA
   */
  const resetRecaptcha = () => {
    recaptchaToken.value = null;
    recaptchaVerified.value = false;
  };

  return {
    recaptchaToken,
    recaptchaVerified,
    onRecaptchaVerified,
    onRecaptchaExpired,
    onRecaptchaError,
    resetRecaptcha
  };
};
