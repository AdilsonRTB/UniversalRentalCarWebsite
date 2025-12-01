<template>
  <div class="vehicle-search-modern">
    <a-spin :spinning="loading && vehicles.length === 0" size="large">
      <HeaderPage />

      <!-- Hero Search Section -->
      <section class="hero-search-section">
        <div class="hero-visual-ultra-modern">
          <!-- Floating Elements -->
          <div class="floating-element element-1">
            <div class="element-icon">
              <HeartOutlined />
            </div>
            <span>Amor pelo que fazemos</span>
          </div>
          
          <div class="floating-element element-2">
            <div class="element-icon">
              <SafetyOutlined />
            </div>
            <span>Segurança em primeiro lugar</span>
          </div>
          
          <div class="floating-element element-3">
            <div class="element-icon">
              <ThunderboltOutlined />
            </div>
            <span>Processo rápido e fácil</span>
          </div>
          

        </div>
        <div class="hero-search-container">
          <div class="hero-search-content">
            <h1 class="hero-search-title">Alugue o veículo perfeito para você!</h1>
            <p class="hero-search-subtitle">Encontre veículos disponíveis. Processo simples, seguro e rápido.</p>
          </div>
        </div>

      </section>
      
      <!-- Main Content -->
      <div class="main-content">
        <div class="content-wrapper">
          
          <!-- Advanced Filters -->
          <div class="advanced-filters-section">
            <div class="filters-header">
              <h3 class="filters-title">Filtros</h3>
              <!--a-button type="text" class="toggle-filters">{{ t('search.showMore') }}</!--a-button-->
            </div>

            <div class="filters-grid">
              <div class="filter-group">
                  <div class="search-field">
                      <label class="filter-label"> Nome | Modelo</label>
                      <a-input
                        v-model:value="filters.name"
                        placeholder="Nome ou modelo do veículo"
                        size="large"
                        class="modern-input"
                        allowClear
                      >
                        <template #prefix>
                          <SearchOutlined class="input-icon" />
                        </template>
                      </a-input>
                  </div>
              </div>
              
              <div class="filter-group">
                <label class="filter-label">Data Recolha</label>
                <a-date-picker
                  v-model:value="filters.startDate"
                  size="large"
                  placeholder="Selecione a data"
                  class="modern-date-picker"
                />
              </div>
              
              <div class="filter-group">
                <label class="filter-label">Data Devolução</label>
                <a-date-picker
                  v-model:value="filters.endDate"
                  size="large"
                  placeholder="Selecione a data"
                  class="modern-date-picker"
                />
              </div>
              <div class="filter-group">
                <div class="search-action">
                    <a-button
                      type="primary"
                      @click="searchVehicles"
                      size="large"
                      :loading="loading"
                      class="search-btn-modern"
                    >
                      <SearchOutlined />
                      {{ t('search.searchVehicles') }}
                    </a-button>
                  </div>
              </div>
            </div>
          </div>
          

          <!-- Results Section -->
          <div class="results-section-modern">
            <!-- Loading -->
            <div v-if="loading" class="loading-section-modern">
              <div class="loading-spinner">
                <a-spin size="large">
                  <template #indicator>
                    <LoadingOutlined class="loading-icon" spin />
                  </template>
                </a-spin>
              </div>
              <h3 class="loading-title">{{ t('search.searchingVehicles') }}</h3>
              <p class="loading-subtitle">{{ t('search.findingBestOptions') }}</p>
            </div>
            
            <!-- Vehicle Results -->
            <div>
              <div class="results-header-modern">
                <div class="results-info">
                  <h2 class="results-count">{{ vehicles.length }} {{ t('search.vehiclesFound') }}</h2>
                  <p class="results-subtitle">{{ t('search.perfectMatches') }}</p>
                </div>

                <div class="sort-section">
                  <div class="transmission-filter">
                    <a-checkbox-group v-model:value="transmissionFilter" @change="filterByTransmission">
                      <a-checkbox value="manual" class="transmission-tag">
                        Manual
                      </a-checkbox>
                      <a-checkbox value="automatic" class="transmission-tag">
                        Automático
                      </a-checkbox>
                    </a-checkbox-group>
                  </div>
                  
                  <!--a-select
                    v-model:value="sortBy"
                    @change="sortVehicles"
                    size="large"
                    class="sort-select"
                  >
                    <a-select-option value="price-asc">{{ t('search.sortByPrice') }}</a-select-option>
                    <a-select-option value="price-desc">{{ t('search.sortByPriceDesc') }}</a-select-option>
                    <a-select-option value="year-desc">{{ t('search.sortByNewest') }}</a-select-option>
                    <a-select-option value="year-asc">{{ t('search.sortByOldest') }}</a-select-option>
                  </!--a-select-->
                </div>
              </div>
            
              <!-- Vehicle Cards Grid -->
                <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
                  <a-col
                    v-for="vehicle in sortedVehicles"
                    :key="vehicle.id"
                    :xs="24" :md="12" :lg="8"
                  >
                    <!--div class="vehicle-card-modern" @click="viewVehicle(vehicle.id)"-->
                    <div class="vehicle-card-modern" @click="openDetailsRendels(vehicle.id)">
                    <div class="vehicle-image-modern">
                      <CarOutlined class="vehicle-icon" v-if="!vehicle.photo"/>
                      <img :src="vehicle.photo" :alt="`${vehicle?.brand_name} ${vehicle?.model}`" class="vehicle-photo-modern" v-else/>

                    </div>

                    <div class="vehicle-content-modern">
                      <div class="vehicle-header">
                        <h3 class="vehicle-title-modern">{{ vehicle.brand_name }} {{ vehicle.model }} - {{ vehicle.year }}</h3>
                        <div class="vehicle-type-badge" :style="{ backgroundColor: getVehicleTypeColor(vehicle.type) }">
                          {{ getVehicleTypeLabel(vehicle.type) }}
                        </div>
                      </div>
                      
                      <div class="vehicle-details">
                        <!--div class="detail-item">
                          <CalendarOutlined class="detail-icon" />
                          <span>{{ vehicle.year }}</span>
                        </!div-->
                        <div class="detail-item">
                          <EnvironmentOutlined class="detail-icon" />
                          <span>{{ vehicle.location || 'Praia, Santigo' }}</span>
                        </div>
                        <div v-if="vehicle.owner" class="detail-item">
                          <UserOutlined class="detail-icon" />
                          <span>{{ vehicle.owner }}</span>
                        </div>
                      </div>
                      
                      <div class="vehicle-features-mini">

                        <div class="feature-mini">

                          <SettingOutlined />
                          <span>{{ vehicle.fuel_type }} </span>
                        </div>
                        <div class="feature-mini">
                          <DeploymentUnitOutlined />
                          <span>{{ vehicle.gearbox_type }}</span>
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
                          <span>4.5 (12)</span>
                        </div>
                        <div class="status-modern">
                          <CheckCircleFilled class="status-icon" />
                          <span>{{ t('vehicles.available') }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  </a-col>
                  <a-col  :span="24" id="details">
                    <div v-if="rentaldetails">
                      <VehicleDetails :vehicleId="vehicleId" :key="vehicleId"
                        :startDate="filters.startDate.format('YYYY-MM-DD')"
                        :endDate="filters.endDate.format('YYYY-MM-DD')"
                      />
                    </div>
                  </a-col>
                </a-row>


            </div>
            
            <!-- No Results -->
            <div v-if="vehicles.length === 0" class="empty-state-modern">
              <div class="empty-illustration">
                <SearchOutlined class="empty-icon" />
              </div>
              <h3 class="empty-title">{{ t('search.noResults') }}</h3>
              <p class="empty-subtitle">{{ t('search.adjustFilters') }}</p>
              <a-button type="primary" size="large" @click="loadAvailableVehicles" class="retry-btn">
                {{ t('search.showAllVehicles') }}
              </a-button>
            </div>

            <EvaluationsSearchPage style="margin-top: 50px;"/>

            <div class="steps-action">
              <div class="steps-cta-card">
                <div class="steps-cta-content">
                  <h3>Simples assim!</h3>
                  <p>Em apenas alguns passos você já está dirigindo</p>
                  <div class="steps-buttons">
                    <a-button type="primary" size="large" @click="scrollToTop">
                      <SearchOutlined />
                      Procurar Veículos
                    </a-button>

                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </a-spin>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
//import { useRouter } from 'vue-router'
import HeaderPage from '../components/HeaderPage.vue'
import EvaluationsSearchPage from './EvaluationsSearchPage.vue'
import { 
  SearchOutlined, 
  EnvironmentOutlined, 
  CarOutlined, 
  //CalendarOutlined,
  StarFilled, 
  CheckCircleFilled,
  LoadingOutlined,
  UserOutlined,
  //TeamOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  DeploymentUnitOutlined,
  DashboardOutlined,
  HeartOutlined,
  SafetyOutlined
} from '@ant-design/icons-vue'
import { vehicleService } from '../services/api'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import VehicleDetails from './VehicleDetailsSearch.vue'
import dayjs from 'dayjs'

// Use i18n and language/currency functionality
const { t } = useI18n()

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  
  if (section) {
    section.scrollIntoView({
      behavior: "smooth"
    });
  } else {
    console.warn("Seção não encontrada:", sectionId);
  }
}


