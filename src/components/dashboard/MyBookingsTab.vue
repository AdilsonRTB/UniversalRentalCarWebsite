<template>
  <div class="my-bookings-content">

    <div class="breadcrumb-modern">
      <span class="breadcrumb-current">Area Pessoal</span>
      <span class="breadcrumb-separator">›</span>
      <router-link to="/owner-dashboard?tab=overview" class="breadcrumb-link">Dashboard</router-link>
    </div>

    <!-- Actions & Filters Section -->
    <section class="actions-section">
      <div class="actions-card">
        <div class="actions-header">
          <h4>Ações e Filtros</h4>
          <a-button type="primary" @click="navigateToSearch" class="new-booking-btn" size="large" :style="{
              '--btn-bg': backgroundHero,
              '--btn-bg-hover': backgroundHero
            }">
            <PlusOutlined />
            {{ $t('bookings.newBooking') }}
          </a-button>
        </div>
        
        <div class="filters-grid">
          <div class="filter-item">
            <label>Status</label>
            <a-select
              :placeholder="$t('bookings.filterByStatus')"
              style="width: 100%"
              @change="$emit('filter-bookings', $event)"
              allow-clear
            >
              <a-select-option value="PENDING">{{ $t('bookings.pending') }}</a-select-option>
              <a-select-option value="CONFIRMED">{{ $t('bookings.confirmed') }}</a-select-option>
              <a-select-option value="ACTIVE">{{ $t('bookings.active') }}</a-select-option>
              <a-select-option value="COMPLETED">{{ $t('bookings.completed') }}</a-select-option>
              <a-select-option value="CANCELLED">{{ $t('bookings.cancelled') }}</a-select-option>
            </a-select>
          </div>
          
          <div class="filter-item">
            <label>Período</label>
            <a-range-picker 
              style="width: 100%"
              format="DD/MM/YYYY"
              placeholder="['Data início', 'Data fim']"
              @change="handleDateRangeChange"
            />
          </div>
          
          <div class="filter-item">
            <label>Ordenar por</label>
            <a-select
              placeholder="Ordenação"
              style="width: 100%"
              @change="handleSortChange"
            >
              <a-select-option value="date-desc">Data (Mais recente)</a-select-option>
              <a-select-option value="date-asc">Data (Mais antiga)</a-select-option>
              <a-select-option value="price-desc">Valor (Maior)</a-select-option>
              <a-select-option value="price-asc">Valor (Menor)</a-select-option>
            </a-select>
          </div>
        </div>
      </div>
    </section>

    <!-- Bookings Grid -->
    <section class="bookings-section">
      <div class="bookings-header">
        <h4>{{ filteredBookings.length }} reserva(s) encontrada(s)</h4>
        <a-space>
          <a-button @click="refreshBookings">
            <ReloadOutlined /> Atualizar
          </a-button>
        </a-space>
      </div>

      <div class="bookings-grid" v-if="filteredBookings.length > 0">
        <div 
          v-for="booking in paginatedBookings"
          :key="booking.id" 
          class="booking-card"
          :class="{ 
            'pending': booking.status === 'PENDING',
            'confirmed': booking.status === 'CONFIRMED',
            'active': booking.status === 'ACTIVE',
            'completed': booking.status === 'COMPLETED',
            'cancelled': booking.status === 'CANCELLED'
          }"
        >
          <!-- Vehicle Image/Icon -->
          <div class="vehicle-cover">
            <div class="vehicle-icon-wrapper">
              <CarOutlined class="vehicle-icon-similar" v-if="!booking.vehicle_info.photo"/>
              <img :src="url + booking.vehicle_info.photo" :alt="`${booking.vehicle_info?.brand} ${booking.vehicle_info?.model}`" class="vehicle-photo-modern" v-else/>
            </div>
            <div class="status-badge" :class="booking.status.toLowerCase()">
              {{ booking.status_display }}
            </div>
          </div>

          <!-- Booking Header -->
          <div class="booking-header">
            <div class="vehicle-title">
              <h5>{{ booking.vehicle_info.brand }} {{ booking.vehicle_info.model }}</h5>
              <span class="booking-id">#{{ booking.vehicle_info.year }}</span>
            </div>
          </div>

          <!-- Owner Info -->
          <!--div class="owner-section">
            <div class="owner-avatar">
              <UserOutlined />
            </div>
            <div class="owner-info">
              <h6 class="owner-name">{{ booking.ownerName }}</h6>
              <p class="owner-location">{{ booking.ownerLocation || 'Localização não informada' }}</p>
            </div>
          </!--div-->

          <!-- Rental Period -->
          <div class="period-section">
            <div class="period-item">
              <CalendarOutlined />
              <div class="period-info">
                <span class="period-label">{{ $t('bookings.period') }}</span>
                <span class="period-dates">{{ formatDate(booking.start_date) }} - {{ formatDate(booking.end_date) }}</span>
              </div>
            </div>
          </div>

          <!-- Booking Summary -->
          <div class="summary-section">
            <div class="summary-item">
              <DollarOutlined />
              <div class="summary-info">
                <span class="summary-label">{{ $t('bookings.totalValue') }}</span>
                <span class="summary-value price">{{ booking.total_amount }} CVE</span>
              </div>
            </div>
            <div class="summary-item">
              <ClockCircleOutlined />
              <div class="summary-info">
                <span class="summary-label">{{ $t('bookings.days') }}</span>
                <span class="summary-value">{{ booking.days_duration }} dia(s)</span>
              </div>
            </div>
          </div>

          <!-- Progress Bar (for active bookings) -->
          <div v-if="['pending', 'confirmed'].includes(booking.status)" class="progress-section">
            <div class="progress-info">
              <span>Progresso da viagem</span>
              <span>{{ getBookingProgress(booking) }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: getBookingProgress(booking) + '%' }"></div>
            </div>
          </div>
          <div v-else class="progress-section">
            <div class="progress-info">
              <span>Progresso da viagem</span>
              <span> </span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: getBookingProgress(booking) + '%' }"></div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card-actions">
            <a-button @click="navigateToVehicleDetails(booking)" class="action-btn">
              <EyeOutlined /> Detalhes
            </a-button>
            <!--a-button @click="navigateToMessages" class="action-btn">
              <MessageOutlined /> Contato
            </!--a-button-->
            <a-button
              v-if="['pending', 'confirmed'].includes(booking.status)"
              danger
              @click="$emit('cancel-booking', booking)"
              class="action-btn"
            >
              <DeleteOutlined /> Cancelar
            </a-button>
            <!--a-button
              v-if="['cancelled', 'completed'].includes(booking.status)"
              type="primary"
              @click="$emit('cancel-booking', booking)"
              class="action-btn"
            >
              <CalendarOutlined /> Reservar
            </!--a-button-->

            <a-button
              v-if="['completed'].includes(booking.status) && !booking.evaluation"
              type="primary"
              @click="rateRental(booking)"
              class="action-btn"
            >
              <StarOutlined /> Avaliar
            </a-button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <InboxOutlined />
        </div>
        <h4>Nenhuma reserva encontrada</h4>
        <p>Você ainda não possui reservas ou não há reservas que correspondam aos filtros selecionados.</p>
        <a-button type="primary" @click="navigateToSearch">
          <PlusOutlined /> Fazer nova reserva
        </a-button>
      </div>

      <!-- Pagination -->
      <div class="pagination-section" v-if="filteredBookings.length > pageSize">
        <a-pagination
          v-model:current="currentPage"
          :total="filteredBookings.length"
          :pageSize="pageSize"
          :showSizeChanger="false"
          :showQuickJumper="true"
          :showTotal="(total, range) => `${range[0]}-${range[1]} de ${total} reservas`"
        />
      </div>
    </section>

    <!-- Rating Modal -->
    <a-modal
      v-model:open="ratingModalVisible"
      title="Avaliar Aluguel"
      :width="600"
      :footer="null"
      @cancel="closeRatingModal"
    >
      <div class="rating-modal-content">
        <!-- Vehicle Info Header -->
        <div class="vehicle-info-header" v-if="selectedBooking">
          <div class="vehicle-image">
            <CarOutlined v-if="!selectedBooking.vehicle_info.photo" />
            <img :src="url + selectedBooking.vehicle_info.photo" :alt="selectedBooking.vehicle_info.brand" v-else />
          </div>
          <div class="vehicle-details">
            <h4>{{ selectedBooking.vehicle_info.brand }} {{ selectedBooking.vehicle_info.model }}</h4>
            <p>Período: {{ formatDate(selectedBooking.start_date) }} - {{ formatDate(selectedBooking.end_date) }}</p>
          </div>
        </div>

        <!-- Rating Form -->
        <a-form
          :model="ratingForm"
          layout="horizontal"
          @finish="submitRating"
          class="rating-form"
        >
          <!-- Overall Rating -->
          <a-form-item 
            label="Avaliação Geral"
            name="overall_rating"
            :rules="[{ required: true, message: 'Por favor, selecione uma avaliação geral!' }]"
          >
            <a-rate
              v-model:value="ratingForm.overall_rating" 
              :count="5" 
              :allow-half="false"
              class="custom-rate"
            />
            <span class="rating-text">{{ getRatingText(ratingForm.overall_rating) }}</span>
          </a-form-item>

          <!-- Vehicle Condition Rating -->
          <a-form-item 
            label="Condição do Veículo" 
            name="vehicle_condition_rating"
            :rules="[{ required: true, message: 'Por favor, avalie a condição do veículo!' }]"
          >
            <a-rate 
              v-model:value="ratingForm.vehicle_condition_rating" 
              :count="5" 
              :allow-half="false"
              class="custom-rate"
            />
            <span class="rating-text">{{ getRatingText(ratingForm.vehicle_condition_rating) }}</span>
          </a-form-item>

          <!-- Service Quality Rating -->
          <a-form-item 
            label="Qualidade do Atendimento" 
            name="service_quality_rating"
            :rules="[{ required: true, message: 'Por favor, avalie a qualidade do atendimento!' }]"
          >
            <a-rate 
              v-model:value="ratingForm.service_quality_rating" 
              :count="5" 
              :allow-half="false"
              class="custom-rate"
            />
            <span class="rating-text">{{ getRatingText(ratingForm.service_quality_rating) }}</span>
          </a-form-item>

          <!-- Value for Money Rating -->
          <a-form-item 
            label="Custo-Benefício" 
            name="value_for_money_rating"
            :rules="[{ required: true, message: 'Por favor, avalie o custo-benefício!' }]"
          >
            <a-rate 
              v-model:value="ratingForm.value_for_money_rating" 
              :count="5" 
              :allow-half="false"
              class="custom-rate"
            />
            <span class="rating-text">{{ getRatingText(ratingForm.value_for_money_rating) }}</span>
          </a-form-item>

          <!-- Comments -->
          <a-form-item name="comments">
            <a-textarea
              v-model:value="ratingForm.comments"
              placeholder="Compartilhe sua experiência com este aluguel..."
              :rows="4"
              :maxlength="500"
              show-count
            />
          </a-form-item>

          <!-- Would Recommend -->
          <a-form-item  name="would_recommend">
            <a-radio-group v-model:value="ratingForm.would_recommend" style="display: flex; gap: 12px;">
              <a-radio :value="true">Recomendaria este veículo</a-radio>
              <a-radio :value="false">Não recomendaria este veículo</a-radio>
            </a-radio-group>
          </a-form-item>

          <!-- Had Issues -->
          <a-form-item  name="had_issues">
            <a-radio-group v-model:value="ratingForm.had_issues" @change="onIssuesChange" style="display: flex; gap: 12px;">
              <a-radio :value="false">Não tive problemas</a-radio>
              <a-radio :value="true">Tive alguns problemas</a-radio>
            </a-radio-group>
          </a-form-item>

          <!-- Issue Description (conditional) -->
          <a-form-item 
            v-if="ratingForm.had_issues"
            name="issue_description"
            :rules="ratingForm.had_issues ? [{ required: true, message: 'Por favor, descreva os problemas encontrados!' }] : []"
          >
            <a-textarea
              v-model:value="ratingForm.issue_description"
              placeholder="Descreva os problemas que enfrentou durante o aluguel..."
              :rows="3"
              :maxlength="300"
              show-count
            />
          </a-form-item>

          <!-- Form Actions -->
          <div class="form-actions">
            <a-button @click="closeRatingModal" style="margin-right: 12px">
              Cancelar
            </a-button>
            <a-button 
              type="primary" 
              html-type="submit" 
              :loading="submittingRating"
              :style="{
                '--btn-bg': backgroundHero,
                '--btn-bg-hover': backgroundHero
              }"
            >
              Enviar Avaliação
            </a-button>
          </div>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { 
  PlusOutlined,
  CarOutlined,
  EyeOutlined,
  //MessageOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  //CheckCircleOutlined,
  DollarOutlined,
  ReloadOutlined,
  InboxOutlined,
  StarOutlined
} from '@ant-design/icons-vue'

