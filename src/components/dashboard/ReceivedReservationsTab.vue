<template>
  <div class="received-reservations-content">
    <!-- Header Section -->
    <section class="header-section">
      <h3 class="section-title">
        <CalendarOutlined />
        Reservas Recebidas
      </h3>
      
      <!-- Quick Stats -->
      <div class="quick-stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon-bg">
            <ClockCircleOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ pendingCount }}</div>
            <div class="stat-label">Pendentes</div>
          </div>
        </div>
        
        <div class="stat-card accent">
          <div class="stat-icon-bg">
            <CheckCircleOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ confirmedCount }}</div>
            <div class="stat-label">Confirmadas</div>
          </div>
        </div>
        
        <div class="stat-card secondary">
          <div class="stat-icon-bg">
            <DollarOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ formatCurrency(totalRevenue) }}</div>
            <div class="stat-label">Receita Total</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="filters-section">
      <div class="filters-card">
        <div class="filters-header">
          <h4>Filtros</h4>
          <a-button size="small" @click="clearFilters" v-if="hasActiveFilters">
            <DeleteOutlined /> Limpar
          </a-button>
        </div>
        
        <div class="filters-grid">
          <div class="filter-item">
            <label>Status</label>
            <a-select v-model:value="statusFilter" placeholder="Todos os status" style="width: 100%">
              <a-select-option value="">Todos</a-select-option>
              <a-select-option value="PENDING">Pendente</a-select-option>
              <a-select-option value="CONFIRMED">Confirmada</a-select-option>
              <a-select-option value="CANCELLED">Cancelada</a-select-option>
              <a-select-option value="COMPLETED">Concluída</a-select-option>
            </a-select>
          </div>
          
          <div class="filter-item">
            <label>Data</label>
            <a-date-picker
              v-model:value="dateFilter"
              placeholder="Filtrar por data"
              format="DD/MM/YYYY"
              style="width: 100%"
            />
          </div>
          
          <div class="filter-item">
            <label>Cliente</label>
            <a-input 
              v-model:value="clientFilter" 
              placeholder="Nome do cliente"
              style="width: 100%"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Reservations Grid -->
    <section class="reservations-section">
      <div class="reservations-header">
        <h4>{{ filteredReservations.length }} reserva(s) encontrada(s)</h4>
        <a-space>
          <a-button @click="refreshReservations">
            <ReloadOutlined /> Atualizar
          </a-button>
        </a-space>
      </div>

      <div class="reservations-grid" v-if="filteredReservations.length > 0">
        <div 
          v-for="reservation in paginatedReservations" 
          :key="reservation.id" 
          class="reservation-card"
          :class="{ 
            'pending': reservation.status === 'PENDING',
            'confirmed': reservation.status === 'CONFIRMED',
            'cancelled': reservation.status === 'CANCELLED',
            'completed': reservation.status === 'COMPLETED'
          }"
        >
          <!-- Card Header -->
          <div class="card-header">
            <div class="reservation-id">
              <span class="id-label">ID:</span>
              <span class="id-value">#{{ reservation.id }}</span>
            </div>
            <div class="status-badge" :class="reservation.status.toLowerCase()">
              {{ getStatusText(reservation.status) }}
            </div>
          </div>

          <!-- Client Info -->
          <div class="client-section">
            <div class="client-avatar">
              <UserOutlined />
            </div>
            <div class="client-info">
              <h5 class="client-name">{{ reservation.clientName }}</h5>
              <p class="client-details">{{ reservation.clientEmail || 'Email não informado' }}</p>
            </div>
          </div>

          <!-- Vehicle Info -->
          <div class="vehicle-section">
            <div class="vehicle-icon">
              <CarOutlined />
            </div>
            <div class="vehicle-info">
              <h5 class="vehicle-name">{{ reservation.vehicleBrand }} {{ reservation.vehicleModel }}</h5>
              <p class="vehicle-details">{{ reservation.vehicleYear || 'Ano não informado' }}</p>
            </div>
          </div>

          <!-- Rental Period -->
          <div class="period-section">
            <div class="period-item">
              <CalendarOutlined />
              <div class="period-info">
                <span class="period-label">Início</span>
                <span class="period-date">{{ formatDate(reservation.startDate) }}</span>
              </div>
            </div>
            <div class="period-separator">→</div>
            <div class="period-item">
              <CalendarOutlined />
              <div class="period-info">
                <span class="period-label">Fim</span>
                <span class="period-date">{{ formatDate(reservation.endDate) }}</span>
              </div>
            </div>
          </div>

          <!-- Price & Duration -->
          <div class="summary-section">
            <div class="summary-item">
              <DollarOutlined />
              <div class="summary-info">
                <span class="summary-label">Valor Total</span>
                <span class="summary-value price">{{ formatCurrency(reservation.totalPrice) }}</span>
              </div>
            </div>
            <div class="summary-item">
              <ClockCircleOutlined />
              <div class="summary-info">
                <span class="summary-label">Duração</span>
                <span class="summary-value">{{ reservation.totalDays }} dia(s)</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="card-actions">
            <a-button type="primary" v-if="reservation.status === 'PENDING'" @click="confirmReservation(reservation)">
              <CheckOutlined /> Confirmar
            </a-button>
            <a-button @click="viewReservation(reservation)">
              <EyeOutlined /> Detalhes
            </a-button>
            <a-button danger v-if="reservation.status === 'PENDING'" @click="cancelReservation(reservation)">
              <CloseOutlined /> Recusar
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
        <p>Não há reservas que correspondam aos filtros selecionados.</p>
        <a-button @click="clearFilters" v-if="hasActiveFilters">
          Limpar Filtros
        </a-button>
      </div>

      <!-- Pagination -->
      <div class="pagination-section" v-if="filteredReservations.length > pageSize">
        <a-pagination
          v-model:current="currentPage"
          :total="filteredReservations.length"
          :pageSize="pageSize"
          :showSizeChanger="false"
          :showQuickJumper="true"
          :showTotal="(total, range) => `${range[0]}-${range[1]} de ${total} reservas`"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { 
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  DeleteOutlined,
  ReloadOutlined,
  UserOutlined,
  CarOutlined,
  CheckOutlined,
  EyeOutlined,
  CloseOutlined,
  InboxOutlined
} from '@ant-design/icons-vue'