const rentaldetails = ref(false);
//const router = useRouter()

const filters = ref({
  location: '',
  name: '',
  type: '',
  year: null,
  startDate: null,
  endDate: null,
  owner: null,
  hasPromotion: null
})

const vehicles = ref([])
const allVehicles = ref([])
const loading = ref(false)
const sortBy = ref('price-asc')
const transmissionFilter = ref([])
const vehicleId = ref(null);


const openDetailsRendels = async (id) => {
  if (id === vehicleId.value){
    rentaldetails.value = false;
    vehicleId.value = null;
    return;
  }
  rentaldetails.value = true;
  vehicleId.value = id;
  scrollToSection('details');
}

const sortedVehicles = computed(() => {
  const vehicleList = [...vehicles.value]
  
  switch (sortBy.value) {
    case 'price-asc':
      return vehicleList.sort((a, b) => a.dailyRate - b.dailyRate)
    case 'price-desc':
      return vehicleList.sort((a, b) => b.dailyRate - a.dailyRate)
    case 'year-desc':
      return vehicleList.sort((a, b) => b.year - a.year)
    case 'year-asc':
      return vehicleList.sort((a, b) => a.year - b.year)
    default:
      return vehicleList
  }
})

const loadAvailableVehicles = async () => {
  loading.value = true
  try {
    const response = await vehicleService.getAllVehicles()
    allVehicles.value = response.data
    vehicles.value = response.data

    // Load promotional vehicles (limited to 10)
    //await loadPromotionalVehicles()
  } catch (error) {
    console.error('Erro ao carregar veículos:', error)
    // Mock data for development - fallback when API fails
    // Load promotional vehicles (limited to 10)
    //await loadPromotionalVehicles()
  } finally {
    loading.value = false
  }
}