import dayjs from 'dayjs'
import { defineProps, defineEmits, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
//import { useLanguageAndCurrency } from '../../composables/useLanguageAndCurrency'
import { baseURL, vehicleService } from '../../services/api'

const url = computed(() => baseURL)

//const { formatCurrency } = useLanguageAndCurrency()
const router = useRouter()

const props = defineProps({
  myBookings: {
    type: Array,
    default: () => []
  },
  backgroundHero: {
    type: String,
    default: ''
  },
  getStatusColor: Function,
  getStatusLabel: Function
})

const emit = defineEmits([
  'filter-bookings',
  'cancel-booking',
  'refreshBookings'
])

// Reactive data
const currentPage = ref(1)
const pageSize = ref(9)
const dateRange = ref([])
const sortBy = ref('date-desc')

// Rating modal data
const ratingModalVisible = ref(false)
const selectedBooking = ref(null)
const submittingRating = ref(false)
const ratingForm = ref({
  rental: 0,
  overall_rating: 0,
  vehicle_condition_rating: 0,
  service_quality_rating: 0,
  value_for_money_rating: 0,
  comments: '',
  would_recommend: true,
  had_issues: false,
  issue_description: ''
})

// Computed properties
/*const activeBookingsCount = computed(() =>
  props.myBookings.filter(b => ['confirmed', 'ACTIVE'].includes(b.status)).length
)

const completedBookingsCount = computed(() => 
  props.myBookings.filter(b => b.status === 'completed').length
)

const totalSpent = computed(() =>
  props.myBookings
    .filter(b => ['completed', 'confirmed', 'ACTIVE'].includes(b.status))
    .reduce((sum, b) => sum + parseFloat(b.total_amount), 0)
)*/

const filteredBookings = computed(() => {
  let filtered = [...props.myBookings]

  // Date range filter
  if (dateRange.value && dateRange.value.length === 2) {
    const [startDate, endDate] = dateRange.value
    filtered = filtered.filter(booking => {
      const bookingStart = dayjs(booking.startDate)
      const bookingEnd = dayjs(booking.endDate)
      return bookingStart.isBetween(startDate, endDate, 'day', '[]') ||
             bookingEnd.isBetween(startDate, endDate, 'day', '[]')
    })
  }

  // Sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return dayjs(b.startDate).valueOf() - dayjs(a.startDate).valueOf()
      case 'date-asc':
        return dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf()
      case 'price-desc':
        return b.totalPrice - a.totalPrice
      case 'price-asc':
        return a.totalPrice - b.totalPrice
      default:
        return 0
    }
  })

  return filtered
})

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredBookings.value.slice(start, end)
})

