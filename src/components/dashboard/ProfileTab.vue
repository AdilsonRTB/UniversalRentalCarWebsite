<template>
  <div class="profile-tab-modern">
    <!-- Header Section -->

    <div class="profile-header-modern">
      <div class="header-content">
        <div class="breadcrumb-modern">
          <!--router-link to="/owner-dashboard?tab=overview" class="breadcrumb-link">Dashboard</!--router-link-->
          <span class="breadcrumb-link">Dashboard</span>
          <span class="breadcrumb-separator">›</span>
          <span class="breadcrumb-current">{{ $t('profile.myProfile') }}</span>
        </div>

        <!--div-- class="title-section">
          <h1 class="page-title-modern">Meu Perfil</h1>
          <p class="page-subtitle-modern">Gerencie suas informações pessoais e de conta</p>
        </!--div-->
        
        <div class="header-actions">
          <a-button
            type="default"
            @click="showPasswordModal = true"
            size="large"
            class="password-modal-btn"
          >
            <LockOutlined />
            {{ $t('profile.changePassword') }}
          </a-button>
          
          <a-button
            type="primary"
            @click="updateAllProfile"
            :loading="updateLoading"
            size="large"
            class="save-btn-modern"
          >
            <SaveOutlined v-if="!updateLoading" />
            {{ $t('profile.saveChanges') }}
          </a-button>
        </div>
      </div>
    </div>

    <!-- Main Profile Card -->
    <div class="main-profile-card">
      <a-form layout="vertical" class="profile-form-modern">
        <!-- Personal Info Section -->
        <div class="form-section">
          <div class="section-header">
            <UserOutlined class="section-icon" />
            <h3 class="section-title">{{ $t('profile.personalInfo') }}</h3>
          </div>
          
          <a-row :gutter="24">
            <a-col :xs="24" :sm="8">
              <a-form-item :label="$t('profile.firstName')">
                <a-input 
                  v-model:value="profileForm.firstName"
                  size="large"
                  :placeholder="$t('profile.firstNamePlaceholder')"
                  class="modern-input"
                />
              </a-form-item>
            </a-col>
            
            <a-col :xs="24" :sm="8">
              <a-form-item :label="$t('profile.lastName')">
                <a-input 
                  v-model:value="profileForm.lastName" 
                  size="large"
                  :placeholder="$t('profile.lastNamePlaceholder')"
                  class="modern-input"
                />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :sm="8">
              <a-form-item :label="$t('profile.birthDate')">
                <a-date-picker
                  v-model:value="profileForm.birthDate" 
                  size="large"
                  :placeholder="$t('profile.birthDatePlaceholder')"
                  style="width: 100%"
                  class="modern-input"
                />
              </a-form-item>
            </a-col>
            
            <a-col :xs="24" :sm="12">
              <a-form-item :label="$t('profile.email')">
                <a-input
                  v-model:value="profileForm.email"
                  type="email"
                  size="large"
                  disabled
                  class="modern-input"
                />
                <small class="field-note">{{ $t('profile.emailReadonly') }}</small>
              </a-form-item>
            </a-col>
            
            <a-col :xs="24" :sm="12">
              <a-form-item :label="$t('profile.phone')">
                <a-input 
                  v-model:value="profileForm.phoneNumber" 
                  size="large"
                  :placeholder="$t('profile.phonePlaceholder')"
                  class="modern-input"
                />
              </a-form-item>
            </a-col>
            
            <!--a-col :xs="24" :sm="12">
              <a-form-item :label="$t('profile.idNumber')">
                <a-input 
                  v-model:value="profileForm.idNumber" 
                  size="large"
                  :placeholder="$t('profile.idNumberPlaceholder')"
                  class="modern-input"
                />
              </a-form-item>
            </!a-col-->


          </a-row>
        </div>

        <!-- Address Section -->
        <div class="form-section">
          <div class="section-header">
            <HomeOutlined class="section-icon" />
            <h3 class="section-title">{{ $t('profile.address') }}</h3>
          </div>

          <a-row :gutter="24">

            <a-col :xs="24" :sm="12">
              <a-form-item :label="$t('profile.country')">
                <a-select
                  v-model:value="addressForm.country"
                  size="large"

                >
                  <a-select-option value="CV">{{ $t('profile.countryCV') }}</a-select-option>
                  <a-select-option value="PT">{{ $t('profile.countryPT') }}</a-select-option>
                  <a-select-option value="BR">{{ $t('profile.countryBR') }}</a-select-option>
                  <a-select-option value="US">{{ $t('profile.countryUS') }}</a-select-option>
                  <a-select-option value="FR">{{ $t('profile.countryFR') }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :xs="24" :sm="12">
              <a-form-item :label="$t('profile.city')">
                <a-input 
                  v-model:value="addressForm.city"
                  size="large"
                  :placeholder="$t('profile.cityPlaceholder')"
                  class="modern-input"
                />
              </a-form-item>
            </a-col>


            <a-col :xs="24" :sm="8">
              <a-form-item :label="$t('profile.addressLine1')">
                <a-input 
                  v-model:value="addressForm.addressLine1" 
                  size="large"
                  :placeholder="$t('profile.addressLine1Placeholder')"
                  class="modern-input"
                />
              </a-form-item>
            </a-col>
            
            <a-col :xs="24" :sm="8">
              <a-form-item :label="$t('profile.addressLine2')">
                <a-input 
                  v-model:value="addressForm.addressLine2" 
                  size="large"
                  :placeholder="$t('profile.addressLine2Placeholder')"
                  class="modern-input"
                />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :sm="8">
              <a-form-item :label="$t('profile.postalCode')">
                <a-input 
                  v-model:value="addressForm.postalCode" 
                  size="large"
                  :placeholder="$t('profile.postalCodePlaceholder')"
                  class="modern-input"
                />
              </a-form-item>
            </a-col>
            

          </a-row>
        </div>

        <!-- License Section -->
        <div class="form-section">
          <div class="section-header">
            <CarOutlined class="section-icon" />
            <h3 class="section-title">{{ $t('profile.drivingLicense') }}</h3>
          </div>
          
          <a-row :gutter="24">
            <a-col :xs="24" :sm="8">
              <a-form-item :label="$t('profile.licenseNumber')">
                <a-input
                  v-model:value="licenseForm.drivingLicenseNumber" 
                  size="large"
                  :placeholder="$t('profile.licenseNumberPlaceholder')"
                  class="modern-input"
                />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :sm="8">
              <a-form-item :label="$t('profile.licenseIssueDate')">
                <a-date-picker 
                  v-model:value="licenseForm.licenseIssueDate" 
                  size="large"
                  :placeholder="$t('profile.licenseIssueDatePlaceholder')"
                  style="width: 100%"
                  class="modern-input"
                />
              </a-form-item>
            </a-col>
            
            <a-col :xs="24" :sm="8">
              <a-form-item :label="$t('profile.licenseExpiryDate')">
                <a-date-picker 
                  v-model:value="licenseForm.licenseExpiryDate" 
                  size="large"
                  :placeholder="$t('profile.licenseExpiryPlaceholder')"
                  style="width: 100%"
                  class="modern-input"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </a-form>
    </div>

    <!-- Password Change Modal -->
    <a-modal
      v-model:visible="showPasswordModal"
      :title="$t('profile.changePassword')"
      :footer="null"
      width="500px"
      centered
      class="password-modal"
    >
      <a-form :model="passwordForm" layout="vertical" class="password-form">
        <a-form-item :label="$t('profile.currentPassword')">
          <a-input-password
            v-model:value="passwordForm.currentPassword" 
            size="large"
            :placeholder="$t('profile.currentPasswordPlaceholder')"
            class="modern-input"
          />
        </a-form-item>
        
        <a-form-item :label="$t('profile.newPassword')">
          <a-input-password 
            v-model:value="passwordForm.newPassword"
            size="large"
            :placeholder="$t('profile.newPasswordPlaceholder')"
            class="modern-input"
          />
          <div class="password-strength" v-if="passwordForm.newPassword">
            <div class="strength-bar">
              <div 
                class="strength-fill" 
                :class="passwordStrength.class"
                :style="{ width: passwordStrength.width }"
              ></div>
            </div>
            <span class="strength-text" :class="passwordStrength.class">
              {{ $t('profile.passwordStrength') }} {{ passwordStrength.text }}
            </span>
          </div>
        </a-form-item>
        
        <a-form-item :label="$t('profile.confirmNewPassword')">
          <a-input-password 
            v-model:value="passwordForm.confirmPassword" 
            size="large"
            :placeholder="$t('profile.confirmPasswordPlaceholder')"
            class="modern-input"
          />
        </a-form-item>
        
        <div class="modal-actions">
          <a-button 
            size="large"
            @click="showPasswordModal = false"
            class="cancel-btn"
          >
            {{ $t('profile.cancel') }}
          </a-button>
          <a-button 
            type="primary" 
            @click="updatePassword"
            :loading="passwordLoading"
            size="large"
            class="confirm-btn"
            :disabled="!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword"
          >
            <LockOutlined v-if="!passwordLoading" />
            {{ $t('profile.changePassword') }}
          </a-button>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { authService } from '../../services/api'
import {
  UserOutlined,
  HomeOutlined,
  CarOutlined,
  SaveOutlined,
  LockOutlined
} from '@ant-design/icons-vue'

const { t } = useI18n()

const loading = ref(false)
const updateLoading = ref(false)
const passwordLoading = ref(false)
const showPasswordModal = ref(false)

const customer = ref(null)

// Formulários reativos
const profileForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  idNumber: '',
  birthDate: null
})

