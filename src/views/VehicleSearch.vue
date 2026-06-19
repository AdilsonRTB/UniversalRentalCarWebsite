<template>
  <div class="vehicle-search-modern">
    <a-spin :spinning="loading && vehicles.length === 0" size="large">
      <HeaderPage />

      <!-- Hero Search Section -->
      <section class="hero-search-section">
        <!-- Map Decoration -->
        <div class="map-decoration">
          <img src="@/assets/mapa_santiago_br.png" alt="Santiago Map" />
        </div>
        
        <div class="hero-visual-ultra-modern">

          <!-- Floating Elements -->
          <div class="floating-element element-1">
            <div class="element-icon">
              <HeartOutlined />
            </div>
            <span>{{ t('search.chooseComfort') }}</span>
          </div>

          <div class="floating-element element-2">
            <div class="element-icon">
              <SafetyOutlined />
            </div>
            <span>{{ t('search.safetyFirst') }}</span>
          </div>
          
          <div class="floating-element element-3">
            <div class="element-icon">
              <ThunderboltOutlined />
            </div>
            <span>{{ t('search.driveWithConfidence') }}</span>
          </div>
          

        </div>
        <div class="hero-search-container">
          <div class="hero-search-content">
            <h1 class="hero-search-title">{{ t('search.findBestCarToRent') }}</h1>
            <p class="hero-search-subtitle">{{ t('search.unforgettableExperiences') }}</p>
          </div>
        </div>

      </section>
      
      <!-- Main Content -->
      <div class="main-content">
        <div class="content-wrapper">
          
          <!-- Advanced Filters -->
          <div class="advanced-filters-section" id="filtro">
            <a-form ref="searchFormRef" :model="filters" :rules="filterRules">
              <div class="filters-grid">
                <div class="filter-group">
                    <h3 class="filters-title">{{ t('search.filters') }}</h3>
                    <div class="search-field">
                        <label class="filter-label">{{ t('search.brand') }}</label>
                        <a-select
                          v-model:value="filters.brand"
                          :placeholder="t('search.selectBrand')"
                          size="large"
                          class="modern-input"
                          allowClear
                          showSearch
                          :not-found-content="t('search.noData')"
                          :filterOption="(input, option) => String(option.value || '').toLowerCase().includes(input.toLowerCase())"
                        >
                          <template #suffixIcon>
                            <CarOutlined class="input-icon" style="pointer-events: none;" />
                          </template>
                          <a-select-option
                            v-for="brand in brands"
                            :key="brand.id" 
                            :value="brand.name"
                          >
                            {{ brand.name }}
                          </a-select-option>
                        </a-select>
                    </div>
                </div>
                
                <div class="filter-group">
                  <label class="filter-label">{{ t('search.pickupDate') }}</label>
                  <a-form-item name="startDate" class="group-form-item">
                    <div class="date-time-group">
                      <a-date-picker
                        :key="'pickup-date-' + currentLanguage"
                        v-model:value="filters.startDate"
                        size="large"
                        :placeholder="t('search.selectDate')"
                        class="modern-date-picker date-only"
                        format="YYYY-MM-DD"
                        :disabled-date="disabledDate"
                        :allowClear="false"
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
                  </a-form-item>
                </div>
                
                <div class="filter-group">
                  <label class="filter-label">{{ t('search.returnDate') }}</label>
                  <a-form-item name="endDate" class="group-form-item">
                    <div class="date-time-group">
                      <a-date-picker
                        :key="'return-date-' + currentLanguage"
                        v-model:value="filters.endDate"
                        size="large"
                        :placeholder="t('search.selectDate')"
                        class="modern-date-picker date-only"
                        format="YYYY-MM-DD"
                        :disabled-date="disabledEndDate"
                        :allowClear="false"
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
                  </a-form-item>
                </div>
                <div class="filter-group">
                  <div class="search-action">
                      <a-button
                        type="primary"
                        @click="validateAndSearch()"
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
            </a-form>
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
                        {{ t('search.transmissionManual') }}
                      </a-checkbox>
                      <a-checkbox value="automatic" class="transmission-tag">
                        {{ t('search.transmissionAutomatic') }}
                      </a-checkbox>
                    </a-checkbox-group>
                  </div>
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
                    <div class="vehicle-card-modern" @click="openDetailsRendels(vehicle.id, vehicle.is_available)">
                    <div class="vehicle-image-modern">
                      <img v-if="vehicle.primary_photo" :src="vehicle.primary_photo.image" :alt="`${vehicle?.brand_name} ${vehicle?.model}`" class="vehicle-photo-modern"/>
                      <img v-if="vehicle.photo && !vehicle.primary_photo" :src="vehicle.photo" :alt="`${vehicle?.brand_name} ${vehicle?.model}`" class="vehicle-photo-modern"/>
                      <CarOutlined class="vehicle-icon" v-if="!vehicle.photo && !vehicle.primary_photo"/>
                    </div>

                    <div class="vehicle-content-modern">
                      <div class="vehicle-header">
                        <!--h3 class="vehicle-title-modern">{{ vehicle.brand_name }} {{ vehicle.model }} - {{ vehicle.year }}</h3-->
                        <h3 class="vehicle-title-modern">{{ vehicle.brand_name }} {{ vehicle.model }}</h3>
                        <div class="vehicle-type-badge" :style="{ backgroundColor: getVehicleTypeColor(vehicle.type) }">
                          {{ getVehicleTypeLabel(vehicle.type) }}
                        </div>
                      </div>

                      <div class="vehicle-details">
                        <!--div class="detail-item">
                          <CalendarOutlined class="detail-icon" />
                          <span>{{ vehicle.year }}</span>
                        </!div-->
                        <!--div class="detail-item">
                          <EnvironmentOutlined class="detail-icon" />
                          <span>{{ vehicle.location || 'Achada Santo António, Santiago' }}</span>
                        </div-->
                        <div v-if="vehicle.owner" class="detail-item">
                          <UserOutlined class="detail-icon" />
                          <span>{{ vehicle.owner }}</span>
                        </div>
                      </div>
                      
                      <div class="vehicle-features-mini">

                        <div class="feature-mini">

                          <SettingOutlined />
                          <span>{{ getLabelFuel(vehicle.fuel_type) }} </span>
                        </div>
                        <div class="feature-mini">
                          <DeploymentUnitOutlined />
                          <span>{{ getLabelTransmission(vehicle.gearbox_type) }}</span>
                        </div>
                        <div class="feature-mini">
                          <UsergroupAddOutlined/>
                          <span>{{ vehicle.number_of_seats }} {{ t('search.seats') }}</span>
                        </div>
                      </div>
                      
                      <div class="vehicle-price-modern">
                        <span class="price-value">{{ formatPriceWithApiRates(vehicle.daily_rate) }}</span>
                        <span class="price-period">/ {{ t('search.perDay') }}</span>
                      </div>
                      
                      <div class="vehicle-footer-modern">
                        <div class="rating-modern">
                          <StarFilled class="star-icon" />
                          <span>{{ vehicle.stats.average_overall_rating }} ({{ vehicle.stats.total_evaluations }})</span>
                        </div>
                        <div v-if="hasDateFilter" class="status-modern" :class="vehicle.is_available ? '' : 'status-modern-unavailable'">
                          <CheckCircleFilled class="status-icon" v-if="vehicle.is_available"/>
                          <CloseCircleFilled class="status-icon-error" v-else/>
                          <span>{{ vehicle.is_available ? t('vehicles.available') : t('vehicles.unavailable') }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  </a-col>
                  <a-col  :span="24" id="details">
                    <div v-if="rentaldetails">
                      <VehicleDetails :vehicleId="vehicleId" :key="vehicleId" :availability="availability"
                        :startDate="formattedStartDateTime"
                        :endDate="formattedEndDateTime"
                        :config="config"
                      />
                    </div>
                  </a-col>

                  <a-back-top />
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
                  <h3>{{ t('search.simpleAsThis') }}</h3>
                  <p>{{ t('search.fewStepsDriving') }}</p>
                  <div class="steps-buttons">
                    <a-button type="primary" size="large" @click="scrollToSection('filtro')">
                      <SearchOutlined />
                      {{ t('search.searchVehiclesCTA') }}
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
import { ref, computed, onMounted, watch } from 'vue'
//import { useRouter } from 'vue-router'
import HeaderPage from '../components/HeaderPage.vue'
import EvaluationsSearchPage from './EvaluationsSearchPage.vue'
import { 
  SearchOutlined, 
  //EnvironmentOutlined,
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
  //DashboardOutlined,
  HeartOutlined,
  SafetyOutlined,
  CloseCircleFilled,
  UsergroupAddOutlined
} from '@ant-design/icons-vue'
import { vehicleService } from '../services/api'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import VehicleDetails from './VehicleDetailsSearch.vue'
import dayjs from 'dayjs'
import 'dayjs/locale/pt'
import 'dayjs/locale/en'
import 'dayjs/locale/fr'
import { useRoute } from 'vue-router'
import { useLanguageAndCurrency } from '../composables/useLanguageAndCurrency.js'
import { useSeo } from '../composables/useSeo.js'
import antLocale_pt_BR from 'ant-design-vue/es/locale/pt_BR'
import antLocale_en_US from 'ant-design-vue/es/locale/en_US'
import antLocale_fr_FR from 'ant-design-vue/es/locale/fr_FR'
//import { useUtilities } from '../composables/utilits.js'

//const { formatImageUrl } = useUtilities()

const { currentCurrency, currentLanguage } = useLanguageAndCurrency()

const route = useRoute()

const openLoginModal = ref(false);
// Use i18n and language/currency functionality
const { t } = useI18n()

// SEO meta tags
useSeo({
  title: 'Pesquisar Veículos - Universal Rent-a-Car',
  description: 'Encontre o veículo perfeito para sua viagem. Compare preços, veja avaliações e reserve online com segurança.',
  keywords: 'pesquisar carros, veículos disponíveis, aluguel de carros online, comparar preços',
  url: 'https://www.universalrental.cv/vehicle-search'
})

// Date picker locale based on current language
const datePickerLocale = computed(() => {
  const lang = currentLanguage.value
  console.log('Date picker locale computed for language:', lang)
  let locale
  switch (lang) {
    case 'pt':
      locale = antLocale_pt_BR.DatePicker
      break
    case 'en':
      locale = antLocale_en_US.DatePicker
      break
    case 'fr':
      locale = antLocale_fr_FR.DatePicker
      break
    default:
      locale = antLocale_pt_BR.DatePicker
  }
  console.log('Using locale:', locale)
  return locale
})

// Update dayjs locale when language changes
watch(currentLanguage, (newLang) => {
  console.log('Language changed to:', newLang)
  const dayjsLocale = newLang === 'pt' ? 'pt' : newLang
  dayjs.locale(dayjsLocale)
  console.log('Dayjs locale set to:', dayjsLocale)
}, { immediate: true })

watch(currentLanguage, () => {
  if (formValidated.value) {
    searchFormRef.value?.validate().catch(() => {})
  }
})

// Disable hours outside 8-23 range
/*const disabledHours = () => {
  const hours = []
  for (let i = 0; i < 8; i++) {
    hours.push(i)
  }
  return hours
}*/

/*function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}*/

const now = dayjs();

const brands = ref([]);

const getAvailableBrands = async () => {
  try {
    const response = await vehicleService.getAllVehiclesBrands()
    brands.value = response.data
  } catch (error) {
    console.error('Erro ao carregar marcas disponíveis:', error)
  }
}

const disabledDate = (current) => {
  if (!current) return false
  
  const today = now.startOf("day")
  const maxDate = now.add(2, 'year').endOf('day')
  
  // Não pode ser antes de hoje ou depois de 2 anos a partir de hoje
  return current < today || current > maxDate
}

const disabledEndDate = (current) => {
  if (!current) return false

  const today = now.startOf('day')
  const maxDate = now.add(2, 'year').endOf('day')

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
  brand: null,
  name: '',
  type: '',
  year: null,
  startDate: null,
  endDate: null,
  startTime: null,
  endTime: null,
  owner: null,
  hasPromotion: null
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

// LocalStorage keys
const STORAGE_KEYS = {
  START_DATE: 'vehicle_search_start_date',
  END_DATE: 'vehicle_search_end_date'
}

// Load dates from localStorage
/*const loadDatesFromStorage = () => {
  try {
    const savedStartDate = localStorage.getItem(STORAGE_KEYS.START_DATE)
    const savedEndDate = localStorage.getItem(STORAGE_KEYS.END_DATE)
    const today = dayjs().startOf('day')

    if (savedStartDate) {
      const startDate = dayjs(savedStartDate)
      // Se a data salva for anterior a hoje, ajustar para hoje
      filters.value.startDate = startDate.isBefore(today) ? dayjs().startOf('day') : startDate.startOf('day')
      // Extrair a hora
      filters.value.startTime = startDate.format('HH:mm')
    } else {
      filters.value.startDate = dayjs().startOf('day')
      filters.value.startTime = '08:00'
    }
    
    if (savedEndDate) {
      const endDate = dayjs(savedEndDate)
      // Se a data de devolução for anterior a hoje ou anterior à data de recolha + 1 dia, ajustar
      const minEndDate = filters.value.startDate.add(2, 'day')
      filters.value.endDate = endDate.isBefore(minEndDate) ? minEndDate : endDate.startOf('day')
      // Extrair a hora
      filters.value.endTime = endDate.format('HH:mm')
    } else {
      filters.value.endDate = filters.value.startDate.add(2, 'day')
      filters.value.endTime = '08:00'
    }
  } catch (error) {
    console.error('Error loading dates from localStorage:', error)
    // Fallback to default dates
    filters.value.startDate = dayjs().startOf('day')
    filters.value.endDate = dayjs().add(2, 'day').startOf('day')
    filters.value.startTime = '08:00'
    filters.value.endTime = '08:00'
  }
}*/

// Watch for brand changes to auto-search
watch(() => filters.value.brand, () => {
  if (!loading.value) {
    searchVehicles()
  }
})

// Watch for startDate changes and save to localStorage
watch(() => filters.value.startDate, (newDate) => {
  if (newDate) {
    const today = dayjs().startOf('day')
    
    // Se a nova data for anterior a hoje, ajustar para hoje
    if (newDate.isBefore(today)) {
      filters.value.startDate = dayjs().startOf('day')
      return
    }
    
    // Verificar se a data de devolução precisa ser ajustada
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
    
    // Combinar data + hora e salvar
    if (filters.value.startTime) {
      const [hour, minute] = filters.value.startTime.split(':')
      const dateWithTime = newDate.hour(parseInt(hour)).minute(parseInt(minute)).second(0)
      localStorage.setItem(STORAGE_KEYS.START_DATE, dateWithTime.toISOString())
    }
    
    // Auto-search when start date changes
    if (!loading.value) {
      searchVehicles()
    }
  }
}, { deep: true })

// Watch for startTime changes and save to localStorage
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
    const dateWithTime = filters.value.startDate.hour(parseInt(hour)).minute(parseInt(minute)).second(0)
    localStorage.setItem(STORAGE_KEYS.START_DATE, dateWithTime.toISOString())
    
    // Auto-search when start time changes
    if (!loading.value) {
      searchVehicles()
    }
  }
})