const searchVehicles = async () => {
  loading.value = true
  if (filters.value.startDate && filters.value.endDate) {
    const start = new Date(filters.value.startDate)
    const end = new Date(filters.value.endDate)
    if (start > end) {
      message.error('A data de recolha não pode ser posterior à data de devolução.')
      loading.value = false
      return
    }
  }
  /* filtrar no allVehicles */
  vehicles.value = allVehicles.value.filter(vehicle => {
    const matchesName = filters.value.name
      ? vehicle.brand_name.toLowerCase().includes(filters.value.name.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(filters.value.name.toLowerCase())
      : true

    return matchesName
  })
  loading.value = false
}

/*const viewVehicle = (vehicleId) => {
  router.push(`/vehicle/${vehicleId}`)
}*/

const getVehicleTypeLabel = (type) => {
  const labels = {
    CAR: 'Carro',
    MOTORCYCLE: 'Moto',
    VAN: 'Van',
    TRUCK: 'Caminhão'
  }
  return labels[type] || type
}

const getVehicleTypeColor = (type) => {
  const colors = {
    CAR: '#FE7743',
    MOTORCYCLE: '#447D9B',
    VAN: '#447D9B',
    TRUCK: '#666'
  }
  return colors[type] || 'default'
}

/*const sortVehicles = () => {
  // Trigger reactivity is handled automatically in Vue 3
}*/

const filterByTransmission = () => {
  rentaldetails.value = false;
  if (transmissionFilter.value.length === 0) {
    vehicles.value = [...allVehicles.value]
  } else {
    vehicles.value = allVehicles.value.filter(vehicle => 
      transmissionFilter.value.includes(vehicle.gearbox_type)
    )
  }
}

onMounted(() => {
  loadAvailableVehicles()

  filters.value.startDate = dayjs().add(1, 'day');
  filters.value.endDate = dayjs().add(3, 'day');

})
</script>

<style scoped>
.vehicle-search-modern {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Hero Search Section */
.hero-search-section {
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-top: 80px;
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%) !important;
}

/* Hero Visual Ultra Modern */
.hero-visual-ultra-modern {
  position: relative;
  height: 500px;
}

/* Floating Elements */
.floating-element {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 10px 14px;
  border-radius: 50px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: float 4s ease-in-out infinite;
  min-width: 200px;

}

.floating-element.element-1 {
  top: 50px;
  left: -20px;
  animation-delay: 0s;
}

.floating-element.element-2 {
  bottom: 240px;
  right: -40px;
  animation-delay: -1.0s;
}

.floating-element.element-3 {
  bottom: 100px;
  left: 10px;
  animation-delay: -2s;
}


.element-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FE7743 0%, #e6693c 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.hero-dashboard-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-search-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.hero-search-container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  width: 100%;
  padding: 0 24px;
}

