<template>
  <section class="gallery-section-modern">
    <div class="gallery-container">
      <div class="vehicle-image-carousel-modern">
        <a-row>
          <a-col :span="14" :md="24" :lg="14" :xs="24">
            <a-carousel :autoplay="true" class="modern-carousel">
              <div v-for="(image, index) in vehicleImages" :key="index" class="carousel-slide-modern">
                <img :src="image.image" :alt="`${vehicle?.brand_name} ${vehicle?.model} - Imagem ${index + 1}`" class="vehicle-image-modern" />
                <h1 class="vehicle-title-modern">{{ vehicle?.brand_name }} {{ vehicle?.model }}</h1>
                <div class="vehicle-meta-modern">
                    <div class="meta-item">
                      <CalendarOutlined class="meta-icon" />
                      <span>{{ vehicle?.year }}</span>
                    </div>
                    <div class="meta-item">
                      <EnvironmentOutlined class="meta-icon" />
                      <span>Praia, Santiago</span>
                    </div>
                </div>
                <div class="image-overlay-actions">
                  <a-button type="text" class="action-btn-modern" @click="viewVehicle(vehicle?.id)">
                    <CarOutlined style="font-size: large;"/>
                  </a-button>
                  <a-button type="text" class="action-btn-modern">
                    <ShareAltOutlined />
                  </a-button>
                  <!--a-button type="text" class="action-btn-modern">
                    <ExpandOutlined />
                  </!--a-button-->
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
                      <span class="spec-value-modern">{{ vehicle?.number_of_seats }} Lugares</span>
                    </div>
                  </div>

              </div>

              </div>
            </a-carousel>
          </a-col>
          <a-col :span="10" :md="24" :xs="24" :lg="10" style="background: white;">

            <div class="description-card-modern" >
              <div class="card-header-modern">
                <h3 class="card-title-modern">Descrição</h3>
                <!--p class="card-subtitle-modern">Informações sobre o veículo</!--p-->
              </div>

              <div class="description-content-modern">
                <p>{{ vehicle?.description }}</p>
              </div>
            </div>

            <!-- Seção de Preço e Reserva -->
            <div class="pricing-section-modern">
              <div class="price-display">
                <div class="main-price">
                  <span class="price-number">{{ vehicle?.daily_rate }}</span>
                  <span class="price-currency">CVE</span>
                  <span class="price-period">/dia</span>
                </div>
                <div class="total-price" >
                  <span class="total-amount">{{ calculateTotal }} CVE</span>
                  <span class="total-label">Total</span>
                </div>
              </div>
              <a-button
                type="primary" 
                size="large" 
                class="next-btn-modern"
                @click="handleReservation"
              >
                Reservar Agora
              </a-button>
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
      @reservation-confirmed="handleReservationConfirmed"
    />
  </section>
</template>

<script setup>
import { defineProps, computed, ref } from 'vue'
import { CarOutlined, ShareAltOutlined, CalendarOutlined, EnvironmentOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import ReservationModal from '../components/ReservationModal.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
  }
})

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

  return days.value * props.vehicle?.daily_rate
})

// Função de reserva
const handleReservation = () => {
  if (!props.startDate || !props.endDate) {
    message.warning('Por favor, selecione as datas de recolha e devolução')
    return
  }
  
  // Abrir modal de reserva
  showReservationModal.value = true
}

// Função chamada quando reserva é confirmada
const handleReservationConfirmed = (reservationData) => {
  console.log('Reserva confirmada:', reservationData)
  message.success('Reserva efetuada com sucesso!')
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

const fuelTypeMap = (type) => {
  switch (type) {
    case 'gasoline':
      return 'Gasolina'
    case 'diesel':
      return 'Diesel'
    case 'electric':
      return 'Elétrico'
    case 'hybrid':
      return 'Híbrido'
    default:
      return type
  }
}

const gearboxTypeMap = (type) => {
  switch (type) {
    case 'manual':
      return 'Manual'
    case 'automatic':
      return 'Automático'
    default:
      return type
  }
}

const viewVehicle = (vehicleId) => {
  router.push(`/vehicle/${vehicleId}`)
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

.vehicle-image-carousel-modern {
  position: relative;
}

.modern-carousel {
  border-radius: 20px;
}

.carousel-slide-modern {
  position: relative;
  height: 400px;
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
  margin-bottom: 16px;
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
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  position: absolute;
  bottom: 30px;
  left: 20px;
  gap: 12px;
}

.spec-item-modern {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px;
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

  margin-top: 20px;

}

.price-display {
  margin-bottom: 16px;
}

.main-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.price-number {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.price-currency {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.price-period {
  font-size: 16px;
  color: #6b7280;
  font-weight: 500;
}

.total-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.total-amount {
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
}

.total-label {
  font-size: 14px;
  color: #6b7280;
  text-transform: capitalize;
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
  height: 50px !important;
  background: #FE7743 !important;
  border: none !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  color: white !important;
  transition: all 0.3s ease !important;

  -position: absolute;
  -bottom: 20px;
}

.next-btn-modern:hover {
  background: #e6693c !important;
  color: white !important;
}











</style>