<template>
  <a-modal 
    :open="visible" 
    @cancel="handleCancel" 
    :footer="null" 
    :width="500"
    centered
    class="login-modal"
  >
    <div class="modal-content">
      <!-- Login Form -->
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
            <h2 class="form-title">Bem-vindo de volta!</h2>
            <p class="form-subtitle">Entre na sua conta para continuar</p>
          </div>

          <!-- Login Form -->
          <div class="login-form">
            <a-form
              ref="formRef"
              :model="formData"
              :rules="formRules"
              layout="vertical"
              @finish="handleLogin"
            >
              <!-- Email Field -->
              <a-form-item
                name="email"
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

              <!-- Password Field -->
              <a-form-item
                name="password"
                class="form-item"
              >
                <a-input-password
                  v-model:value="formData.password"
                  size="large"
                  placeholder="Password"
                  :prefix="() => h(LockOutlined, { style: { color: '#8b5cf6' } })"
                  class="form-input"
                />
              </a-form-item>

              <!-- Remember & Forgot -->
              <div class="form-options">
                <a-checkbox v-model:checked="formData.rememberMe">
                  Lembrar-me
                </a-checkbox>
                <a href="#" class="forgot-link" @click.prevent="showForgotPassword">
                  Esqueceu a palavra-passe?
                </a>
              </div>

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
                  <LoginOutlined v-if="!isLoading" />
                  Entrar
                </a-button>
              </a-form-item>
            </a-form>

            <!-- Divider -->
            <div class="divider">
              <span>ou</span>
            </div>

            <!-- Register Link -->
            <div class="register-link">
              <span>Ainda não tem conta?</span>
              <a href="#" class="register-text" @click.prevent="handleRegister">
                Criar conta
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import {
  MailOutlined,
  LockOutlined,
  LoginOutlined
} from '@ant-design/icons-vue'
import { ref, reactive, h, defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {authService} from '../services/api'
import logo from '../assets/logo2.png'

defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'success', 'register'])

const router = useRouter()

// Form references
const formRef = ref(null)

// Reactive data
const isLoading = ref(false)

const formData = reactive({
  email: '',
  password: '',
  rememberMe: false
})



// Form validation rules
const formRules = {
  email: [
    { required: true, message: 'Por favor, insira o seu e-mail' },
    { type: 'email', message: 'Por favor, insira um e-mail válido' }
  ],
  password: [
    { required: true, message: 'Por favor, insira a sua palavra-passe' },
    { min: 6, message: 'A palavra-passe deve ter pelo menos 6 caracteres' }
  ]
}

// Methods
const handleLogin = async (values) => {
  try {
    isLoading.value = true

    const request = {
      email: values.email,
      password: values.password
    }
    
    // Use our custom auth service
    const result = await authService.login(request)
    
    console.log('Login successful:', result)
    
    // Store authentication data
    localStorage.setItem('authToken', result.data.token)
    //localStorage.setItem('userData', JSON.stringify(result.user))


    if (formData.rememberMe) {
      localStorage.setItem('rememberMe', 'true')
    }
    
    //message.success(`Bem-vindo, ${result.customer?.first_name || result.user.username}!`)
    
    // Emit success and close modal
    emit('success', result)
    emit('close')
    
  } catch (error) {
    console.error('Login error:', error)
    message.error(error.message || 'Erro ao fazer login. Verifique as suas credenciais.')
  } finally {
    isLoading.value = false
  }
}

const showForgotPassword = () => {
  // Navigate to forgot password page or show modal
  router.push('/forgot-password')
}

const handleCancel = () => {
  emit('close')
}

const handleRegister = () => {
  emit('register')
  emit('close')
}
</script>

<style scoped>
/* Modal Styling */
:deep(.ant-modal .ant-modal-content) {
  border-radius: 20px;
  overflow: hidden;
  padding: 0;
}

:deep(.ant-modal .ant-modal-body) {
  padding: 0;
}

.login-modal {
  z-index: 1001;
}

/* Modal Content */
.modal-content {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  max-width: 500px;
  width: 100%;
}

/* Form Section */
.form-section {
  padding: 40px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.form-container {
  width: 100%;
  max-width: 420px;
}

/* Form Header */
.form-header {
  text-align: center;
  margin-bottom: 40px;
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

/* Form Styling */
.login-form {
  width: 100%;
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
  -border: 2px solid #e5e7eb;
  padding: 2px 2px;
  transition: all 0.3s ease;
}

.form-input :deep(.ant-input:focus) {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.form-input :deep(.ant-input-password) {
  border-radius: 12px;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.forgot-link {
  color: #8b5cf6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #7c3aed;
}

/* Submit Button */
.submit-item {
  margin-bottom: 24px;
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
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
}

/* Divider */
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

/* Alternative Login */
.alternative-login {
  margin-bottom: 32px;
}

.keycloak-btn {
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  color: #374151;
  font-weight: 500;
  height: 50px;
  transition: all 0.3s ease;
}

.keycloak-btn:hover {
  border-color: #8b5cf6;
  color: #8b5cf6;
  background: #f8fafc;
}

/* Register Link */
.register-link {
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

.register-text {
  color: #8b5cf6;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
}

.register-text:hover {
  color: #7c3aed;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-content {
    max-width: 100%;
  }

  .form-section {
    padding: 30px 24px;
  }

  .form-container {
    max-width: 100%;
  }

  .form-title {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .form-section {
    padding: 25px 20px;
  }
}
</style>