// Watch for endDate changes and save to localStorage
watch(() => filters.value.endDate, (newDate) => {
  if (newDate) {
    const today = dayjs().startOf('day')
    
    // Se a nova data for anterior a hoje, ajustar para hoje + 2 dias
    if (newDate.isBefore(today)) {
      filters.value.endDate = dayjs().add(2, 'day').startOf('day')
      return
    }
    
    // Se existe startDate e endDate for anterior a startDate + 2 dias, ajustar
    if (filters.value.startDate && newDate.isBefore(filters.value.startDate.add(2, 'day'))) {
      filters.value.endDate = filters.value.startDate.add(2, 'day')
      return
    }
    
    // Combinar data + hora e salvar
    if (filters.value.endTime) {
      const [hour, minute] = filters.value.endTime.split(':')
      const dateWithTime = newDate.hour(parseInt(hour)).minute(parseInt(minute)).second(0)
      localStorage.setItem(STORAGE_KEYS.END_DATE, dateWithTime.toISOString())
    }
    
    // Auto-search when end date changes
    if (!loading.value) {
      searchVehicles()
    }
  }
}, { deep: true })

// Watch for endTime changes and save to localStorage
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
    const dateWithTime = filters.value.endDate.hour(parseInt(hour)).minute(parseInt(minute)).second(0)
    localStorage.setItem(STORAGE_KEYS.END_DATE, dateWithTime.toISOString())
    
    // Auto-search when end time changes
    if (!loading.value) {
      searchVehicles()
    }
  }
})

