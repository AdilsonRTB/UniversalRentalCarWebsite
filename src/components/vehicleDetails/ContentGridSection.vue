<template>

  <div class="description-card-modern" style="margin-bottom: 24px; margin-top: -10px;">
    <div class="card-header-modern">
      <h3 class="card-title-modern">{{ t('vehicles.description') }}</h3>
      <p class="card-subtitle-modern">{{ t('vehicles.aboutVehicle') }}</p>
    </div>

    <div class="description-content-modern">
      <p>{{ vehicle?.description || t('vehicles.defaultDescription') }}</p>
    </div>
  </div>
  <div class="content-grid-modern">
    <!-- Specs Card -->

    <div class="specs-card-modern">
      <div class="card-header-modern">
        <h3 class="card-title-modern">{{ t('vehicles.specifications') }}</h3>
        <p class="card-subtitle-modern">{{ t('vehicles.technicalDetails') }}</p>
      </div>

      <div class="specs-grid-modern">
        <div class="spec-item-modern">
          <div class="spec-icon-modern">
            <CarOutlined />
          </div>
          <div class="spec-content-modern">
            <span class="spec-label-modern">Transmissão</span>
            <span class="spec-value-modern">{{ vehicle?.gearbox_type }}</span>
          </div>
        </div>
        
        <div class="spec-item-modern">
          <div class="spec-icon-modern">
            <SettingOutlined />
          </div>
          <div class="spec-content-modern">
            <span class="spec-label-modern">Combustivel</span>
            <span class="spec-value-modern">{{ vehicle?.fuel_type }}</span>
          </div>
        </div>
        
        <div class="spec-item-modern">
          <div class="spec-icon-modern">
            <CalendarOutlined />
          </div>
          <div class="spec-content-modern">
            <span class="spec-label-modern">Potencia</span>
            <span class="spec-value-modern">{{ vehicle?.engine_size }} CV</span>
          </div>
        </div>
        
        <div class="spec-item-modern">
          <div class="spec-icon-modern">
            <TeamOutlined />
          </div>
          <div class="spec-content-modern">
            <span class="spec-label-modern">Quilometragem</span>
            <span class="spec-value-modern">{{ vehicle?.mileage }} KM</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Card -->
    <!--div class="features-card-modern">
      <div class="card-header-modern">
        <h3 class="card-title-modern">{{ t('vehicles.features') }}</h3>
        <p class="card-subtitle-modern">{{ t('vehicles.includedFeatures') }}</p>
      </div>
      
      <div class="features-grid-modern">
        <div class="feature-item-modern" v-if="vehicle?.air_conditioning">
          <CheckCircleFilled class="feature-icon available" />
          <span class="feature-text">{{ t('vehicles.airConditioning') }}</span>
        </div>
        <div class="feature-item-modern">
          <CheckCircleFilled class="feature-icon available" />
          <span class="feature-text">{{ t('vehicles.bluetooth') }}</span>
        </div>
        <div class="feature-item-modern">
          <CheckCircleFilled class="feature-icon available" />
          <span class="feature-text">{{ t('vehicles.gps') }}</span>
        </div>
        <div class="feature-item-modern">
          <CheckCircleFilled class="feature-icon available" />
          <span class="feature-text">{{ t('vehicles.insurance') }}</span>
        </div>
        <div class="feature-item-modern" v-if="vehicle?.panoramic_roof">
          <CheckCircleFilled class="feature-icon available" />
          <span class="feature-text">Teto Panoramico</span>
        </div>
      </div>
    </!--div-->

    <!-- Description Card -->


    <!-- Booking Card -->
    <div class="booking-card-modern">
      <div class="card-header-modern booking-header-modern">
        <h3 class="card-title-modern">{{ t('vehicles.bookNow') }}</h3>
        <div class="price-section-modern">
          <div v-if="vehicle?.hasPromotion" class="original-price-modern">
            {{ formatCurrency(vehicle?.original_rate || vehicle?.daily_rate * 1.2) }}
          </div>
          <div class="current-price-modern">
            <span class="price-value-modern">{{ vehicle?.daily_rate }} CVE</span>
            <span class="price-period-modern">/ {{ t('vehicles.day') }}</span>
          </div>
          <div v-if="vehicle?.hasPromotion" class="promotion-savings">
            {{ t('vehicles.save') }} {{ formatCurrency((vehicle?.original_rate || vehicle?.daily_rate * 1.2) - vehicle?.daily_rate) }}
          </div>
        </div>
      </div>
      
      <div class="booking-form-modern">
        <div class="date-grid-modern">
          <div class="date-item-modern">
            <label>{{ t('vehicles.pickupDate') }}</label>
            <a-date-picker 
              :value="bookingDates.startDate"
              @change="(date) => $emit('update:startDate', date)"
              :disabled-date="disabledStartDate"
              class="modern-date-picker"
              :placeholder="t('vehicles.selectStartDate')"
            />
          </div>
          <div class="date-item-modern">
            <label>{{ t('vehicles.returnDate') }}</label>
            <a-date-picker 
              :value="bookingDates.endDate"
              @change="(date) => $emit('update:endDate', date)"
              :disabled-date="disabledEndDate"
              class="modern-date-picker"
              :placeholder="t('vehicles.selectEndDate')"
            />
          </div>
        </div>
        
        <div class="booking-summary-modern">
          <div class="summary-item">
            <span class="summary-label">{{ t('vehicles.subtotal') }} ({{ totalDays }} {{ totalDays === 1 ? t('vehicles.day') : t('vehicles.days') }}):</span>
            <span class="summary-value">{{ subtotal }} CVE</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">{{ t('vehicles.taxes') }}:</span>
            <span class="summary-value">{{ taxes }} CVE</span>
          </div>
          <div class="summary-item total">
            <span class="summary-label">{{ t('vehicles.total') }}:</span>
            <span class="summary-value">{{ totalPrice }} CVE</span>
          </div>
        </div>
        
        <div class="booking-actions-modern">
          <a-button
            type="primary" 
            size="large"
            class="book-now-btn-modern"
            :loading="bookingLoading"
            :disabled="!bookingDates.startDate || !bookingDates.endDate"
            @click="handleBooking"
          >
            {{ t('vehicles.bookNow') }}
          </a-button>

        </div>
      </div>
    </div>
    <ReservationModal
      v-model:visible="showReservationModal"
      :vehicle="vehicle"
      :pickup-date="bookingDates.startDate"
      :return-date="bookingDates.endDate"
      :calculate-days="totalDays"
      :calculate-total="totalPrice"
      @reservation-confirmed="handleReservationConfirmed"
    />
  </div>