const addressForm = reactive({
  addressLine1: '',
  addressLine2: '',
  city: '',
  postalCode: '',
  country: 'CV'
})

const licenseForm = reactive({
  drivingLicenseNumber: '',
  licenseIssueDate: null,
  licenseExpiryDate: null
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Password strength computation
const passwordStrength = computed(() => {
  const password = passwordForm.newPassword
  if (!password) return { width: '0%', class: '', text: '' }
  
  let strength = 0
  let feedback = []
  
  if (password.length >= 8) strength++
  else feedback.push(t('profile.passwordChars'))
  
  if (/[a-z]/.test(password)) strength++
  else feedback.push(t('profile.passwordLower'))
  
  if (/[A-Z]/.test(password)) strength++
  else feedback.push(t('profile.passwordUpper'))
  
  if (/[0-9]/.test(password)) strength++
  else feedback.push(t('profile.passwordNumber'))
  
  if (/[^A-Za-z0-9]/.test(password)) strength++
  else feedback.push(t('profile.passwordSymbol'))
  
  const strengthLevels = [
    { width: '20%', class: 'weak', text: t('profile.passwordVeryWeak') },
    { width: '40%', class: 'weak', text: t('profile.passwordWeak') },
    { width: '60%', class: 'medium', text: t('profile.passwordMedium') },
    { width: '80%', class: 'good', text: t('profile.passwordGood') },
    { width: '100%', class: 'strong', text: t('profile.passwordStrong') }
  ]
  
  return strengthLevels[strength - 1] || strengthLevels[0]
})

// Buscar dados do cliente
const getCustomerData = async () => {
  loading.value = true
  try {
    const response = await authService.me()
    customer.value = response.data
    console.log('[ProfileTab] Fetched customer data:', customer.value)
    
    // Preencher formulários com dados do cliente
    if (customer.value) {
      profileForm.firstName = customer.value.first_name || ''
      profileForm.lastName = customer.value.last_name || ''
      profileForm.email = customer.value.email || ''
      profileForm.phoneNumber = customer.value.phone_number || ''
      profileForm.idNumber = customer.value.id_number || ''
      profileForm.birthDate = customer.value.birth_date ? dayjs(customer.value.birth_date) : null
      
      addressForm.addressLine1 = customer.value.address_line_1 || ''
      addressForm.addressLine2 = customer.value.address_line_2 || ''
      addressForm.city = customer.value.city || ''
      addressForm.postalCode = customer.value.postal_code || ''
      addressForm.country = customer.value.country || 'CV'
      
      licenseForm.drivingLicenseNumber = customer.value.driving_license_number || ''
      licenseForm.licenseIssueDate = customer.value.license_issue_date ? dayjs(customer.value.license_issue_date) : null
      licenseForm.licenseExpiryDate = customer.value.license_expiry_date ? dayjs(customer.value.license_expiry_date) : null
    }
  } catch (error) {
    console.error('[ProfileTab] Error fetching customer data:', error)
    message.error(t('profile.loadCustomerDataError'))
  } finally {
    loading.value = false
  }
}

// Atualizar todas as informações do perfil (unificado)
const updateAllProfile = async () => {
  updateLoading.value = true
  try {
    const updateData = {
      first_name: profileForm.firstName,
      last_name: profileForm.lastName,
      email: profileForm.email, // Incluído no JSON mas será readonly
      phone_number: profileForm.phoneNumber,
      address_line_1: addressForm.addressLine1,
      address_line_2: addressForm.addressLine2,
      city: addressForm.city,
      postal_code: addressForm.postalCode,
      country: addressForm.country,
      id_number: profileForm.idNumber,
      birth_date: profileForm.birthDate?.format('YYYY-MM-DD'),
      driving_license_number: licenseForm.drivingLicenseNumber,
      license_issue_date: licenseForm.licenseIssueDate?.format('YYYY-MM-DD'),
      license_expiry_date: licenseForm.licenseExpiryDate?.format('YYYY-MM-DD')
    }

    await authService.updateCustomer(customer.value.id ,updateData)
    
    console.log('Updating all profile data:', updateData)
    message.success(t('profile.allInformationUpdatedSuccess'))
    
    // Recarregar dados para manter sincronização
    await getCustomerData()
  } catch (error) {
    console.error('Error updating profile:', error)
    message.error(t('profile.updateInformationError'))
  } finally {
    updateLoading.value = false
  }
}

// Atualizar palavra-passe
const updatePassword = async () => {
  // Validações
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    message.error(t('profile.passwordMismatchMessage'))
    return
  }
  
  if (passwordForm.newPassword.length < 8) {
    message.error(t('profile.passwordMinLengthMessage'))
    return
  }
  
  // Validar padrão da senha (minúscula, maiúscula e número)
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  if (!passwordPattern.test(passwordForm.newPassword)) {
    message.error('A senha deve conter pelo menos uma minúscula, maiúscula e um número')
    return
  }
  
  // Verificar força da password
  if (passwordStrength.value.class === 'weak') {
    message.error(t('profile.passwordWeakMessage'))
    return
  }
  
  passwordLoading.value = true
  try {
    const requestData = {
      customer_id: customer.value.id,
      current_password: passwordForm.currentPassword,
      new_password: passwordForm.newPassword,
      confirm_password: passwordForm.confirmPassword
    }
    
    // Aqui você pode fazer a chamada para a API de atualização de senha
    await authService.changePassword(requestData.customer_id, requestData.current_password, requestData.new_password, requestData.confirm_password)
    
    console.log('Updating password')
    
    // Limpar formulário
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
    // Fechar modal
    showPasswordModal.value = false
    
    message.success(t('profile.passwordChangedSuccessMessage'))
  } catch (error) {
    console.error('Error updating password:', error)
    message.error(t('profile.passwordChangeErrorMessage'))
  } finally {
    passwordLoading.value = false
  }
}

// Formatar data
/*const formatDate = (date) => {
  if (!date) return 'N/A'
  return dayjs(date).format('DD/MM/YYYY')
}*/

// Watch para formatação do código postal
watch(() => addressForm.postalCode, (newValue) => {
  if (newValue && newValue.length === 4 && !newValue.includes('-')) {
    addressForm.postalCode = newValue + '-'
  }
})

onMounted(() => {
  getCustomerData()
})
</script>

<style scoped>
/* Modern Profile Tab Styling */
.profile-tab-modern {
  -padding: 24px;
  -background: #f8fafc;
  min-height: 100vh;
}

/* Header Section */
.profile-header-modern {
  border-radius: 24px;
  padding: 10px;
  position: relative;
  overflow: hidden;
}

.profile-header-modern::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(50%, -50%);
}