const vehicles = ref([])
const allVehicles = ref([])
const loading = ref(false)
const sortBy = ref('price-asc')
const transmissionFilter = ref([])
const vehicleId = ref(null);
const availability = ref(false);
const config = ref({})
const hasDateFilter = ref(false)
const searchFormRef = ref(null)
const formValidated = ref(false)

const filterRules = computed(() => ({
  startDate: [{
    validator: () => {
      if (!filters.value.startDate || !filters.value.startTime)
        return Promise.reject(t('search.fieldRequired'))
      return Promise.resolve()
    },
    trigger: 'change'
  }],
  endDate: [{
    validator: () => {
      if (!filters.value.endDate || !filters.value.endTime)
        return Promise.reject(t('search.fieldRequired'))
      return Promise.resolve()
    },
    trigger: 'change'
  }],
}))

const getLabelTransmission = (type) => {
  if (!type) return ''
  return t(`vehicles.transmissionTypes.${type}`) || type
}

const getLabelFuel = (type) => {
  if (!type) return ''
  return t(`vehicles.fuelTypes.${type}`) || type
}

// Função para formatar preço com taxas de câmbio da API
const formatPriceWithApiRates = (amount) => {
  if (!amount || !config.value) return `${amount} CVE`
  
  switch (currentCurrency.value) {
    case 'USD': {
      const usdRate = parseFloat(config.value.usd_exchange_rate || 100)
      const usdAmount = amount / usdRate
      return `$${usdAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`
    }
    case 'EUR': {
      const eurRate = parseFloat(config.value.euro_exchange_rate || 100)
      const eurAmount = amount / eurRate
      return `${eurAmount.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}€`
    }
    case 'CVE':
    default:
      return `${amount.toLocaleString('pt-PT')} CVE`
  }
}


