<template>
  <div class="auth-container">
    <HeaderPage />

    <!-- Background Elements -->
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- Main Content -->
    <div class="auth-wrapper">
      <!-- Register Form -->
      <div class="form-section">
        <div class="form-container">
          <!-- Form Header -->
          <div class="form-header">
            <div >
              <img
                :src="logo"
                style="max-width: 180px; height: auto; max-height: 60px; object-fit: contain;"
              />
            </div>
            <h2 class="form-title">Criar Conta</h2>
            <p class="form-subtitle">Preencha os seus dados para começar</p>
          </div>


          <!-- Register Form -->
          <div class="register-form">
            <a-form
              ref="formRef"
              :model="formData"
              :rules="formRules"
              layout="vertical"
              @finish="handleRegister"
            >
              <!-- Step 1: Informações Pessoais -->
              <div v-show="currentStep === 0" class="form-step">
                <h3 class="step-title">Informações Pessoais</h3>
                
                <!-- First Name and Last Name -->
                <div class="form-row">
                  <a-form-item
                    name="firstName"
                    label="Nome"
                    class="form-item form-item-half"
                  >
                    <a-input
                      v-model:value="formData.firstName"
                      size="large"
                      placeholder="Nome"
                      :prefix="() => h(UserOutlined, { style: { color: '#8b5cf6' } })"
                      class="form-input"
                    />
                  </a-form-item>
                  
                  <a-form-item
                    name="lastName"
                    label="Apelido"
                    class="form-item form-item-half"
                  >
                    <a-input
                      v-model:value="formData.lastName"
                      size="large"
                      placeholder="Apelido"
                      :prefix="() => h(UserOutlined, { style: { color: '#8b5cf6' } })"
                      class="form-input"
                    />
                  </a-form-item>
                </div>

                <!-- Email Field -->
                <a-form-item
                  name="email"
                  label="E-mail"
                  class="form-item"
                >
                  <a-input
                    v-model:value="formData.email"
                    size="large"
                    placeholder="Insira o seu e-mail"
                    :prefix="() => h(MailOutlined, { style: { color: '#8b5cf6' } })"
                    class="form-input"
                  />
                </a-form-item>

                <!-- Driving License Number -->
                <a-form-item
                  name="drivingLicenseNumber"
                  label="Carta de Condução"
                  class="form-item"
                >
                  <a-input
                    v-model:value="formData.drivingLicenseNumber"
                    size="large"
                    placeholder="Número da carta de condução"
                    :prefix="() => h(IdcardOutlined, { style: { color: '#8b5cf6' } })"
                    class="form-input"
                  />
                </a-form-item>

                <!-- Phone Field -->
                <a-form-item
                  name="phoneNumber"
                  label="Número de Telefone"
                  class="form-item"
                >
                  <a-input
                    v-model:value="formData.phoneNumber"
                    size="large"
                    placeholder="+238 900 000 000"
                    :prefix="() => h(PhoneOutlined, { style: { color: '#8b5cf6' } })"
                    class="form-input"
                  />
                </a-form-item>
              </div>

              <!-- Step 2: Segurança -->
              <div v-show="currentStep === 1" class="form-step">
                <h3 class="step-title">Segurança da Conta</h3>
                
                <!-- Password Field -->
                <a-form-item
                  name="password"
                  label="Palavra-passe"
                  class="form-item"
                >
                  <a-input-password
                    v-model:value="formData.password"
                    size="large"
                    placeholder="Insira a sua palavra-passe"
                    :prefix="() => h(LockOutlined, { style: { color: '#8b5cf6' } })"
                    class="form-input"
                  />
                  <div class="password-strength">
                    <div class="strength-bar">
                      <div 
                        class="strength-fill" 
                        :class="passwordStrength.class"
                        :style="{ width: passwordStrength.width }"
                      ></div>
                    </div>
                    <span class="strength-text" :class="passwordStrength.class">
                      {{ passwordStrength.text }}
                    </span>
                  </div>
                </a-form-item>

                <!-- Confirm Password Field -->
                <a-form-item
                  name="confirmPassword"
                  label="Confirmar Palavra-passe"
                  class="form-item"
                >
                  <a-input-password
                    v-model:value="formData.confirmPassword"
                    size="large"
                    placeholder="Confirme a sua palavra-passe"
                    :prefix="() => h(LockOutlined, { style: { color: '#8b5cf6' } })"
                    class="form-input"
                  />
                </a-form-item>

                <!-- Terms and Conditions -->
                <a-form-item
                  name="agreeTerms"
                  class="form-item terms-item"
                >
                  <a-checkbox v-model:checked="formData.agreeTerms">
                    Concordo com os 
                    <a href="#" @click.prevent="showTerms" class="terms-link">Termos e Condições</a> 
                    e 
                    <a href="#" @click.prevent="showPrivacy" class="terms-link">Política de Privacidade</a>
                  </a-checkbox>
                </a-form-item>
              </div>

              <!-- Navigation Buttons -->
              <div class="form-navigation">
                <a-button
                  v-if="currentStep > 0"
                  size="large"
                  @click="previousStep"
                  class="nav-btn prev-btn"
                >
                  <ArrowLeftOutlined />
                  Anterior
                </a-button>
                
                <a-button
                  v-if="currentStep < 1"
                  type="primary"
                  size="large"
                  @click="nextStep"
                  class="nav-btn next-btn"
                >
                  Próximo
                  <ArrowRightOutlined />
                </a-button>
                
                <a-button
                  v-if="currentStep === 1"
                  type="primary"
                  html-type="submit"
                  size="large"
                  :loading="isLoading"
                  :disabled="!formData.agreeTerms"
                  class="nav-btn submit-btn"
                >
                  <UserAddOutlined v-if="!isLoading" />
                  Criar Conta
                </a-button>
              </div>
            </a-form>

            <!-- Divider -->
            <div class="divider">
              <span>ou</span>
            </div>

            <!-- Login Link -->
            <div class="login-link" >
              <span>Já tem uma conta?</span>
              <router-link :to="{ path: '/', query: { from: $route.fullPath } }" class="login-text">
                Fazer login
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <a-spin size="large" />
    </div>
  </div>
