<template>
  <section class="similar-vehicles-section-modern">
    <div class="section-header-modern">
      <h3 class="section-title-modern">{{ t('vehicles.similarVehicles') }}</h3>
      <div class="section-subtitle-modern">{{ t('vehicles.otherOptions') }}</div>
    </div>
    
    <div class="similar-vehicles-grid-modern">
      <div 
        class="similar-vehicle-card-modern" 
        v-for="(vehicle, index) in similarVehicles" 
        :key="index"
        @click="navigateToVehicle(vehicle.id)"
      >
        <div class="similar-vehicle-image-modern">
          <!--CarOutlined class="vehicle-icon-similar" /-->
          <CarOutlined class="vehicle-icon-similar" v-if="!vehicle.photo && !vehicle.primary_photo"/>
          <img v-if="vehicle.primary_photo" :src="formatImageUrl(vehicle.primary_photo.image)" :alt="`${vehicle?.brand_name} ${vehicle?.model}`" class="vehicle-photo-modern" />
          <img v-if="!vehicle.primary_photo && vehicle.photo" :src="formatImageUrl(vehicle.photo)" :alt="`${vehicle?.brand_name} ${vehicle?.model}`" class="vehicle-photo-modern" />
          <div v-if="vehicle.hasPromotion" class="promotion-badge-similar">
            🔥 {{ t('vehicles.promotion') }}
          </div>
        </div>
        
        <div class="similar-vehicle-content-modern">
          <div class="vehicle-header-similar">
            <h4 class="vehicle-title-similar">{{ vehicle.brand_name }} {{ vehicle.model }}</h4>
            <span class="vehicle-year-similar">{{ vehicle.year }}</span>
          </div>
          
          <div class="vehicle-location-similar">
            <EnvironmentOutlined class="location-icon-similar" />
            <span>Achada Santo António, Santiago</span>
          </div>
          
          <div class="vehicle-features-mini">
            <div class="feature-mini">
                <SettingOutlined />
                <span>{{ fuelTypeMap(vehicle.fuel_type) }} </span>
            </div>
            <div class="feature-mini">
                <DeploymentUnitOutlined />
                <span>{{ gearboxTypeMap(vehicle.gearbox_type) }}</span>
            </div>
            <div class="feature-mini">
                <DashboardOutlined/>
                <span>{{ vehicle.mileage }} KM</span>
            </div>
          </div>
          <div class="vehicle-price-modern">
                <span class="price-value">{{ vehicle.daily_rate }} CVE</span>
                <span class="price-period">/ {{ t('search.perDay') }}</span>
            </div>

            <div class="vehicle-footer-modern">
                <div class="rating-modern">
                <StarFilled class="star-icon" />
                <span>{{ vehicle.stats.average_overall_rating }} ({{ vehicle.stats.total_evaluations }})</span>
                </div>
                <div class="status-modern" :class="vehicle.is_available ? '' : 'status-modern-unavailable'">
                  <CheckCircleFilled class="status-icon" v-if="vehicle.is_available"/>
                  <CloseCircleFilled class="status-icon-error" v-else/>
                  <span>{{ vehicle.is_available ? t('vehicles.available') : t('vehicles.unavailable') }}</span>
                </div>
            </div>
          <!--div class="vehicle-price-section">
            <div-- class="price-info">
              <div v-if="vehicle.hasPromotion" class="original-price-grid">
                {{ vehicle.originalPrice }} CVE
              </div>
              <div class="current-price-grid">
                {{ vehicle.price }} CVE
              </div>
              <div class="price-period-grid">/ {{ t('vehicles.day') }}</div>
            </div-->
            <!--a-dropdowna-button type="primary" size="small" class="view-details-btn">
              {{ t('vehicles.viewDetails') }}
            </!--a-button-->
          <!--/div-->
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
    CarOutlined,
    EnvironmentOutlined,
    DeploymentUnitOutlined,
    DashboardOutlined,
    StarFilled,
    CheckCircleFilled,
  //TeamOutlined,
  SettingOutlined,
  CloseCircleFilled
} from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import { vehicleService } from '../../services/api'
import dayjs from 'dayjs'
import { useUtilities } from '../../composables/utilits.js'

const { formatImageUrl } = useUtilities()

const { t } = useI18n()

const STORAGE_KEYS = {
  START_DATE: 'vehicle_search_start_date',
  END_DATE: 'vehicle_search_end_date'
}

const similarVehicles = ref([])

const filters = ref({
  startDate: localStorage.getItem(STORAGE_KEYS.START_DATE) || null,
  endDate: localStorage.getItem(STORAGE_KEYS.END_DATE) || null
})

