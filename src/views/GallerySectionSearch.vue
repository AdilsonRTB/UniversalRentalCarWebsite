<template>
  <section class="gallery-section-modern">
    <div class="gallery-container">
      <div class="vehicle-image-carousel-modern">
        <a-row class="equal-height-row">
          <a-col :span="14" :md="24" :lg="14" :xs="24" class="image-column">
            <a-carousel :autoplay="true" class="modern-carousel">
              <div v-for="(image, index) in vehicleImages" :key="index" class="carousel-slide-modern">
                <img :src="formatImageUrl(image.image)" :alt="`${vehicle?.brand_name} ${vehicle?.model} - Imagem ${index + 1}`" class="vehicle-image-modern" />
                <h1 class="vehicle-title-modern">{{ vehicle?.brand_name }} {{ vehicle?.model }}</h1>
                <div class="vehicle-meta-modern">
                    <div class="meta-item">
                      <CalendarOutlined class="meta-icon" />
                      <span>{{ vehicle?.year }}</span>
                    </div>
                    <div class="meta-item">
                      <EnvironmentOutlined class="meta-icon" />
                      <span>{{ $t('search.gallery.defaultLocation') }}</span>
                    </div>
                </div>
                <div class="image-overlay-actions">
                  <a-button type="text" class="action-btn-modern" @click="viewVehicle(vehicle?.id)">
                    <CarOutlined style="font-size: large;"/>
                  </a-button>
                  <a-button type="text" class="action-btn-modern" @click="shareLink">
                    <ShareAltOutlined />
                  </a-button>
                  <a-button type="text" class="action-btn-modern" @click="visible = true">
                    <ExpandOutlined />
                  </a-button>
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

              <div class="description-container" :class="{ scrollable: expanded }" >
                <a-typography-paragraph
                  :ellipsis="!expanded
                    ? { rows: 6, expandable: true, symbol: $t('search.gallery.seeMore') }
                    : false
                  "
                  :content="vehicleDescription"
                  @expand="onExpand"
                />
              </div>
            </div>

            <!-- Seção de Preço e Reserva -->
            <div class="pricing-section-modern">
              <!-- Location Section -->
              <div class="location-section">
                <div class="location-selects">
                  <div class="location-select-item">
                    <label class="location-label">{{ $t('search.gallery.pickupLocation') }}</label>
                    <a-select
                      v-model:value="pickupLocation"
                      :placeholder="$t('search.gallery.pickupLocation')"
                      class="location-select"
                      :options="locationsOptions"
                    />
                  </div>
                  <div class="location-select-item">
                    <label class="location-label">{{ $t('search.gallery.returnLocation') }}</label>
                    <a-select
                      v-model:value="returnLocation"
                      :placeholder="$t('search.gallery.returnLocation')"
                      class="location-select"
                      :options="locationsOptions"
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
                </div>
              </div>

              <!-- Reserve Button -->
              <a-button
                type="primary"
                size="large"
                class="next-btn-modern"
                @click="handleReservation"
                :disabled="!availability"
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
      :pickupLocation="pickupLocation"
      :returnLocation="returnLocation"
      :locations="locations"
      @reservation-confirmed="handleReservationConfirmed"
      :serviceFeeAmount="serviceFeeAmount"
      :currencySymbol="currencySymbol"
      :dailyRate="dailyRate * days"
      :serviceFeeType="config?.service_fee_type"
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
import { defineProps, computed, ref, watch } from 'vue'
import { CarOutlined, ShareAltOutlined, CalendarOutlined, EnvironmentOutlined, SettingOutlined, UserOutlined, ExpandOutlined } from '@ant-design/icons-vue'
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
const { formatImageUrl } = useUtilities()

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

const expanded = ref(false);

const visible = ref(false);

// Extras state
const withDriver = ref(false);
const carSeat = ref(false);

// Location state
const pickupLocation = ref(null);
const returnLocation = ref(null);

const onExpand = (isExpanded) => {
  expanded.value = isExpanded;
};

const locationsOptions = computed(() => {
  return props.locations.map(loc => ({ label: loc.name, value: loc.id }))
})

// Watch for changes in locations to set default values
watch(() => props.locations, (newLocations) => {
  if (newLocations && newLocations.length > 0) {
    // Find default pickup location
    const defaultPickup = newLocations.find(loc => loc.default_pickup === true)
    if (defaultPickup && !pickupLocation.value) {
      pickupLocation.value = defaultPickup
    }
    
    // Find default return location
    const defaultReturn = newLocations.find(loc => loc.default_return === true)
    if (defaultReturn && !returnLocation.value) {
      returnLocation.value = defaultReturn
    }
  }
}, { immediate: true })

const shareLink = () => {
  const linkToShare = window.location.href + `vehicle/${props.vehicle.id}`

  if (navigator.share) {
    navigator.share({
      title: document.title,
      url: linkToShare
    }).catch(err => console.error(t('search.gallery.shareError'), err))
  } else {
    alert(t('search.gallery.shareNotSupported'))
  }
}

// Modal state
const showReservationModal = ref(false)

const days = computed(() => {
  if (props.startDate && props.endDate) {
    const start = dayjs(props.startDate);
    const end = dayjs(props.endDate);
    return end.diff(start, 'day');
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

  return Math.round(baseTotal + extras + serviceFee);
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
  switch (locale.value) {
    case 'en':
      return props.vehicle?.description_en || props.vehicle?.description || t('vehicles.defaultDescription')
    case 'fr':
      return props.vehicle?.description_fr || props.vehicle?.description || t('vehicles.defaultDescription')
    case 'pt':
    default:
      return props.vehicle?.description || t('vehicles.defaultDescription')
  }
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
  min-height: 500px;
}

.content-column {
  background: white;
  min-height: 500px;
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
}

.description-container {
  height: 180px;
  overflow-y: auto;
  display: block;
}

.description-container .ant-typography {
  margin-bottom: 0;
}

.description-container.scrollable {
  overflow-y: auto; /* ativa scroll */
}

.pricing-section-modern {
  flex-shrink: 0;
  margin-top: -120px;
}

/* Responsive adjustments */
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
  }
  
  .pricing-section-modern {
    margin-top: 20px;
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
  
  .location-select .ant-select-selector {
    padding: 6px 10px;
    min-height: 36px;
  }
}

.vehicle-image-carousel-modern {
  position: relative;
}

.modern-carousel {
  border-radius: 20px;
}

.carousel-slide-modern {
  position: relative;
  height: 500px;
  min-height: 500px;
}

.vehicle-image-modern {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay-actions {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 12px;
}

.vehicle-title-modern {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
  color: white;
  position: absolute;
  top: 15px;
  left: 20px;
  display: flex;
  gap: 12px;
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
  flex-direction: row;
  gap: 16px;
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

.location-select {
  width: 100%;
  max-width: 100%;
}

.location-select .ant-select-selector {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 8px 12px;
  min-height: 40px;
  transition: all 0.2s ease;
  max-width: 100%;
  overflow: hidden;
}

.location-select .ant-select-selection-item {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 24px);
}

.location-select .ant-select-selector:hover {
  border-color: #FE7743;
}

.location-select.ant-select-focused .ant-select-selector {
  border-color: #FE7743;
  box-shadow: 0 0 0 2px rgba(254, 119, 67, 0.1);
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











</style>