</template>

<script setup>
import {
  UserAddOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  IdcardOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined
} from '@ant-design/icons-vue'
import { ref, reactive, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { authService } from '../services/api'
import logo from '../assets/logo2.png'
import HeaderPage from '../components/HeaderPage.vue'

const router = useRouter()

// Form references
const formRef = ref(null)

// Reactive data
const isLoading = ref(false)
const currentStep = ref(0)



const formData = reactive({
  // Personal Information (Step 1)
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  drivingLicenseNumber: '',
  
  // Security (Step 2)
  password: '',
  confirmPassword: '',
  
  // Terms
  agreeTerms: false
})

// Password strength computation
const passwordStrength = computed(() => {
  const password = formData.password
  if (!password) return { width: '0%', class: '', text: '' }
  
  let strength = 0
  let feedback = []
  
  if (password.length >= 8) strength++
  else feedback.push('8+ caracteres')
  
  if (/[a-z]/.test(password)) strength++
  else feedback.push('minúscula')
  
  if (/[A-Z]/.test(password)) strength++
  else feedback.push('maiúscula')
  
  if (/[0-9]/.test(password)) strength++
  else feedback.push('número')
  
  if (/[^A-Za-z0-9]/.test(password)) strength++
  else feedback.push('símbolo')
  
  const strengthLevels = [
    { width: '20%', class: 'weak', text: 'Muito fraca' },
    { width: '40%', class: 'weak', text: 'Fraca' },
    { width: '60%', class: 'medium', text: 'Média' },
    { width: '80%', class: 'good', text: 'Boa' },
    { width: '100%', class: 'strong', text: 'Forte' }
  ]
  
  return strengthLevels[strength - 1] || strengthLevels[0]
})

// Form validation rules
const formRules = {
  firstName: [
    { required: true, message: 'Por favor, insira o seu primeiro nome' },
    { min: 2, message: 'O nome deve ter pelo menos 2 caracteres' }
  ],
  lastName: [
    { required: true, message: 'Por favor, insira o seu último nome' },
    { min: 2, message: 'O nome deve ter pelo menos 2 caracteres' }
  ],
  email: [
    { required: true, message: 'Por favor, insira o seu e-mail' },
    { type: 'email', message: 'Por favor, insira um e-mail válido' }
  ],
  phoneNumber: [
    { required: true, message: 'Por favor, insira o seu número de telefone' },
    { pattern: /^[+]?[0-9\s-()]+$/, message: 'Formato de telefone inválido' }
  ],
  idNumber: [
    { required: true, message: 'Por favor, insira o número de identificação' }
  ],
  password: [
    { required: true, message: 'Por favor, insira uma palavra-passe' },
    { min: 8, message: 'A palavra-passe deve ter pelo menos 8 caracteres' },
    { 
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      message: 'Deve conter pelo menos uma minúscula, maiúscula e um número' 
    }
  ],
  confirmPassword: [
    { required: true, message: 'Por favor, confirme a sua palavra-passe' },
    {
      validator: (rule, value) => {
        if (value && value !== formData.password) {
          return Promise.reject('As palavras-passe não coincidem')
        }
        return Promise.resolve()
      }
    }
  ],
  drivingLicenseNumber: [
    { required: true, message: 'Por favor, insira o número da carta de condução' }
  ],
  licenseExpiryDate: [
    { required: true, message: 'Por favor, selecione a data de validade' },
    {
      validator: (rule, value) => {
        if (value && value.isBefore(new Date(), 'day')) {
          return Promise.reject('A carta de condução deve estar válida')
        }
        return Promise.resolve()
      }
    }
  ],
  addressLine1: [
    { required: true, message: 'Por favor, insira o endereço' }
  ],
  postalCode: [
    { required: true, message: 'Por favor, insira o código postal' },
    { pattern: /^\d{4}-\d{3}$/, message: 'Formato: 0000-000' }
  ],
  city: [
    { required: true, message: 'Por favor, insira a sua cidade' }
  ],
  country: [
    { required: true, message: 'Por favor, selecione o país' }
  ],
  agreeTerms: [
    {
      validator: (rule, value) => {
        if (!value) {
          return Promise.reject('Deve concordar com os termos e condições')
        }
        return Promise.resolve()
      }
    }
  ]
}

// Methods
const nextStep = async () => {
  if (currentStep.value === 0) {
    // Validate step 1 fields
    try {
      await formRef.value.validateFields(['firstName', 'lastName', 'email', 'phoneNumber', 'drivingLicenseNumber'])
      currentStep.value++
    } catch (error) {
      message.error('Por favor, corrija os erros antes de continuar')
    }
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function gerarCodigo() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

const handleRegister = async () => {
  try {
    isLoading.value = true
    
    // Prepare registration data according to the API payload
    const registrationData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone_number: formData.phoneNumber,
      driving_license_number: formData.drivingLicenseNumber,
      password: formData.password,
      password_confirm: formData.confirmPassword,
      license_expiry_date: '2025-12-31', // Placeholder, add date picker in future
      address_line_1: '123', // Placeholder, add address fields
      postal_code: '1234-567', // Placeholder, add postal code field
      city: 'Praia', // Placeholder, add city field
      country: 'CV', // Placeholder, add country selector
      id_number: gerarCodigo()
    }
    
    // Call registration service
    const result = await authService.register(registrationData)
    
    console.log('Registration successful:', result)
    
    message.success('Conta criada com sucesso! Bem-vindo ao RentCV!')
    
    // Redirect to login page for user to authenticate
    router.push('/login')
    
  } catch (error) {
    console.error('Registration error:', error)
    if (error.response && error.response.status === 400 && error.response.data?.email) {
      message.error('E-mail já está em uso. Por favor, utilize outro e-mail.')
    } else {
      message.error(error.response?.data?.message || 'Erro ao criar conta. Tente novamente.')
    }
  } finally {
    isLoading.value = false
  }
}

const showTerms = () => {
  // Open terms and conditions modal or page
  window.open('/terms', '_blank')
}

const showPrivacy = () => {
  // Open privacy policy modal or page
  window.open('/privacy', '_blank')
}
</script>

<style scoped>
/* Auth Container */
.auth-container {
  min-height: 100vh;
  position: relative;
  -background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%) !important;
  background: white !important;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 80px;
  overflow: hidden;

}

.divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  background: #fafafa;
  padding: 0 16px;
  color: #6b7280;
  font-size: 14px;
  position: relative;
  z-index: 1;
}

