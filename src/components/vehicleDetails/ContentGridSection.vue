<template>

  <div class="description-card-modern" style="margin-bottom: 24px; margin-top: -10px;">
    <div class="card-header-modern">
      <h3 class="card-title-modern">{{ t('vehicles.description') }}</h3>
      <p class="card-subtitle-modern">{{ t('vehicles.aboutVehicle') }}</p>
    </div>

    <div class="description-content-modern">
      <p v-html="vehicleDescription"></p>
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
            <span class="spec-label-modern">{{ t('vehicles.transmission') }}</span>
            <span class="spec-value-modern">{{ gearboxTypeMap(vehicle?.gearbox_type) }}</span>
          </div>
        </div>
        
        <div class="spec-item-modern">
          <div class="spec-icon-modern">
            <SettingOutlined />
          </div>
          <div class="spec-content-modern">
            <span class="spec-label-modern">{{ t('vehicles.fuel') }}</span>
            <span class="spec-value-modern">{{ fuelTypeMap(vehicle?.fuel_type) }}</span>
          </div>
        </div>

        <div class="spec-item-modern">
          <div class="spec-icon-modern">
            <CalendarOutlined />
          </div>
          <div class="spec-content-modern">
            <span class="spec-label-modern">{{ t('vehicles.power') }}</span>
            <span class="spec-value-modern">{{ vehicle?.engine_size }} CV</span>
          </div>
        </div>

        <div class="spec-item-modern">
          <div class="spec-icon-modern">
            <TeamOutlined />
          </div>
          <div class="spec-content-modern">
            <span class="spec-label-modern">{{ t('vehicles.seats') }}</span>
            <span class="spec-value-modern">{{ vehicle?.number_of_seats }} </span>
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
          <span class="feature-text">{{ t('vehicles.panoramicRoof') }}</span>
        </div>
      </div>
    </!--div-->

    <!-- Description Card -->


    <!-- Booking Card -->
    <div class="booking-card-modern">
      <div class="card-header-modern">
        <h3 class="card-title-modern">{{ t('vehicles.bookNow') }}</h3>
        <div class="price-section-modern">
          <div v-if="vehicle?.hasPromotion" class="original-price-modern">
            {{ formatCurrency(vehicle?.original_rate || vehicle?.daily_rate * 1.2) }}
          </div>
          <!--div class="current-price-modern">
            <span class="price-value-modern">{{ vehicle?.daily_rate }} CVE</span>
            <span class="price-period-modern">/ {{ t('vehicles.day') }}</span>
          </!--div-->
          <div class="date-grid-modern">
            <div class="date-item-modern">
              <label>{{ t('vehicles.pickupDate') }}</label>
              <div class="date-time-group">
                <a-date-picker
                  size="large"
                  v-model:value="filters.startDate"
                  @change="(date) => $emit('update:startDate', date)"
                  :disabled-date="disabledStartDate"
                  class="modern-date-picker date-only"
                  :placeholder="t('vehicles.selectStartDate')"
                  format="YYYY-MM-DD"
                  :key="'start-date-' + currentLanguage"
                  :locale="datePickerLocale"
                  :show-today="false"
                />
                <a-select
                  v-model:value="filters.startTime"
                  size="large"
                  class="modern-time-picker"
                  :placeholder="t('search.selectTime')"
                >
                  <a-select-option v-for="time in availableStartTimes" :key="time" :value="time">
                    {{ time }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="date-item-modern">
              <label>{{ t('vehicles.returnDate') }}</label>
              <div class="date-time-group">
                <a-date-picker
                  size="large"
                  v-model:value="filters.endDate"
                  @change="(date) => $emit('update:endDate', date)"
                  :disabled-date="disabledEndDate"
                  class="modern-date-picker date-only"
                  :placeholder="t('vehicles.selectEndDate')"
                  format="YYYY-MM-DD"
                  :key="'end-date-' + currentLanguage"
                  :locale="datePickerLocale"
                  :show-today="false"
                />
                <a-select
                  v-model:value="filters.endTime"
                  size="large"
                  class="modern-time-picker"
                  :placeholder="t('search.selectTime')"
                >
                  <a-select-option v-for="time in availableEndTimes" :key="time" :value="time">
                    {{ time }}
                  </a-select-option>
                </a-select>
              </div>
            </div>
          </div>
          <div v-if="vehicle?.hasPromotion" class="promotion-savings">
            {{ t('vehicles.save') }} {{ formatCurrency((vehicle?.original_rate || vehicle?.daily_rate * 1.2) - vehicle?.daily_rate) }}
          </div>
        </div>
      </div>
      
      <div class="booking-form-modern">

        
        <!-- Location Section -->
        <div class="location-section">
          <div class="location-selects">
            <div class="location-select-item">
              <label>{{ $t('search.gallery.pickupLocation') }}</label>
              <a-select
                size="large"
                v-model:value="pickupLocation"
                :placeholder="t('search.gallery.pickupLocation')"
                class="location-select"
                :options="locationsOptions"
                show-search
                :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
              />
              <a-input
                v-if="pickupLocation === '__others__'"
                v-model:value="customPickupLocation"
                :placeholder="t('search.gallery.customLocationPlaceholder')"
                size="large"
                class="custom-location-input"
              />
            </div>
            <div class="location-select-item">
              <label>{{ $t('search.gallery.returnLocation') }}</label>
              <a-select
                size="large"
                v-model:value="returnLocation"
                :placeholder="t('search.gallery.returnLocation')"
                class="location-select"
                :options="locationsOptions"
                show-search
                :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
              />
              <a-input
                v-if="returnLocation === '__others__'"
                v-model:value="customReturnLocation"
                :placeholder="t('search.gallery.customLocationPlaceholder')"
                size="large"
                class="custom-location-input"
              />
            </div>
          </div>
        </div>

        <!-- Extras Section -->
        <div class="extras-section">
          <div class="extras-options">
            <div class="extra-option">
              <a-checkbox v-model:checked="withDriver">{{ t('search.gallery.withDriver') }}</a-checkbox>
              <span class="extra-price">{{ driverDailyRate }} {{ currencySymbol }}</span>
            </div>
            <div class="extra-option">
              <a-checkbox v-model:checked="carSeat">{{ t('search.gallery.carSeat') }}</a-checkbox>
              <span class="extra-price">{{ carSeatDailyRate }} {{ currencySymbol }}</span>
            </div>
          </div>
        </div>

        <!-- Price Display -->
        <div class="price-display">
          <div class="price-breakdown">
            <div class="price-line">
              <span class="price-label">{{ t('search.gallery.dailyPrice') }}</span>
              <span class="price-value">{{ dailyRate }} {{ currencySymbol }}</span>
            </div>
            <div class="price-line">
              <span class="price-label">{{ totalDays }} {{ t('search.gallery.days') }}</span>
              <span class="price-value">{{ (totalDays * dailyRate) }} {{ currencySymbol }}</span>
            </div>
            <div v-if="withDriver" class="price-line">
              <span class="price-label">{{ t('search.gallery.withDriverDays', { days: totalDays }) }}</span>
              <span class="price-value">{{ (totalDays * driverDailyRate) }} {{ currencySymbol }}</span>
            </div>
            <div v-if="carSeat" class="price-line">
              <span class="price-label">{{ t('search.gallery.carSeatDays', { days: totalDays }) }}</span>
              <span class="price-value">{{ (totalDays * carSeatDailyRate) }} {{ currencySymbol }}</span>
            </div>
            <div class="price-line">
              <span class="price-label">{{ t('search.gallery.serviceFee') }}</span>
              <span class="price-value">{{ serviceFeeAmount }} {{ currencySymbol }}</span>
            </div>
            <div class="price-line" v-if="securityDeposit > 0">
              <span class="price-label">{{ t('search.gallery.securityDeposit') }}</span>
              <span class="price-value">{{ securityDeposit }} {{ currencySymbol }}</span>
            </div>
          </div>
        </div>
        
        <div class="booking-actions-modern">
          <a-button
            type="primary" 
            size="large"
            class="next-btn-modern"
            :loading="bookingLoading"
            :disabled="isBookingDisabled"
            @click="handleBooking"
          >
            <div class="button-content">
              <span class="button-text">{{ t('vehicles.bookNow') }}</span>
              <span class="button-total">{{ calculateTotal }} {{ currencySymbol }}</span>
            </div>
          </a-button>
        </div>
      </div>
    </div>
    <ReservationModal
      v-model:visible="showReservationModal"
      :vehicle="vehicle"
      :pickup-date="filters.startDate"
      :return-date="filters.endDate"
      :calculate-days="totalDays"
      :calculate-total="calculateTotal"
      :with-driver="withDriver"
      :car-seat="carSeat"
      :with-driver-value="totalDays * driverDailyRate"
      :car-seat-value="totalDays * carSeatDailyRate"
      :pickupLocation="effectivePickupLocation"
      :returnLocation="effectiveReturnLocation"
      :locations="locations"
      @reservation-confirmed="handleReservationConfirmed"
      :serviceFeeAmount="serviceFeeAmount"
      :currencySymbol="currencySymbol"
      :dailyRate="dailyRate * totalDays"
      :securityDeposit="securityDeposit"
    />
  </div>
</template>

<script setup>
import { defineProps, ref, watch, computed, defineEmits } from 'vue'
import { 
  CarOutlined, 
  SettingOutlined, 
  CalendarOutlined,
  TeamOutlined
} from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import 'dayjs/locale/pt'
import 'dayjs/locale/en'
import 'dayjs/locale/fr'
import antLocale_pt_BR from 'ant-design-vue/es/locale/pt_BR'
import antLocale_en_US from 'ant-design-vue/es/locale/en_US'
import antLocale_fr_FR from 'ant-design-vue/es/locale/fr_FR'
import { message } from 'ant-design-vue'
import ReservationModal from '../ReservationModal.vue'
import { useLanguageAndCurrency } from '../../composables/useLanguageAndCurrency.js'

const { t, locale } = useI18n()
const { formatCurrency, currentCurrency, currentLanguage } = useLanguageAndCurrency()

const disableBooking = ref(false)

const props = defineProps({
  vehicle: {
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
  },
  availability: {
    type: Boolean,
    default: false
  },
  locations: {
    type: Array,
    default: () => []
  },
  config: {
    type: Object,
    default: () => ({})
  }
})

const STORAGE_KEYS = {
  START_DATE: 'vehicle_search_start_date',
  END_DATE: 'vehicle_search_end_date'
}

// emit for update section
const emit = defineEmits(['updateSection'])

// Load dates from localStorage safely
const loadDateFromStorage = (key) => {
  try {
    const savedDate = localStorage.getItem(key)
    if (savedDate) {
      return dayjs(savedDate)
    }
  } catch (error) {
    console.error(t('common.errors.loadingDateFromStorage'), error)
  }
  return null
}

// Load time from localStorage
const loadTimeFromStorage = (key, defaultTime = '08:00') => {
  try {
    const savedDate = localStorage.getItem(key)
    if (savedDate) {
      return dayjs(savedDate).format('HH:mm')
    }
  } catch (error) {
    console.error(t('common.errors.loadingDateFromStorage'), error)
  }
  return defaultTime
}

const filters = ref({
  startDate: loadDateFromStorage(STORAGE_KEYS.START_DATE) || dayjs().add(1, 'day'),
  endDate: loadDateFromStorage(STORAGE_KEYS.END_DATE) || dayjs().add(3, 'day'),
  startTime: loadTimeFromStorage(STORAGE_KEYS.START_DATE, '08:00'),
  endTime: loadTimeFromStorage(STORAGE_KEYS.END_DATE, '08:00')
})

// Generate time options (00:00 to 23:30 in 30-minute intervals)
const timeOptions = computed(() => {
  const times = []
  for (let hour = 0; hour < 24; hour++) {
    const hourStr = hour.toString().padStart(2, '0')
    times.push(`${hourStr}:00`)
    times.push(`${hourStr}:30`)
  }
  return times
})

// Available pickup times: if start date is today, exclude past times
const availableStartTimes = computed(() => {
  const isToday = filters.value.startDate && filters.value.startDate.isSame(dayjs(), 'day')
  if (!isToday) return timeOptions.value
  const currentHour = dayjs().hour()
  const currentMinute = dayjs().minute()
  return timeOptions.value.filter(time => {
    const [h, m] = time.split(':').map(Number)
    return h > currentHour || (h === currentHour && m > currentMinute)
  })
})

// Available return times: if rental is exactly 2 days (48h minimum), show only times >= pickup time
const availableEndTimes = computed(() => {
  // If no dates selected, return all times
  if (!filters.value.startDate || !filters.value.endDate) {
    return timeOptions.value
  }
  
  // Calculate difference in days
  const daysDiff = filters.value.endDate.diff(filters.value.startDate, 'day')
  
  // If exactly 2 days (48 hours minimum rental), filter times
  if (daysDiff === 2) {
    const startTime = filters.value.startTime
    if (!startTime) return timeOptions.value
    
    // Return only times >= pickup time to ensure minimum 48 hours
    return timeOptions.value.filter(time => time >= startTime)
  }
  
  // For other cases, return all times
  return timeOptions.value
})

// Date picker locale support
const datePickerLocale = computed(() => {
  if (currentLanguage.value === 'pt') return antLocale_pt_BR.DatePicker
  if (currentLanguage.value === 'en') return antLocale_en_US.DatePicker
  if (currentLanguage.value === 'fr') return antLocale_fr_FR.DatePicker
  return antLocale_pt_BR.DatePicker
})

// Disable hours outside 8-23 range (no longer needed with select dropdown)
/*const disabledHours = () => {
  return [0, 1, 2, 3, 4, 5, 6, 7]
}*/

// Watch for language changes to update dayjs locale
watch(currentLanguage, (newLang) => {
  if (newLang === 'pt') dayjs.locale('pt')
  else if (newLang === 'en') dayjs.locale('en')
  else if (newLang === 'fr') dayjs.locale('fr')
}, { immediate: true })

const showReservationModal = ref(false)

// Extras state
const withDriver = ref(false)
const carSeat = ref(false)

// Location state
const pickupLocation = ref(null)
const returnLocation = ref(null)
const customPickupLocation = ref('')
const customReturnLocation = ref('')

// Effective location: custom text if 'Outros' selected, else selected value
const effectivePickupLocation = computed(() =>
  pickupLocation.value === '__others__' ? customPickupLocation.value.trim() : pickupLocation.value
)
const effectiveReturnLocation = computed(() =>
  returnLocation.value === '__others__' ? customReturnLocation.value.trim() : returnLocation.value
)

// Calculated total with extras
const calculateTotal = computed(() => {
  let baseTotal = props.totalDays * dailyRate.value;
  let extras = 0;

  // Add driver cost per day based on config
  if (withDriver.value) {
    extras += props.totalDays * driverDailyRate.value;
  }
  
  // Add car seat cost per day based on config
  if (carSeat.value) {
    extras += props.totalDays * carSeatDailyRate.value;
  }

  // Add service fee based on config
  const serviceFee = serviceFeeAmount.value;

  // Add security deposit
  const deposit = securityDeposit.value;

  return Math.round(baseTotal + extras + serviceFee + deposit);
})

// Computed options for locations — includes 'Outros' for custom input
const locationsOptions = computed(() => {
  const options = props.locations.map(loc => ({ label: loc.name, value: loc.name }))
  options.push({ label: t('search.gallery.others'), value: '__others__' })
  return options
})

// Check if booking button should be disabled
const isBookingDisabled = computed(() => {
  return disableBooking.value || !effectivePickupLocation.value || !effectiveReturnLocation.value
})

const handleBooking = () => {
  if (!filters.value.startDate || !filters.value.endDate) {
    message.warning(t('search.gallery.selectDatesWarning'))
    return
  }
  
  if (disableBooking.value) {
    message.warning(t('search.gallery.vehicleNotAvailable'))
    return
  }
  
  showReservationModal.value = true
}
// Watch for changes in locations to set default values
watch(() => props.locations, (newLocations) => {
  if (newLocations && newLocations.length > 0) {
    // Find default pickup location
    const defaultPickup = newLocations.find(loc => loc.default_pickup === true)
    if (defaultPickup && !pickupLocation.value) {
      pickupLocation.value = defaultPickup.name
    }

    // Find default return location
    const defaultReturn = newLocations.find(loc => loc.default_return === true)
    if (defaultReturn && !returnLocation.value) {
      returnLocation.value = defaultReturn.name
    }
  }
}, { immediate: true })

// Função chamada quando reserva é confirmada
const handleReservationConfirmed = (reservationData) => {
  console.log('Reserva confirmada:', reservationData)
  message.success(t('search.gallery.reservationSuccess'))

}

const isAuthenticated = ref(!!localStorage.getItem('authToken'))
// Watch for auth changes
watch(() => localStorage.getItem('authToken'), (newToken) => {
  isAuthenticated.value = !!newToken
})


const disabledStartDate = (current) => {
  if (!current) return false
  
  const today = dayjs().startOf('day')
  const maxDate = dayjs().add(2, 'year').endOf('day')
  
  // Não pode ser antes de hoje ou depois de 2 anos a partir de hoje
  return current < today || current > maxDate
}

const disabledEndDate = (current) => {
  if (!current) return false

  const today = dayjs().startOf('day')
  const maxDate = dayjs().add(2, 'year').endOf('day')

  // Não pode ser anterior ao dia de hoje
  if (current < today) {
    return true
  }

  // Não pode ser depois de 2 anos a partir de hoje
  if (current > maxDate) {
    return true
  }

  // Mínimo: data de recolha + 2 dias
  const minReturn = filters.value.startDate
    ? filters.value.startDate.add(2, 'day').startOf('day')
    : dayjs().add(2, 'day').startOf('day')

  if (current < minReturn) {
    return true
  }

  return false
}

// Computed property para descrição do veículo na linguagem selecionada
const vehicleDescription = computed(() => {
  let description = ''
  switch (locale.value) {
    case 'en':
      description = props.vehicle?.description_en || props.vehicle?.description || t('vehicles.defaultDescription')
      break
    case 'fr':
      description = props.vehicle?.description_fr || props.vehicle?.description || t('vehicles.defaultDescription')
      break
    case 'pt':
    default:
      description = props.vehicle?.description || t('vehicles.defaultDescription')
  }
  // Substituir ponto e vírgula por quebra de linha
  return description.replace(/;/g, ';<br>')
})

// Computed properties para valores da configuração baseados na moeda selecionada
const driverDailyRate = computed(() => {
  switch (currentCurrency.value) {
    case 'USD':
      return parseFloat(props.config?.driver_rate_usd || 30)
    case 'EUR':
      return parseFloat(props.config?.driver_rate_eur || 30)
    case 'CVE':
    default:
      return parseFloat(props.config?.driver_daily_rate || 3000)
  }
})

const dailyRate = computed(() => {
  const baseRate = Number(props.vehicle?.daily_rate) || 0

  const usdRate = Number(props.config?.usd_exchange_rate) || 1
  const eurRate = Number(props.config?.euro_exchange_rate) || 1

  switch (currentCurrency.value) {
    case 'USD':
      return usdRate ? baseRate / usdRate : 0

    case 'EUR':
      return eurRate ? baseRate / eurRate : 0

    case 'CVE':
    default:
      return baseRate
  }
})

const carSeatDailyRate = computed(() => {
  switch (currentCurrency.value) {
    case 'USD':
      return parseFloat(props.config?.car_seat_rate_usd || 5)
    case 'EUR':
      return parseFloat(props.config?.car_seat_rate_eur || 5)
    case 'CVE':
    default:
      return parseFloat(props.config?.car_seat_daily_rate || 500)
  }
})

const serviceFeeAmount = computed(() => {
  switch (currentCurrency.value) {
    case 'USD':
      return parseFloat(props.config?.service_fee_usd || 10)
    case 'EUR':
      return parseFloat(props.config?.service_fee_eur || 10)
    case 'CVE':
    default:
      return parseFloat(props.config?.service_fee_amount || 1000)
  }
})

const securityDeposit = computed(() => {
  const baseDeposit = Number(props.vehicle?.security_deposit) || 0

  const usdRate = Number(props.config?.usd_exchange_rate) || 1
  const eurRate = Number(props.config?.euro_exchange_rate) || 1

  switch (currentCurrency.value) {
    case 'USD':
      return usdRate ? Math.round(baseDeposit / usdRate) : 0
    case 'EUR':
      return eurRate ? Math.round(baseDeposit / eurRate) : 0
    case 'CVE':
    default:
      return baseDeposit
  }
})


const currencySymbol = computed(() => {
  switch (currentCurrency.value) {
    case 'USD':
      return 'USD'
    case 'EUR':
      return 'EUR'
    case 'CVE':
    default:
      return 'CVE'
  }
})

const fuelTypeMap = (type) => {
  switch (type) {
    case 'gasoline':
    case 'gas':
      return t('vehicles.fuelTypes.gas')
    case 'diesel':
      return t('vehicles.fuelTypes.diesel')
    case 'electric':
      return t('vehicles.fuelTypes.electric')
    case 'hybrid':
      return t('vehicles.fuelTypes.hybrid')
    case 'petrol':
      return t('vehicles.fuelTypes.petrol')
    default:
      return type
  }
}

const gearboxTypeMap = (type) => {
  switch (type) {
    case 'manual':
      return t('vehicles.transmissionTypes.manual')
    case 'automatic':
      return t('vehicles.transmissionTypes.automatic')
    default:
      return type
  }
}

// Watch for startDate changes and save to localStorage
watch(() => filters.value.startDate, (newDate) => {
  if (newDate && dayjs.isDayjs(newDate)) {
    const today = dayjs().startOf('day')
    
    // Se a nova data for anterior a hoje, ajustar para hoje
    if (newDate.isBefore(today)) {
      filters.value.startDate = today
      return
    }
    
    // Verificar se a data de devolução precisa ser ajustada (mínimo 2 dias)
    if (filters.value.endDate && filters.value.endDate.isBefore(newDate.add(2, 'day'))) {
      filters.value.endDate = newDate.add(2, 'day')
    }
    
    // Se mudou para hoje e a hora selecionada já passou, limpar a hora
    if (newDate.isSame(dayjs(), 'day') && filters.value.startTime) {
      const [h, m] = filters.value.startTime.split(':').map(Number)
      const now = dayjs()
      if (h < now.hour() || (h === now.hour() && m <= now.minute())) {
        filters.value.startTime = null
      }
    }
    
    localStorage.setItem(STORAGE_KEYS.START_DATE, newDate.toISOString())
  } else if (newDate) {
    // If it's not a dayjs object, try to convert it
    const dayjsDate = dayjs(newDate)
    if (dayjsDate.isValid()) {
      localStorage.setItem(STORAGE_KEYS.START_DATE, dayjsDate.toISOString())
    }
  } else {
    localStorage.removeItem(STORAGE_KEYS.START_DATE)
  }
  checkVehicleAvailable()
  emit('updateSection') // Emit event to update similar vehicles section
}, { deep: true })

// Watch for endDate changes and save to localStorage
watch(() => filters.value.endDate, (newDate) => {
  if (newDate && dayjs.isDayjs(newDate)) {
    const today = dayjs().startOf('day')
    
    // Se a nova data for anterior a hoje, ajustar para hoje + 2 dias
    if (newDate.isBefore(today)) {
      filters.value.endDate = today.add(2, 'day')
      return
    }
    
    // Se existe startDate e endDate for anterior a startDate + 2 dias, ajustar
    if (filters.value.startDate && newDate.isBefore(filters.value.startDate.add(2, 'day'))) {
      filters.value.endDate = filters.value.startDate.add(2, 'day')
      return
    }
    
    localStorage.setItem(STORAGE_KEYS.END_DATE, newDate.toISOString())
  } else if (newDate) {
    // If it's not a dayjs object, try to convert it
    const dayjsDate = dayjs(newDate)
    if (dayjsDate.isValid()) {
      localStorage.setItem(STORAGE_KEYS.END_DATE, dayjsDate.toISOString())
    }
  } else {
    localStorage.removeItem(STORAGE_KEYS.END_DATE)
  }
  checkVehicleAvailable()
  emit('updateSection')
}, { deep: true })

// Watch for startTime changes and combine with startDate
watch(() => filters.value.startTime, (newTime) => {
  if (newTime && filters.value.startDate) {
    // Se a diferença for exatamente 2 dias e hora de devolução < hora de recolha, ajustar
    if (filters.value.endDate && filters.value.endTime) {
      const daysDiff = filters.value.endDate.diff(filters.value.startDate, 'day')
      if (daysDiff === 2 && filters.value.endTime < newTime) {
        filters.value.endTime = newTime
      }
    }
    
    const [hour, minute] = newTime.split(':')
    const combinedDateTime = dayjs(filters.value.startDate)
      .hour(parseInt(hour))
      .minute(parseInt(minute))
      .second(0)
    localStorage.setItem(STORAGE_KEYS.START_DATE, combinedDateTime.toISOString())
  }
})

// Watch for endTime changes and combine with endDate
watch(() => filters.value.endTime, (newTime) => {
  if (newTime && filters.value.endDate) {
    // Se a diferença for exatamente 2 dias, garantir que hora de devolução >= hora de recolha
    if (filters.value.startDate && filters.value.startTime) {
      const daysDiff = filters.value.endDate.diff(filters.value.startDate, 'day')
      if (daysDiff === 2 && newTime < filters.value.startTime) {
        filters.value.endTime = filters.value.startTime
        return
      }
    }
    
    const [hour, minute] = newTime.split(':')
    const combinedDateTime = dayjs(filters.value.endDate)
      .hour(parseInt(hour))
      .minute(parseInt(minute))
      .second(0)
    localStorage.setItem(STORAGE_KEYS.END_DATE, combinedDateTime.toISOString())
  }
})

const checkVehicleAvailable = async () => {

  if (filters.value.startDate && filters.value.endDate) {
    const start = new Date(filters.value.startDate)
    const end = new Date(filters.value.endDate)
    if (start > end) {
      return
    }
  }

  /* filtrar por data active_rentals */
  if (filters.value.startDate && filters.value.endDate) {
    const start = dayjs(filters.value.startDate)
    const end = dayjs(filters.value.endDate)

    console.log(t('common.console.filteringVehicles'), start.format(), 'and', end.format())

    const hasOverlap = props.vehicle.active_rentals?.some(rental => {
      const rentalStart = dayjs(rental.start_date)
      const rentalEnd = dayjs(rental.end_date)
      return start.isBefore(rentalEnd) && end.isAfter(rentalStart)
    })

    if (hasOverlap) {
      disableBooking.value = true
    } else {
      disableBooking.value = false
    }

    console.log(t('common.console.vehicleAvailability'), disableBooking.value ? t('common.console.notAvailable') : t('common.console.available'))
  }
}

// Watch for vehicle active_rentals to check availability when data is loaded
watch(() => props.vehicle?.active_rentals, () => {
  checkVehicleAvailable()
}, { immediate: true, deep: true })
</script>

<style scoped>
/* Content Grid */
.content-grid-modern {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  margin-bottom: 40px;
  max-width: 100%;
  width: 100%;
  overflow: hidden;
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
  max-width: 100%;
  width: 100%;
  min-width: 0;
  overflow: hidden;
  box-sizing: border-box;
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
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
  max-width: 100%;
  width: 100%;
  overflow: hidden;
}

.spec-item-modern {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  min-width: 0;
  max-width: 100%;
  width: 100%;
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
  max-width: 100%;
  width: 100%;
  overflow: hidden;
}

.date-grid-modern {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
  max-width: 100%;
  width: 100%;
  overflow: hidden;
}

.date-item-modern {
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 100%;
}

.date-time-group {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  max-width: 100%;
}

.date-only {
  flex: 1;
  min-width: 0;
  max-width: 100%;
}

.modern-time-picker {
  flex: 0 0 120px;
  max-width: 120px;
}

.modern-date-picker {
  width: 100%;
  max-width: 100%;
}

/* Location Section */
.location-section {
  margin-bottom: 20px;
  padding-bottom: 0px;
  max-width: 100%;
  overflow: hidden;
}

.location-selects {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  max-width: 100%;
  overflow: hidden;
}

.location-select-item {
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 100%;
}

.location-select {
  width: 100%;
  border-radius: 8px;
  margin-top: 8px;
  max-width: 100%;
  box-sizing: border-box;
}

.location-select :deep(.ant-select-selector) {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.location-select :deep(.ant-select-selection-item) {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.location-select :deep(.ant-select-dropdown) {
  max-width: 100vw !important;
}

.location-select :deep(.ant-select-item) {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  max-width: 100%;
}

.custom-location-input {
  margin-top: 8px;
  border-radius: 8px;
  max-width: 100%;
  box-sizing: border-box;
}

/* Extras Section */
.extras-section {
  margin-bottom: 20px;
  padding-bottom: 0px;
  max-width: 100%;
  overflow: hidden;
}

.extras-options {
  display: flex;
  flex-direction: row;
  gap: 12px;
  max-width: 100%;
}

.extra-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.extra-option:hover {
  background: #f3f4f6;
  border-color: #FE7743;
}

.extra-price {
  font-size: 12px;
  font-weight: 600;
  color: #FE7743;
  background: rgba(254, 119, 67, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
}

/* Price Display */
.price-display {
  margin-bottom: 20px;
  max-width: 100%;
  overflow: hidden;
}

.price-breakdown {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 10px;
  max-width: 100%;
  box-sizing: border-box;
}

.price-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 0;
  border-bottom: 1px solid #e2e8f0;
}

.price-line:last-child {
  border-bottom: none;
}

.price-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.price-value {
  font-size: 14px;
  color: #1e293b;
  font-weight: 600;
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

.next-btn-modern {
  width: 100% !important;
  height: 60px !important;
  background: #FE7743 !important;
  border: none !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  color: white !important;
  transition: all 0.3s ease !important;
  padding: 0 !important;
}

.next-btn-modern:hover {
  background: #e6693c !important;
  color: white !important;
}

.next-btn-modern:disabled,
.next-btn-modern[disabled] {
  background: #d1d5db !important;
  color: #9ca3af !important;
  cursor: not-allowed !important;
  opacity: 0.6 !important;
}

.next-btn-modern:disabled:hover,
.next-btn-modern[disabled]:hover {
  background: #d1d5db !important;
  color: #9ca3af !important;
}

.button-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 20px;
}

.button-text {
  font-size: 16px;
  font-weight: 600;
}

.button-total {
  font-size: 18px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
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
  .specs-card-modern,
  .features-card-modern,
  .description-card-modern,
  .booking-card-modern {
    padding: 20px;
    max-width: 100%;
    overflow: hidden;
  }

  .specs-grid-modern {
    grid-template-columns: 1fr 1fr;
  }

  .features-grid-modern {
    grid-template-columns: 1fr;
  }
  
  .date-grid-modern {
    grid-template-columns: 1fr;
  }

  .date-time-group {
    flex-direction: column;
    gap: 8px;
  }

  .modern-time-picker {
    flex: 1;
    width: 100%;
  }

  .location-selects {
    grid-template-columns: 1fr;
    max-width: 100%;
  }

  .location-select-item {
    max-width: 100%;
  }

  .extras-options {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .specs-card-modern,
  .features-card-modern,
  .description-card-modern,
  .booking-card-modern {
    padding: 16px;
    max-width: 100%;
    overflow: hidden;
  }

  .specs-grid-modern {
    grid-template-columns: 1fr;
  }

  .location-section {
    max-width: 100%;
    overflow: hidden;
  }

  .location-selects {
    max-width: 100%;
  }

  .location-select-item {
    max-width: 100%;
  }

  .location-select {
    max-width: 100%;
  }
}
</style>