// Methods
const formatDate = (dateString) => {
  return dayjs(dateString).format('DD/MM/YYYY')
}

const getBookingProgress = (booking) => {
  const now = dayjs()
  const start = dayjs(booking.start_date)
  const end = dayjs(booking.end_date)
  
  if (now.isBefore(start)) return 0
  if (now.isAfter(end)) return 100
  
  const total = end.diff(start, 'day')
  const elapsed = now.diff(start, 'day')
  
  return Math.round((elapsed / total) * 100)
}

const handleDateRangeChange = (dates) => {
  dateRange.value = dates
}

const handleSortChange = (value) => {
  sortBy.value = value
}

const refreshBookings = () => {
  emit('refreshBookings')
}

// Rating methods
const rateRental = (booking) => {
  selectedBooking.value = booking
  ratingForm.value = {
    rental: booking.id,
    overall_rating: 0,
    vehicle_condition_rating: 0,
    service_quality_rating: 0,
    value_for_money_rating: 0,
    comments: '',
    would_recommend: true,
    had_issues: false,
    issue_description: ''
  }
  ratingModalVisible.value = true
}

const closeRatingModal = () => {
  ratingModalVisible.value = false
  selectedBooking.value = null
  ratingForm.value = {
    rental: 0,
    overall_rating: 0,
    vehicle_condition_rating: 0,
    service_quality_rating: 0,
    value_for_money_rating: 0,
    comments: '',
    would_recommend: true,
    had_issues: false,
    issue_description: ''
  }
}

