<template>
  <a-modal 
    :open="visible" 
    @cancel="handleCancel"
    :footer="null"
    :width="modalWidth"
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
          <a-row :gutter="rowGutter">
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
                  <div class="pricing-row" v-if="securityDeposit > 0">
                    <span>{{ $t('reservation.details.securityDeposit') }}</span>
                    <span>{{ securityDeposit }} {{ currencySymbol }}</span>
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
                  layout="vertical"
                  @finish="handleReservation"
                >
              <!-- Name Fields -->
              <div class="name-row">
                <a-form-item
                  name="firstName"
                  :label="$t('reservation.form.firstNamePlaceholder')"
                  class="form-item half-width"
                  required
                >
                  <a-input
                    v-model:value="formData.firstName"
                    size="large"
                    :placeholder="$t('reservation.form.firstNamePlaceholder')"
                    :prefix="() => h(UserOutlined, { style: { color: '#8b5cf6' } })"
                    class="form-input"
                    :disabled="isLoggedIn"
                  />
                </a-form-item>

                <a-form-item
                  name="lastName"
                  :label="$t('reservation.form.lastNamePlaceholder')"
                  class="form-item half-width"
                  required
                >
                  <a-input
                    v-model:value="formData.lastName"
                    size="large"
                    :placeholder="$t('reservation.form.lastNamePlaceholder')"
                    :prefix="() => h(UserOutlined, { style: { color: '#8b5cf6' } })"
                    class="form-input"
                    :disabled="isLoggedIn"
                  />
                </a-form-item>
              </div>

              <!-- Birth Date Field -->
              <div class="name-row">
                <a-form-item
                  name="birthDate"
                  class="form-item"
                >
                  <template #label>
                    <span style="color: red; font-size: large; margin-right: 4px;">*</span> {{ $t('reservation.form.birthDatePlaceholder') }}
                  </template>
                  <a-date-picker
                    v-model:value="formData.birthDate"
                    size="large"
                    :placeholder="$t('reservation.form.birthDatePlaceholder')"
                    style="width: 100%;"
                    class="form-input"
                    :disabled-date="disabledBirthDate"
                    format="DD/MM/YYYY"
                    value-format="YYYY-MM-DD"
                    :disabled="isLoggedIn"
                    :key="'birth-date-' + currentLanguage"
                    :locale="datePickerLocale"
                    :show-today="false"
                    :default-picker-value="dayjs().subtract(25, 'year')"
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
                    :disabled="isLoggedIn"
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
                    :disabled="isLoggedIn"
                  />
                </a-form-item>
              </div>
              <!-- License Field -->
               <div class="name-row">
                  <a-form-item
                    name="drivingLicense"
                    :label="$t('reservation.form.drivingLicenseLabel')"
                    class="form-item"
                    required
                  >
                    <a-input
                      v-model:value="formData.drivingLicense"
                      size="large"
                      :placeholder="$t('reservation.form.drivingLicensePlaceholder')"
                      :prefix="() => h(IdcardOutlined, { style: { color: '#8b5cf6' } })"
                      class="form-input"
                      :disabled="isLoggedIn"
                    />
                  </a-form-item>
                  <!-- License Expiry Date Field -->
                  <a-form-item
                    name="license_issue_date"
                    class="form-item"
                    style="margin-top: -5px;"
                  >
                    <template #label>
                      <span style="color: red; font-size: medium; margin-right: 4px;">*</span> {{ $t('reservation.form.licenseIssueDateLabel') }}
                    </template>
                    <a-date-picker
                      v-model:value="formData.license_issue_date"
                      size="large"
                      :placeholder="$t('reservation.form.licenseIssueDatePlaceholder')"
                      style="width: 100%;"
                      class="form-input"
                      format="DD/MM/YYYY"
                      value-format="YYYY-MM-DD"
                      :disabled-date="disabledLicenseDate"
                      :disabled="isLoggedIn"
                      :key="'license-date-' + currentLanguage"
                      :locale="datePickerLocale"
                      :show-today="false"
                      :default-picker-value="dayjs().subtract(2, 'year')"
                    />
                  </a-form-item>
               </div>


              <!-- Terms and Conditions -->
              <div class="terms-section">
                <a-form-item name="acceptTerms" :label="$t('reservation.form.termsLabel')" class="terms-item" required>
                  <a-checkbox v-model:checked="formData.acceptTerms">
                    {{ $t('reservation.form.termsText') }} <router-link to="/terms" target="_blank" class="terms-link">{{ $t('reservation.form.termsLink') }}</router-link>
                    {{ $t('reservation.form.andText') }} <router-link to="/privacy" target="_blank" class="terms-link">{{ $t('reservation.form.privacyLink') }}</router-link>
                  </a-checkbox>
                </a-form-item>
              </div>

              <!-- reCAPTCHA v2 - DESATIVADO -->
              <!-- <div v-if="!qrcode" class="recaptcha-container" style="margin-bottom: 20px; display: flex; justify-content: center;">
                <VueRecaptcha
                  :sitekey="recaptchaSiteKey"
                  @verify="onRecaptchaVerified"
                  @expired="onRecaptchaExpired"
                  @error="onRecaptchaError"
                />
              </div> -->

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
                  <CarOutlined v-if="!isLoading" />
                  {{ $t('reservation.form.submitButton') }}
                </a-button>
              </a-form-item>
            </a-form>
            </div>
          </a-col>
          <a-col :xs="24" :md="24" v-if="qrcode">
            <a-row :gutter="[24, 16]" align="top">
              <a-col :xs="24" :sm="10" style="display:flex; flex-direction:column; align-items:center; gap:12px;">
                <div class="rental-code-display">
                  <span class="rental-code-label">{{ $t('reservation.messages.rentalCode') }}</span>
                  <span class="rental-code-value">#{{ reservationId }}</span>
                </div>
                <a-qrcode ref="qrcodeCanvasRef" :value="textQrCode" :size="180" />
                <a-button type="primary" @click="dowloadChange" class="download-btn">{{ $t('reservation.form.downloadButton') }}</a-button>
              </a-col>
              <a-col :xs="24" :sm="14">
                <div class="bank-details-card">
                  <h4 class="bank-details-title">UNIVERSAL LDA</h4>

                  <!-- IBAN highlight box -->
                  <div class="bank-iban-box">
                    <span class="bank-iban-value">CV64 0008 1004 0006 9902 00106</span>
                    <a-tooltip :title="copiedField === 'iban' ? $t('reservation.messages.bankCopied') : $t('reservation.messages.bankCopy')">
                      <button class="bank-copy-btn" @click="copyField('iban', 'CV64000810040006990200106')">
                        <CopyOutlined />
                      </button>
                    </a-tooltip>
                  </div>

                  <!-- Detail rows -->
                  <div class="bank-detail-row">
                    <span class="bank-detail-label">{{ $t('reservation.messages.bankTransferAccount') }}</span>
                    <div class="bank-detail-right">
                      <span class="bank-detail-value">100 400 069 90 2001</span>
                      <a-tooltip :title="copiedField === 'account' ? $t('reservation.messages.bankCopied') : $t('reservation.messages.bankCopy')">
                        <button class="bank-copy-btn-sm" @click="copyField('account', '100400069902001')">
                          <CopyOutlined />
                        </button>
                      </a-tooltip>
                    </div>
                  </div>

                  <div class="bank-detail-row">
                    <span class="bank-detail-label">NIB</span>
                    <div class="bank-detail-right">
                      <span class="bank-detail-value">0008 1004 0006 9902 00106</span>
                      <a-tooltip :title="copiedField === 'nib' ? $t('reservation.messages.bankCopied') : $t('reservation.messages.bankCopy')">
                        <button class="bank-copy-btn-sm" @click="copyField('nib', '000810040006990200106')">
                          <CopyOutlined />
                        </button>
                      </a-tooltip>
                    </div>
                  </div>

                  <div class="bank-detail-row">
                    <span class="bank-detail-label">SWIFT/BIC</span>
                    <div class="bank-detail-right">
                      <span class="bank-detail-value">BAIPCVCV</span>
                      <a-tooltip :title="copiedField === 'swift' ? $t('reservation.messages.bankCopied') : $t('reservation.messages.bankCopy')">
                        <button class="bank-copy-btn-sm" @click="copyField('swift', 'BAIPCVCV')">
                          <CopyOutlined />
                        </button>
                      </a-tooltip>
                    </div>
                  </div>

                  <!-- Share button -->
                  <button class="bank-share-btn" @click="shareBankDetails">
                    <ShareAltOutlined />
                    {{ $t('reservation.messages.bankShareDetails') }}
                  </button>
                </div>
              </a-col>
            </a-row>
            <p class="bank-instruction">
              {{ $t('reservation.messages.bankTransferInstructionSend') }}
              <a href="mailto:universal.r.car@gmail.com">universal.r.car@gmail.com</a>
              {{ $t('reservation.messages.bankTransferInstructionOr') }}
              <a href="https://wa.me/2389781304" target="_blank" rel="noopener">(+238) 978 13 04</a>
              {{ $t('reservation.messages.bankTransferInstructionRef', { id: reservationId }) }}
            </p>
            <p class="bank-instruction bank-instruction-warning">
              ⚠️ {{ $t('reservation.messages.bankCancellationWarning') }}
            </p>
            <p class="bank-instruction bank-instruction-address">
              📍 <a href="https://maps.app.goo.gl/UxWQV255Kuf6vVGg7" target="_blank" rel="noopener">{{ $t('reservation.messages.bankCompanyAddress') }}</a>
            </p>
          </a-col>
        </a-row>
        </div>
      </div>
    </div>
  </a-modal>
  
  <!-- Login Modal -->
  <LoginPageModal
    v-model:visible="showLoginModal" 
    @close="handleLoginModalClose"
    @success="handleLoginSuccess"
  />
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, watch, computed, h, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
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
  SafetyOutlined,
  CopyOutlined,
  ShareAltOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import 'dayjs/locale/pt'
