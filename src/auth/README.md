# Sistema de Autenticação Personalizado - RentCV

## 📋 Visão Geral

Sistema completo de autenticação personalizado como alternativa ao Keycloak, incluindo páginas de login, registro e recuperação de palavra-passe com design moderno e responsivo.

## 🎨 Páginas Implementadas

### 1. **LoginPage.vue** (`/login`)
- **Design**: Layout split com branding à esquerda e formulário à direita
- **Campos**: E-mail, palavra-passe, lembrar-me
- **Funcionalidades**:
  - Validação de formulário em tempo real
  - Integração com serviço de autenticação personalizado
  - Opção de login via Keycloak (mantendo compatibilidade)
  - Link para recuperação de palavra-passe
  - Redirecionamento baseado em roles (admin, owner, client)

### 2. **RegisterPage.vue** (`/register`)
- **Design**: Formulário multi-step com progress indicator
- **Estrutura de Steps**:
  
  **Step 1 - Informações Pessoais:**
  - Nome completo
  - E-mail (com verificação de duplicação)
  - Número de telefone
  - Palavra-passe (com indicador de força)
  - Confirmação de palavra-passe

  **Step 2 - Carta de Condução:**
  - Número da carta de condução
  - Data de validade (com validação de prazo)

  **Step 3 - Endereço:**
  - Localidade (morada completa)
  - Código postal (formato automático: 0000-000)
  - Cidade
  - Termos e condições

### 3. **ForgotPasswordPage.vue** (`/forgot-password`)
- **Design**: Formulário centrado com branding
- **Funcionalidades**:
  - Solicitação de recuperação por e-mail
  - Página de confirmação com opção de reenvio
  - Link de retorno ao login

## 🛠️ Serviços Implementados

### **authService.js**
Serviço completo de autenticação com as seguintes funcionalidades:

#### Métodos Principais:
- `login(email, password, rememberMe)` - Autenticação de usuário
- `register(userData)` - Registro de novo usuário
- `logout()` - Logout e limpeza de dados
- `requestPasswordReset(email)` - Solicitação de recuperação
- `resetPassword(token, newPassword)` - Reset com token
- `getCurrentUser()` - Obter dados do usuário atual
- `isAuthenticated()` - Verificar estado de autenticação
- `updateProfile(userData)` - Atualizar perfil
- `changePassword(current, new)` - Alterar palavra-passe
- `checkEmailExists(email)` - Verificar e-mail duplicado
- `validateDrivingLicense(number, validity)` - Validar carta

#### Funcionalidades Avançadas:
- Interceptors para token refresh automático
- Gestão de tokens (access + refresh)
- Distinção entre autenticação custom e Keycloak
- Validação de roles e permissões
- Tratamento de erros centralizado

## 🚀 Integração com Router

### Rotas Adicionadas:
```javascript
{
  path: '/login',
  name: 'Login',
  component: Login
},
{
  path: '/register', 
  name: 'Register',
  component: Register
},
{
  path: '/forgot-password',
  name: 'ForgotPassword', 
  component: ForgotPassword
}
```

### Navigation Guards Atualizados:
- Rotas públicas incluem as novas páginas de auth
- Redirecionamento baseado em estado de autenticação
- Compatibilidade mantida com Keycloak existente

## 🎯 Características do Design

### **Layout e UX:**
- **Responsive Design**: Mobile-first approach
- **Breakpoints**: 768px, 480px com adaptações específicas
- **Animações**: Elementos flutuantes, hover effects, loading states
- **Gradientes**: Purple/blue theme consistente com o projeto
- **Tipografia**: Hierarquia visual clara e legível

### **Componentes Visuais:**
- **Background**: Elementos decorativos animados
- **Cards**: Design glassmorphism com shadows
- **Botões**: Gradientes com hover effects e loading states
- **Inputs**: Borders coloridos, ícones prefixados, validação visual
- **Progress Steps**: Indicador visual para registro multi-step

### **Estados Interativos:**
- **Loading**: Overlays com blur effect
- **Validação**: Feedback visual em tempo real
- **Sucesso/Erro**: Messages toast integradas
- **Password Strength**: Barra visual de força da senha

## 🔧 Configuração e Uso

### **Environment Variables:**
```env
VUE_APP_AUTH_API_URL=http://localhost:8080/api/auth
```

### **Dependências Utilizadas:**
- Vue 3 Composition API
- Vue Router 4
- Ant Design Vue 4
- Axios para HTTP requests
- dayjs para manipulação de datas

### **Estrutura de Dados Esperada:**

#### Login Response:
```javascript
{
  user: {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    roles: ["owner"]
  },
  accessToken: "jwt_token...",
  refreshToken: "refresh_token..."
}
```

#### Registration Data:
```javascript
{
  name: "João Silva",
  email: "joao@email.com",
  phone: "+351 900 000 000",
  password: "password123",
  licenseNumber: "123456789",
  licenseValidity: "2030-12-31",
  address: {
    location: "Rua da Liberdade, 123",
    postalCode: "1250-096",
    city: "Lisboa"
  }
}
```

## 📱 Compatibilidade Mobile

### **Adaptações Responsivas:**
- **Desktop**: Layout split com branding sidebar
- **Tablet**: Formulário centrado, sidebar oculta
- **Mobile**: Stack vertical, padding reduzido, botões full-width

### **Interações Touch:**
- Botões com tamanho mínimo 44px
- Campos de input otimizados para touch
- Navegação por gestos suportada

## 🔐 Segurança Implementada

### **Frontend:**
- Validação robusta de formulários
- Sanitização de inputs
- Gestão segura de tokens
- Timeout de sessão automático
- Refresh token rotation

### **Validações:**
- E-mail format e duplicação
- Força de palavra-passe com critérios visuais
- Carta de condução com validação de prazo
- Código postal no formato português
- Terms acceptance obrigatório

## 🚀 Próximos Passos

### **Backend Integration:**
1. Implementar endpoints correspondentes no backend
2. Configurar autenticação JWT
3. Integrar validação de carta de condução com APIs governamentais
4. Implementar sistema de e-mail para recuperação

### **Funcionalidades Adicionais:**
1. Verificação de e-mail por token
2. 2FA (Two-Factor Authentication)
3. Social login (Google, Facebook)
4. Perfil de usuário editável
5. Histórico de login/atividade

## 📄 Notas de Desenvolvimento

- **Compatibilidade**: Mantida com sistema Keycloak existente
- **Performance**: Lazy loading de componentes, code splitting
- **Acessibilidade**: ARIA labels, navegação por teclado
- **SEO**: Meta tags apropriadas, structured data
- **Testing**: Preparado para unit tests e e2e testing

---

**Desenvolvido por**: Sistema RentCV  
**Última atualização**: Novembro 2024  
**Tecnologias**: Vue 3, Ant Design Vue, Axios