/* Background Decoration */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%) !important;
  backdrop-filter: blur(10px);
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation: float 8s ease-in-out infinite reverse;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation: float 7s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* Auth Wrapper */
.auth-wrapper {
  background: whitesmoke;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 700px;
  width: 100%;
  min-height: 700px;
  position: relative;
  z-index: 2;
}

/* Form Section */
.form-section {
  padding: 20px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: whitesmoke;
  min-height: 700px;
}

.form-container {
  width: 100%;
  max-width: 600px;
}

/* Form Header */
.form-header {
  text-align: center;
  margin-bottom: 15px;
}

.form-logo {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 28px;
  color: white;
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.form-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

/* Progress Steps */
.progress-steps {
  margin-bottom: 30px;
}

.progress-steps :deep(.ant-steps-item-title) {
  font-size: 12px !important;
}

/* Form Steps */
.form-step {
  min-height: 400px;
}

.step-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 15px 0;
  text-align: center;
}

/* Form Styling */
.register-form {
  width: 100%;
}

.form-item {
  margin-bottom: 10px;
}

.form-item :deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-input {
  border-radius: 12px;
}

.form-input :deep(.ant-input) {
  border-radius: 12px;
  -border: 2px solid #e5e7eb;
  padding: 3px 3px;
  transition: all 0.3s ease;
}

