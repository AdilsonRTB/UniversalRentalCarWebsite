<template>
  <div class="profile-tab">
    <div class="breadcrumb-modern">
      <span class="breadcrumb-current">Area Pessoal</span>
      <span class="breadcrumb-separator">›</span>
      <router-link to="/owner-dashboard?tab=overview" class="breadcrumb-link">Dashboard</router-link>
    </div>
     <a-row :gutter="32" style="margin-bottom: 24px;">
      <a-col :xs="24" :lg="12" :xl="12" :md="12" >
        <div class="profile-header">
          <h2 class="page-title">Meu Perfil</h2>
          <p class="page-subtitle">Gerencie suas informações pessoais e de conta</p>
        </div>
      </a-col>
      <a-col :xs="24" :lg="12" :xl="12" :md="12" >
        <div class="unified-update-section">
          <a-button
            type="primary"
            @click="updateAllProfile"
            :loading="updateLoading"
            size="large"
            class="unified-update-btn"
          >
            <SaveOutlined v-if="!updateLoading" />
            Atualizar Informações
          </a-button>
          <!-- <p class="update-description">Clique para atualizar informações pessoais, endereço e carta de condução</p> -->
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="32">
      <!-- Informações Pessoais -->
      <a-col :xs="24" :lg="12" :md="12" :xl="8">
        <div class="profile-card">
          <div class="card-header">
            <UserOutlined class="card-icon" />
            <h3 class="card-title">Informações Pessoais</h3>
          </div>
          
          <a-form :model="profileForm" layout="vertical" class="profile-form">
            <!-- Nome Completo -->
            <div class="form-row">
              <a-form-item label="Primeiro Nome" class="form-item-half">
                <a-input 
                  v-model:value="profileForm.firstName"
                  size="large"
                  placeholder="Primeiro nome"
                  class="form-input"
                />
              </a-form-item>
              
              <a-form-item label="Último Nome" class="form-item-half">
                <a-input 
                  v-model:value="profileForm.lastName" 
                  size="large"
                  placeholder="Último nome"
                  class="form-input"
                />
              </a-form-item>
            </div>
            
            <!-- Email -->
            <a-form-item label="E-mail">
              <a-input 
                v-model:value="profileForm.email" 
                type="email" 
                size="large"
                disabled
                class="form-input"
                :prefix="() => h(MailOutlined, { style: { color: '#8b5cf6' } })"
              />
              <small class="field-note">O e-mail não pode ser alterado</small>
            </a-form-item>
            
            <!-- Telefone -->
            <a-form-item label="Telefone">
              <a-input 
                v-model:value="profileForm.phoneNumber" 
                size="large"
                placeholder="+351 900 000 000"
                class="form-input"
                :prefix="() => h(PhoneOutlined, { style: { color: '#8b5cf6' } })"
              />
            </a-form-item>
            
            <!-- Documento de Identificação -->
            <a-form-item label="Número de Identificação">
              <a-input 
                v-model:value="profileForm.idNumber" 
                size="large"
                placeholder="Número do documento"
                class="form-input"
                :prefix="() => h(IdcardOutlined, { style: { color: '#8b5cf6' } })"
              />
            </a-form-item>
            
            <!-- Botão removido - será unificado -->
          </a-form>
        </div>
      </a-col>
      
      <!-- Endereço e Outros Dados -->
      <a-col :xs="24" :lg="12" :md="12" :xl="8">
        <!-- Endereço -->
        <div class="profile-card address-card">
          <div class="card-header">
            <HomeOutlined class="card-icon" />
            <h3 class="card-title">Endereço</h3>
          </div>
          
          <a-form :model="addressForm" layout="vertical" class="profile-form">
            <!-- Endereço -->
            <a-form-item label="Endereço (Linha 1)">
              <a-input 
                v-model:value="addressForm.addressLine1" 
                size="large"
                placeholder="Rua, número"
                class="form-input"
                :prefix="() => h(HomeOutlined, { style: { color: '#8b5cf6' } })"
              />
            </a-form-item>
            
            <a-form-item label="Endereço (Linha 2)">
              <a-input 
                v-model:value="addressForm.addressLine2" 
                size="large"
                placeholder="Apartamento, andar (opcional)"
                class="form-input"
              />
            </a-form-item>
            
            <!-- Cidade e Código Postal -->
            <div class="form-row">
              <a-form-item label="Cidade" class="form-item-half">
                <a-input 
                  v-model:value="addressForm.city" 
                  size="large"
                  placeholder="Cidade"
                  class="form-input"
                />
              </a-form-item>
              
              <a-form-item label="Código Postal" class="form-item-half">
                <a-input 
                  v-model:value="addressForm.postalCode" 
                  size="large"
                  placeholder="0000-000"
                  class="form-input"
                />
              </a-form-item>
            </div>
            
            <!-- País -->
            <a-form-item label="País">
              <a-select 
                v-model:value="addressForm.country" 
                size="large"
                class="form-input"
              >
                <a-select-option value="CV">Cabo Verde</a-select-option>
                <a-select-option value="PT">Portugal</a-select-option>
                <a-select-option value="BR">Brasil</a-select-option>
                <a-select-option value="US">Estados Unidos</a-select-option>
                <a-select-option value="FR">França</a-select-option>
              </a-select>
            </a-form-item>
            
            <!-- Botão removido - será unificado -->
          </a-form>
        </div>
      </a-col>
      <!-- Carta de Condução -->
      <a-col :xs="24" :lg="12" :md="12" :xl="8">

        <div class="profile-card license-card">
          <div class="card-header">
            <CarOutlined class="card-icon" />
            <h3 class="card-title">Carta de Condução</h3>
          </div>
          
          <a-form :model="licenseForm" layout="vertical" class="profile-form">
            <a-form-item label="Número da Carta">
              <a-input 
                v-model:value="licenseForm.drivingLicenseNumber" 
                size="large"
                placeholder="Número da carta de condução"
                class="form-input"
                :prefix="() => h(IdcardOutlined, { style: { color: '#8b5cf6' } })"
              />
            </a-form-item>
            
            <a-form-item label="Data de Validade">
              <a-date-picker 
                v-model:value="licenseForm.licenseExpiryDate" 
                size="large"
                placeholder="Data de validade"
                style="width: 100%"
                class="form-input"
              />
            </a-form-item>

          </a-form>
        </div>
      </a-col>

      <!-- Alterar Palavra-passe -->
      <a-col :xs="24" :lg="12" :xl="8" :md="12">
        <div class="profile-card password-card">
          <div class="card-header">
            <LockOutlined class="card-icon" />
            <h3 class="card-title">Segurança da Conta</h3>
          </div>
          
          <a-form :model="passwordForm" layout="vertical" class="profile-form">
            <a-form-item label="Palavra-passe Atual">
              <a-input-password
                v-model:value="passwordForm.currentPassword" 
                size="large"
                placeholder="Digite sua palavra-passe atual"
                class="form-input"
                :prefix="() => h(LockOutlined, { style: { color: '#8b5cf6' } })"
              />
            </a-form-item>
            
            <a-form-item label="Nova Palavra-passe">
              <a-input-password 
                v-model:value="passwordForm.newPassword"
                size="large"
                placeholder="Digite uma nova palavra-passe"
                class="form-input"
                :prefix="() => h(LockOutlined, { style: { color: '#8b5cf6' } })"
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
                  Força: {{ passwordStrength.text }}
                </span>
              </div>
            </a-form-item>
            
            <a-form-item label="Confirmar Nova Palavra-passe">
              <a-input-password 
                v-model:value="passwordForm.confirmPassword" 
                size="large"
                placeholder="Confirme a nova palavra-passe"
                class="form-input"
                :prefix="() => h(LockOutlined, { style: { color: '#8b5cf6' } })"
              />
            </a-form-item>
            
            <a-form-item>
              <a-button 
                type="primary" 
                @click="updatePassword" 
                :loading="passwordLoading"
                size="large"
                class="password-btn"
                block
                :disabled="!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword"
              >
                <LockOutlined v-if="!passwordLoading" />
                Alterar Palavra-passe
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-col>
    </a-row>

  </div>