const openDetailsRendels = async (id, available) => {
  const hasAllDates = filters.value.startDate && filters.value.endDate &&
                      filters.value.startTime && filters.value.endTime

  if (!hasAllDates) {
    formValidated.value = true
    scrollToSection('filtro')
    searchFormRef.value?.validate().catch(() => {})
    return
  }

  if (id === vehicleId.value){
    rentaldetails.value = false;
    vehicleId.value = null;
    availability.value = available;
    return;
  }
  rentaldetails.value = true;
  vehicleId.value = id;
  availability.value = available;
  scrollToSection('details');
}

const sortedVehicles = computed(() => {
  const vehicleList = [...vehicles.value]

  switch (sortBy.value) {
    case 'price-asc':
      return vehicleList.sort((a, b) => a.daily_rate - b.daily_rate)
    case 'price-desc':
      return vehicleList.sort((a, b) => b.daily_rate - a.daily_rate)
    case 'year-desc':
      return vehicleList.sort((a, b) => b.year - a.year)
    case 'year-asc':
      return vehicleList.sort((a, b) => a.year - b.year)
    default:
      return vehicleList
  }
})

// Computed properties to combine date + time for VehicleDetails
const formattedStartDateTime = computed(() => {
  if (!filters.value.startDate || !filters.value.startTime) return ''
  return `${filters.value.startDate.format('YYYY-MM-DD')} ${filters.value.startTime}:00`
})