const getRatingText = (rating) => {
  if (rating === 0) return ''
  if (rating <= 1) return 'Muito Ruim'
  if (rating <= 2) return 'Ruim'
  if (rating <= 3) return 'Regular'
  if (rating <= 4) return 'Bom'
  return 'Excelente'
}

const onIssuesChange = (e) => {
  if (!e.target.value) {
    ratingForm.value.issue_description = ''
  }
}

const submitRating = async () => {
  try {
    submittingRating.value = true
    
    // Validação básica
    if (ratingForm.value.overall_rating === 0 || 
        ratingForm.value.vehicle_condition_rating === 0 ||
        ratingForm.value.service_quality_rating === 0 ||
        ratingForm.value.value_for_money_rating === 0) {
      throw new Error('Todas as avaliações são obrigatórias!')
    }

    if (ratingForm.value.had_issues && !ratingForm.value.issue_description.trim()) {
      throw new Error('Por favor, descreva os problemas encontrados!')
    }

    // Aqui você faria a chamada para a API
    console.log('Enviando avaliação:', ratingForm.value)
    
    // Simular delay da API
    const result = await vehicleService.createVehicleEvaluations(ratingForm.value)
    console.log('Avaliação enviada com sucesso:', result)
    
    // Sucesso
    const { message } = await import('ant-design-vue')
    message.success('Avaliação enviada com sucesso!')
    
    closeRatingModal()
    
  } catch (error) {
    console.error('Erro ao enviar avaliação:', error)
    const { message } = await import('ant-design-vue')
    message.error(error.message || 'Erro ao enviar avaliação. Tente novamente.')
  } finally {
    submittingRating.value = false
  }
}

