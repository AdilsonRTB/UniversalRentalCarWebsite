<template>
  <a-modal 
    :open="visible" 
    @cancel="handleCancel"
    :footer="null"
    :width="1000"
    centered
    class="reservation-modal"
  >
    <div class="modal-content">
      <!-- Reservation Form -->
      <div class="form-section">
        <div class="form-container">
          <!-- Form Header -->
          <div class="form-header">
            <h2 class="form-title">Finalizar Reserva</h2>
            <p class="form-subtitle">Preencha os seus dados para confirmar a reserva</p>
          </div>

          <!-- Layout lado a lado -->
          <a-row :gutter="32">
            <!-- Reservation Details -->
            <a-col :xs="24" :md="24">
              <div class="reservation-details">
                <h3 class="details-title">Detalhes da Reserva</h3>
                <div class="details-grid">
                  <div class="detail-item">
                    <span class="detail-label">Veículo:</span>
                    <span class="detail-value">{{ vehicle?.brand_name }} {{ vehicle?.model }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Data de Recolha:</span>
                    <span class="detail-value">{{ formatDate(pickupDate) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Data de Devolução:</span>
                    <span class="detail-value">{{ formatDate(returnDate) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Período:</span>
                    <span class="detail-value">{{ calculateDays }} {{ calculateDays === 1 ? 'dia' : 'dias' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Valor Diário:</span>
                    <span class="detail-value">{{ vehicle?.daily_rate }} CVE</span>
                  </div>
                  <div class="detail-item total">
                    <span class="detail-label">Total a Pagar:</span>
                    <span class="detail-value">{{ calculateTotal }} CVE</span>
                  </div>
                </div>
              </div>
            </a-col>
            
            <!-- Customer Form -->
            <a-col :xs="24" :md="24" v-if="!qrcode">
              <div class="customer-form">
                <h3 class="form-section-title">Dados Pessoais</h3>
                <a-form
                  ref="formRef"
                  :model="formData"
                  :rules="formRules"
                  layout="horizontal"
                  @finish="handleReservation"
                >
              <!-- Name Fields -->
              <div class="name-row">
                <a-form-item
                  name="firstName"
                  class="form-item half-width"
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
                  class="form-item half-width"
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
                class="form-item"
              >
                <a-input
                  v-model:value="formData.email"
                  size="large"
                  placeholder="seu.email@exemplo.com"
                  :prefix="() => h(MailOutlined, { style: { color: '#8b5cf6' } })"
                  class="form-input"
                />
              </a-form-item>

              <!-- License Field -->
              <a-form-item
                name="drivingLicense"
                class="form-item"
              >
                <a-input
                  v-model:value="formData.drivingLicense"
                  size="large"
                  placeholder="Número da carta de condução"
                  :prefix="() => h(IdcardOutlined, { style: { color: '#8b5cf6' } })"
                  class="form-input"
                />
              </a-form-item>

              <!-- Phone Field -->
              <a-form-item
                name="phone"
                class="form-item"
              >
                <a-input
                  v-model:value="formData.phone"
                  size="large"
                  placeholder="+238 xxx xxxx"
                  :prefix="() => h(PhoneOutlined, { style: { color: '#8b5cf6' } })"
                  class="form-input"
                />
              </a-form-item>

              <!-- Terms and Conditions -->
              <div class="terms-section">
                <a-form-item name="acceptTerms" class="terms-item">
                  <a-checkbox v-model:checked="formData.acceptTerms">
                    Aceito os <a href="#" class="terms-link">termos e condições</a> 
                    e <a href="#" class="terms-link">política de privacidade</a>
                  </a-checkbox>
                </a-form-item>
              </div>

              <!-- Submit Button -->
              <a-form-item class="submit-item">
                <a-button
                  type="primary"
                  html-type="submit"
                  size="large"
                  block
                  :loading="isLoading"
                  :disabled="!formData.acceptTerms"
                  class="submit-btn"
                >
                  <CarOutlined v-if="!isLoading" />
                  Efetuar Reserva
                </a-button>
              </a-form-item>
            </a-form>
            </div>
          </a-col>
          <a-col :xs="24" :md="24" v-if="qrcode">
            <a-qrcode ref="qrcodeCanvasRef" :value="textQrCode" />
            <br />
            <a-button type="primary" @click="dowloadChange">Downlaod</a-button>
          </a-col>
        </a-row>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, watch } from 'vue'
import { message } from 'ant-design-vue'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CarOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
//import logo from '../assets/logo.png'
import {authService, bookingService} from '../services/api'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  vehicle: {
    type: Object,
    required: true
  },
  pickupDate: {
    type: Object,
    required: true
  },
  returnDate: {
    type: Object,
    required: true
  },
  calculateDays: {
    type: Number,
    required: true
  },
  calculateTotal: {
    type: Number,
    required: true
  }
})

const qrcode = ref(false)

const textQrCode = ref("")
const qrcodeCanvasRef = ref();
const dowloadChange = async () => {
  const url = await qrcodeCanvasRef.value.toDataURL({
    size: 512,
    margin: 2,
    scale: 10,
    text: textQrCode.value
  });
  const a = document.createElement('a');
  a.download = 'RentalQRCode.png';
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Emits
const emit = defineEmits(['update:visible', 'reservation-confirmed'])

// Form data
const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  drivingLicense: '',
  phone: '',
  acceptTerms: false
})

// Form validation rules
const formRules = {
  firstName: [
    { required: true, message: 'Por favor insira o seu nome', trigger: 'blur' },
    { min: 2, message: 'Nome deve ter pelo menos 2 caracteres', trigger: 'blur' }
  ],
  lastName: [
    { required: true, message: 'Por favor insira o seu apelido', trigger: 'blur' },
    { min: 2, message: 'Apelido deve ter pelo menos 2 caracteres', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Por favor insira o seu e-mail', trigger: 'blur' },
    { type: 'email', message: 'Por favor insira um e-mail válido', trigger: 'blur' }
  ],
  drivingLicense: [
    { required: true, message: 'Por favor insira o número da carta de condução', trigger: 'blur' },
    { min: 5, message: 'Número da carta deve ter pelo menos 5 caracteres', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Por favor insira o número de telefone', trigger: 'blur' },
    { pattern: /^\+\d{1,3}\s?\d{6,14}$/, message: 'Por favor insira um número de telefone válido', trigger: 'blur' }
  ],
  acceptTerms: [
    { required: true, message: 'Deve aceitar os termos e condições', trigger: 'change', 
      validator: (rule, value) => {
        if (!value) {
          return Promise.reject('Deve aceitar os termos e condições')
        }
        return Promise.resolve()
      }
    }
  ]
}

// Loading state
const isLoading = ref(false)
const formRef = ref(null)

// Methods
const handleCancel = () => {
  emit('update:visible', false)
    // Reset form data
    formData.firstName = ''
    formData.lastName = ''
    formData.email = ''
    formData.drivingLicense = ''
    formData.phone = ''
    formData.acceptTerms = false
    qrcode.value = false;
    textQrCode.value = ""
}

const formatDate = (date) => {
  if (!date) return ''
  return dayjs(date).format('DD/MM/YYYY')
}

const customer = ref(null)

const allCustomers = ref([])

const token = localStorage.getItem('authToken') || ''

const getCustomerData = async () => {
  isLoading.value = true
  try {

    if (!token || token === '' || token === null) {
       const response = await authService.allCustomers();
        allCustomers.value = response.data;
    } else {
      const response = await authService.me()
      customer.value = response.data
        formData.firstName = customer.value.first_name
        formData.lastName = customer.value.last_name
        formData.email = customer.value.email
        formData.phone = customer.value.phone_number || ''
        formData.drivingLicense = customer.value.driving_license_number || ''
        formData.acceptTerms = true
    }
  } catch (error) {
    console.error('[OwnerDashboard] Error fetching customer data:', error)

  } finally {
    isLoading.value = false
  }
}


const verificationEmail = (email) => {
  const customerFound = allCustomers.value.find(cust => cust.email.toUpperCase().trim() === email.toUpperCase().trim())
  return customerFound?.id || null
}

function gerarCodigo() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

const handleReservation = async () => {

  const requestCreateUser = {
    // Personal Information
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    phone_number: formData.phone,
    id_number: gerarCodigo(), // Gerar valores aleatorios para placeholder
    
    // License Information
    driving_license_number: formData.drivingLicense,
    license_expiry_date: '2025-12-31', // Placeholder for license expiry date
    
    // Address Information
    address_line_1: 'address 1',
    address_line_2: '',
    city: 'Praia',
    postal_code: 'postal code',
    country: 'CV', // Default to Cape Verde

    // Terms
    agreeTerms: false
}

isLoading.value = true
  if (formRef.value) {
    try {
      await formRef.value.validate()

      if (token === '' || token === null) {
        const customerId = verificationEmail(formData.email)
        if (customerId) {
            await authService.updateCustomer(customerId, requestCreateUser)
            await createBookingServices(customerId)
        } else {
          // Create new customer logic can be added here
          const response = await authService.createCustomer(requestCreateUser)
          if (response && response.data && response.data.id) {
            await createBookingServices(response.data.id)
          } else {
            message.error("Erro ao criar cliente. Tente novamente.")
          }
        }
      } else {
        await createBookingServices(customer.value.id)
        await authService.updateCustomer(customer.value.id, requestCreateUser)
    }
      //await createBookingServices()
    } catch (error) {
      console.error('Form validation failed:', error)
    }
    finally {
      isLoading.value = false
    }
  }
}


const createBookingServices = async (custumerId) => {
  isLoading.value = true

  const bookingData = {
    vehicle: props.vehicle.id,
    customer: custumerId, // Replace with actual customer ID
    start_date: props.pickupDate,
    end_date: props.returnDate,
    daily_rate: props.vehicle.daily_rate.toString(),
    commission_percent: "10", // Example value
    insurance_fee: "0", // Example value
    security_deposit: "0", // Example value
    late_return_fee: "0", // Example value
    damage_fee: "0", // Example value
    amount_paid: props.calculateTotal.toString(),
    mileage_start: 0, // Example value
    mileage_end: 0, // Example value
    fuel_level_start: 'full', // Example value
    fuel_level_end: 'full', // Example value
    status: 'pending',
    notes: ''
  }

  try {
    const response = await bookingService.createBooking(bookingData)

    if (response && response.data) {
      if (response.data.id > 0) {
        // Notification of success can be added here with time to close
        message.success("Reserva criada com sucesso!")

        textQrCode.value = `Reserva Nº: ${response.data.id}\nCliente: ${formData.firstName} ${formData.lastName}\nVeículo: ${props.vehicle.brand_name} ${props.vehicle.model}\nPeríodo: ${formatDate(props.pickupDate)} a ${formatDate(props.returnDate)}\nTotal: ${props.calculateTotal} CVE`
        qrcode.value = true;


      }
      else {
        message.error("Erro ao criar reserva. Tente novamente.")
      }
    }

  } catch (error) {
    console.error('Erro ao carregar veículos:', error)
    // Mock data for development - fallback when API fails
    // Load promotional vehicles (limited to 10)
    //await loadPromotionalVehicles()
  } finally {
    isLoading.value = false
  }
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    getCustomerData()
  }
})
</script>

<style scoped>
/* Modal Styles */
.reservation-modal :deep(.ant-modal-content) {
  border-radius: 20px;
  overflow: hidden;
  padding: 0;
}

.reservation-modal :deep(.ant-modal-body) {
  padding: 0;
}

/* Modal Content */
.modal-content {
  background: white;
  min-height: 500px;
}

.form-section {
  padding: 20px;
}

.form-container {
  max-width: 100%;
  margin: 0;
}

/* Form Header */
.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 16px 0 8px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 16px;
}

/* Reservation Details */
.reservation-details {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
  border: 1px solid #e2e8f0;
}

.details-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
}

.details-grid {
  display: grid;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-item.total {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
  font-weight: 600;
}

.detail-label {
  color: #6b7280;
  font-size: 14px;
}

.detail-value {
  font-weight: 500;
  color: #1f2937;
}

.detail-item.total .detail-value {
  color: #FE7743;
  font-size: 16px;
  font-weight: 600;
}

/* Customer Form */
.customer-form {
  margin-top: 24px;
}

.form-section-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 20px 0;
}

/* Form Fields */
.name-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-item {
  margin-bottom: 20px;
}

.form-item.half-width {
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
  font-size: 16px;
}

.form-input :deep(.ant-input:focus) {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

/* Terms Section */
.terms-section {
  margin: 24px 0 16px 0;
}

.terms-item {
  margin-bottom: 0 !important;
}

.terms-link {
  color: #8b5cf6;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

/* Submit Button */
.submit-item {
  margin-bottom: 0;
}

.submit-btn {
  height: 50px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  background: linear-gradient(135deg, #FE7743 0%, #ff5722 100%);
  border: none;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(254, 119, 67, 0.3);
}

.submit-btn:disabled {
  background: #d1d5db;
  color: #9ca3af;
  transform: none;
  box-shadow: none;
}

/* Responsive */
@media (max-width: 768px) {
  .reservation-modal :deep(.ant-modal) {
    width: 95% !important;
    max-width: 95% !important;
  }
  
  .form-section {
    padding: 16px;
  }
  
  .form-header {
    margin-bottom: 20px;
  }
  
  .form-title {
    font-size: 24px;
  }
  
  .name-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .details-grid {
    gap: 8px;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .reservation-details {
    margin-bottom: 20px;
  }
}
</style>