const formattedEndDateTime = computed(() => {
  if (!filters.value.endDate || !filters.value.endTime) return ''
  return `${filters.value.endDate.format('YYYY-MM-DD')} ${filters.value.endTime}:00`
})

const validateAndSearch = async () => {
  formValidated.value = true
  try {
    await searchFormRef.value.validate()
  } catch {
    scrollToSection('filtro')
    return
  }
  loadAvailableVehicles()
}

const loadAvailableVehicles = async () => {
  loading.value = true
  hasDateFilter.value = !!(filters.value.startDate && filters.value.endDate)
  try {
    const response = await vehicleService.getAllVehicles()
    allVehicles.value = response.data
    //vehicles.value = response.data
    searchVehicles()

    // Load promotional vehicles (limited to 10)
    //await loadPromotionalVehicles()
  } catch (error) {
    console.error('Erro ao carregar veículos:', error)
    //loadMockVehicles()
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
      message.error(t('validation.pickupDateCannotBePriorToReturn'))
      loading.value = false
      return
    }
  }
  /* filtrar no allVehicles */
  vehicles.value = allVehicles.value.filter(vehicle => {
    const matchesBrand = filters.value.brand
      ? vehicle.brand_name.toLowerCase() === filters.value.brand.toLowerCase()
      : true

    const matchesName = filters.value.name
      ? vehicle.brand_name.toLowerCase().includes(filters.value.name.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(filters.value.name.toLowerCase())
      : true

    return matchesBrand && matchesName
  })

  /* filtrar por data active_rentals */
  if (filters.value.startDate && filters.value.endDate) {
    const start = dayjs(filters.value.startDate)
    const end = dayjs(filters.value.endDate)

    console.log('Filtering vehicles between', start.format(), 'and', end.format())

    vehicles.value = vehicles.value.map(vehicle => {
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
  rentaldetails.value = false;
}

const loadSystemConfig = async () => {
  try {
    const response = await vehicleService.getSystemConfig()
    config.value = response.data
    // Use config as needed, e.g., set max slides for carousel
  } catch (error) {
    console.error('Erro ao carregar configuração do sistema:', error)
  }
}

const getVehicleTypeLabel = (type) => {
  if (!type) return ''
  return t(`vehicles.typeLabels.${type.toLowerCase()}`) || type
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
  let baseVehicles = [...allVehicles.value]
  
  // Apply brand filter first if selected
  if (filters.value.brand) {
    baseVehicles = baseVehicles.filter(vehicle => 
      vehicle.brand_name.toLowerCase() === filters.value.brand.toLowerCase()
    )
  }
  
  // Then apply transmission filter
  if (transmissionFilter.value.length === 0) {
    vehicles.value = baseVehicles
  } else {
    vehicles.value = baseVehicles.filter(vehicle => 
      transmissionFilter.value.includes(vehicle.gearbox_type)
    )
  }
  
  // Apply date filtering if dates are selected
  if (filters.value.startDate && filters.value.endDate) {
    const start = dayjs(filters.value.startDate)
    const end = dayjs(filters.value.endDate)

    vehicles.value = vehicles.value.map(vehicle => {
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
}

onMounted(() => {
  loadSystemConfig()
  getAvailableBrands()
  loadAvailableVehicles()

  console.log(route.query.from)

  if (route.query.from === 'register') {
    // open modal login
    openLoginModal.value = true;
  }

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
  -margin-top: 80px;
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%) !important;
}

/* Hero Visual Ultra Modern */
.hero-visual-ultra-modern {
  position: relative;
  height: 500px;
}

/* Map Decoration */
.map-decoration {
  position: absolute;
  top: 55%;
  right: 30px;
  transform: translateY(-50%);
  width: 400px;
  height: 400px;
  opacity: 0.5;
  z-index: 3;
  pointer-events: none;
}

.map-decoration img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(1.2);
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
  top: 100px;
  left: 80px;
  animation-delay: 0s;
}

.floating-element.element-2 {
  bottom: 200px;
  left: -10px;
  animation-delay: -1.0s;
}

.floating-element.element-3 {
  bottom: 100px;
  left: 90px;
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
  padding: 5px 0px;
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
  width: 100%;
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

.date-time-group {
  display: flex;
  gap: 8px;
  width: 100%;
}

.group-form-item {
  margin-bottom: 0;
  position: relative;
}

.group-form-item :deep(.ant-form-item-explain) {
  position: absolute;
  top: 100%;
  left: 0;
  padding-top: 2px;
}

.group-form-item :deep(.ant-form-item-explain-error) {
  font-size: 12px;
  white-space: nowrap;
}

.date-only {
  flex: 1;
  min-width: 0;
}

.modern-time-picker {
  flex: 0 0 120px;
  border-radius: 12px !important;
  border: 2px solid #e5e7eb !important;
  transition: all 0.3s ease !important;
}

.modern-time-picker:hover {
  border-color: #FE7743 !important;
}

.modern-time-picker :deep(.ant-select-selector) {
  border: none !important;
  background: transparent !important;
}

.modern-time-picker:hover :deep(.ant-select-selector) {
  border-color: transparent !important;
  box-shadow: none !important;
}

.modern-time-picker :deep(.ant-select-focused .ant-select-selector) {
  border-color: transparent !important;
  box-shadow: none !important;
}

.modern-time-picker :deep(.ant-select-arrow) {
  color: #9ca3af !important;
}

.modern-time-picker:hover :deep(.ant-select-arrow) {
  color: #FE7743 !important;
}

.search-btn-modern {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
}

.modern-time-picker:focus {
  border-color: #FE7743 !important;
  box-shadow: 0 0 0 3px rgba(254, 119, 67, 0.1) !important;
}

.modern-input :deep(.ant-select-selector) {
  border: none !important;
  background: transparent !important;
}

.modern-input :deep(.ant-select-focused .ant-select-selector) {
  border: none !important;
  box-shadow: none !important;
}

.input-icon {
  color: #9ca3af !important;
  font-size: 17px !important;
}


.clickable-icon:hover {
  color: #FE7743 !important;
}

.search-btn-modern {
  background: linear-gradient(135deg, #FE7743 0%, #ff5722 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  height: 45px !important;
  font-weight: 600 !important;
  box-shadow: 0 4px 16px rgba(254, 119, 67, 0.4) !important;
  transition: all 0.3s ease !important;
  width: 100%;
  max-width: 250px;
}

.search-btn-modern:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 24px rgba(254, 119, 67, 0.5) !important;
}

.search-action {
  display: flex;
  align-items: end;
  justify-content: center;
  margin-top: 25px;
  width: 100%;
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

.filters-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.toggle-filters {
  color: #FE7743 !important;
  font-weight: 600 !important;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  align-items: end;
  justify-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 300px;
}

.filter-label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  margin-bottom: 4px;
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
  
  .map-decoration {
    width: 300px;
    height: 300px;
    right: 20px;
  }
  
  .floating-element {
    min-width: 150px;
    font-size: 12px;
    padding: 8px 12px;
  }
  
  .floating-element.element-1 {
    top: 80px;
    left: 60px;
  }

  .floating-element.element-2 {
    bottom: 180px;
    left: -5px;
  }

  .floating-element.element-3 {
    bottom: 80px;
    left: 70px;
  }

}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 0 16px;
  }

  .map-decoration {
    width: 400px;
    height: 400px;
    right: 100px;
    top: 50%;
    opacity: 0.3;
  }
  
  .floating-element {
    display: none;
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
  
  .advanced-filters-section {
    padding: 20px;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .filter-group {
    max-width: 100%;
  }
  
  .filters-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 640px) {
  .map-decoration {
    width: 350px;
    height: 350px;
    right: 50px;
    top: 50%;
    opacity: 0.25;
  }

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
    padding: 16px;
    border-radius: 16px;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .filter-group {
    max-width: 100%;
  }
  
  .date-time-group {
    flex-direction: column;
    gap: 12px;
  }
  
  .modern-time-picker {
    flex: 1;
    width: 100%;
  }
  
  .date-only {
    width: 100%;
  }
  
  .filters-title {
    font-size: 1.125rem;
  }
  
  .filter-label {
    font-size: 13px;
  }
  
  .search-btn-modern {
    height: 52px;
    font-size: 15px;
  }
  
  .search-action {
    margin-top: 20px;
  }
  
  .promo-card-modern {
    flex: 0 0 260px;
  }
}

@media (max-width: 480px) {
  .map-decoration {
    width: 320px;
    height: 320px;
    right: 30px;
    top: 50%;
    opacity: 0.2;
  }
  
  .advanced-filters-section {
    padding: 12px;
    margin-bottom: 24px;
  }
  
  .filters-header {
    margin-bottom: 16px;
  }
  
  .filters-title {
    font-size: 1rem;
  }
  
  .filters-grid {
    gap: 14px;
  }
  
  .filter-label {
    font-size: 12px;
    margin-bottom: 2px;
  }
  
  .modern-input,
  .modern-date-picker,
  .modern-time-picker {
    font-size: 14px;
  }
  
  .date-time-group {
    gap: 10px;
  }
  
  .search-btn-modern {
    height: 48px;
    font-size: 14px;
  }
  
  .content-wrapper {
    padding: 0 12px;
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

.steps-buttons :deep(.ant-btn-primary:hover) {
  background: #ff5722 !important;
  border-color: #ff5722 !important;
}

</style>