.hero-search-content {
  text-align: center;
  color: white;
}

.hero-search-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0 0 24px 0;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #fff 0%, #f0f9ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-search-subtitle {
  font-size: 1.25rem;
  margin: 0 0 48px 0;
  opacity: 0.9;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
}

.quick-search-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: 0 auto;
  max-width: 1000px;
}

.search-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  align-items: end;
}

.search-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  margin-bottom: 4px;
}

.modern-input, .modern-select, .modern-date-picker {
  border-radius: 12px !important;
  border: 2px solid #e5e7eb !important;
  transition: all 0.3s ease !important;
}

.modern-input:hover, .modern-select:hover, .modern-date-picker:hover {
  border-color: #FE7743 !important;
}

.modern-input:focus, .modern-select:focus, .modern-date-picker:focus {
  border-color: #FE7743 !important;
  box-shadow: 0 0 0 3px rgba(254, 119, 67, 0.1) !important;
}

.input-icon {
  color: #9ca3af;
}

.search-btn-modern {
  background: linear-gradient(135deg, #FE7743 0%, #ff5722 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  height: 45px !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 16px rgba(254, 119, 67, 0.4) !important;
  transition: all 0.3s ease !important;
}

.search-btn-modern:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 24px rgba(254, 119, 67, 0.5) !important;
}

.search-action {
  display: flex;
  align-items: end;
  margin-top: 25px;
}

