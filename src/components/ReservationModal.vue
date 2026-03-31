<template>
  <a-modal 
    :open="visible" 
    @cancel="handleCancel"
    :footer="null"
    :width="800"
    centered
    class="reservation-modal"
  >
    <div class="modal-content">
      <!-- Reservation Form -->
      <div class="form-section">
        <div class="form-container">
          <!-- Form Header -->
          <div class="form-header">
            <h2 class="form-title">{{ $t('reservation.title') }}</h2>
            <p class="form-subtitle">{{ $t('reservation.subtitle') }}</p>
          </div>

          <!-- Layout lado a lado -->
          <a-row :gutter="32">
            <!-- Reservation Details -->
            <a-col :xs="24" :md="24">
              <div class="reservation-details">
                <div class="details-header">
                  <div class="details-header-icon">
                    <CarOutlined />
                  </div>
                  <div>
                    <h3 class="details-title">{{ $t('reservation.details.title') }}</h3>
                    <p class="details-vehicle-name">{{ vehicle?.brand_name }} {{ vehicle?.model }}</p>
                  </div>
                </div>

                <!-- Date & Location Cards -->
                <div class="details-cards">
                  <div class="detail-card">
                    <div class="detail-card-icon">
                      <CalendarOutlined />
                    </div>
                    <div class="detail-card-content">
                      <span class="detail-card-label">{{ $t('reservation.details.dates') }}</span>
                      <span class="detail-card-value">{{ formatDate(pickupDate) }} - {{ formatDate(returnDate) }}</span>
                      <span class="detail-card-sub">{{ calculateDays }} {{ calculateDays === 1 ? $t('reservation.details.day') : $t('reservation.details.days') }}</span>
                    </div>
                  </div>
                  <div class="detail-card">
                    <div class="detail-card-icon">
                      <EnvironmentOutlined />
                    </div>
                    <div class="detail-card-content">
                      <span class="detail-card-label">{{ $t('reservation.details.locations') }}</span>
                      <span class="detail-card-value">{{ pickupLocationName }}</span>
                      <span class="detail-card-sub" v-if="returnLocationName !== pickupLocationName">→ {{ returnLocationName }}</span>
                    </div>
                  </div>
                </div>

                <!-- Extras -->
                <div class="details-extras" v-if="withDriver || carSeat">
                  <div class="extras-badge" v-if="withDriver">
                    <UserOutlined />
                    <span>{{ $t('reservation.details.withDriver') }}</span>
                    <span class="extras-badge-price">{{ withDriverValue }} {{ currencySymbol }}</span>
                  </div>
                  <div class="extras-badge" v-if="carSeat">
                    <SafetyOutlined />
                    <span>{{ $t('reservation.details.carSeat') }}</span>
                    <span class="extras-badge-price">{{ carSeatValue }} {{ currencySymbol }}</span>
                  </div>
                </div>

                <!-- Price Breakdown -->
                <div class="details-pricing">
                  <div class="pricing-row">
                    <span>{{ $t('reservation.details.dailyValue') }}</span>
                    <span>{{ dailyRate }} {{ currencySymbol }}</span>
                  </div>
                  <div class="pricing-row" v-if="withDriver">
                    <span>{{ $t('reservation.details.withDriver') }}</span>
                    <span>{{ withDriverValue }} {{ currencySymbol }}</span>
                  </div>
                  <div class="pricing-row" v-if="carSeat">
                    <span>{{ $t('reservation.details.carSeat') }}</span>
                    <span>{{ carSeatValue }} {{ currencySymbol }}</span>
                  </div>
                  <div class="pricing-row" v-if="serviceFeeAmount > 0">
                    <span>{{ $t('reservation.details.serviceFee') }}</span>
                    <span>{{ serviceFeeAmount }} {{ currencySymbol }}</span>
                  </div>
                  <div class="pricing-total">
                    <span>{{ $t('reservation.details.totalToPay') }}</span>
                    <span>{{ calculateTotal }} {{ currencySymbol }}</span>
                  </div>
                </div>
              </div>
            </a-col>
            
            <!-- Customer Form -->
            <a-col :xs="24" :md="24" v-if="!qrcode">
              <div class="customer-form">
                <h3 class="form-section-title">{{ $t('reservation.form.personalDataTitle') }}</h3>
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
                    :placeholder="$t('reservation.form.firstNamePlaceholder')"
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
                    :placeholder="$t('reservation.form.lastNamePlaceholder')"
                    :prefix="() => h(UserOutlined, { style: { color: '#8b5cf6' } })"
                    class="form-input"
                  />
                </a-form-item>
              </div>

              <!-- Birth Date Field -->
              <div class="name-row">
                <a-form-item
                  name="birthDate"
                  class="form-item"
                >
                  <a-date-picker
                    v-model:value="formData.birthDate"
                    size="large"
                    :placeholder="$t('reservation.form.birthDatePlaceholder')"
                    style="width: 100%;"
                    class="form-input"
                    :disabled-date="disabledBirthDate"
                    format="DD/MM/YYYY"
                    value-format="YYYY-MM-DD"
                  />
                </a-form-item>
              </div>

              <div class="name-row">
                <!-- Email Field -->
                <a-form-item
                  name="email"
                  class="form-item"
                >
                  <a-input
                    v-model:value="formData.email"
                    size="large"
                    :placeholder="emailPlaceholder"
                    :prefix="() => h(MailOutlined, { style: { color: '#8b5cf6' } })"
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
                    :placeholder="$t('reservation.form.phonePlaceholder')"
                    :prefix="() => h(PhoneOutlined, { style: { color: '#8b5cf6' } })"
                    class="form-input"
                  />
                </a-form-item>
              </div>
              <!-- License Field -->
               <div class="name-row">
                  <a-form-item
                    name="drivingLicense"
                    class="form-item"
                  >
                    <a-input
                      v-model:value="formData.drivingLicense"
                      size="large"
                      :placeholder="$t('reservation.form.drivingLicensePlaceholder')"
                      :prefix="() => h(IdcardOutlined, { style: { color: '#8b5cf6' } })"
                      class="form-input"
                    />
                  </a-form-item>
                  <!-- License Expiry Date Field -->
                  <a-form-item
                    name="license_issue_date"
                    class="form-item"
                  >
                    <a-date-picker
                      v-model:value="formData.license_issue_date"
                      size="large"
                      :placeholder="$t('reservation.form.licenseIssueDatePlaceholder')"
                      style="width: 100%;"
                      class="form-input"
                      format="DD/MM/YYYY"
                      value-format="YYYY-MM-DD"
                      :disabled-date="disabledLicenseDate"
                    />
                  </a-form-item>
               </div>


              <!-- Terms and Conditions -->
              <div class="terms-section">
                <a-form-item name="acceptTerms" class="terms-item">
                  <a-checkbox v-model:checked="formData.acceptTerms">
                    {{ $t('reservation.form.termsText') }} <router-link to="/terms" target="_blank" class="terms-link">{{ $t('reservation.form.termsLink') }}</router-link>
                    {{ $t('reservation.form.andText') }} <router-link to="/privacy" target="_blank" class="terms-link">{{ $t('reservation.form.privacyLink') }}</router-link>
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
                  :disabled="!isFormValid"
                  class="submit-btn"
                >
                  <CarOutlined v-if="!isLoading" />
                  {{ $t('reservation.form.submitButton') }}
                </a-button>
              </a-form-item>
            </a-form>
            </div>
          </a-col>
          <a-col :xs="24" :md="24" v-if="qrcode">
            <a-qrcode ref="qrcodeCanvasRef" :value="textQrCode" />
            <br />
            <a-button type="primary" @click="dowloadChange">{{ $t('reservation.form.downloadButton') }}</a-button>
          </a-col>
        </a-row>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, watch, computed, h } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  CarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  SafetyOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import 'dayjs/locale/pt'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