// Navigation methods
const navigateToSearch = () => {
  router.push('/search')
}

const navigateToVehicleDetails = (booking) => {
  if (booking.id) {
    window.open(`/vehicle/${booking.vehicle_info.id}`, '_blank');
  }
}

/*const navigateToMessages = () => {
  router.push('/owner-dashboard?tab=messages')
}*/
</script>

<style scoped>
/* My Bookings Content - Integrado com OwnerDashboard */
.my-bookings-content {
  padding: 0;
  background: transparent;
}

/* Section Styling */
.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Header Section */
.header-section {
  margin-bottom: 32px;
}

.quick-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--stat-gradient);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.stat-card.primary {
  --stat-gradient: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.stat-card.accent {
  --stat-gradient: linear-gradient(135deg, #059669, #047857);
}

.stat-card.secondary {
  --stat-gradient: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.stat-icon-bg {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--stat-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  flex-shrink: 0;
}

.stat-content .stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-content .stat-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

/* Actions Section */
.actions-section {
  margin-bottom: 32px;
}

.actions-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
}

.actions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.actions-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.new-booking-btn {
  border-radius: 12px;
  font-weight: 600;
  background: var(--btn-bg, linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%));
  border: none;
}

.new-booking-btn:hover {
  background: var(--btn-bg-hover, linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%)) !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

/* Bookings Section */
.bookings-section {
  margin-bottom: 32px;
}

.bookings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.bookings-header h4 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

/* Bookings Grid */
.bookings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
}

.booking-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.booking-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--status-gradient);
}