import { ref, computed, defineProps, defineEmits } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  receivedReservations: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['confirmReservation', 'cancelReservation', 'viewReservation', 'refreshReservations'])

// Filters
const statusFilter = ref('')
const dateFilter = ref(null)
const clientFilter = ref('')

// Pagination
const currentPage = ref(1)
const pageSize = ref(9)

// Computed properties
const pendingCount = computed(() => 
  props.receivedReservations.filter(r => r.status === 'PENDING').length
)

const confirmedCount = computed(() => 
  props.receivedReservations.filter(r => r.status === 'CONFIRMED').length
)

const totalRevenue = computed(() => 
  props.receivedReservations
    .filter(r => r.status === 'CONFIRMED' || r.status === 'COMPLETED')
    .reduce((sum, r) => sum + r.totalPrice, 0)
)

const hasActiveFilters = computed(() => 
  statusFilter.value || dateFilter.value || clientFilter.value
)

const filteredReservations = computed(() => {
  let filtered = props.receivedReservations

  if (statusFilter.value) {
    filtered = filtered.filter(reservation => reservation.status === statusFilter.value)
  }

  if (dateFilter.value) {
    const filterDate = dayjs(dateFilter.value).format('YYYY-MM-DD')
    filtered = filtered.filter(reservation => 
      dayjs(reservation.startDate).format('YYYY-MM-DD') === filterDate ||
      dayjs(reservation.endDate).format('YYYY-MM-DD') === filterDate
    )
  }

  if (clientFilter.value) {
    filtered = filtered.filter(reservation => 
      reservation.clientName.toLowerCase().includes(clientFilter.value.toLowerCase())
    )
  }

  return filtered
})

const paginatedReservations = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredReservations.value.slice(start, end)
})

// Methods
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YYYY')
}

const getStatusText = (status) => {
  const texts = {
    'PENDING': 'Pendente',
    'CONFIRMED': 'Confirmada',
    'CANCELLED': 'Cancelada',
    'COMPLETED': 'Concluída'
  }
  return texts[status] || status
}

const clearFilters = () => {
  statusFilter.value = ''
  dateFilter.value = null
  clientFilter.value = ''
  currentPage.value = 1
}

const refreshReservations = () => {
  emit('refreshReservations')
}

const confirmReservation = (reservation) => {
  emit('confirmReservation', reservation)
}

const cancelReservation = (reservation) => {
  emit('cancelReservation', reservation)
}

const viewReservation = (reservation) => {
  emit('viewReservation', reservation)
}
</script>

<style scoped>
/* Received Reservations Content - Integrado com OwnerDashboard */
.received-reservations-content {
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
  --stat-gradient: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-card.accent {
  --stat-gradient: linear-gradient(135deg, #059669, #047857);
}

.stat-card.secondary {
  --stat-gradient: linear-gradient(135deg, #3b82f6, #1d4ed8);
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

/* Filters Section */
.filters-section {
  margin-bottom: 32px;
}

.filters-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filters-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
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

/* Reservations Section */
.reservations-section {
  margin-bottom: 32px;
}

.reservations-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.reservations-header h4 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

/* Reservations Grid */
.reservations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.reservation-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.reservation-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--status-gradient);
}

.reservation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.reservation-card.pending {
  --status-gradient: linear-gradient(135deg, #f59e0b, #d97706);
}

.reservation-card.confirmed {
  --status-gradient: linear-gradient(135deg, #059669, #047857);
}

.reservation-card.cancelled {
  --status-gradient: linear-gradient(135deg, #dc2626, #b91c1c);
}

.reservation-card.completed {
  --status-gradient: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.reservation-id .id-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.reservation-id .id-value {
  font-size: 14px;
  color: #111827;
  font-weight: 700;
  margin-left: 4px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.confirmed {
  background: #d1fae5;
  color: #047857;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #b91c1c;
}

.status-badge.completed {
  background: #dbeafe;
  color: #1d4ed8;
}

/* Client & Vehicle Sections */
.client-section,
.vehicle-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.client-avatar,
.vehicle-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  flex-shrink: 0;
}

.client-info,
.vehicle-info {
  flex: 1;
}

.client-name,
.vehicle-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 2px 0;
}

.client-details,
.vehicle-details {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

/* Period Section */
.period-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 12px;
}

.period-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
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
  font-size: 10px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
}

.period-date {
  font-size: 12px;
  color: #111827;
  font-weight: 600;
}

.period-separator {
  color: #9ca3af;
  font-size: 16px;
  font-weight: 600;
}

/* Summary Section */
.summary-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
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

/* Card Actions */
.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.card-actions .ant-btn {
  flex: 1;
  min-width: 80px;
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
  .reservations-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .reservations-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .summary-section {
    grid-template-columns: 1fr;
  }
  
  .period-section {
    flex-direction: column;
    gap: 8px;
  }
  
  .period-separator {
    transform: rotate(90deg);
  }
}

@media (max-width: 480px) {
  .card-actions {
    flex-direction: column;
  }
  
  .card-actions .ant-btn {
    flex: none;
  }
  
  .reservation-card {
    padding: 16px;
  }
}
</style>