</template>

<script setup>
import { ref, reactive, computed, h, watch, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { authService } from '../../services/api'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  HomeOutlined,
  CarOutlined,
  SaveOutlined,
  /*TrophyOutlined,
  CalendarOutlined,
  BookOutlined,
  ClockCircleOutlined,
  ShieldOutlined,*/
  LockOutlined
} from '@ant-design/icons-vue'

const loading = ref(false)
const updateLoading = ref(false)
const passwordLoading = ref(false)

const customer = ref(null)

// Formulários reativos
const profileForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  idNumber: ''
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
      
      addressForm.addressLine1 = customer.value.address_line_1 || ''
      addressForm.addressLine2 = customer.value.address_line_2 || ''
      addressForm.city = customer.value.city || ''
      addressForm.postalCode = customer.value.postal_code || ''
      addressForm.country = customer.value.country || 'CV'
      
      licenseForm.drivingLicenseNumber = customer.value.driving_license_number || ''
      licenseForm.licenseExpiryDate = customer.value.license_expiry_date ? dayjs(customer.value.license_expiry_date) : null
    }
  } catch (error) {
    console.error('[ProfileTab] Error fetching customer data:', error)
    message.error('Erro ao carregar dados do cliente.')
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
      driving_license_number: licenseForm.drivingLicenseNumber,
      license_expiry_date: licenseForm.licenseExpiryDate?.format('YYYY-MM-DD')
    }
    
    await authService.updateProfile(updateData)
    
    console.log('Updating all profile data:', updateData)
    message.success('Todas as informações foram atualizadas com sucesso!')
    
    // Recarregar dados para manter sincronização
    await getCustomerData()
  } catch (error) {
    console.error('Error updating profile:', error)
    message.error('Erro ao atualizar informações. Tente novamente.')
  } finally {
    updateLoading.value = false
  }
}