.booking-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.booking-card.pending {
  --status-gradient: linear-gradient(135deg, #f59e0b, #d97706);
}

.booking-card.confirmed {
  --status-gradient: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.booking-card.active {
  --status-gradient: linear-gradient(135deg, #059669, #047857);
}

.booking-card.completed {
  --status-gradient: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.booking-card.cancelled {
  --status-gradient: linear-gradient(135deg, #dc2626, #b91c1c);
}

/* Vehicle Cover */
.vehicle-cover {
  height: 140px;
  background: linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.vehicle-icon-wrapper {
  font-size: 48px;
  color: #6b7280;
}

.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  z-index: 2
}

.status-badge.pending {
  color: #d97706;
}

.status-badge.confirmed {
  color: #1d4ed8;
}

.status-badge.active {
  color: #047857;
}

.status-badge.completed {
  color: #7c3aed;
}

.status-badge.cancelled {
  color: #b91c1c;
}

/* Booking Content */
.booking-header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.vehicle-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vehicle-title h5 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.booking-id {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

/* Owner Section */
.owner-section {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.owner-avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  flex-shrink: 0;
}

.owner-info {
  flex: 1;
}

.owner-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 2px 0;
}

.owner-location {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

/* Period Section */
.period-section {
  padding: 16px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.period-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.period-item .anticon {
  color: #667eea;
  font-size: 14px;
}

.period-info {
  display: flex;
  flex-direction: column;
}

.period-label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
}

.period-dates {
  font-size: 13px;
  color: #111827;
  font-weight: 600;
}

/* Summary Section */
.summary-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 8px;
}

.summary-item .anticon {
  color: #667eea;
  font-size: 14px;
}

.summary-info {
  display: flex;
  flex-direction: column;
}

.summary-label {
  font-size: 10px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
}

.summary-value {
  font-size: 12px;
  color: #111827;
  font-weight: 600;
}

.summary-value.price {
  color: #059669;
  font-size: 14px;
}

/* Progress Section */
.progress-section {
  padding: 16px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  color: #6b7280;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #059669, #047857);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Card Actions */
.card-actions {
  padding: 16px 24px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  min-width: 90px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
}

.empty-icon {
  font-size: 48px;
  color: #d1d5db;
  margin-bottom: 16px;
}

.empty-state h4 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 20px 0;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

/* Responsive Design */
@media (max-width: 768px) {
  .bookings-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .bookings-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .summary-section {
    grid-template-columns: 1fr;
  }
  
  .vehicle-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .card-actions {
    flex-direction: column;
  }
  
  .action-btn {
    flex: none;
  }
  
  .booking-card {
    margin: 0 -4px;
  }
}


.breadcrumb-modern {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 14px;
}

.breadcrumb-link {
  color: rgba(22, 21, 21, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: black;
}

.breadcrumb-separator {
  color: rgba(8, 8, 8, 0.6);
  margin: 0 4px;
}

.breadcrumb-current {
  color: black;
  font-weight: 500;
}

.vehicle-icon-similar {
  font-size: 48px;
  color: white;
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

/* Rating Modal Styles */
.rating-modal-content {
  max-height: 70vh;
  overflow-y: auto;
}

.vehicle-info-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #e5e7eb;
}

.vehicle-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
  overflow: hidden;
}

.vehicle-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vehicle-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.vehicle-details p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.rating-form {
  padding: 8px 0;
}

.rating-form .ant-form-item {
  margin-bottom: 20px;
}

.rating-form .ant-form-item-label > label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.custom-rate {
  font-size: 24px;
  margin-right: 12px;
  margin-top: -5px;
}

.custom-rate .ant-rate-star {
  margin-right: 4px;
}

.rating-text {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  margin-left: 8px;
}

.rating-form .ant-radio-group {
  width: 100%;
}

.rating-form .ant-radio-wrapper {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  width: 100%;
}

.rating-form .ant-radio-wrapper:hover {
  border-color: #667eea;
  background: #f8fafc;
}

.rating-form .ant-radio-wrapper-checked {
  border-color: #667eea;
  background: #f0f4ff;
}

.rating-form .ant-textarea {
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.rating-form .ant-textarea:hover,
.rating-form .ant-textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.form-actions .ant-btn {
  border-radius: 8px;
  font-weight: 500;
  min-width: 100px;
  height: 40px;
}

.form-actions .ant-btn-primary {
  background: var(--btn-bg, linear-gradient(135deg, #667eea, #764ba2));
  border: none;
}

.form-actions .ant-btn-primary:hover {
  background: var(--btn-bg-hover, linear-gradient(135deg, #5a67d8, #6b46c1)) !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Responsive Modal */
@media (max-width: 768px) {
  .vehicle-info-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .rating-form .ant-radio-wrapper {
    font-size: 14px;
  }
  
  .custom-rate {
    font-size: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .ant-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .rating-modal-content {
    padding: 8px;
  }
  
  .vehicle-info-header {
    padding: 12px;
    margin-bottom: 16px;
  }
  
  .custom-rate {
    font-size: 18px;
  }
  
  .rating-text {
    font-size: 12px;
  }
}
</style>
