<template>
  <div class="auth-container">
    <!-- Background Elements -->
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
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
            Insira o seu e-mail para receber as instruções de recuperação
          </p>
        </div>

        <!-- Form -->
        <div v-if="!emailSent" class="forgot-form">
          <a-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            layout="vertical"
            @finish="handleForgotPassword"
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
                :prefix="() => h(MailOutlined, { style: { color: '#8b5cf6' } })"
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
                <SendOutlined v-if="!isLoading" />
                Enviar Instruções
              </a-button>
            </a-form-item>
          </a-form>
        </div>

        <!-- Success Message -->
        <div v-else class="success-message">
          <div class="success-icon">
            <CheckCircleOutlined />
          </div>
          <h3>E-mail Enviado!</h3>
          <p>
            Enviámos as instruções de recuperação para
            <strong>{{ formData.email }}</strong>
          </p>
          <p class="hint">
            Verifique a sua caixa de entrada e spam. 
            O link expira em 15 minutos.
          </p>
          
          <a-button
            type="link"
            @click="resendEmail"
            :loading="isResending"
            class="resend-btn"
          >
            Reenviar E-mail
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
  SendOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons-vue'
import { ref, reactive, h } from 'vue'
import { message } from 'ant-design-vue'
import authService from '../services/authService'

// Form references
const formRef = ref(null)

// Reactive data
const isLoading = ref(false)
const isResending = ref(false)
const emailSent = ref(false)

const formData = reactive({
  email: ''
})

// Form validation rules
const formRules = {
  email: [
    { required: true, message: 'Por favor, insira o seu e-mail' },
    { type: 'email', message: 'Por favor, insira um e-mail válido' }
  ]
}

// Methods
const handleForgotPassword = async (values) => {
  try {
    isLoading.value = true
    
    await authService.requestPasswordReset(values.email)
    
    emailSent.value = true
    message.success('Instruções enviadas com sucesso!')
    
  } catch (error) {
    console.error('Forgot password error:', error)
    message.error(error.message || 'Erro ao enviar instruções. Tente novamente.')
  } finally {
    isLoading.value = false
  }
}

const resendEmail = async () => {
  try {
    isResending.value = true
    
    await authService.requestPasswordReset(formData.email)
    message.success('E-mail reenviado com sucesso!')
    
  } catch (error) {
    console.error('Resend email error:', error)
    message.error('Erro ao reenviar e-mail. Tente novamente.')
  } finally {
    isResending.value = false
  }
}
</script>

<style scoped>
/* Auth Container */
.auth-container {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 20%;
  left: 15%;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  right: 15%;
  animation: float 8s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* Forgot Wrapper */
.forgot-wrapper {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 450px;
  width: 100%;
  padding: 60px 40px;
  position: relative;
  z-index: 2;
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
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
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
  margin-bottom: 24px;
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
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

/* Submit Button */
.submit-item {
  margin-bottom: 0;
}

.submit-btn {
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  height: 50px;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #7c3aed, #2563eb) !important;
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
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
  color: #8b5cf6;
  font-weight: 600;
  padding: 8px 16px;
  height: auto;
}

.resend-btn:hover {
  color: #7c3aed;
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
  color: #8b5cf6;
  text-decoration: none;
  font-weight: 600;
}

.back-text:hover {
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