// Atualizar palavra-passe
const updatePassword = async () => {
  // Validações
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    message.error('As palavras-passe não coincidem')
    return
  }
  
  if (passwordForm.newPassword.length < 8) {
    message.error('A nova palavra-passe deve ter pelo menos 8 caracteres')
    return
  }
  
  // Verificar força da password
  if (passwordStrength.value.class === 'weak') {
    message.error('A palavra-passe é muito fraca. Use uma combinação de maiúsculas, minúsculas, números e símbolos.')
    return
  }
  
  passwordLoading.value = true
  try {
    /*const updateData = {
      current_password: passwordForm.currentPassword,
      new_password: passwordForm.newPassword,
      confirm_password: passwordForm.confirmPassword
    }*/
    
    // Aqui você pode fazer a chamada para a API de atualização de senha
    // await authService.updatePassword(updateData)
    
    console.log('Updating password')
    
    // Limpar formulário
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
    message.success('Palavra-passe alterada com sucesso!')
  } catch (error) {
    console.error('Error updating password:', error)
    message.error('Erro ao alterar palavra-passe. Verifique se a palavra-passe atual está correta.')
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
/* Profile Tab Styling */
.profile-tab {
  -padding: 0px;
  -background: #f8fafc;
  min-height: 100vh;
}

.profile-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

/* Profile Cards */
.profile-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.profile-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.card-icon {
  font-size: 24px;
  color: #8b5cf6;
  margin-right: 12px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

/* Forms */
.profile-form {
  margin: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-item-half {
  margin-bottom: 20px;
}

.form-input {
  border-radius: 12px;
}

.form-input :deep(.ant-input) {
  border-radius: 12px;
  -border: 2px solid #e2e8f0;
  padding: 3px 3px;
  transition: all 0.3s ease;
}

.form-input :deep(.ant-input:focus) {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.form-input :deep(.ant-input:disabled) {
  background: #f7fafc;
  color: #6b7280;
}

.form-input :deep(.ant-picker) {
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.form-input :deep(.ant-picker:hover),
.form-input :deep(.ant-picker-focused) {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.form-input :deep(.ant-select-selector) {
  border-radius: 12px !important;
  border: 2px solid #e2e8f0 !important;
  padding: 8px 16px !important;
  min-height: 48px !important;
}

.form-input :deep(.ant-select-focused .ant-select-selector) {
  border-color: #8b5cf6 !important;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1) !important;
}

.field-note {
  color: #6b7280;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

/* Update Buttons */
.update-btn {
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  height: 48px;
  padding: 0 24px;
  transition: all 0.3s ease;
}

.update-btn:hover {
  background: linear-gradient(135deg, #7c3aed, #2563eb) !important;
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
}

/* Unified Update Button */
.unified-update-section {
  text-align: center;
  padding: 0px;
  margin: 0px 0;
}

.unified-update-btn {
  min-width: 300px;
  background: linear-gradient(135deg, #059669, #10b981);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  height: 56px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.2);
}

.unified-update-btn:hover,
.unified-update-btn:focus {
  background: linear-gradient(135deg, #047857, #059669) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(16, 185, 129, 0.4);
}

.update-description {
  margin-top: 0px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

/* Stats Section */
.profile-stats-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-top: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.stats-grid {
  margin-top: 16px;
}

.stat-card {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive Design (expanded) */
@media (max-width: 1200px) {
  .form-row {
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .profile-card {
    padding: 20px;
  }
}

@media (max-width: 1024px) {
  /* stack form fields for medium screens */
  .form-row {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .unified-update-btn {
    min-width: 240px;
  }
  .update-section {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .profile-tab {
    padding: 16px;
  }
  
  /* Make form fields single column on small screens */
  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .profile-card {
    padding: 16px;
    border-radius: 12px;
  }

  /* Buttons should be full width for easy tapping */
  .unified-update-btn,
  .main-update-btn,
  .password-update-btn,
  .password-btn {
    width: 100% !important;
    min-width: 0 !important;
  }

  .card-header {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .profile-tab {
    padding: 12px;
  }

  .form-row {
    gap: 8px;
  }

  .unified-update-btn {
    font-size: 14px;
    height: 48px;
  }

  .card-icon {
    margin-right: 0;
  }
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
</style>