.form-input :deep(.ant-input:focus) {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.form-input :deep(.ant-input-password) {
  border-radius: 12px;
}

.form-input :deep(.ant-picker) {
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.form-input :deep(.ant-picker:hover),
.form-input :deep(.ant-picker-focused) {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

/* Form Row */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-item-half {
  margin-bottom: 20px;
}

/* Password Strength */
.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 2px;
}

.strength-fill.weak { background: #ef4444; }
.strength-fill.medium { background: #f59e0b; }
.strength-fill.good { background: #3b82f6; }
.strength-fill.strong { background: #10b981; }

.strength-text {
  font-size: 12px;
  font-weight: 500;
}

.strength-text.weak { color: #ef4444; }
.strength-text.medium { color: #f59e0b; }
.strength-text.good { color: #3b82f6; }
.strength-text.strong { color: #10b981; }

/* Terms */
.terms-item {
  margin: 24px 0;
}

.terms-link {
  color: #8b5cf6;
  text-decoration: none;
}

.terms-link:hover {
  color: #7c3aed;
  text-decoration: underline;
}

/* Navigation */
.form-navigation {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 32px;
}

.nav-btn {
  border-radius: 12px;
  font-weight: 600;
  height: 48px;
  flex: 1;
  transition: all 0.3s ease;
}

.prev-btn {
  border: 2px solid #e5e7eb;
  color: #374151;
}

.prev-btn:hover {
  border-color: #8b5cf6;
  color: #8b5cf6;
}

.next-btn,
.submit-btn {
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%);
  border: none;
}

.next-btn:hover,
.submit-btn:hover {
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%) !important;
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
}

.submit-btn:disabled {
  background: #d1d5db !important;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Login Link */
.login-link {
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

.login-text {
  color: #8b5cf6;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
}

.login-text:hover {
  color: #7c3aed;
  text-decoration: underline;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .auth-container {
    padding: 16px;
  }

  .auth-wrapper {
    max-width: 100%;
  }

  .form-section {
    padding: 40px 24px;
  }

  .form-container {
    max-width: 100%;
  }

  .form-title {
    font-size: 24px;
  }

  .form-logo {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .form-navigation {
    flex-direction: column;
  }

  .nav-btn {
    flex: none;
  }
}

@media (max-width: 480px) {
  .auth-container {
    padding: 12px;
  }

  .form-section {
    padding: 24px 16px;
  }

  .circle-1, .circle-2, .circle-3 {
    display: none;
  }

  .form-step {
    min-height: auto;
  }
}
</style>