</template>

<script setup>
import { defineProps, ref, watch} from 'vue'
import { 
  CarOutlined, 
  SettingOutlined, 
  CalendarOutlined, 
  TeamOutlined, 
  //CheckCircleFilled,
  //LoginOutlined
  //MessageOutlined
} from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import { useLanguageAndCurrency } from '../../composables/useLanguageAndCurrency'
import dayjs from 'dayjs'
//import { bookingService, authService } from '../../services/api'
import { message } from 'ant-design-vue'
import ReservationModal from '../ReservationModal.vue'

//import { useRouter } from 'vue-router'

const { t } = useI18n()
const { formatCurrency } = useLanguageAndCurrency()

//const loading = ref(false)

const props = defineProps({
  vehicle: {
    type: Object,
    required: true
  },
  bookingDates: {
    type: Object,
    required: true
  },
  bookingLoading: {
    type: Boolean,
    default: false
  },
  totalDays: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  taxes: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
})

const showReservationModal = ref(false)

const handleBooking = () => {
  showReservationModal.value = true
}

// Função chamada quando reserva é confirmada
const handleReservationConfirmed = (reservationData) => {
  console.log('Reserva confirmada:', reservationData)
  message.success('Reserva efetuada com sucesso!')

  // clean up booking dates
}

const isAuthenticated = ref(!!localStorage.getItem('authToken'))
// Watch for auth changes
watch(() => localStorage.getItem('authToken'), (newToken) => {
  isAuthenticated.value = !!newToken
})

/*const login = async () => {
  // Redirect to login page instead of using Keycloak
  router.push('/login')
}*/

//const emit = defineEmits(['book', 'contact', 'update:startDate', 'update:endDate'])

const disabledStartDate = (current) => {
  return current && current < dayjs().startOf('day')
}

const disabledEndDate = (current) => {
  return current && (current < dayjs().startOf('day') || (props.bookingDates.startDate && current <= dayjs(props.bookingDates.startDate)))
}

/*const customer = ref(null)

const getCustomerData = async () => {
  loading.value = true
  try {
    const response = await authService.me()
    customer.value = response.data
    console.log('[OwnerDashboard] Fetched customer data:', customer.value)
  } catch (error) {
    console.error('[OwnerDashboard] Error fetching customer data:', error)

  } finally {
    loading.value = false
  }
}*/

