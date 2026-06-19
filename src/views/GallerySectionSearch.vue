<template>
  <section class="gallery-section-modern">
    <div class="gallery-container">
      <div class="vehicle-image-carousel-modern">
        <a-row class="equal-height-row">
          <a-col :span="14" :md="24" :lg="14" :xs="24" class="image-column">
            <a-carousel :autoplay="true" class="modern-carousel">
              <div v-for="(image, index) in vehicleImages" :key="index" class="carousel-slide-modern">
                <img :src="image.image" :alt="`${vehicle?.brand_name} ${vehicle?.model} - Imagem ${index + 1}`" class="vehicle-image-modern" />
                <h1 class="vehicle-title-modern">{{ vehicle?.brand_name }} {{ vehicle?.model }}</h1>

                <!-- Availability Badge -->
                <div v-if="hasDateFilter" class="availability-badge-modern" :class="availability ? 'available' : 'unavailable'">
                  <CheckCircleFilled class="availability-icon" v-if="availability"/>
                  <CloseCircleFilled class="availability-icon" v-else/>
                  <span>{{ availability ? $t('vehicles.available') : $t('vehicles.unavailable') }}</span>
                </div>
                <div class="image-overlay-actions">
                  <!-- Menu button for mobile -->
                  <a-button type="text" class="action-btn-modern menu-toggle-btn" @click.stop="showActionsMenu = !showActionsMenu">
                    <MoreOutlined style="font-size: 20px;" />
                  </a-button>
                  
                  <!-- Action buttons (desktop always visible, mobile conditional) -->
                  <div class="action-buttons-group" :class="{ 'show-menu': showActionsMenu }">
                    <a-button type="text" class="action-btn-modern" @click.stop="viewVehicle(vehicle?.id); showActionsMenu = false">
                      <CarOutlined style="font-size: large;"/>
                    </a-button>
                    <a-button type="text" class="action-btn-modern" @click.stop="shareVehicleLink">
                      <ShareAltOutlined />
                    </a-button>
                    <a-button type="text" class="action-btn-modern" @click.stop="visible = true; showActionsMenu = false">
                      <ExpandOutlined />
                    </a-button>
                  </div>
                </div>
                <div class="specs-grid-modern">
                  <div class="spec-item-modern">
                    <div class="spec-icon-modern">
                      <CarOutlined />
                    </div>
                    <div class="spec-content-modern">
                      <!--span class="spec-label-modern">Transmissão</!span-->
                      <span class="spec-value-modern">{{ gearboxTypeMap(vehicle?.gearbox_type) }}</span>
                    </div>
                  </div>

                  <div class="spec-item-modern">
                    <div class="spec-icon-modern">
                      <SettingOutlined />
                    </div>
                    <div class="spec-content-modern">
                      <!--span class="spec-label-modern">Combustivel</!--span-->
                      <span class="spec-value-modern">{{ fuelTypeMap(vehicle?.fuel_type) }}</span>
                    </div>
                  </div>
                  
                  <div class="spec-item-modern">
                    <div class="spec-icon-modern">
                      <UserOutlined />
                    </div>
                    <div class="spec-content-modern">
                      <!--span class="spec-label-modern">Potencia</!--span-->
                      <span class="spec-value-modern">{{ vehicle?.number_of_seats }} {{ $t('search.gallery.seats') }}</span>
                    </div>
                  </div>

              </div>

              </div>
            </a-carousel>
          </a-col>
          <a-col :span="10" :md="24" :xs="24" :lg="10" class="content-column">
            <div class="column-content-wrapper">

            <div class="description-card-modern" >
              <div class="card-header-modern">
                <h3 class="card-title-modern">{{ $t('search.gallery.description') }}</h3>
                <!--p class="card-subtitle-modern">Informações sobre o veículo</!--p-->
              </div>

              <div class="description-container">
                <div class="description-text">
                  <div v-html="vehicleDescription"></div>
                </div>
              </div>
            </div>

            <!-- Seção de Preço e Reserva -->
            <div class="pricing-section-modern">
              <!-- Location Section -->
              <div class="location-section">
                <div class="location-selects">
                  <div class="location-select-item">
                    <label class="location-label required-field">{{ $t('search.gallery.pickupLocation') }}</label>
                    <a-select
                      v-model:value="pickupLocation"
                      :placeholder="$t('search.gallery.pickupLocation')"
                      class="location-select"
                      :options="locationsOptions"
                      show-search
                      :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
                    />
                    <a-input
                      v-if="pickupLocation === '__others__'"
                      v-model:value="customPickupLocation"
                      :placeholder="$t('search.gallery.customLocationPlaceholder')"
                      class="custom-location-input"
                    />
                  </div>
                  <div class="location-select-item">
                    <label class="location-label required-field">{{ $t('search.gallery.returnLocation') }}</label>
                    <a-select
                      v-model:value="returnLocation"
                      :placeholder="$t('search.gallery.returnLocation')"
                      class="location-select"
                      :options="locationsOptions"
                      show-search
                      :filter-option="(input, option) => option.label.toLowerCase().includes(input.toLowerCase())"
                    />
                    <a-input
                      v-if="returnLocation === '__others__'"
                      v-model:value="customReturnLocation"
                      :placeholder="$t('search.gallery.customLocationPlaceholder')"
                      class="custom-location-input"
                    />
                  </div>
                </div>
              </div>

              <!-- Extras Section -->
              <div class="extras-section">
                <!--h4 class="extras-title">Extras Disponíveis</!--h4-->
                <div class="extras-options">
                  <div class="extra-option">
                    <a-checkbox v-model:checked="withDriver">{{ $t('search.gallery.withDriver') }}</a-checkbox>
                    <span class="extra-price">{{ driverDailyRate }} {{ currencySymbol }}</span>
                  </div>
                  <div class="extra-option">
                    <a-checkbox v-model:checked="carSeat">{{ $t('search.gallery.carSeat') }}</a-checkbox>
                    <span class="extra-price">{{ carSeatDailyRate }} {{ currencySymbol }}</span>
                  </div>
                </div>
              </div>

              <!-- Price Display -->
              <div class="price-display">
                <div class="price-breakdown">
                  <div class="price-line">
                    <span class="price-label">{{ $t('search.gallery.dailyPrice') }}</span>
                    <span class="price-value">{{ dailyRate }} {{ currencySymbol }}</span>
                  </div>
                  <div class="price-line">
                    <span class="price-label">{{ days }} {{ $t('search.gallery.days') }}</span>
                    <span class="price-value">{{ (days * dailyRate) }} {{ currencySymbol }}</span>
                  </div>
                  <div v-if="withDriver" class="price-line">
                    <span class="price-label">{{ $t('search.gallery.withDriverDays', { days }) }}</span>
                    <span class="price-value">{{ (days * driverDailyRate) }} {{ currencySymbol }}</span>
                  </div>
                  <div v-if="carSeat" class="price-line">
                    <span class="price-label">{{ $t('search.gallery.carSeatDays', { days }) }}</span>
                    <span class="price-value">{{ (days * carSeatDailyRate) }} {{ currencySymbol }}</span>
                  </div>
                  <div class="price-line">
                    <span class="price-label">{{ $t('search.gallery.serviceFee') }}</span>
                    <span class="price-value">{{ serviceFeeAmount }} {{ currencySymbol }}</span>
                  </div>
                  <div class="price-line">
                    <span class="price-label">{{ $t('search.gallery.securityDeposit') }}</span>
                    <span class="price-value">{{ securityDeposit }} {{ currencySymbol }}</span>
                  </div>
                </div>
              </div>

              <!-- Reserve Button -->
              <a-button
                type="primary"
                size="large"
                class="next-btn-modern"
                @click="handleReservation"
                :disabled="isReserveButtonDisabled"
              >
                <div class="button-content">
                  <span class="button-text">{{ $t('search.gallery.reserveNow') }}</span>
                  <span class="button-total">{{ calculateTotal }} {{ currencySymbol }}</span>
                </div>
              </a-button>

              <!-- Details Link -->
              <!--div class="details-section">
                <a href="#details" class="details-link">Ver Detalhes do Veículo</a>
              </!--div-->
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    
    <!-- Reservation Modal -->
    <ReservationModal
      v-model:visible="showReservationModal"
      :vehicle="vehicle"
      :pickup-date="pickupDate"
      :return-date="returnDate"
      :calculate-days="calculateDays"
      :calculate-total="calculateTotal"
      :with-driver="withDriver"
      :car-seat="carSeat"
      :with-driver-value="days * driverDailyRate"
      :car-seat-value="days * carSeatDailyRate"
      :pickupLocation="effectivePickupLocation"
      :returnLocation="effectiveReturnLocation"
      :locations="locations"
      @reservation-confirmed="handleReservationConfirmed"
      :serviceFeeAmount="serviceFeeAmount"
      :currencySymbol="currencySymbol"
      :dailyRate="dailyRate * days"
      :serviceFeeType="config?.service_fee_type"
      :securityDeposit="securityDeposit"
    />
  </section>
  <div style="display: none">
    <a-image-preview-group :preview="{ visible, onVisibleChange: vis => (visible = vis) }">
          <a-image v-for="(image, index) in vehicleImages" :key="index"
            :src="image.image"
          />

        </a-image-preview-group>
    </div>
