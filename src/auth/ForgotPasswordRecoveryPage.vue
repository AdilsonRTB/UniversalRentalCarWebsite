<template>
  <div class="auth-container">
    <!-- Background Elements -->
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- Main Content -->
    <div class="forgot-wrapper">
      <div class="form-container">
        <!-- Header -->
        <div class="form-header">
          <div class="brand-logo">
            <CarOutlined />
          </div>
          <h2 class="form-title">Recuperar Palavra-passe</h2>
          <p class="form-subtitle">
            Insira o código OTP enviado para o seu email e defina uma nova senha
          </p>
        </div>

        <!-- Form -->
        <div v-if="!emailSent" class="forgot-form">
          <a-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            layout="vertical"
            @finish="handlePasswordReset"
          >
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
                :prefix="() => h(MailOutlined, { style: { color: '#667eea' } })"
                :disabled="emailFromUrl"
                class="form-input"
              />
            </a-form-item>

            <!-- OTP Field -->
            <a-form-item
              name="otp"
              label="Código OTP"
              class="form-item"
            >
              <a-input
                v-model:value="formData.otp"
                size="large"
                placeholder="Insira o código de 6 dígitos"
                maxlength="6"
                :prefix="() => h(SafetyOutlined, { style: { color: '#667eea' } })"
                :disabled="otpFromUrl"
                class="form-input"
              />
            </a-form-item>

            <!-- New Password Field -->
            <a-form-item
              name="newPassword"
              label="Nova Senha"
              class="form-item"
            >
              <a-input-password
                v-model:value="formData.newPassword"
                size="large"
                placeholder="Insira a nova senha"
                :prefix="() => h(LockOutlined, { style: { color: '#667eea' } })"
                :iconRender="(visible) => (visible ? h(EyeTwoTone) : h(EyeInvisibleOutlined))"
                class="form-input"
              />
            </a-form-item>

            <!-- Confirm Password Field -->
            <a-form-item
              name="confirmPassword"
              label="Confirmar Nova Senha"
              class="form-item"
            >
              <a-input-password
                v-model:value="formData.confirmPassword"
                size="large"
                placeholder="Confirme a nova senha"
                :prefix="() => h(LockOutlined, { style: { color: '#667eea' } })"
                :iconRender="(visible) => (visible ? h(EyeTwoTone) : h(EyeInvisibleOutlined))"
                class="form-input"
              />
            </a-form-item>

            <!-- Submit Button -->
            <a-form-item class="submit-item">
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                block
                :loading="isLoading"
                class="submit-btn"
              >
                <CheckCircleOutlined v-if="!isLoading" />
                Redefinir Senha
              </a-button>
            </a-form-item>
          </a-form>
        </div>

        <!-- Success Message -->
        <div v-else class="success-message">
          <div class="success-icon">
            <CheckCircleOutlined />
          </div>
          <h3>Senha Redefinida com Sucesso!</h3>
          <p>
            Sua senha foi alterada com sucesso.
          </p>
          <p class="hint">
            Agora você pode fazer login com sua nova senha.
          </p>
          
          <a-button
            @click="goToLogin"
            type="primary"
            class="login-btn"
          >
            Ir para Login
          </a-button>
        </div>

        <!-- Back to Login -->
        <div class="back-link">
          <ArrowLeftOutlined />
          <router-link to="/login" class="back-text">
            Voltar ao Login
          </router-link>
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
  CarOutlined,
  MailOutlined,
  //SendOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  LockOutlined,
  SafetyOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons-vue'
import { ref, reactive, h, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter, useRoute } from 'vue-router'
import {authService} from '../services/api'

// Router
const router = useRouter()
const route = useRoute()

// Form references
const formRef = ref(null)

// Reactive data
const isLoading = ref(false)
const emailSent = ref(false)
const emailFromUrl = ref(false)
const otpFromUrl = ref(false)

const formData = reactive({
  email: '',
  otp: '',
  newPassword: '',
  confirmPassword: ''
})