.header-content {
  position: relative;
  z-index: 2;
}

.breadcrumb-modern {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 14px;
}

.breadcrumb-link {
  color: rgba(22, 21, 21, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: black;
}

.breadcrumb-separator {
  color: rgba(8, 8, 8, 0.6);
  margin: 0 4px;
}

.breadcrumb-current {
  color: black;
  font-weight: 500;
}

.title-section {
  margin-bottom: 32px;
}

.page-title-modern {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #fff 0%, #f0f9ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle-modern {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.password-modal-btn {
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%) !important;
  -border: 2px solid rgba(255, 255, 255, 0.3) !important;
  color: white !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  height: 48px !important;
  padding: 0 24px !important;
  backdrop-filter: blur(10px) !important;
  transition: all 0.3s ease !important;
}

.save-btn-modern {
  background: linear-gradient(135deg, #FDBB2D 0%, #FDBB2D 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  height: 48px !important;
  padding: 0 32px !important;
  box-shadow: 0 8px 24px rgba(254, 119, 67, 0.4) !important;
  transition: all 0.3s ease !important;
}

.save-btn-modern:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 12px 32px rgba(254, 119, 67, 0.5) !important;
}

/* Main Profile Card */
.main-profile-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.profile-form-modern {
  margin: 0;
}

.form-section {
  margin-bottom: 48px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
}

