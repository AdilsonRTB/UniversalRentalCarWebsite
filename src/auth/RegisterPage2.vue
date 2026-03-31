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
      <div class="form-section">
        <div class="form-container">
          <!-- Form Header -->
          <div class="form-header">
            <img
              :src="logo"
              style="max-width: 160px; height: auto; max-height: 50px; object-fit: contain;"
            />
            <h2 class="form-title">{{ t('auth.createAccountTitle') }}</h2>
            <p class="form-subtitle">{{ t('auth.fillDataToStart') }}</p>

            <!-- Step Indicator -->
            <div class="step-indicator">
              <div 
                class="step-dot" 
                :class="{ active: currentStep === 0, completed: currentStep > 0 }"
                @click="currentStep = 0"
              >
                <UserOutlined v-if="currentStep <= 0" />
                <CheckOutlined v-else />
              </div>
              <div class="step-line" :class="{ active: currentStep > 0 }"></div>
              <div 
                class="step-dot" 
                :class="{ active: currentStep === 1 }"
              >
                <LockOutlined />
              </div>
            </div>
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
              <!-- Step 1: Personal Information -->
              <div v-show="currentStep === 0" class="form-step">
                <!-- Section: Identity -->
                <div class="section-group">
                  <div class="section-label">
                    <UserOutlined class="section-icon" />
                    <span>{{ t('auth.personalInfo') }}</span>
                  </div>

                  <div class="form-row">
                    <a-form-item name="firstName" :label="t('auth.firstName')" class="form-item">
                      <a-input
                        v-model:value="formData.firstName"
                        size="large"
                        :placeholder="t('auth.firstNamePlaceholder')"
                        class="form-input"
                      />
                    </a-form-item>

                    <a-form-item name="lastName" :label="t('auth.lastName')" class="form-item">
                      <a-input
                        v-model:value="formData.lastName"
                        size="large"
                        :placeholder="t('auth.lastNamePlaceholder')"
                        class="form-input"
                      />
                    </a-form-item>
                  </div>

                  <div class="form-row">
                    <a-form-item name="birthDate" :label="t('auth.birthDate')" class="form-item">
                      <a-date-picker
                        v-model:value="formData.birthDate"
                        size="large"
                        :placeholder="t('auth.birthDatePlaceholder')"
                        class="form-input"
                        style="width: 100%"
                        format="DD/MM/YYYY"
                        :disabled-date="(current) => current && current > dayjs().subtract(18, 'year').endOf('day')"
                      />
                    </a-form-item>

                    <a-form-item name="phoneNumber" :label="t('auth.phoneNumber')" class="form-item">
                      <a-input
                        v-model:value="formData.phoneNumber"
                        size="large"
                        placeholder="+238 900 000 000"
                        class="form-input"
                      />
                    </a-form-item>
                  </div>

                  <a-form-item name="email" :label="t('auth.email')" class="form-item">
                    <a-input
                      v-model:value="formData.email"
                      size="large"
                      :placeholder="t('auth.emailPlaceholder')"
                      :prefix="() => h(MailOutlined, { style: { color: '#8b5cf6' } })"
                      class="form-input"
                    />
                  </a-form-item>
                </div>

                <!-- Section: Driving License -->
                <div class="section-group">
                  <div class="section-label">
                    <IdcardOutlined class="section-icon" />
                    <span>{{ t('auth.drivingLicense') }}</span>
                  </div>

                  <div class="form-row">
                    <a-form-item name="drivingLicenseNumber" :label="t('auth.drivingLicensePlaceholder')" class="form-item">
                      <a-input
                        v-model:value="formData.drivingLicenseNumber"
                        size="large"
                        :placeholder="t('auth.drivingLicensePlaceholder')"
                        class="form-input"
                      />
                    </a-form-item>

                    <a-form-item name="licenseIssueDate" :label="t('auth.licenseIssueDate')" class="form-item">
                      <a-date-picker
                        v-model:value="formData.licenseIssueDate"
                        size="large"
                        :placeholder="t('auth.licenseIssueDatePlaceholder')"
                        class="form-input"
                        style="width: 100%"
                        format="DD/MM/YYYY"
                      />
                    </a-form-item>
                  </div>
                </div>
              </div>

              <!-- Step 2: Security -->
              <div v-show="currentStep === 1" class="form-step">
                <div class="section-group">
                  <div class="section-label">
                    <LockOutlined class="section-icon" />
                    <span>{{ t('auth.accountSecurity') }}</span>
                  </div>

                  <a-form-item name="password" :label="t('auth.passwordLabel')" class="form-item">
                    <a-input-password
                      v-model:value="formData.password"
                      size="large"
                      :placeholder="t('auth.passwordPlaceholderRegister')"
                      :prefix="() => h(LockOutlined, { style: { color: '#8b5cf6' } })"
                      class="form-input"
                    />
                    <div class="password-strength" v-if="formData.password">
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

                  <a-form-item name="confirmPassword" :label="t('auth.confirmPasswordLabel')" class="form-item">
                    <a-input-password
                      v-model:value="formData.confirmPassword"
                      size="large"
                      :placeholder="t('auth.confirmPasswordPlaceholder')"
                      :prefix="() => h(LockOutlined, { style: { color: '#8b5cf6' } })"
                      class="form-input"
                    />
                  </a-form-item>

                  <!-- Terms -->
                  <a-form-item name="agreeTerms" class="form-item terms-item">
                    <a-checkbox v-model:checked="formData.agreeTerms">
                      {{ t('auth.agreeWith') }}
                      <a href="#" @click.prevent="showTerms" class="terms-link">{{ t('auth.termsAndConditions') }}</a> 
                      {{ t('auth.and') }}
                      <a href="#" @click.prevent="showPrivacy" class="terms-link">{{ t('auth.privacyPolicy') }}</a>
                    </a-checkbox>
                  </a-form-item>
                </div>
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
                  {{ t('auth.previous') }}
                </a-button>
                <div v-else></div>
                
                <a-button
                  v-if="currentStep < 1"
                  type="primary"
                  size="large"
                  @click="nextStep"
                  class="nav-btn next-btn"
                >
                  {{ t('auth.next') }}
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
                  {{ t('auth.createAccountTitle') }}
                </a-button>
              </div>
            </a-form>

            <!-- Divider -->
            <div class="divider">
              <span>{{ t('auth.or') }}</span>
            </div>

            <!-- Login Link -->
            <div class="login-link">
              <span>{{ t('auth.hasAccount') }}</span>
              <router-link :to="{ path: '/', query: { from: $route.fullPath } }" class="login-text">
                {{ t('auth.doLogin') }}
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
  LockOutlined,
  IdcardOutlined,
  CheckOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined
} from '@ant-design/icons-vue'
import { ref, reactive, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { authService } from '../services/api'
import logo from '../assets/logo2.png'
import HeaderPage from '../components/HeaderPage.vue'
import { useLanguageAndCurrency } from '../composables/useLanguageAndCurrency'

const { t } = useLanguageAndCurrency()
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
  birthDate: null,
  licenseIssueDate: null,
  
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
  else feedback.push(t('auth.pwChars'))
  
  if (/[a-z]/.test(password)) strength++
  else feedback.push(t('auth.pwLowercase'))
  
  if (/[A-Z]/.test(password)) strength++
  else feedback.push(t('auth.pwUppercase'))
  
  if (/[0-9]/.test(password)) strength++
  else feedback.push(t('auth.pwNumber'))
  
  if (/[^A-Za-z0-9]/.test(password)) strength++
  else feedback.push(t('auth.pwSymbol'))
  
  const strengthLevels = [
    { width: '20%', class: 'weak', text: t('auth.pwVeryWeak') },
    { width: '40%', class: 'weak', text: t('auth.pwWeak') },
    { width: '60%', class: 'medium', text: t('auth.pwMedium') },
    { width: '80%', class: 'good', text: t('auth.pwGood') },
    { width: '100%', class: 'strong', text: t('auth.pwStrong') }
  ]
  
  return strengthLevels[strength - 1] || strengthLevels[0]
})