import advancedFormat from 'dayjs/plugin/advancedFormat'

// Configure dayjs
dayjs.extend(customParseFormat)
dayjs.extend(localeData)
dayjs.extend(weekday)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
dayjs.extend(advancedFormat)
dayjs.locale('pt')

//import logo from '../assets/logo.png'
import {authService, bookingService, vehicleService} from '../services/api'
import { useLanguageAndCurrency } from '../composables/useLanguageAndCurrency'

const { t } = useI18n()
const router = useRouter()
const { currentCurrency } = useLanguageAndCurrency()

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
  },
  carSeat: {
    type: Boolean,
    required: false,
    default: false
  },
  withDriver: {
    type: Boolean,
    required: false,
    default: false
  },
  withDriverValue: {
    type: Number,
    required: false,
    default: 0
  },
  carSeatValue: {
    type: Number,
    required: false,
    default: 0
  },
  pickupLocation: {
    type: Object,
    required: false,
    default: null
  },
  returnLocation: {
    type: Object,
    required: false,
    default: null
  },
  locations: {
    type: Array,
    required: false,
    default: () => []
  },
  serviceFeeAmount: {
    type: Number,
    required: false,
    default: 0
  },
  currencySymbol: {
    type: String,
    required: false,
    default: 'CVE'
  },
  dailyRate: {
    type: Number,
    required: false,
    default: 0
  },
  serviceFeeType: {
    type: String,
    required: false,
    default: 'fixed' // or 'percentage'
  }
})