.section-icon {
  font-size: 28px;
  color: #667eea;
  margin-right: 16px;
  padding: 12px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.modern-input :deep(.ant-input),
.modern-input :deep(.ant-input-password-input) {
  border: 2px solid #e2e8f0 !important;
  border-radius: 12px !important;
  padding: 12px 16px !important;
  font-size: 16px !important;
  transition: all 0.3s ease !important;
  background: #fafbfc !important;
}

.modern-input :deep(.ant-input:focus),
.modern-input :deep(.ant-input-password-input:focus),
.modern-input :deep(.ant-input-focused) {
  border-color: #667eea !important;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
  background: white !important;
}

.modern-input :deep(.ant-input:disabled) {
  background: #f1f5f9 !important;
  color: #64748b !important;
  border-color: #d1d5db !important;
}

.modern-input :deep(.ant-select-selector) {
  border: 2px solid #e2e8f0 !important;
  border-radius: 12px !important;
  padding: 8px 16px !important;
  min-height: 48px !important;
  background: #fafbfc !important;
}

.modern-input :deep(.ant-select-focused .ant-select-selector) {
  border-color: #667eea !important;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
  background: white !important;
}

.modern-input :deep(.ant-picker) {
  border: 2px solid #e2e8f0 !important;
  border-radius: 12px !important;
  padding: 12px 16px !important;
  background: #fafbfc !important;
}

.modern-input :deep(.ant-picker:hover),
.modern-input :deep(.ant-picker-focused) {
  border-color: #667eea !important;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
  background: white !important;
}

.field-note {
  color: #64748b;
  font-size: 13px;
  margin-top: 6px;
  display: block;
  font-style: italic;
}

/* Password Modal */
.password-modal :deep(.ant-modal-header) {
  padding: 24px 32px !important;
  border-bottom: 2px solid #f1f5f9 !important;
  border-radius: 16px 16px 0 0 !important;
}

.password-modal :deep(.ant-modal-title) {
  font-size: 20px !important;
  font-weight: 700 !important;
  color: #1e293b !important;
}

.password-modal :deep(.ant-modal-body) {
  padding: 32px !important;
}

.password-modal :deep(.ant-modal-content) {
  border-radius: 16px !important;
  overflow: hidden !important;
}

.password-form {
  margin: 0;
}

.password-strength {
  margin-top: 12px;
}

.strength-bar {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 3px;
}

.strength-fill.weak {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.strength-fill.medium {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.strength-fill.good {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}

.strength-fill.strong {
  background: linear-gradient(90deg, #10b981, #059669);
}

.strength-text {
  font-size: 12px;
  font-weight: 600;
}

.strength-text.weak {
  color: #ef4444;
}

.strength-text.medium {
  color: #f59e0b;
}

.strength-text.good {
  color: #3b82f6;
}

.strength-text.strong {
  color: #10b981;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.cancel-btn {
  background: #f8fafc !important;
  border: 2px solid #e2e8f0 !important;
  color: #64748b !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  height: 48px !important;
  padding: 0 24px !important;
}

.cancel-btn:hover {
  background: #f1f5f9 !important;
  border-color: #d1d5db !important;
  color: #374151 !important;
}

.confirm-btn {
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  height: 48px !important;
  padding: 0 24px !important;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3) !important;
  color: white !important;
}

.confirm-btn:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4) !important;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .profile-tab-modern {
    padding: 16px;
  }
  
  .profile-header-modern {
    padding: 32px 24px;
  }
  
  .main-profile-card {
    padding: 32px 24px;
  }
  
  .page-title-modern {
    font-size: 36px;
  }
}

@media (max-width: 768px) {
  .profile-tab-modern {
    padding: 12px;
  }
  
  .profile-header-modern {
    padding: 24px 20px;
  }
  
  .main-profile-card {
    padding: 24px 20px;
  }
  
  .page-title-modern {
    font-size: 28px;
  }
  
  .page-subtitle-modern {
    font-size: 16px;
  }
  
  .header-actions {
    flex-direction: column;
  }
  
  .password-modal-btn,
  .save-btn-modern {
    width: 100% !important;
  }
  
  .section-icon {
    font-size: 24px;
    padding: 10px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .profile-header-modern {
    padding: 20px 16px;
  }
  
  .main-profile-card {
    padding: 20px 16px;
  }
  
  .page-title-modern {
    font-size: 24px;
  }
  
  .form-section {
    margin-bottom: 32px;
  }
}
</style>