</template>

<script setup>
import { defineProps, computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { CarOutlined, ShareAltOutlined, SettingOutlined, UserOutlined, ExpandOutlined, MoreOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { useLanguageAndCurrency } from '../composables/useLanguageAndCurrency.js'
import dayjs from 'dayjs'
import ReservationModal from '../components/ReservationModal.vue'
import { useRouter } from 'vue-router'
import { useUtilities } from '../composables/utilits.js'

const { t, locale } = useI18n()
const { currentCurrency } = useLanguageAndCurrency()
const router = useRouter()
const { calculateRentalDays } = useUtilities()
//const { formatImageUrl } = useUtilities()

const props = defineProps({
  vehicle: {
    type: Object,
    required: true
  },
  vehicleImages: {
    type: Array,
    required: true
  },
  startDate: {
    type: String,
    default: null
  },
  endDate: {
    type: String,
    default: null
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

const visible = ref(false);
const showActionsMenu = ref(false);

// Close menu when clicking outside
const handleClickOutside = (event) => {
  const actionsMenu = event.target.closest('.image-overlay-actions')
  if (!actionsMenu && showActionsMenu.value) {
    showActionsMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Extras state
const withDriver = ref(false);
const carSeat = ref(false);

// Location state
const pickupLocation = ref(null);
const returnLocation = ref(null);
const customPickupLocation = ref('');
const customReturnLocation = ref('');

const locationsOptions = computed(() => {
  const options = props.locations.map(loc => ({ label: loc.name, value: loc.id }))
  //options.push({ label: t('search.gallery.others'), value: '__others__' })
  return options
})

// Effective location: custom text or predefined name
const effectivePickupLocation = computed(() => {
  if (pickupLocation.value === '__others__') return customPickupLocation.value.trim()
  if (pickupLocation.value && props.locations) {
    const found = props.locations.find(loc => loc.id === pickupLocation.value)
    return found ? found.name : ''
  }
  return ''
})
const effectiveReturnLocation = computed(() => {
  if (returnLocation.value === '__others__') return customReturnLocation.value.trim()
  if (returnLocation.value && props.locations) {
    const found = props.locations.find(loc => loc.id === returnLocation.value)
    return found ? found.name : ''
  }
  return ''
})

// Watch for changes in locations to set default values
watch(() => props.locations, (newLocations) => {
  if (newLocations && newLocations.length > 0) {
    // Find default pickup location
    const defaultPickup = newLocations.find(loc => loc.default_pickup === true)
    if (defaultPickup && !pickupLocation.value) {
      pickupLocation.value = defaultPickup.id
    }
    
    // Find default return location
    const defaultReturn = newLocations.find(loc => loc.default_return === true)
    if (defaultReturn && !returnLocation.value) {
      returnLocation.value = defaultReturn.id
    }
  }
}, { immediate: true })

const vehicleUrl = computed(() =>
  `${window.location.origin}/vehicle/${props.vehicle?.id}`
)

const shareVehicleLink = async () => {
  const url = vehicleUrl.value
  showActionsMenu.value = false
  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, url })
    } catch (err) {
      if (err.name !== 'AbortError') console.error('Erro ao partilhar', err)
    }
  } else {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
  }
}

// Modal state
const showReservationModal = ref(false)

const days = computed(() => {
  if (props.startDate && props.endDate) {
    const tolerance = Number(props.config?.rental_days_tolerance_hours) || 12
    return calculateRentalDays(props.startDate, props.endDate, tolerance);
  }
  return 0;
})

const calculateTotal = computed(() => {
  let baseTotal = days.value * dailyRate.value;
  let extras = 0;

  // Add driver cost per day based on config
  if (withDriver.value) {
    extras += days.value * driverDailyRate.value;
  }
  
  // Add car seat cost per day based on config
  if (carSeat.value) {
    extras += days.value * carSeatDailyRate.value;
  }

  // Add service fee based on config
  const serviceFee = serviceFeeAmount.value;

  // Add security deposit
  const deposit = securityDeposit.value;

  return Math.round(baseTotal + extras + serviceFee + deposit);
})

// Check if reserve button should be disabled
const isReserveButtonDisabled = computed(() => {
  const hasLocations = effectivePickupLocation.value && effectiveReturnLocation.value
  const hasDates = props.startDate && props.endDate
  const isAvailable = props.availability
  
  console.log('🔍 Reserve button debug:', {
    hasLocations,
    hasDates,
    isAvailable,
    pickupLocationId: pickupLocation.value,
    returnLocationId: returnLocation.value,
    startDate: props.startDate,
    endDate: props.endDate,
    availability: props.availability,
    shouldDisable: !isAvailable || !hasLocations || !hasDates
  })
  
  // Disable if: no availability OR no locations OR no dates
  return !isAvailable || !hasLocations || !hasDates
})

// Função de reserva
const handleReservation = () => {
  if (!props.startDate || !props.endDate) {
    message.warning(t('search.gallery.selectDatesWarning'))
    return
  }

  // Abrir modal de reserva
  showReservationModal.value = true
}

// Função chamada quando reserva é confirmada
const handleReservationConfirmed = (reservationData) => {
  console.log('Reserva confirmada:', reservationData)
  message.success(t('search.gallery.reservationSuccess'))
  // Aqui você pode adicionar navegação ou outras ações
  // router.push('/reservation-success', { query: { id: reservationData.id } })
}

// Computed properties para o modal
const pickupDate = computed(() => {
  return props.startDate ? dayjs(props.startDate) : null
})

const returnDate = computed(() => {
  return props.endDate ? dayjs(props.endDate) : null
})

const calculateDays = computed(() => {
  return days.value
})

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
  
  // Formatar a descrição: remover espaços antes de : e ;, substituir quebras de linha
  return description
    .replace(/\s+:/g, ':')           // Remove espaços antes de :
    .replace(/\s+;/g, ';')           // Remove espaços antes de ;
    .replace(/\r\n/g, '<br>')        // Substitui \r\n por <br>
    .replace(/\n/g, '<br>')          // Substitui \n por <br>
    //.replace(/;/g, ';<br>')          // Adiciona <br> após cada ;
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
      return usdRate ? baseDeposit / usdRate : 0
    case 'EUR':
      return eurRate ? baseDeposit / eurRate : 0
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

// Check if date filters are applied
const hasDateFilter = computed(() => {
  return !!(props.startDate && props.endDate)
})


const fuelTypeMap = (type) => {
  switch (type) {
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

const viewVehicle = (vehicleId) => {
  router.push(`/vehicle/${vehicleId}`, { query: { startDate: props.startDate, endDate: props.endDate } })
}


</script>

<style scoped>
/* Gallery Section */
.gallery-section-modern {
  margin-bottom: 40px;
}

.gallery-container {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

/* Equal Height Columns */
.equal-height-row {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
}

.equal-height-row .ant-col {
  display: flex;
  flex-direction: column;
}

.image-column {
  min-height: 0;
}

.image-column .modern-carousel {
  height: 100%;
}

.content-column {
  background: white;
  min-height: 0;
}

.column-content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
}

.description-card-modern {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
  background: white;
  border-radius: 12px;
  margin-bottom: 0px;
  max-height: 220px;
  overflow-y: auto;
}

.description-container {
  height: auto;
  overflow: visible;
  display: block;
}

.description-container .ant-typography {
  margin-bottom: 0;
}

.description-text {
  font-size: 12px;
  line-height: 1.2;
  color: #374151;
}

/* Custom scrollbar for description */
.description-card-modern::-webkit-scrollbar {
  width: 6px;
}

.description-card-modern::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.description-card-modern::-webkit-scrollbar-thumb {
  background: #FE7743;
  border-radius: 10px;
}

.description-card-modern::-webkit-scrollbar-thumb:hover {
  background: #ff5722;
}

.pricing-section-modern {
  flex-shrink: 0;
  margin-top: 0px;
  padding: 16px;
  background: white;
  border-radius: 12px;
}

/* Responsive adjustments */
/* Telas extra grandes */
@media (min-width: 1920px) {
  .carousel-slide-modern {
    min-height: 600px;
  }
}

@media (min-width: 1440px) and (max-width: 1919px) {
  .carousel-slide-modern {
    min-height: 550px;
  }
}

@media (min-width: 1200px) and (max-width: 1439px) {
  .carousel-slide-modern {
    min-height: 500px;
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .carousel-slide-modern {
    min-height: 450px;
  }
}

@media (max-width: 991px) {
  .equal-height-row {
    display: block;
  }
  
  .image-column,
  .content-column {
    min-height: auto;
  }
  
  .column-content-wrapper {
    height: auto;
  }
  
  .description-card-modern {
    flex: none;
    max-height: none;
    overflow-y: visible;
  }
  
  .pricing-section-modern {
    margin-top: 20px;
    padding: 16px;
  }

  .carousel-slide-modern {
    height: 420px !important;
    min-height: 420px !important;
    max-height: none !important;
  }
  
  .location-selects {
    flex-direction: column !important;
    gap: 12px;
  }
  
  .extras-options {
    flex-direction: column !important;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .location-selects {
    flex-direction: column !important;
    gap: 10px;
  }
  
  .extras-options {
    flex-direction: column !important;
    gap: 10px;
  }
  
  .location-select :deep(.ant-select-selector) {
    padding: 7px 10px !important;
    min-height: 38px !important;
  }
  
  .location-select :deep(.ant-select-selection-item) {
    font-size: 13px !important;
  }
  
  .location-select :deep(.ant-select-dropdown) {
    max-width: 94vw !important;
  }

  /* Mobile action menu for tablets */
  .menu-toggle-btn {
    display: flex !important;
    z-index: 102 !important;
  }
  
  .action-buttons-group {
    display: none !important;
    flex-direction: column;
    position: absolute;
    top: 50px;
    right: 0;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 12px;
    padding: 8px;
    gap: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(10px);
    z-index: 101;
    min-width: 50px;
    animation: slideDown 0.2s ease-out;
  }
  
  .action-buttons-group.show-menu {
    display: flex !important;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .image-overlay-actions {
    flex-direction: column;
    align-items: flex-end;
    gap: 0;
  }

  .carousel-slide-modern {
    height: 320px !important;
    min-height: 320px !important;
  }

  .vehicle-title-modern {
    font-size: 20px;
    top: 10px;
    left: 14px;
    right: 65px;
    white-space: nowrap;
  }
  
  .vehicle-meta-modern {
    top: 36px;
    left: 14px;
  }

  .availability-badge-modern {
    top: 45px;
    left: 14px;
    font-size: 11px;
    padding: 4px 10px;
  }
}

@media (max-width: 480px) {
  .carousel-slide-modern {
    height: 200px !important;
    min-height: 200px !important;
  }

  .gallery-container {
    border-radius: 12px;
  }

  .modern-carousel {
    border-radius: 12px;
  }

  .image-overlay-actions {
    top: 10px;
    right: 10px;
    gap: 8px;
  }

  .action-btn-modern {
    width: 36px;
    height: 36px;
  }

  .specs-grid-modern {
    bottom: 10px;
    left: 10px;
  }

  .location-select :deep(.ant-select-selector) {
    padding: 6px 8px !important;
    min-height: 36px !important;
  }
  
  .location-select :deep(.ant-select-selection-item) {
    font-size: 11px !important;
    padding-right: 16px !important;
  }
  
  .location-select :deep(.ant-select-item-option-content) {
    font-size: 11px !important;
  }
}

@media (max-width: 576px) {
  .location-section {
    margin-bottom: 16px;
  }
  
  .location-selects {
    flex-direction: column !important;
    gap: 10px;
  }
  
  .extras-options {
    flex-direction: column !important;
    gap: 10px;
  }
  
  .location-label {
    font-size: 12px;
  }
  
  .location-select :deep(.ant-select-selector) {
    padding: 6px 10px !important;
    min-height: 36px !important;
  }
  
  .location-select :deep(.ant-select-selection-item) {
    font-size: 12px !important;
    padding-right: 18px !important;
  }
  
  .location-select :deep(.ant-select-dropdown) {
    max-width: 92vw !important;
  }
  
  .location-select :deep(.ant-select-item) {
    padding: 8px 12px !important;
  }
  
  .location-select :deep(.ant-select-item-option-content) {
    font-size: 12px !important;
  }
  
  /* Mobile action menu */
  .menu-toggle-btn {
    display: flex !important;
    z-index: 102 !important;
  }
  
  .action-buttons-group {
    display: none !important;
    flex-direction: column;
    position: absolute;
    top: 50px;
    right: 0;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 12px;
    padding: 8px;
    gap: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(10px);
    z-index: 101;
    min-width: 50px;
    animation: slideDown 0.2s ease-out;
  }
  
  .action-buttons-group.show-menu {
    display: flex !important;
  }
  
  .image-overlay-actions {
    flex-direction: column;
    align-items: flex-end;
    gap: 0;
  }
  
  .carousel-slide-modern {
    height: 230px !important;
    min-height: 230px !important;
  }

  .vehicle-title-modern {
    font-size: 15px;
    top: 8px;
    left: 12px;
    right: 60px;
  }
  
  .vehicle-meta-modern {
    top: 28px;
    left: 12px;
  }

  .availability-badge-modern {
    top: 35px;
    left: 12px;
    font-size: 10px;
    padding: 3px 8px;
    gap: 4px;
  }
  
  .availability-icon {
    font-size: 11px;
  }

  .meta-item {
    font-size: 12px;
  }

  .meta-icon {
    font-size: 14px;
  }
}

.vehicle-image-carousel-modern {
  position: relative;
  height: 100%;
}

.modern-carousel {
  border-radius: 20px;
  height: 100%;
}

.modern-carousel :deep(.slick-slider) {
  height: 100%;
}

.modern-carousel :deep(.slick-list) {
  height: 100%;
}

.modern-carousel :deep(.slick-track) {
  height: 100%;
}

.modern-carousel :deep(.slick-slide) {
  height: 100%;
}

.modern-carousel :deep(.slick-slide > div) {
  height: 100%;
}

.carousel-slide-modern {
  position: relative;
  height: 100% !important;
  overflow: hidden;
}

.vehicle-image-modern {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.image-overlay-actions {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 12px;
  z-index: 100;
  pointer-events: auto;
}

.menu-toggle-btn {
  display: none;
  z-index: 101;
}

.action-buttons-group {
  display: flex;
  gap: 12px;
  z-index: 100;
}

.vehicle-title-modern {
  font-size: clamp(16px, 2.8vw, 32px);
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  color: white;
  position: absolute;
  top: 15px;
  left: 20px;
  right: 180px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.vehicle-meta-modern {
  position: absolute;
  top: 50px;
  left: 20px;
  display: flex;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
}

.meta-icon {
  font-size: 18px;
}

/* Availability Badge */
.availability-badge-modern {
  position: absolute;
  top: 55px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.availability-badge-modern.available {
  background: rgba(16, 185, 129, 0.9);
  color: white;
}

.availability-badge-modern.unavailable {
  background: rgba(239, 68, 68, 0.9);
  color: white;
}

.availability-icon {
  font-size: 14px;
}

.action-btn-modern {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  cursor: pointer;
  pointer-events: auto;
  position: relative;
  z-index: 11;
}

.action-btn-modern:hover {
  background: white;
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}
.specs-card-modern,
.description-card-modern,

.booking-card-modern {
  background: white;
  padding: 24px;
}
.card-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title-modern {
  font-size: 16px;
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
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  position: absolute;
  bottom: 30px;
  left: 20px;
}

.spec-item-modern {
  display: flex;
  align-items: center;
  -gap: 5px;
  padding: 0px;
  -border-radius: 12px;
  -background: #f8fafc;
}

.spec-icon-modern {
  width: 32px;
  height: 32px;
  -border-radius: 50%;
  -background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%);
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
  color: white;
}

/* Pricing Section Modern */
.pricing-section-modern {
  padding: 24px;
  background: white;
  border-radius: 12px;

}

.price-display {
  margin-bottom: 10px;
}

.price-breakdown {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 10px;
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

.price-details {
  margin-bottom: 24px;
}

.details-link {
  color: #1f2937;
  text-decoration: underline;
  font-size: 14px;
  font-weight: 500;
}

.details-link:hover {
  color: #FE7743;
  text-decoration: underline;
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

/* Extras Section */
.extras-section {
  margin-bottom: 0px;
  padding-bottom: 16px;
  -border-bottom: 1px solid #e5e7eb;
}

.extras-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
}
/* Location Section */
.location-section {
  margin-bottom: 20px;
}

.location-selects {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.location-select-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.location-label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0px;
}

.location-label.required-field {
  color: #374151;
}

.location-label.required-field::after {
  content: ' *';
  color: #ff4d4f;
  margin-left: 2px;
}

.location-select {
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.location-select :deep(.ant-select-selector) {
  border-radius: 8px !important;
  border: 1px solid #d1d5db !important;
  padding: 8px 12px !important;
  min-height: 40px !important;
  transition: all 0.2s ease !important;
  max-width: 100% !important;
  overflow: hidden !important;
}

.location-select :deep(.ant-select-selection-item) {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  max-width: 100% !important;
  padding-right: 20px !important;
}

.location-select :deep(.ant-select-selection-search) {
  max-width: 100% !important;
}

.location-select :deep(.ant-select-selection-search-input) {
  max-width: 100% !important;
}

.location-select :deep(.ant-select-selector:hover) {
  border-color: #FE7743 !important;
}

.location-select:deep(.ant-select-focused .ant-select-selector) {
  border-color: #FE7743 !important;
  box-shadow: 0 0 0 2px rgba(254, 119, 67, 0.1) !important;
}

/* Dropdown options responsiveness */
.location-select :deep(.ant-select-dropdown) {
  max-width: 95vw !important;
}

.location-select :deep(.ant-select-item-option-content) {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: normal !important;
  word-break: break-word !important;
  line-height: 1.4 !important;
  padding: 4px 0 !important;
}

.custom-location-input {
  margin-top: 8px;
  border-radius: 8px;
}
.extras-options {
  display: flex;
  flex-direction: row;
  gap: 12px;
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
  flex: 1;
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

/* Details Section */
.details-section {
  text-align: center;
  margin-top: 0px;
  padding-top: 5px;
  -border-top: 1px solid #e5e7eb;
}

.details-link {
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.details-link:hover {
  color: #FE7743;
  text-decoration: underline;
}

/* Desktop - Buttons always visible, menu toggle hidden */
@media (min-width: 769px) {
  .menu-toggle-btn {
    display: none !important;
  }
  
  .action-buttons-group {
    display: flex !important;
    flex-direction: row !important;
    position: static !important;
    background: transparent !important;
    padding: 0 !important;
    gap: 12px !important;
    box-shadow: none !important;
  }
}


</style>