const handleLocationName = (location) => {
  // If location is an object, return its name directly
  if (typeof location === 'object' && location !== null) {
    return location.name || ''
  }
  // If location is an ID, find it in the locations array
  if (typeof location === 'number' || typeof location === 'string') {
    const foundLocation = props.locations.find(loc => loc.id === location)
    return foundLocation ? foundLocation.name : ''
  }
  return ''
}

const pickupLocationName = computed(() => {
  return handleLocationName(props.pickupLocation)
})
const returnLocationName = computed(() => {
  return handleLocationName(props.returnLocation)
})

// Email placeholder com @ corretamente formatado
const emailPlaceholder = computed(() => {
  return t('reservation.form.emailPlaceholder')
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
  birthDate: dayjs(), // Data atual como padrão
  email: '',
  drivingLicense: '',
  license_expiry_date: null,
  license_issue_date: null,
  phone: '',
  acceptTerms: false,
  pickupLocation: null,
  returnLocation: null,
})

// Form validation rules
const formRules = {
  firstName: [
    { required: true, message: t('reservation.validation.firstNameRequired'), trigger: 'blur' },
    { min: 2, message: t('reservation.validation.firstNameMinLength'), trigger: 'blur' }
  ],
  lastName: [
    { required: true, message: t('reservation.validation.lastNameRequired'), trigger: 'blur' },
    { min: 2, message: t('reservation.validation.lastNameMinLength'), trigger: 'blur' }
  ],
  birthDate: [
    { required: true, message: t('reservation.validation.birthDateRequired'), trigger: 'change' },
    { 
      validator: (rule, value) => {
        if (!value) {
          return Promise.reject(t('reservation.validation.birthDateRequiredMsg'))
        }
        const age = dayjs().diff(dayjs(value), 'year');
        if (age < 25) {
          return Promise.reject(t('reservation.validation.ageMinimum'))
        }
        if (age > 100) {
          return Promise.reject(t('reservation.validation.birthDateInvalid'))
        }
        return Promise.resolve()
      },
      trigger: 'change'
    }
  ],
  email: [
    { required: true, message: t('reservation.validation.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('reservation.validation.emailInvalid'), trigger: 'blur' }
  ],
  drivingLicense: [
    { required: true, message: t('reservation.validation.drivingLicenseRequired'), trigger: 'blur' },
    { min: 5, message: t('reservation.validation.drivingLicenseMinLength'), trigger: 'blur' }
  ],
  phone: [
    { required: true, message: t('reservation.validation.phoneRequired'), trigger: 'blur' },
    { pattern: /^\+\d{1,3}\s?\d{6,14}$/, message: t('reservation.validation.phoneInvalid'), trigger: 'blur' }
  ],
  license_issue_date: [
    { required: true, message: t('reservation.validation.licenseIssueDateRequired'), trigger: 'change' },
    {
      validator: (rule, value) => {
        if (!value) {
          return Promise.reject(t('reservation.validation.licenseIssueDateRequiredMsg'))
        }
        const yearsWithLicense = dayjs().diff(dayjs(value), 'year');
        if (yearsWithLicense < 2) {
          return Promise.reject(t('reservation.validation.licenseExperienceRequired'))
        }
        const issueDate = dayjs(value);
        const today = dayjs();
        if (issueDate.isAfter(today)) {
          return Promise.reject(t('reservation.validation.licenseIssueDateFuture'))
        }
        return Promise.resolve()
      },
      trigger: 'change'
    }
  ],
  acceptTerms: [
    { required: true, message: t('reservation.validation.termsRequired'), trigger: 'change', 
      validator: (rule, value) => {
        if (!value) {
          return Promise.reject(t('reservation.validation.termsRequired'))
        }
        return Promise.resolve()
      }
    }
  ]
}

// Loading state
const isLoading = ref(false)
const formRef = ref(null)

// Computed property to check if all required fields are filled
const isFormValid = computed(() => {
  return (
    formData.firstName &&
    formData.firstName.trim().length >= 2 &&
    formData.lastName &&
    formData.lastName.trim().length >= 2 &&
    formData.birthDate &&
    formData.email &&
    formData.email.includes('@') &&
    formData.phone &&
    formData.phone.trim().length > 0 &&
    formData.drivingLicense &&
    formData.drivingLicense.trim().length >= 5 &&
    formData.license_issue_date &&
    formData.acceptTerms
  )
})

// Methods
const handleCancel = () => {
  const reservationConfirmed = qrcode.value
  emit('update:visible', false)
    // Reset form data
    formData.firstName = ''
    formData.lastName = ''
    formData.birthDate = dayjs() // Reset para data atual
    formData.email = ''
    formData.drivingLicense = ''
    formData.phone = ''
    formData.acceptTerms = false
    qrcode.value = false;
    textQrCode.value = ""
    formData.license_issue_date = null
    formData.license_expiry_date = null

    if (reservationConfirmed) {
      const token = localStorage.getItem('authToken')
      if (token) {
        router.push('/owner-dashboard?tab=my-bookings')
      } else {
        router.push('/booking-status')
      }
    }
}

const formatDate = (date) => {
  if (!date) return ''
  return dayjs(date).format('DD/MM/YYYY')
}

// Disable future dates for birth date
const disabledBirthDate = (current) => {
  // Disable dates in the future and dates more than 100 years ago
  const today = dayjs()
  const hundredYearsAgo = today.subtract(100, 'year')
  return current && (current.isAfter(today, 'day') || current.isBefore(hundredYearsAgo, 'day'))
}

// Disable future dates for license issue date
const disabledLicenseDate = (current) => {
  // Disable dates in the future and dates more than 50 years ago
  const today = dayjs()
  const fiftyYearsAgo = today.subtract(50, 'year')
  return current && (current.isAfter(today, 'day') || current.isBefore(fiftyYearsAgo, 'day'))
}

const customer = ref(null)

const allCustomers = ref([])

const token = localStorage.getItem('authToken') || ''

const config = ref({})

const loadSystemConfig = async () => {
  try {
    const response = await vehicleService.getSystemConfig()
    config.value = response.data
  } catch (error) {
    console.error('Erro ao carregar configuração do sistema:', error)
  }
}

// Convert value to CVE based on current currency
const convertToCVE = (amount) => {
  if (!amount || !config.value) return amount
  
  switch (currentCurrency.value) {
    case 'USD': {
      const usdRate = parseFloat(config.value.usd_exchange_rate || 100)
      return amount * usdRate
    }
    case 'EUR': {
      const eurRate = parseFloat(config.value.euro_exchange_rate || 100)
      return amount * eurRate
    }
    case 'CVE':
    default:
      return amount
  }
}

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
        formData.country = customer.value.country || ''
        formData.address_line_1 = customer.value.address_line_1 || ''
        formData.address_line_2 = customer.value.address_line_2 || ''
        formData.city = customer.value.city || ''
        formData.postal_code = customer.value.postal_code || ''
        formData.id_number = customer.value.id_number || ''
        formData.license_expiry_date = customer.value.license_expiry_date || ''
        formData.license_issue_date = customer.value.license_issue_date || ''
        // Converter string da data para dayjs object
        formData.birthDate = customer.value.birth_date ? dayjs(customer.value.birth_date) : dayjs()

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
    birth_date: formData.birthDate ? dayjs(formData.birthDate).format('YYYY-MM-DD') : null,
    email: formData.email,
    phone_number: formData.phone,
    id_number: gerarCodigo(), // Gerar valores aleatorios para placeholder
    
    // License Information
    driving_license_number: formData.drivingLicense,
    license_expiry_date: formData.license_issue_date ? dayjs(formData.license_issue_date).add(10, 'year').format('YYYY-MM-DD') : null,

    license_issue_date: formData.license_issue_date,

    // Address Information
    address_line_1: formData.address_line_1,
    address_line_2: formData.address_line_2,
    city: formData.city,
    postal_code: formData.postal_code,
    country: formData.country, // Default to Cape Verde

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
            message.error(t('reservation.messages.customerError'))
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

  // Convert all monetary values to CVE before sending
  const amountPaidCVE = convertToCVE(props.calculateTotal)
  const commissionCVE = props.serviceFeeType !== 'fixed' ? convertToCVE(props.serviceFeeAmount) : null
  const insuranceFeeCVE = props.serviceFeeType === 'fixed' ? convertToCVE(props.serviceFeeAmount) : null

  const bookingData = {
    vehicle: props.vehicle.id,
    customer: custumerId, // Replace with actual customer ID
    start_date: props.pickupDate,
    end_date: props.returnDate,
    daily_rate: props.vehicle.daily_rate.toString(),
    commission_percent: commissionCVE,
    insurance_fee: insuranceFeeCVE,
    security_deposit: "0", // Example value
    late_return_fee: "0", // Example value
    damage_fee: "0", // Example value
    amount_paid: amountPaidCVE.toString(),
    mileage_start: 0, // Example value
    mileage_end: 0, // Example value
    fuel_level_start: 'full', // Example value
    fuel_level_end: 'full', // Example value
    status: 'pending',
    notes: '',
    car_seat: props.carSeat,
    driver: props.withDriver,
    pickup_location: typeof props.pickupLocation === 'object' ? props.pickupLocation?.id : props.pickupLocation,
    return_location: typeof props.returnLocation === 'object' ? props.returnLocation?.id : props.returnLocation
  }

  try {
    const response = await bookingService.createBooking(bookingData)

    if (response && response.data) {
      if (response.data.id > 0) {
        // Notification of success can be added here with time to close
        message.success(t('reservation.messages.reservationSuccess'))

        textQrCode.value = t('reservation.messages.qrCodeText', {
          id: response.data.id,
          name: `${formData.firstName} ${formData.lastName}`,
          vehicle: `${props.vehicle.brand_name} ${props.vehicle.model}`,
          dates: `${formatDate(props.pickupDate)} a ${formatDate(props.returnDate)}`,
          total: props.calculateTotal
        })
        qrcode.value = true;


      }
      else {
        message.error(t('reservation.messages.reservationError'))
      }
    }

  } catch (error) {
    console.error('Erro ao carregar veículos:', error)
  } finally {
    isLoading.value = false
  }
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    getCustomerData()
    loadSystemConfig()
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
  margin-bottom: 10px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin: 0px 0 8px 0;
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%);
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
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 10px;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.reservation-details::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FE7743, #ff9a76, #FE7743);
}