// Form validation rules
const formRules = {
  firstName: [
    { required: true, message: t('auth.firstNameRequired') },
    { min: 2, message: t('auth.nameMinLength') }
  ],
  lastName: [
    { required: true, message: t('auth.lastNameRequired') },
    { min: 2, message: t('auth.nameMinLength') }
  ],
  email: [
    { required: true, message: t('auth.emailRequired') },
    { type: 'email', message: t('auth.emailInvalid') }
  ],
  phoneNumber: [
    { required: true, message: t('auth.phoneNumberRequired') },
    { pattern: /^[+]?[0-9\s-()]+$/, message: t('auth.phoneInvalidFormat') }
  ],
  birthDate: [
    { required: true, message: t('auth.birthDateRequired') },
    {
      validator: (_rule, value) => {
        if (!value) return Promise.resolve()
        const age = dayjs().diff(dayjs(value), 'year')
        if (age < 18) {
          return Promise.reject(t('auth.birthDateMinAge'))
        }
        return Promise.resolve()
      },
      trigger: 'change'
    }
  ],
  licenseIssueDate: [
    { required: true, message: t('auth.licenseIssueDateRequired') }
  ],
  idNumber: [
    { required: true, message: t('auth.idNumberRequired') }
  ],
  password: [
    { required: true, message: t('auth.passwordRequiredRegister') },
    { min: 8, message: t('auth.passwordMinLengthRegister') },
    { 
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      message: t('auth.passwordComplexity') 
    }
  ],
  confirmPassword: [
    { required: true, message: t('auth.confirmPasswordRequired') },
    {
      validator: (rule, value) => {
        if (value && value !== formData.password) {
          return Promise.reject(t('auth.passwordsDoNotMatch'))
        }
        return Promise.resolve()
      }
    }
  ],
  drivingLicenseNumber: [
    { required: true, message: t('auth.drivingLicenseRequired') }
  ],
  licenseExpiryDate: [
    { required: true, message: t('auth.licenseExpiryRequired') },
    {
      validator: (rule, value) => {
        if (value && value.isBefore(new Date(), 'day')) {
          return Promise.reject(t('auth.licenseExpired'))
        }
        return Promise.resolve()
      }
    }
  ],
  addressLine1: [
    { required: true, message: t('auth.addressRequired') }
  ],
  postalCode: [
    { required: true, message: t('auth.postalCodeRequired') },
    { pattern: /^\d{4}-\d{3}$/, message: t('auth.postalCodeFormat') }
  ],
  city: [
    { required: true, message: t('auth.cityRequired') }
  ],
  country: [
    { required: true, message: t('auth.countryRequired') }
  ],
  agreeTerms: [
    {
      validator: (rule, value) => {
        if (!value) {
          return Promise.reject(t('auth.agreeTermsRequired'))
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
      await formRef.value.validateFields(['firstName', 'lastName', 'email', 'phoneNumber', 'drivingLicenseNumber', 'birthDate', 'licenseIssueDate'])
      currentStep.value++
    } catch (error) {
      message.error(t('auth.fixErrorsBeforeContinue'))
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
      birth_date: formData.birthDate ? formData.birthDate.format('YYYY-MM-DD') : null,
      license_issue_date: formData.licenseIssueDate ? formData.licenseIssueDate.format('YYYY-MM-DD') : null,
      password: formData.password,
      password_confirm: formData.confirmPassword,
      license_expiry_date: '2025-12-31', // Placeholder
      address_line_1: '123', // Placeholder, add address fields
      postal_code: '1234-567', // Placeholder, add postal code field
      city: 'Praia', // Placeholder, add city field
      country: 'CV', // Placeholder, add country selector
      id_number: gerarCodigo()
    }
    
    // Call registration service
    const result = await authService.register(registrationData)
    
    console.log('Registration successful:', result)
    
    message.success(t('auth.accountCreatedSuccess'))
    
    // Redirect to login page for user to authenticate
    router.push('/login')
    
  } catch (error) {
    console.error('Registration error:', error)
    if (error.response && error.response.status === 400 && error.response.data?.email) {
      message.error(t('auth.emailAlreadyInUse'))
    } else {
      message.error(error.response?.data?.message || t('auth.accountCreationError'))
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
  background: #f8f9fc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 80px;
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
  background: linear-gradient(90deg, #3A1C71 0%, #FDBB2D 100%);
  opacity: 0.08;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -5%;
  right: -5%;
  animation: float 8s ease-in-out infinite;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: 10%;
  left: -3%;
  animation: float 10s ease-in-out infinite reverse;
}

.circle-3 {
  width: 120px;
  height: 120px;
  top: 40%;
  right: 10%;
  animation: float 7s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Auth Wrapper */
.auth-wrapper {
  max-width: 640px;
  width: 100%;
  position: relative;
  z-index: 2;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #eef0f4;
  margin: 20px 16px;
}

/* Form Section */
.form-section {
  padding: 36px 40px;
  display: flex;
  justify-content: center;
}

.form-container {
  width: 100%;
}

/* Form Header */
.form-header {
  text-align: center;
  margin-bottom: 28px;
}

.form-title {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin: 12px 0 4px 0;
}

.form-subtitle {
  font-size: 14px;
  color: #9ca3af;
  margin: 0 0 24px 0;
}

/* Step Indicator */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-top: 4px;
}

.step-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border: 2px solid #e5e7eb;
  color: #9ca3af;
  background: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
}

.step-dot.active {
  border-color: #8b5cf6;
  color: #8b5cf6;
  background: #f5f3ff;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}

.step-dot.completed {
  border-color: #10b981;
  color: #fff;
  background: #10b981;
}

.step-line {
  width: 60px;
  height: 2px;
  background: #e5e7eb;
  transition: background 0.3s ease;
}

.step-line.active {
  background: linear-gradient(90deg, #10b981, #8b5cf6);
}

/* Section Group */
.section-group {
  margin-bottom: 8px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f3f4f6;
}

.section-label span {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-icon {
  color: #8b5cf6;
  font-size: 16px;
}

/* Form Styling */
.register-form {
  width: 100%;
}

.form-step {
  min-height: 280px;
}

.form-item {
  margin-bottom: 16px;
}

.form-item :deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #374151;
  font-size: 13px;
}

.form-input {
  border-radius: 10px;
}

.form-input :deep(.ant-input) {
  border-radius: 10px;
  padding: 4px 8px;
  transition: all 0.2s ease;
  border-color: #e5e7eb;
}

.form-input :deep(.ant-input:hover) {
  border-color: #c4b5fd;
}

.form-input :deep(.ant-input:focus) {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.08);
}

.form-input :deep(.ant-input-password) {
  border-radius: 10px;
}

.form-input :deep(.ant-picker) {
  border-radius: 10px;
  transition: all 0.2s ease;
}

.form-input :deep(.ant-picker:hover) {
  border-color: #c4b5fd;
}

.form-input :deep(.ant-picker-focused) {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.08);
}

/* Form Row */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Password Strength */
.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 3px;
  background: #f3f4f6;
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
  font-size: 11px;
  font-weight: 500;
}

.strength-text.weak { color: #ef4444; }
.strength-text.medium { color: #f59e0b; }
.strength-text.good { color: #3b82f6; }
.strength-text.strong { color: #10b981; }

/* Terms */
.terms-item {
  margin: 20px 0 0 0;
}

.terms-link {
  color: #8b5cf6;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  color: #7c3aed;
  text-decoration: underline;
}

/* Navigation */
.form-navigation {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
}

.nav-btn {
  border-radius: 10px;
  font-weight: 600;
  height: 46px;
  min-width: 140px;
  transition: all 0.2s ease;
  font-size: 14px;
}

.prev-btn {
  border: 1.5px solid #e5e7eb;
  color: #6b7280;
  background: #fff;
}

.prev-btn:hover {
  border-color: #8b5cf6;
  color: #8b5cf6;
  background: #faf8ff;
}

.next-btn,
.submit-btn {
  background: linear-gradient(135deg, #3A1C71 0%, #FDBB2D 100%) !important;
  border: none;
  color: #fff !important;
}

.next-btn:hover,
.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(58, 28, 113, 0.25);
}

.submit-btn:disabled {
  background: #e5e7eb !important;
  color: #9ca3af !important;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Divider */
.divider {
  text-align: center;
  margin: 15px 0 10px;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #f3f4f6;
}

.divider span {
  background: #ffffff;
  padding: 0 14px;
  color: #9ca3af;
  font-size: 13px;
  position: relative;
  z-index: 1;
}

/* Login Link */
.login-link {
  text-align: center;
  font-size: 14px;
  color: #9ca3af;
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
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .auth-wrapper {
    max-width: 100%;
    border-radius: 20px;
    margin: 16px;
  }

  .form-section {
    padding: 28px 24px;
  }

  .form-title {
    font-size: 22px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .form-navigation {
    flex-direction: column;
  }

  .nav-btn {
    min-width: 100%;
  }
}

@media (max-width: 480px) {
  .form-section {
    padding: 20px 16px;
  }

  .circle-1, .circle-2, .circle-3 {
    display: none;
  }

  .form-step {
    min-height: auto;
  }

  .step-line {
    width: 40px;
  }
}
</style>