// Form validation rules
const formRules = {
  email: [
    { required: true, message: 'Por favor, insira o seu e-mail' },
    { type: 'email', message: 'Por favor, insira um e-mail válido' }
  ],
  otp: [
    { required: true, message: 'Por favor, insira o código OTP' },
    { len: 6, message: 'O código OTP deve ter 6 dígitos' }
  ],
  newPassword: [
    { required: true, message: 'Por favor, insira a nova senha' },
    { min: 8, message: 'A senha deve ter pelo menos 8 caracteres' },
    { 
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      message: 'Deve conter pelo menos uma minúscula, maiúscula e um número' 
    }
  ],
  confirmPassword: [
    { required: true, message: 'Por favor, confirme a senha' },
    {
      validator: (rule, value) => {
        if (value && value !== formData.newPassword) {
          return Promise.reject('As senhas não coincidem')
        }
        return Promise.resolve()
      }
    }
  ]
}

// Methods
const handlePasswordReset = async (values) => {
  try {
    isLoading.value = true
    
    await authService.resetPassword(
      values.email,
      values.otp,
      values.newPassword,
      values.confirmPassword
    )
    
    emailSent.value = true
    message.success('Senha redefinida com sucesso!')
    
  } catch (error) {
    console.error('Password reset error:', error)
    message.error(error.message || 'Erro ao redefinir senha. Verifique os dados e tente novamente.')
  } finally {
    isLoading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}

// Load email and OTP from URL on mount
onMounted(() => {
  const { email, otp, code } = route.query
  
  if (email) {
    formData.email = email
    emailFromUrl.value = true
  }
  
  // Support both 'otp' and 'code' query params
  if (otp || code) {
    formData.otp = otp || code
    otpFromUrl.value = true
  }
})
</script>

<style scoped>
/* Auth Container */
.auth-container {
  min-height: 100vh;
  position: relative;
  background: white !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
}

/* Background Decoration */
.background-decoration {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: -1;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%);
  backdrop-filter: blur(20px);
  opacity: 0.6;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 20%;
  left: 10%;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 70%;
  right: 15%;
  animation: float 8s ease-in-out infinite reverse;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 10%;
  left: 20%;
  animation: float 7s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* Forgot Wrapper */
.forgot-wrapper {
  background: whitesmoke;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  max-width: 500px;
  width: 100%;
  padding: 50px 40px;
  position: relative;
  z-index: 10;
  text-align: center;
}

/* Form Container */
.form-container {
  width: 100%;
}

/* Form Header */
.form-header {
  margin-bottom: 40px;
}

.brand-logo {
  width: 80px;
  height: 80px;
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 36px;
  color: white;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
}

.form-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

/* Form Styling */
.forgot-form {
  text-align: left;
  margin-bottom: 32px;
}

.form-item {
  margin-bottom: 20px;
}

.form-item :deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: #374151;
}

.form-input {
  border-radius: 12px;
}

.form-input :deep(.ant-input) {
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.form-input :deep(.ant-input:focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Submit Button */
.submit-item {
  margin-bottom: 0;
}

.submit-btn {
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%) !important;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  height: 50px;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

/* Success Message */
.success-message {
  text-align: center;
  margin-bottom: 32px;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 36px;
  color: white;
}

.success-message h3 {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
}

.success-message p {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.hint {
  font-size: 14px !important;
  color: #9ca3af !important;
}

.resend-btn {
  color: #667eea;
  font-weight: 600;
  padding: 8px 16px;
  height: auto;
}

.resend-btn:hover {
  color: #3A1C71;
}

.login-btn {
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%) !important;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  height: 50px;
  padding: 0 32px;
  margin-top: 16px;
}

.login-btn:hover {
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

/* Back Link */
.back-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

.back-text {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.back-text:hover {
  color: #3A1C71;
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

  .forgot-wrapper {
    padding: 40px 24px;
  }

  .form-title {
    font-size: 24px;
  }

  .brand-logo {
    width: 64px;
    height: 64px;
    font-size: 28px;
  }

  .success-icon {
    width: 64px;
    height: 64px;
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .auth-container {
    padding: 12px;
  }

  .forgot-wrapper {
    padding: 32px 20px;
  }

  .circle-1, .circle-2 {
    display: none;
  }
}
</style>