/* Details Header */
.details-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #e2e8f0;
}

.details-header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #FE7743 0%, #ff5722 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 22px;
  flex-shrink: 0;
}

.details-title {
  font-size: 17px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  line-height: 1.2;
}

.details-vehicle-name {
  font-size: 14px;
  color: #6b7280;
  margin: 2px 0 0 0;
  font-weight: 500;
}

/* Detail Cards */
.details-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.detail-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: white;
  border-radius: 12px;
  padding: 14px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.detail-card:hover {
  border-color: #FE7743;
  box-shadow: 0 2px 8px rgba(254, 119, 67, 0.08);
}

.detail-card-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #fff7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FE7743;
  font-size: 16px;
  flex-shrink: 0;
}

.detail-card-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.detail-card-label {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-card-value {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-card-sub {
  font-size: 12px;
  color: #6b7280;
}

/* Extras Badges */
.details-extras {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.extras-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #5b21b6;
  border: 1px solid #c4b5fd;
}

.extras-badge-price {
  background: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  color: #7c3aed;
  font-weight: 700;
}

/* Price Breakdown */
.details-pricing {
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.pricing-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 13px;
  color: #6b7280;
}

.pricing-row span:last-child {
  font-weight: 500;
  color: #374151;
}

.pricing-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0 0 0;
  margin-top: 8px;
  border-top: 2px solid #f3f4f6;
  font-size: 16px;
  font-weight: 700;
}

.pricing-total span:first-child {
  color: #1a202c;
}

.pricing-total span:last-child {
  color: #FE7743;
  font-size: 18px;
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
  
  .details-cards {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .details-extras {
    flex-direction: column;
  }
  
  .reservation-details {
    margin-bottom: 20px;
    padding: 16px;
  }
}
</style>