import 'dayjs/locale/en'
import 'dayjs/locale/fr'
import antLocale_pt_BR from 'ant-design-vue/es/locale/pt_BR'
import antLocale_en_US from 'ant-design-vue/es/locale/en_US'
import antLocale_fr_FR from 'ant-design-vue/es/locale/fr_FR'
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
import LoginPageModal from '../auth/LoginPageModal.vue'
// import { useRecaptcha } from '../composables/useRecaptcha' // DESATIVADO

const { t } = useI18n()
const router = useRouter()
const { currentCurrency, currentLanguage } = useLanguageAndCurrency()

// Responsive modal width and gutter
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 800)
const modalWidth = computed(() => {
  if (windowWidth.value < 576) return '95%'
  if (windowWidth.value < 768) return '90%'
  if (windowWidth.value < 992) return '85%'
  return 800
})

const rowGutter = computed(() => {
  if (windowWidth.value < 576) return 12
  if (windowWidth.value < 768) return 16
  return 32
})

// reCAPTCHA - DESATIVADO
// const { 
//   recaptchaToken,
//   recaptchaVerified,
//   onRecaptchaVerified,
//   onRecaptchaExpired,
//   onRecaptchaError,
//   resetRecaptcha
// } = useRecaptcha()

// reCAPTCHA Site Key - DESATIVADO
// const recaptchaSiteKey = process.env.VUE_APP_RECAPTCHA_SITE_KEY

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
  securityDeposit: {
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
  // If location is an ID or string, try to find in the locations array
  if (typeof location === 'number' || typeof location === 'string') {
    const foundById = props.locations.find(loc => loc.id === location)
    if (foundById) return foundById.name
    // Not found as ID — it's a custom location text, return as-is
    return String(location)
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
const reservationId = ref(null)

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
  birthDate: '', // Data atual como padrão
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
const formRules = computed(() => ({
  firstName: [
    { required: true, message: t('reservation.validation.firstNameRequired'), trigger: 'blur' },
    { min: 2, message: t('reservation.validation.firstNameMinLength'), trigger: 'blur' }
  ],
  lastName: [
    { required: true, message: t('reservation.validation.lastNameRequired'), trigger: 'blur' },
    { min: 2, message: t('reservation.validation.lastNameMinLength'), trigger: 'blur' }
  ],
  birthDate: [
    {
      validator: (rule, value) => {
        if (!value) {
          return Promise.reject(t('reservation.validation.birthDateRequired'))
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
    {
      validator: (_, value) => {
        if (!value && !formData.phone) {
          return Promise.reject(t('reservation.validation.emailOrPhoneRequired'))
        }
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return Promise.reject(t('reservation.validation.emailInvalid'))
        }
        return Promise.resolve()
      },
      trigger: ['blur', 'change']
    }
  ],
  drivingLicense: [
    { required: true, message: t('reservation.validation.drivingLicenseRequired'), trigger: 'blur' },
    { min: 5, message: t('reservation.validation.drivingLicenseMinLength'), trigger: 'blur' }
  ],
  phone: [
    {
      validator: (_, value) => {
        if (!value && !formData.email) {
          return Promise.reject(t('reservation.validation.emailOrPhoneRequired'))
        }
        if (value && !/^\+\d{1,3}\s?\d{6,14}$/.test(value)) {
          return Promise.reject(t('reservation.validation.phoneInvalid'))
        }
        return Promise.resolve()
      },
      trigger: ['blur', 'change']
    }
  ],
  license_issue_date: [
    {
      validator: (rule, value) => {
        if (!value) {
          return Promise.reject(t('reservation.validation.licenseIssueDateRequired'))
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
}))

// Loading state
const isLoading = ref(false)
const formRef = ref(null)
const formValidated = ref(false)
const showLoginModal = ref(false)

// Computed property to check if all required fields are filled
/*const isFormValid = computed(() => {
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
})*/

// Computed property to check if user is logged in
const isLoggedIn = computed(() => {
  const token = localStorage.getItem('authToken')
  return token !== null && token !== '' && token !== undefined
})

// Methods
const handleCancel = () => {
  const reservationConfirmed = qrcode.value
  emit('update:visible', false)
    // Reset form data
    formData.firstName = ''
    formData.lastName = ''
    formData.birthDate = '' // Reset para data atual
    formData.email = ''
    formData.drivingLicense = ''
    formData.phone = ''
    formData.acceptTerms = false
    qrcode.value = false;
    reservationId.value = null
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

// Bank details copy & share
const copiedField = ref(null)

const copyField = async (fieldName, value) => {
  try {
    await navigator.clipboard.writeText(value)
  } catch {
    const el = document.createElement('textarea')
    el.value = value
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
  copiedField.value = fieldName
  setTimeout(() => { copiedField.value = null }, 2000)
}

const shareText = computed(() => {
  const lines = [
    `UNIVERSAL LDA`
  ]
  
  // Adicionar número da reserva se disponível
  if (reservationId.value) {
    lines.push(`${t('reservation.messages.rentalCode')}: ${reservationId.value}`)
  }
  
  lines.push(
    `${t('reservation.messages.bankTransferAccount')}: 100400069902001`,
    `NIB: 000810040006990200106`,
    `IBAN: CV64000810040006990200106`,
    `SWIFT/BIC: BAIPCVCV`
  )
  
  return lines.join('\n')
})

const shareBankDetails = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'UNIVERSAL LDA - IBAN',
        text: shareText.value
      })
    } catch (err) {
      if (err.name !== 'AbortError') console.error('Erro ao partilhar', err)
    }
  } else {
    await copyField('all', shareText.value)
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

// Disable future dates for birth date
const disabledBirthDate = (current) => {
  // Disable dates in the future and dates more than 100 years ago
  const today = dayjs()
  const hundredYearsAgo = today.subtract(100, 'year')
  return current && (current.isAfter(today, 'day') || current.isBefore(hundredYearsAgo, 'day'))
}

// Date picker locale support
const datePickerLocale = computed(() => {
  if (currentLanguage.value === 'pt') return antLocale_pt_BR.DatePicker
  if (currentLanguage.value === 'en') return antLocale_en_US.DatePicker
  if (currentLanguage.value === 'fr') return antLocale_fr_FR.DatePicker
  return antLocale_pt_BR.DatePicker
})

// Watch for language changes to update dayjs locale
watch(currentLanguage, (newLang) => {
  if (newLang === 'pt') dayjs.locale('pt')
  else if (newLang === 'en') dayjs.locale('en')
  else if (newLang === 'fr') dayjs.locale('fr')
}, { immediate: true })

watch(currentLanguage, () => {
  if (formValidated.value) {
    formRef.value?.validate().catch(() => {})
  }
})

// Re-validate both fields when either changes (so the error on the other clears)
watch(() => formData.email, () => {
  if (formValidated.value) {
    formRef.value?.validateFields(['email', 'phone']).catch(() => {})
  }
})
watch(() => formData.phone, () => {
  if (formValidated.value) {
    formRef.value?.validateFields(['email', 'phone']).catch(() => {})
  }
})

// Disable future dates for license issue date
const disabledLicenseDate = (current) => {
  // Disable dates in the future and dates more than 50 years ago
  const today = dayjs()
  const fiftyYearsAgo = today.subtract(50, 'year')
  return current && (current.isAfter(today, 'day') || current.isBefore(fiftyYearsAgo, 'day'))
}

const customer = ref(null)

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
    // Ler token dinamicamente do localStorage
    const currentToken = localStorage.getItem('authToken') || ''
    if (currentToken && currentToken !== '' && currentToken !== null) {
      const response = await authService.me()
      customer.value = response.data
        formData.firstName = customer.value.first_name
        formData.lastName = customer.value.last_name
        formData.email = customer.value.email
        formData.phone = customer.value.phone_number || ''
        formData.drivingLicense = customer.value.driving_license_number || ''
        formData.acceptTerms = false
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

//const isEmailExisting = ref(false)

//const isHasAccount = ref(false)

/*const verificationEmail = async (email) => {
  try {
    const response = await authService.getCustomersByEmail(email)
    isEmailExisting.value = response.data?.email_exists || false
    isHasAccount.value = response.data?.has_account || false
  } catch (error) {
    console.error('Error checking email:', error)
  }
}*/

const handleLoginModalClose = () => {
  showLoginModal.value = false
}

const handleLoginSuccess = async () => {
  showLoginModal.value = false
  // Atualizar dados do cliente após login bem-sucedido
  await getCustomerData()
  // Limpar erros de validação do formulário
  if (formRef.value) {
    formRef.value.clearValidate()
  }

  isLoggedIn.value = true
  // Disparar evento customizado para notificar outros componentes (HeaderPage)
  window.dispatchEvent(new CustomEvent('user-logged-in'))
  // Mostrar mensagem de sucesso
  message.success(t('auth.loginSuccess') || 'Login realizado com sucesso!')


}

/*function gerarCodigo() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}*/

const handleReservation = async () => {
  isLoading.value = true
  formValidated.value = true

  if (!formRef.value) {
    isLoading.value = false
    return
  }

  try {
    await formRef.value.validate()

    const currentToken = localStorage.getItem('authToken') || ''

    if (currentToken) {
      // Utilizador com sessão: usar o customer_id existente sem alterar o perfil
      await createBookingServices(customer.value.id)
    } else {
      // Sem sessão: o backend resolve (cria guest, actualiza guest, ou usa conta existente sem alterar)
      const guestData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        birth_date: formData.birthDate ? dayjs(formData.birthDate).format('YYYY-MM-DD') : null,
        email: formData.email || null,
        phone_number: formData.phone || null,
        driving_license_number: formData.drivingLicense || null,
        license_issue_date: formData.license_issue_date
          ? dayjs(formData.license_issue_date).format('YYYY-MM-DD')
          : null,
        license_expiry_date: formData.license_issue_date
          ? dayjs(formData.license_issue_date).add(10, 'year').format('YYYY-MM-DD')
          : null,
        address_line_1: formData.address_line_1 || null,
        address_line_2: formData.address_line_2 || null,
        city: formData.city || null,
        postal_code: formData.postal_code || null,
        country: formData.country || 'CV',
      }

      const response = await authService.resolveGuest(guestData)
      if (response && response.data && response.data.customer_id) {
        await createBookingServices(response.data.customer_id)
      } else {
        message.error(t('reservation.messages.customerError'))
      }
    }
  } catch (error) {
    console.error('Form validation failed:', error)
  } finally {
    isLoading.value = false
  }
}


const createBookingServices = async (custumerId) => {
  isLoading.value = true

  // Convert all monetary values to CVE before sending
  const amountPaidCVE = convertToCVE(props.calculateTotal)
  const commissionCVE = convertToCVE(props.serviceFeeAmount)

  // Format dates to avoid timezone conversion
  const formatDateForAPI = (date) => {
    if (!date) return null
    return dayjs(date).format('YYYY-MM-DDTHH:mm:ss')
  }

  const bookingData = {
    vehicle: props.vehicle.id,
    customer: custumerId, // Replace with actual customer ID
    start_date: formatDateForAPI(props.pickupDate),
    end_date: formatDateForAPI(props.returnDate),
    daily_rate: props.vehicle.daily_rate.toString(),
    commission_percent: props.serviceFeeType !== 'fixed' ? commissionCVE : null,
    commission_amount: props.serviceFeeType === 'fixed' ? commissionCVE : null,
    insurance_fee: 0,
    security_deposit: (props.vehicle.security_deposit || 0).toString(), // Always in CVE
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
    pickup_location: (() => {
      if (typeof props.pickupLocation === 'object') return props.pickupLocation?.id ?? null
      const found = props.locations.find(loc => loc.name === props.pickupLocation)
      return found ? found.id : null
    })(),
    pickup_location_custom: (() => {
      if (typeof props.pickupLocation === 'object') return null
      const found = props.locations.find(loc => loc.name === props.pickupLocation)
      return found ? null : (props.pickupLocation || null)
    })(),
    return_location: (() => {
      if (typeof props.returnLocation === 'object') return props.returnLocation?.id ?? null
      const found = props.locations.find(loc => loc.name === props.returnLocation)
      return found ? found.id : null
    })(),
    return_location_custom: (() => {
      if (typeof props.returnLocation === 'object') return null
      const found = props.locations.find(loc => loc.name === props.returnLocation)
      return found ? null : (props.returnLocation || null)
    })()
    // recaptchaToken // DESATIVADO - Envia o token para o backend validar
  }

  try {
    const response = await bookingService.createBooking(bookingData)

    if (response && response.data) {
      if (response.data.rental.id > 0) {
        // Show payment pending modal with appropriate message based on contact method
        const paymentInstructionKey = formData.email
          ? 'reservation.messages.paymentInstructions'
          : formData.phone
          ? 'reservation.messages.paymentInstructionsGeneral'
          : 'reservation.messages.paymentInstructionsGeneral'

        Modal.info({
          title: t('reservation.messages.reservationPendingPayment'),
          content: t(paymentInstructionKey),
          okText: 'OK',
          onOk() {
            // Generate QR code after modal closes
            reservationId.value = response.data.rental.rental_code
            textQrCode.value = t('reservation.messages.qrCodeText', {
              id: response.data.rental.rental_code,
              name: `${formData.firstName} ${formData.lastName}`,
              vehicle: `${props.vehicle.brand_name} ${props.vehicle.model}`,
              dates: `${formatDate(props.pickupDate)} a ${formatDate(props.returnDate)}`,
              total: props.calculateTotal
            })
            qrcode.value = true
          }
        })
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

// Handle window resize for responsive modal
if (typeof window !== 'undefined') {
  onMounted(() => {
    const handleResize = () => {
      windowWidth.value = window.innerWidth
    }
    window.addEventListener('resize', handleResize)
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })
}
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
  max-width: 100%;
  overflow: hidden;
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
  max-width: 100%;
  overflow: hidden;
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
  max-width: 100%;
  overflow: hidden;
  flex: 1;
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
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  overflow: hidden;
  max-width: 100%;
}

.detail-card-sub {
  font-size: 12px;
  color: #6b7280;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
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
  width: 100%;
}

.form-item.half-width {
  margin-bottom: 20px;
}

.form-item :deep(.ant-input),
.form-item :deep(.ant-picker),
.form-item :deep(.ant-select) {
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}

.form-item :deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: #374151;
}

.form-item :deep(.ant-form-item-label > label.ant-form-item-required::before) {
  color: #ff4d4f !important;
  font-size: 14px;
  margin-right: 4px;
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

.bank-details-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  padding: 20px;
}

.bank-details-title {
  font-size: 17px;
  font-weight: 700;
  color: #1a202c;
  text-align: center;
  margin: 0 0 16px 0;
}

.bank-iban-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 16px;
  gap: 8px;
}

.bank-iban-value {
  font-size: 15px;
  font-weight: 700;
  color: #1a202c;
  letter-spacing: 0.5px;
  word-break: break-all;
}

.bank-copy-btn {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 6px 8px;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 15px;
  transition: all 0.2s ease;
}

.bank-copy-btn:hover {
  border-color: #FE7743;
  color: #FE7743;
  background: #fff7ed;
}

.bank-detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.bank-detail-row:last-of-type {
  border-bottom: none;
}

.bank-detail-label {
  font-size: 13px;
  color: #9ca3af;
  font-weight: 500;
  flex-shrink: 0;
  min-width: 80px;
}

.bank-detail-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bank-detail-value {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  text-align: right;
}

.bank-copy-btn-sm {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  font-size: 14px;
  transition: color 0.2s ease;
}

.bank-copy-btn-sm:hover {
  color: #FE7743;
}

.bank-share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: 16px;
  padding: 13px;
  background: linear-gradient(135deg, #FE7743 0%, #ff5722 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.bank-share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(254, 119, 67, 0.35);
}

.bank-instruction {
  font-size: 13px;
  color: #444;
  background: #fff3ee;
  border-left: 3px solid #FE7743;
  padding: 10px 12px;
  border-radius: 4px;
  margin: 14px 0 0 0;
  line-height: 1.6;
}

.bank-instruction a {
  color: #FE7743;
  font-weight: 600;
  text-decoration: none;
}

.bank-instruction a:hover {
  text-decoration: underline;
}

.bank-instruction-warning {
  background: #fff8e1;
  border-left-color: #f59e0b;
  color: #92400e;
  font-weight: 600;
}

.bank-instruction-address {
  background: #f0fdf4;
  border-left-color: #22c55e;
  color: #14532d;
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
@media (max-width: 992px) {
  .form-section {
    padding: 18px;
  }
  
  .form-title {
    font-size: 26px;
  }
  
  .reservation-details {
    padding: 20px;
  }
  
  .details-title {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .reservation-modal :deep(.ant-modal) {
    width: 90% !important;
    max-width: 90% !important;
    margin: 16px;
  }

  .reservation-modal :deep(.ant-modal-body) {
    padding: 16px !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
  }
  
  .modal-content {
    max-width: 100% !important;
    overflow-x: hidden !important;
  }
  
  .form-section {
    padding: 16px;
    max-width: 100% !important;
    overflow-x: hidden !important;
  }
  
  .form-header {
    margin-bottom: 16px;
  }
  
  .form-title {
    font-size: 22px;
  }
  
  .form-subtitle {
    font-size: 14px;
  }
  
  .name-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .details-cards {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .detail-card {
    padding: 12px;
    max-width: 100%;
  }
  
  .detail-card-content {
    max-width: 100%;
  }
  
  .detail-card-value {
    font-size: 12px;
  }
  
  .detail-card-sub {
    font-size: 11px;
  }
  
  .details-extras {
    flex-direction: column;
    gap: 10px;
  }
  
  .extras-badge {
    width: 100%;
    justify-content: space-between;
  }
  
  .reservation-details {
    margin-bottom: 16px;
    padding: 16px;
  }
  
  .details-header {
    gap: 12px;
  }
  
  .details-header-icon {
    width: 42px;
    height: 42px;
    font-size: 20px;
  }
  
  .details-pricing {
    padding: 14px;
  }
  
  .pricing-total {
    font-size: 15px;
  }
  
  .pricing-total span:last-child {
    font-size: 16px;
  }
  
  .submit-btn {
    height: 48px;
    font-size: 15px;
  }
  
  .bank-details-card {
    padding: 16px;
  }
  
  .bank-iban-box {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .bank-iban-value {
    font-size: 13px;
    text-align: center;
  }
  
  .bank-copy-btn {
    width: 100%;
  }
  
  .form-section-title {
    font-size: 17px;
  }
}

@media (max-width: 576px) {
  .reservation-modal :deep(.ant-modal) {
    width: 96% !important;
    max-width: 96% !important;
    margin: 8px auto !important;
  }
  
  .reservation-modal :deep(.ant-modal-content) {
    border-radius: 16px;
    padding: 0 !important;
  }
  
  .reservation-modal :deep(.ant-modal-body) {
    padding: 12px !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
  }
  
  .modal-content {
    max-width: 100% !important;
    overflow-x: hidden !important;
  }
  
  .form-section {
    padding: 8px !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
  }
  
  .form-container {
    max-width: 100% !important;
    overflow-x: hidden !important;
  }
  
  .form-header {
    margin-bottom: 12px;
  }
  
  .form-title {
    font-size: 20px;
  }
  
  .form-subtitle {
    font-size: 13px;
  }

  .name-row {
    grid-template-columns: 1fr !important;
    gap: 0 !important;
  }
  
  .reservation-details {
    padding: 14px;
    margin-bottom: 12px;
  }
  
  .details-header {
    gap: 10px;
    margin-bottom: 16px;
    padding-bottom: 14px;
  }
  
  .details-header-icon {
    width: 38px;
    height: 38px;
    font-size: 18px;
  }
  
  .details-title {
    font-size: 15px;
  }
  
  .details-vehicle-name {
    font-size: 13px;
  }
  
  .details-cards {
    gap: 8px;
    margin-bottom: 14px;
  }
  
  .detail-card {
    padding: 10px;
    max-width: 100%;
  }
  
  .detail-card-content {
    max-width: 100%;
  }
  
  .detail-card-icon {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
  
  .detail-card-label {
    font-size: 10px;
  }
  
  .detail-card-value {
    font-size: 12px;
  }
  
  .detail-card-sub {
    font-size: 11px;
  }
  
  .details-extras {
    margin-bottom: 14px;
  }
  
  .extras-badge {
    padding: 8px 12px;
    font-size: 11px;
  }
  
  .details-pricing {
    padding: 12px;
  }
  
  .pricing-row {
    font-size: 12px;
    padding: 5px 0;
  }
  
  .pricing-total {
    font-size: 14px;
    padding: 10px 0 0 0;
    margin-top: 6px;
  }
  
  .pricing-total span:last-child {
    font-size: 15px;
  }
  
  .form-section-title {
    font-size: 16px;
    margin-bottom: 16px;
  }
  
  .form-item {
    margin-bottom: 16px;
    width: 100% !important;
  }
  
  .form-item :deep(.ant-input),
  .form-item :deep(.ant-picker),
  .form-item :deep(.ant-select) {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }
  
  .form-input :deep(.ant-input) {
    padding: 10px 14px;
    font-size: 15px;
  }

  .form-input :deep(.ant-picker-input) {
    font-size: 14px !important;
  }
  
  .submit-btn {
    height: 46px;
    font-size: 14px;
    border-radius: 10px;
  }
  
  .bank-details-card {
    padding: 14px;
  }
  
  .bank-details-title {
    font-size: 16px;
    margin-bottom: 14px;
  }
  
  .bank-iban-box {
    padding: 12px 14px;
  }
  
  .bank-iban-value {
    font-size: 12px;
  }
  
  .bank-detail-row {
    padding: 10px 0;
  }
  
  .bank-detail-label {
    font-size: 12px;
    min-width: 70px;
  }
  
  .bank-detail-value {
    font-size: 12px;
  }
  
  .bank-share-btn {
    padding: 12px;
    font-size: 14px;
  }
  
  .bank-instruction {
    font-size: 12px;
    padding: 8px 10px;
  }
  
  .rental-code-display {
    padding: 10px 20px;
    max-width: 200px;
  }
  
  .rental-code-label {
    font-size: 11px;
  }
  
  .rental-code-value {
    font-size: 20px;
  }
}

@media (max-width: 400px) {
  .reservation-modal :deep(.ant-modal) {
    width: 98% !important;
    max-width: 98% !important;
  }
  
  .form-section {
    padding: 6px !important;
  }
  
  .form-title {
    font-size: 18px;
  }

  .name-row {
    grid-template-columns: 1fr !important;
    gap: 0 !important;
  }
  
  .reservation-details {
    padding: 12px;
  }
  
  .details-cards {
    gap: 6px;
  }
  
  .detail-card {
    padding: 8px;
    max-width: 100%;
  }
  
  .detail-card-content {
    max-width: 100%;
  }
  
  .detail-card-value {
    font-size: 11px;
  }
  
  .detail-card-sub {
    font-size: 10px;
  }
  
  .details-header-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  
  .details-title {
    font-size: 14px;
  }
  
  .form-input :deep(.ant-input) {
    padding: 9px 12px;
    font-size: 14px;
  }
  
  .submit-btn {
    height: 44px;
    font-size: 13px;
  }
}

/* Modal Info Button Styling — usa :global porque o modal é teleportado para o body */
:global(.ant-modal-confirm .ant-modal-confirm-btns .ant-btn-primary) {
  background: #FE7743 !important;
  background-color: #FE7743 !important;
  border: none !important;
  border-radius: 8px !important;
  height: 40px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  color: #fff !important;
}

:global(.ant-modal-confirm .ant-modal-confirm-btns .ant-btn-primary:hover),
:global(.ant-modal-confirm .ant-modal-confirm-btns .ant-btn-primary:focus),
:global(.ant-modal-confirm .ant-modal-confirm-btns .ant-btn-primary:active) {
  background: linear-gradient(135deg, #FE7743 0%, #ff5722 100%) !important;
  background-color: #fe6030 !important;
  border: none !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(254, 119, 67, 0.3) !important;
  color: #fff !important;
}

/* Ícone de Info — cor laranja */
:global(.ant-modal-confirm-info .ant-modal-confirm-body > .anticon) {
  color: #FE7743 !important;
}

/* Botões primary do modal — cor laranja */
.reservation-modal :deep(.ant-btn-primary) {
  background: #FE7743 !important;
  border-color: #FE7743 !important;
  color: #fff !important;
}

.reservation-modal :deep(.ant-btn-primary:hover),
.reservation-modal :deep(.ant-btn-primary:focus) {
  background: #ff5722 !important;
  border-color: #ff5722 !important;
  color: #fff !important;
}

.reservation-modal :deep(.ant-btn-primary:active) {
  background: #e64a19 !important;
  border-color: #e64a19 !important;
  color: #fff !important;
}

/* Rental Code Display */
.rental-code-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  border: 2px solid #FE7743;
  border-radius: 12px;
  padding: 12px 24px;
  width: 100%;
  max-width: 240px;
}

.rental-code-label {
  font-size: 12px;
  font-weight: 600;
  color: #9a3412;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.rental-code-value {
  font-size: 24px;
  font-weight: 700;
  color: #FE7743;
  letter-spacing: 1px;
}

/* Download Button - força hover laranja */
.download-btn {
  background: #FE7743 !important;
  border-color: #FE7743 !important;
}

.download-btn:hover,
.download-btn:focus {
  background: #ff5722 !important;
  border-color: #ff5722 !important;
}
</style>