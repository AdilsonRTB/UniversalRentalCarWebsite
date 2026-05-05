# Configuração do Google reCAPTCHA v2

Este documento explica como configurar o Google reCAPTCHA v2 no projeto Universal Rent-a-Car.

## O que é o reCAPTCHA v2?

O reCAPTCHA v2 é uma solução de proteção contra bots e spam do Google que requer interação do usuário. Os usuários precisam clicar na caixa de seleção "Não sou um robô" (e às vezes resolver um desafio visual) para provar que são humanos.

## Como Obter as Chaves do reCAPTCHA

### 1. Acesse o Google reCAPTCHA Admin Console

Visite: [https://www.google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)

### 2. Registre um Novo Site

1. Clique no botão **+** (Criar)
2. Preencha os seguintes campos:

   - **Etiqueta (Label)**: Um nome descritivo para o seu site (ex: "Universal Rent-a-Car")
   - **Tipo de reCAPTCHA**: Selecione **reCAPTCHA v2** e escolha **"Caixa de seleção Não sou um robô"**
   - **Domínios**: Adicione os domínios onde o reCAPTCHA será usado:
     - `localhost` (para desenvolvimento local)
     - Seu domínio de produção (ex: `rentcv.com`)
     - Adicione domínios adicionais conforme necessário

3. Aceite os Termos de Serviço do reCAPTCHA
4. Clique em **Enviar**

### 3. Copie as Chaves

Após a criação, você receberá duas chaves:

- **Chave do Site (Site Key)**: Usada no frontend (Vue.js)
- **Chave Secreta (Secret Key)**: Usada no backend para validar os tokens

## Configuração no Projeto

### 1. Configurar a Chave do Site no Frontend

Edite o arquivo `.env` na raiz do projeto:

```env
# Google reCAPTCHA v3 Site Key
VUE_APP_RECAPTCHA_SITE_KEY=sua_chave_do_site_aqui
```

**Importante**: Substitua `sua_chave_do_site_aqui` pela **Chave do Site** que você copiou.

### 2. Configurar a Chave Secreta no Backend

A **Chave Secreta** deve ser configurada no seu backend (API) para validar os tokens enviados pelo frontend.

**⚠️ NUNCA exponha a Chave Secreta no frontend!**

## Chave de Teste

Para desenvolvimento e testes em localhost, você pode usar a chave de teste oficial do Google:

```env
VUE_APP_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

**Nota**: Esta chave de teste **SEMPRE** retorna sucesso e só funciona em ambientes de desenvolvimento.

## Implementação

O reCAPTCHA v2 foi integrado nos seguintes pontos da aplicação:

1. **Login** ([LoginPage.vue](src/auth/LoginPage.vue))
   - Checkbox visível antes do botão de submit
   - Botão desabilitado até verificação completada

2. **Registro** ([RegisterPage.vue](src/auth/RegisterPage.vue))
   - Checkbox visível no último passo (Step 3)
   - Botão desabilitado até verificação completada

3. **Reserva** ([ReservationModal.vue](src/components/ReservationModal.vue))
   - Checkbox visível no formulário de reserva
   - Botão desabilitado até verificação completada

## Como Funciona

1. O usuário preenche o formulário
2. Antes de submeter, deve clicar na caixa "Não sou um robô"
3. O Google valida automaticamente o clique
4. Se necessário, pode apresentar um desafio adicional (selecionar imagens)
5. Após verificação bem-sucedida, o token é gerado
6. O botão de submit é habilitado
7. O token é enviado ao backend para validação final

## Validação no Backend

O token reCAPTCHA é enviado ao backend nos seguintes campos:

```javascript
{
  // ... outros dados do formulário
  recaptchaToken: "token_gerado_pelo_recaptcha"
}2 com o Google"""
    
    secret_key = settings.RECAPTCHA_SECRET_KEY
    url = 'https://www.google.com/recaptcha/api/siteverify'
    
    data = {
        'secret': secret_key,
        'response': token
    }
    
    response = requests.post(url, data=data)
    result = response.json()
    
    # Verifica se a validação foi bem-sucedida
    return result.get('success', False)
    # Verifica se a validação foi bem-sucedida
    if result.get('success'):
        # Pontuação entre 0.0 (bot) e 1.0 (humano)
        score = result.get('score', 0)
        
        # Defina um limiar apropriado (ex: 0.5)
        if score >= 0.5:
            return True
    
    return False
```

### Exemplo para Node.js/Express

```javascript
const axios = require('axios');

async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const url = 'https://www.google.com/recaptcha/api/siteverify';
  
  try {
    const response = await axios.post(url, null, {
      params: {
        secret: secretKey,
        response: token
      }
    });
    
    const { success, score } = response.data;
    
    // Verifica se passou e se a pontuação é aceitável
    return success && score >= 0.5;
    
  } catch (error) {
    console.error('Erro ao verificar reCAPTCHA:', error);
    return false;
  } } = response.data;
    
    // Retorna true se a verificação passou
    return success;
    
  } catch (error) {
    console.error('Erro ao verificar reCAPTCHA:', error);
    return false;
  }
}
```

## Diferenças entre v2 e v3

| Característica | reCAPTCHA v2 | reCAPTCHA v3 |
|----------------|--------------|--------------|
| **Interação do usuário** | Requerida (checkbox) | Invisível |
| **Experiência** | Clique obrigatório, pode ter desafios | Sem interação |
| **Pontuação** | Aprovado/Reprovado | Score de 0.0 a 1.0 |
| **Uso recomendado** | Formulários críticos | Proteção geral |
| **Controle do usuário** | Claro e visível | Transparente |

## Vantagens do reCAPTCHA v2

- ✅ **Transparência**: Usuário sabe que está sendo verificado
- ✅ **Controle**: Validação clara e explícita
- ✅ **Simplicidade**: Implementação direta
- ✅ **Compatibilidade**: Funciona em todos os navegadores
- ✅ **Confiável**: Menos falsos positivosVerifique o console do navegador para erros JavaScript
4. Confirme que o plugin foi corretamente inicializado no `main.js`

### Erro: "Invalid site key"

- Certifique-se de estar usando a **Chave do Site** (não a Chave Secreta)
- Verifique se o domínio atual está autorizado nas configurações do reCAPTCHA

### O backend rejeita o token

- Verifique se a **Chave Secreta** está correta no backend
- Certifique-se de que o token está sendo enviado corretamente
- Tokens expiram após 2 minutos - não reutilize tokens antigos

## Recursos Adicionais

- [Documentação Oficial do reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3)
- [FAQ do reCAPTCHA](https://developers.google.com/recaptcha/docs/faq)
- [Documentação do vue-recaptcha-v3](https://www.npmjs.com/package/vue-recaptcha-v3)

## Suporte

Para problemas relacionados ao reCAPTCHA:
- Verifique a [FAQ do Google reCAPTCHA](https://developers.google.com/recaptcha/docs/faq)
- Consulte os logs de erro no console do navegador
- Verifique os logs do backend para erros de validação

- Confirme que selecionou **reCAPTCHA v2** (não v3) ao criar o site

### O checkbox não aparece

- Verifique se a chave do site está correta no arquivo `.env`
- Confirme que o componente foi registrado corretamente no `main.js`
- Verifique o console do navegador par2](https://developers.google.com/recaptcha/docs/display)
- [FAQ do reCAPTCHA](https://developers.google.com/recaptcha/docs/faq)
- [Documentação do vue3-recaptcha2](https://www.npmjs.com/package/vue3-recaptcha2)
- [Comparação v2 vs v3](https://developers.google.com/recaptcha/docs/versions