/*const createBookingServices = async () => {
  loading.value = true

  const bookingData = {
    vehicle: props.vehicle.id,
    customer: customer.value.id, // Replace with actual customer ID
    start_date: props.bookingDates.startDate,
    end_date: props.bookingDates.endDate,
    daily_rate: props.vehicle.daily_rate.toString(),
    commission_percent: "10", // Example value
    insurance_fee: "0", // Example value
    security_deposit: "0", // Example value
    late_return_fee: "0", // Example value
    damage_fee: "0", // Example value
    amount_paid: props.totalPrice.toString(),
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
        message.success(t('vehicles.bookingSuccessMessage'))

        // clean up booking dates
        emit('update:startDate', null)
        emit('update:endDate', null)
        
      }
      else {
        message.error(t('vehicles.bookingErrorMessage'))
      }
    }

  } catch (error) {
    console.error('Erro ao carregar veículos:', error)
    // Mock data for development - fallback when API fails
    // Load promotional vehicles (limited to 10)
    //await loadPromotionalVehicles()
  } finally {
    loading.value = false
  }
}

const handleBooking = () => {
  emit('book')
  createBookingServices()
}

/*const contactOwner = () => {
  emit('contact')
}*/

/*onMounted(() => {
  getCustomerData()
})*/
</script>

<style scoped>
/* Content Grid */
.content-grid-modern {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 40px;
}

/* Cards */
.specs-card-modern,
.features-card-modern,
.description-card-modern,
.booking-card-modern {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.card-header-modern {
  margin-bottom: 24px;
}

.card-title-modern {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #111827;
}

.card-subtitle-modern {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
}

/* Specs Grid */
.specs-grid-modern {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.spec-item-modern {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background: #f8fafc;
}

.spec-icon-modern {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.spec-content-modern {
  display: flex;
  flex-direction: column;
}

.spec-label-modern {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.spec-value-modern {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

/* Features Grid */
.features-grid-modern {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.feature-item-modern {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature-icon {
  font-size: 16px;
}

.feature-icon.available {
  color: #10b981;
}

.feature-text {
  font-weight: 500;
  color: #374151;
}

/* Description */
.description-content-modern {
  margin-top: 16px;
}

.description-content-modern p {
  line-height: 1.6;
  color: #4b5563;
  margin: 0;
  font-size: 15px;
}

/* Booking Card */
.booking-card-modern {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.booking-header-modern {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 20px;
}

.price-section-modern {
  margin-top: 16px;
}

.original-price-modern {
  font-size: 14px;
  color: #9ca3af;
  text-decoration: line-through;
  margin-bottom: 4px;
}

.current-price-modern {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}

.price-value-modern {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.price-period-modern {
  font-size: 14px;
  color: #6b7280;
}

.promotion-savings {
  color: #059669;
  font-size: 14px;
  font-weight: 600;
}

/* Booking Form */
.booking-form-modern {
  margin-top: 24px;
}

.date-grid-modern {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.date-item-modern {
  display: flex;
  flex-direction: column;
}

.modern-date-picker {
  margin-top: 8px;
}

/* Booking Summary */
.booking-summary-modern {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.summary-item.total {
  border-top: 1px solid #e5e7eb;
  padding-top: 12px;
  font-weight: 600;
  font-size: 16px;
}

.summary-label {
  color: #6b7280;
  font-size: 14px;
}

.summary-value {
  font-weight: 600;
  color: #111827;
  font-size: 14px;
}

.hero-auth-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.hero-auth-btn.secondary {
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  background: transparent !important;
}

.hero-auth-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  color: white !important;
  transform: translateY(-2px);
}

.hero-auth-btn.primary {
  background: #FE7743 !important;
  border: none !important;
  color: white !important;
}

.hero-auth-btn.primary:hover {
  background: #e06a3c !important;
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(254, 119, 67, 0.4);
}

/* Booking Actions */
.booking-actions-modern {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.book-now-btn-modern {
  background: #e06a3c !important;
  border: none;
  height: 48px;
  font-weight: 600;
  color: white;
}

.contact-owner-btn-modern {
  border-color: #d1d5db;
  height: 48px;
  color: #374151;
}

.contact-owner-btn-modern:hover {
  border-color: #9ca3af;
  color: #111827;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-grid-modern {
    grid-template-columns: 1fr;
  }
  
  .booking-card-modern {
    position: static;
  }
}

@media (max-width: 768px) {
  .specs-grid-modern,
  .features-grid-modern {
    grid-template-columns: 1fr;
  }
  
  .date-grid-modern {
    grid-template-columns: 1fr;
  }
}
</style>