/* Main Content */
.main-content {
  position: relative;
  z-index: 2;
  margin-top: -70px;
  padding-bottom: 80px;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Advanced Filters */
.advanced-filters-section {
  background: white;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.filters-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.toggle-filters {
  color: #FE7743 !important;
  font-weight: 600 !important;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  align-items: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

/* Promotions Section */
.promotions-section-modern {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.section-title-container {
  flex: 1;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.section-subtitle {
  color: #64748b;
  margin: 0;
  font-size: 1rem;
}

.slider-controls {
  display: flex;
  gap: 12px;
}

.slider-control-btn {
  width: 48px !important;
  height: 48px !important;
  border-radius: 50% !important;
  border: 2px solid #e5e7eb !important;
  background: white !important;
  color: #374151 !important;
  font-size: 20px !important;
  font-weight: bold !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.3s ease !important;
}

.slider-control-btn:hover:not(:disabled) {
  border-color: #FE7743 !important;
  color: #FE7743 !important;
  transform: scale(1.05) !important;
}

.promotions-slider-modern {
  overflow: hidden;
  border-radius: 16px;
}

.slider-track-modern {
  display: flex;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  gap: 24px;
}

.promo-card-modern {
  flex: 0 0 320px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.promo-card-modern:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.promo-image-modern {
  height: 180px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  position: relative;
  overflow: hidden;
}

.promo-icon {
  font-size: 64px;
  z-index: 2;
  position: relative;
}

.promo-badge-modern {
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #ff4d4f 0%, #ff1744 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  z-index: 3;
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.4);
}

.promo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.promo-content-modern {
  padding: 24px;
}

.promo-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.promo-location {
  color: #64748b;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.promo-price-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.original-price-modern {
  text-decoration: line-through;
  color: #9ca3af;
  font-size: 14px;
}

.promo-price-modern {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FE7743;
}

/* Results Section */
.results-section-modern {
  margin-top: 40px;
}

.loading-section-modern {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
  text-align: center;
}

.loading-spinner {
  margin-bottom: 24px;
}

.loading-icon {
  font-size: 48px !important;
  color: #FE7743 !important;
}

.loading-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.loading-subtitle {
  color: #64748b;
  margin: 0;
}

.results-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px 0;
}

.results-info {
  flex: 1;
}

.results-count {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.results-subtitle {
  color: #64748b;
  margin: 0;
}

.sort-section {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.transmission-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.filter-label-small {
  font-weight: 600;
  color: #475569;
  font-size: 14px;
  white-space: nowrap;
}

.transmission-filter .ant-checkbox-group {
  display: flex;
  gap: 12px;
}

.transmission-tag.ant-checkbox-wrapper {
  margin: 0 !important;
  padding: 6px 12px;
  border-radius: 8px;
  background: white;
  border: 1px solid #d1d5db;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 13px;
}

.transmission-tag.ant-checkbox-wrapper:hover {
  border-color: #FE7743;
  background: #fef7f0;
}

.transmission-tag.ant-checkbox-wrapper-checked {
  background: #FE7743 !important;
  border-color: #FE7743 !important;
  color: white !important;
}

.transmission-tag.ant-checkbox-wrapper-checked .ant-checkbox {
  display: none;
}

.transmission-tag .ant-checkbox {
  display: none;
}

.sort-label {
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.sort-select {
  min-width: 200px;
}

.vehicle-card-modern {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.vehicle-card-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border-color: #2563eb;
}

.vehicle-image-modern {
  height: 180px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.vehicle-icon {
  font-size: 48px;
  z-index: 2;
  position: relative;
  opacity: 0.8;
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

.vehicle-card-modern:hover .vehicle-photo-modern {
  transform: scale(1.05);
}

.promotion-badge-modern {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  z-index: 3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.vehicle-content-modern {
  padding: 20px;
}

.vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 12px;
}

.vehicle-title-modern {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
  line-height: 1.4;
}

.vehicle-type-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  color: white;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.vehicle-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 13px;
}

.detail-icon {
  color: #9ca3af;
  font-size: 14px;
  width: 14px;
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

.status-icon {
  color: #10b981;
  font-size: 12px;
}

/* Empty State */
.empty-state-modern {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
  text-align: center;
}

.empty-illustration {
  margin-bottom: 24px;
}

.empty-icon {
  font-size: 80px;
  color: #d1d5db;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.empty-subtitle {
  color: #64748b;
  margin: 0 0 32px 0;
}

.retry-btn {
  background: linear-gradient(135deg, #FE7743 0%, #ff5722 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 16px rgba(254, 119, 67, 0.4) !important;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
/* Responsive Design */
@media (max-width: 1024px) {
  .hero-search-title {
    font-size: 2.5rem;
  }
  
  .quick-search-card {
    padding: 32px;
  }
  
  .search-grid {
    grid-template-columns: 1fr;
  }
  

}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 0 16px;
  }
  
  .hero-search-title {
    font-size: 2rem;
  }
  
  .quick-search-card {
    padding: 24px;
  }
  
  .results-header-modern {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .slider-track-modern {
    gap: 16px;
  }
  
  .promo-card-modern {
    flex: 0 0 280px;
  }
  

  
  .vehicle-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (max-width: 640px) {
  .hero-search-section {
    min-height: 50vh;
  }
  
  .hero-search-title {
    font-size: 1.75rem;
  }
  
  .hero-search-subtitle {
    font-size: 1rem;
  }
  
  .quick-search-card {
    padding: 20px;
    margin: 0 16px;
  }
  
  .advanced-filters-section {
    padding: 24px;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .promo-card-modern {
    flex: 0 0 260px;
  }
}

.steps-action {
  text-align: center;
}

.steps-cta-card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: 24px;
  padding: 60px 40px;
  color: white;
}

.steps-cta-content h3 {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 16px;
}

.steps-cta-content p {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 32px;
}

.steps-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.steps-buttons .ant-btn {
  border-radius: 12px;
  height: 48px;
  padding: 0 24px;
  font-weight: 600;
}

</style>