const loading = ref(false)

const loadAvailableVehicles = async () => {
  loading.value = true
  try {
    const response = await vehicleService.getAllVehicles()
    similarVehicles.value = response.data
  } catch (error) {
    console.error('Erro ao carregar veículos:', error)
  } finally {
    loading.value = false
    searchVehicles()
  }
}


const searchVehicles = async () => {
  loading.value = true
  if (filters.value.startDate && filters.value.endDate) {
    const start = new Date(filters.value.startDate)
    const end = new Date(filters.value.endDate)
    if (start > end) {
      //message.error('A data de recolha não pode ser posterior à data de devolução.')
      loading.value = false
      return
    }
  }

  /* filtrar por data active_rentals */
  if (filters.value.startDate && filters.value.endDate) {
    const start = dayjs(filters.value.startDate)
    const end = dayjs(filters.value.endDate)

    console.log('Filtering vehicles between', start.format(), 'and', end.format())

    similarVehicles.value = similarVehicles.value.map(vehicle => {
      const hasOverlap = vehicle.active_rentals?.some(rental => {
        const rentalStart = dayjs(rental.start_date)
        const rentalEnd = dayjs(rental.end_date)
        return start.isBefore(rentalEnd) && end.isAfter(rentalStart)
      })

      return {
        ...vehicle,
        is_available: !hasOverlap
      }
  })

  }
  loading.value = false
}

// Initial load
onMounted(() => {
  loadAvailableVehicles()

})

const navigateToVehicle = (vehicleId) => {
    window.location.href = `/vehicle/${vehicleId}`;
}

const fuelTypeMap = (type) => {
  switch (type) {
    case 'gas':
      return 'Gasolina'
    case 'diesel':
      return 'Diesel'
    case 'electric':
      return 'Elétrico'
    case 'hybrid':
      return 'Híbrido'
    case 'petrol':
      return 'Gasóleo'
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
</script>

<style scoped>
/* Similar Vehicles Section */
.similar-vehicles-section-modern {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin: 40px 0;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(229, 231, 235, 0.3);
}

.section-header-modern {
  margin-bottom: 40px;
  text-align: center;
  position: relative;
}

.section-title-modern {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle-modern {
  color: #6b7280;
  font-size: 16px;
  margin-top: 8px;
}

/* Similar Vehicles Grid */
.similar-vehicles-grid-modern {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.similar-vehicle-card-modern {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.similar-vehicle-card-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border-color: #2563eb;
}

.similar-vehicle-image-modern {
  height: 180px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vehicle-icon-similar {
  font-size: 48px;
  color: white;
  opacity: 0.8;
}

.promotion-badge-similar {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.similar-vehicle-content-modern {
  padding: 20px;
}

.vehicle-header-similar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.vehicle-title-similar {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #111827;
}

.vehicle-year-similar {
  color: #6b7280;
  font-size: 14px;
}

.vehicle-location-similar {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 16px;
}

.location-icon-similar {
  font-size: 12px;
}

.vehicle-features-mini {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.feature-mini {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 12px;
  background: #f8fafc;
  padding: 6px 10px;
  border-radius: 6px;
}

.feature-mini span {
  font-weight: 500;
}

.vehicle-price-section {
  margin-top: 16px;
}

.price-info {
  margin-bottom: 12px;
}

.original-price-grid {
  color: #9ca3af;
  text-decoration: line-through;
  font-size: 12px;
  margin-bottom: 2px;
}

.current-price-grid {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.price-period-grid {
  color: #6b7280;
  font-size: 12px;
}

.view-details-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

/* Responsive */
@media (max-width: 768px) {
  .similar-vehicles-grid-modern {
    grid-template-columns: 1fr;
  }
  
  .vehicle-features-mini {
    grid-template-columns: repeat(2, 1fr);
  }
}


.vehicle-price-modern {
  margin-bottom: 12px;
}

.price-value {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-right: 4px;
}

.price-period {
  color: #6b7280;
  font-size: 12px;
}

.vehicle-footer-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating-modern, .status-modern {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.rating-modern {
  color: #f59e0b;
}



.star-icon {
  color: #f59e0b;
  font-size: 12px;
}

.status-modern {
  color: #10b981;
}

.status-modern-unavailable {
  color: #ef4444;
}

.status-icon {
  color: #10b981;
  font-size: 12px;
}

.status-icon-error {
  color: #ef4444;
  font-size: 12px;
}

.status-icon-unavailable {
  color: #ef4444;
  font-size: 12px;
}

.vehicle-photo-modern {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  transition: transform 0.3s ease;
}

</style>