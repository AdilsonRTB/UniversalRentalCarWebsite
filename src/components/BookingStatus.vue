<template>
  <div class="booking-status-container">
    <HeaderPage />

    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
    <!-- Header Section -->
    <section class="header-section">
      <div class="header-content">
        <h1 class="page-title">Estado do Aluguel</h1>
        <p class="page-subtitle">
          Insira o número do seu aluguel e email para consultar o estado da sua reserva
        </p>
      </div>
    </section>

    <!-- Search Form Section -->
    <section class="search-section">
      <div class="search-card">
        <div class="search-header">
          <SearchOutlined class="search-icon" />
          <h3>Consultar Reserva</h3>
        </div>
        
        <a-form
          ref="formRef"
          :model="searchForm"
          :rules="formRules"
          layout="vertical"
          @finish="handleSearch"
          class="search-form"
        >
          <div class="form-row">
            <a-form-item
              name="bookingNumber"
              label="Número do Aluguel"
              class="form-item"
            >
              <a-input
                v-model:value="searchForm.bookingNumber"
                size="large"
                placeholder="Ex: #12345"
                :prefix="() => h(NumberOutlined, { style: { color: '#8b5cf6' } })"
                class="form-input"
              />
            </a-form-item>
            
            <a-form-item
              name="email"
              label="Email"
              class="form-item"
            >
              <a-input
                v-model:value="searchForm.email"
                size="large"
                placeholder="seu.email@exemplo.com"
                :prefix="() => h(MailOutlined, { style: { color: '#8b5cf6' } })"
                class="form-input"
              />
            </a-form-item>
          </div>
          
          <div class="form-actions">
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              :loading="isLoading"
              class="search-btn"
            >
              <SearchOutlined v-if="!isLoading" />
              {{ isLoading ? 'Consultando...' : 'Consultar Reserva' }}
            </a-button>

            <div class="or-divider">
              <span>ou</span>
            </div>
            
            <a-button
              @click="openQRScanner"
              size="large"
              class="qr-btn"
            >
              <QrcodeOutlined />
              Escanear QR Code
            </a-button>
          </div>
        </a-form>
      </div>
    </section>

    <!-- Results Section -->
    <section v-if="searchResult" class="results-section">
      <div class="results-header">
        <h3>Resultado da Consulta</h3>
        <a-button @click="clearSearch" type="text">
          <CloseOutlined /> Limpar
        </a-button>
      </div>
      
      <!-- Booking Card (similar to MyBookingsTab) -->
      <div class="booking-result">
        <div 
          class="booking-card"
          :class="{ 
            'pending': searchResult.status === 'PENDING',
            'confirmed': searchResult.status === 'CONFIRMED',
            'active': searchResult.status === 'ACTIVE',
            'completed': searchResult.status === 'COMPLETED',
            'cancelled': searchResult.status === 'CANCELLED'
          }"
        >
          <!-- Vehicle Image/Icon -->
          <div class="vehicle-cover">
            <div class="vehicle-icon-wrapper">
              <CarOutlined class="vehicle-icon-similar" v-if="!searchResult.vehicle_info?.photo"/>
              <img 
                :src="url + searchResult.vehicle_info?.photo" 
                :alt="`${searchResult.vehicle_info?.brand} ${searchResult.vehicle_info?.model}`" 
                class="vehicle-photo-modern" 
                v-else
              />
            </div>
            <div class="status-badge" :class="searchResult.status?.toLowerCase()">
              {{ getStatusDisplay(searchResult.status) }}
            </div>
          </div>

          <!-- Booking Header -->
          <div class="booking-header">
            <div class="vehicle-title">
              <h5>{{ searchResult.vehicle_info?.brand }} {{ searchResult.vehicle_info?.model }}</h5>
              <span class="booking-id">#{{ searchResult.id || searchResult.vehicle_info?.year }}</span>
            </div>
          </div>

          <!-- Rental Period -->
          <div class="period-section">
            <div class="period-item">
              <CalendarOutlined />
              <div class="period-info">
                <span class="period-label">Período</span>
                <span class="period-dates">{{ formatDate(searchResult.start_date) }} - {{ formatDate(searchResult.end_date) }}</span>
              </div>
            </div>
          </div>

          <!-- Booking Summary -->
          <div class="summary-section">
            <div class="summary-item">
              <DollarOutlined />
              <div class="summary-info">
                <span class="summary-label">Valor Total</span>
                <span class="summary-value price">{{ searchResult.total_amount }} CVE</span>
              </div>
            </div>
            <div class="summary-item">
              <ClockCircleOutlined />
              <div class="summary-info">
                <span class="summary-label">Duração</span>
                <span class="summary-value">{{ searchResult.days_duration || calculateDuration(searchResult.start_date, searchResult.end_date) }} dia(s)</span>
              </div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="progress-section">
            <div class="progress-info">
              <span>Progresso da viagem</span>
              <span>{{ getBookingProgress(searchResult) }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: getBookingProgress(searchResult) + '%' }"></div>
            </div>
          </div>

          <!-- Customer Info -->
          <div class="customer-section">
            <div class="customer-item">
              <UserOutlined />
              <div class="customer-info">
                <span class="customer-label">Cliente</span>
                <span class="customer-value">{{ searchResult.customer_name }} </span>
              </div>
            </div>
            <div class="customer-item">
              <PhoneOutlined />
              <div class="customer-info">
                <span class="customer-label">Telefone</span>
                <span class="customer-value">{{ searchResult.customer_info?.phone_number || 'Não informado' }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card-actions">
            <a-button @click="printBooking" class="action-btn">
              <PrinterOutlined /> Imprimir
            </a-button>
            <a-button @click="downloadBooking" class="action-btn">
              <DownloadOutlined /> Download
            </a-button>
            <a-button 
              v-if="searchResult.status === 'CONFIRMED'"
              type="primary" 
              class="action-btn"
            >
              <MessageOutlined /> Contatar
            </a-button>
          </div>
        </div>
      </div>
    </section>

    <!-- Empty State -->
    <section v-if="showEmptyState" class="empty-state-section">
      <div class="empty-state">
        <div class="empty-icon">
          <InboxOutlined />
        </div>
        <h4>Nenhuma reserva encontrada</h4>
        <p>
          Não foi possível encontrar uma reserva com os dados fornecidos. 
          Verifique se o número do aluguel e o email estão corretos.
        </p>
        <a-button @click="clearSearch" type="primary">
          <SearchOutlined /> Nova Consulta
        </a-button>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-overlay">
      <a-spin size="large" />
      <p>Consultando reserva...</p>
    </div>
    
    <!-- QR Code Scanner Component -->
    <QRCodeScanner
      ref="qrScannerRef"
      @qr-code-detected="handleQRCodeDetected"
    />
  </div>
</template>

<script setup>
import {
  SearchOutlined,
  NumberOutlined,
  MailOutlined,
  CarOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  UserOutlined,
  PhoneOutlined,
  CloseOutlined,
  InboxOutlined,
  PrinterOutlined,
  DownloadOutlined,
  MessageOutlined,
  QrcodeOutlined
} from '@ant-design/icons-vue'

import dayjs from 'dayjs'
import { ref, reactive, computed, h } from 'vue'
import { message } from 'ant-design-vue'
import QRCodeScanner from './QRCodeScanner.vue'
import { baseURL } from '../services/api'
import HeaderPage from './HeaderPage.vue'
import {bookingService} from '../services/api'


const url = computed(() => baseURL)

// Reactive data
const isLoading = ref(false)
const searchResult = ref(null)
const showEmptyState = ref(false)
const formRef = ref(null)

const searchForm = reactive({
  bookingNumber: '',
  email: ''
})

// Form validation rules
const formRules = {
  bookingNumber: [
    { required: true, message: 'Por favor, insira o número do aluguel' },
    { min: 1, message: 'O número do aluguel deve ter pelo menos 3 caracteres' }
  ],
  email: [
    { required: true, message: 'Por favor, insira o seu email' },
    { type: 'email', message: 'Por favor, insira um email válido' }
  ]
}

// Methods
const handleSearch = async (values) => {
  try {
    isLoading.value = true
    showEmptyState.value = false
    searchResult.value = null
    
    const result = await bookingService.getRentalDetails(
      values.bookingNumber,
      values.email
    )

    searchResult.value = result.data
    message.success('Reserva encontrada com sucesso!')
    
  } catch (error) {
    console.error('Search error:', error)
    showEmptyState.value = true
    message.error('Reserva não encontrada. Verifique os dados e tente novamente.')
  } finally {
    isLoading.value = false
  }
}

const clearSearch = () => {
  searchResult.value = null
  showEmptyState.value = false
  searchForm.bookingNumber = ''
  searchForm.email = ''
  formRef.value?.resetFields()
}

const formatDate = (dateString) => {
  return dayjs(dateString).format('DD/MM/YYYY')
}

const calculateDuration = (startDate, endDate) => {
  return dayjs(endDate).diff(dayjs(startDate), 'day')
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

const getStatusDisplay = (status) => {
  const statusMap = {
    'PENDING': 'Pendente',
    'CONFIRMED': 'Confirmada',
    'ACTIVE': 'Ativa',
    'COMPLETED': 'Concluída',
    'CANCELLED': 'Cancelada'
  }
  return statusMap[status] || status
}

const printBooking = () => {
  window.print()
}

const downloadBooking = () => {
  // Implement download functionality
}

// QR Scanner functionality
const qrScannerRef = ref(null)

const openQRScanner = () => {
  if (qrScannerRef.value) {
    qrScannerRef.value.open()
  }
}

const handleQRCodeDetected = (qrData) => {
  // Preencher o formulário com os dados do QR code
  if (qrData.bookingNumber) {
    searchForm.bookingNumber = qrData.bookingNumber
  }
  if (qrData.email) {
    searchForm.email = qrData.email
  }
  
  // Se ambos os campos estão preenchidos, fazer a busca automaticamente
  if (searchForm.bookingNumber && searchForm.email) {
    message.success('Dados do QR Code carregados! Realizando consulta...')
    handleSearch()
  } else {
    message.success('Dados do QR Code carregados!')
  }
}
</script>

<style scoped>
.background-decoration {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: -1;
  pointer-events: none;
}
.circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%);
  backdrop-filter: blur(20px);
  opacity: 0.6;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 20%;
  left: 10%;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 70%;
  right: 15%;
  animation: float 8s ease-in-out infinite reverse;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 10%;
  left: 20%;
  animation: float 7s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}
/* Main Container */
.booking-status-container {
  min-height: 100vh;
  background: white !important;
  padding: 40px 20px;
  -margin-top: 80px;
  position: relative;
  z-index: 10;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 10;
  margin-top: 80px;
}

.header-content {
  max-width: 600px;
  margin: 0 auto;
}

.page-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}

/* Search Section */
.search-section {
  max-width: 800px;
  margin: 0 auto 40px auto;
  position: relative;
  z-index: 10;
}

.search-card {
  background: whitesmoke;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  text-align: center;
  justify-content: center;
}

.search-icon {
  font-size: 24px;
  color: #667eea;
}

.search-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.search-form {
  width: 100%;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.form-item {
  margin-bottom: 0;
}

.form-item :deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-input {
  border-radius: 12px;
}

.form-input :deep(.ant-input) {
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  padding: 12px 16px;
  transition: all 0.3s ease;
  font-size: 16px;
}

.form-input :deep(.ant-input:focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  text-align: center;
}

.search-btn {
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%) !important;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  height: 50px;
  padding: 0 32px;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

/* Results Section */
.results-section {
  max-width: 600px;
  margin: 0 auto 40px auto;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.results-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

/* Booking Card Styles (copied from MyBookingsTab) */
.booking-result {
  display: flex;
  justify-content: center;
}

.booking-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  width: 100%;
  max-width: 500px;
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
  z-index: 2;
}

.status-badge.pending { color: #d97706; }
.status-badge.confirmed { color: #1d4ed8; }
.status-badge.active { color: #047857; }
.status-badge.completed { color: #7c3aed; }
.status-badge.cancelled { color: #b91c1c; }

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

/* Customer Section */
.customer-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.customer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 8px;
}

.customer-item .anticon {
  color: #667eea;
  font-size: 14px;
}

.customer-info {
  display: flex;
  flex-direction: column;
}

.customer-label {
  font-size: 10px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
}

.customer-value {
  font-size: 12px;
  color: #111827;
  font-weight: 600;
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
.empty-state-section {
  max-width: 500px;
  margin: 0 auto;
}

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
  line-height: 1.5;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.loading-overlay p {
  color: white;
  margin-top: 16px;
  font-size: 16px;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .booking-status-container {
    padding: 20px 16px;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .search-card {
    padding: 24px 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .search-btn {
    width: 100%;
  }
  
  .results-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .summary-section,
  .customer-section {
    grid-template-columns: 1fr;
  }
  
  .card-actions {
    flex-direction: column;
  }
  
  .action-btn {
    flex: none;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }
  
  .search-card {
    padding: 20px 16px;
  }
  
  .booking-card {
    margin: 0 -4px;
  }
  
  .vehicle-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>

<style scoped>
/* Main Container */
.booking-status-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 40px 20px;
}

/* Header Section */
.header-section {
  text-align: center;
  margin-bottom: 40px;
}

.header-content {
  max-width: 600px;
  margin: 0 auto;
}

.page-title {
  font-size: 36px;
  font-weight: 900;
  color: #1a202c;
  margin: 0 0 16px 0;

}

.page-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}

/* Search Section */
.search-section {
  max-width: 800px;
  margin: 0 auto 40px auto;
}

.search-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  text-align: center;
  justify-content: center;
}

.search-icon {
  font-size: 24px;
  color: #667eea;
}

.search-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.search-form {
  width: 100%;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.form-item {
  margin-bottom: 0;
}

.form-item :deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-input {
  border-radius: 12px;
}

.form-input :deep(.ant-input) {
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  padding: 12px 16px;
  transition: all 0.3s ease;
  font-size: 16px;
}

.form-input :deep(.ant-input:focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  text-align: center;
}

.search-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  height: 50px;
  padding: 0 32px;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: linear-gradient(135deg, #5a67d8, #6b46c1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

/* Results Section */
.results-section {
  max-width: 600px;
  margin: 0 auto 40px auto;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.results-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

/* Booking Card Styles (copied from MyBookingsTab) */
.booking-result {
  display: flex;
  justify-content: center;
}

.booking-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  width: 100%;
  max-width: 500px;
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
  z-index: 2;
}

.status-badge.pending { color: #d97706; }
.status-badge.confirmed { color: #1d4ed8; }
.status-badge.active { color: #047857; }
.status-badge.completed { color: #7c3aed; }
.status-badge.cancelled { color: #b91c1c; }

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

/* Customer Section */
.customer-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.customer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 8px;
}

.customer-item .anticon {
  color: #667eea;
  font-size: 14px;
}

.customer-info {
  display: flex;
  flex-direction: column;
}

.customer-label {
  font-size: 10px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
}

.customer-value {
  font-size: 12px;
  color: #111827;
  font-weight: 600;
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
.empty-state-section {
  max-width: 500px;
  margin: 0 auto;
}

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
  line-height: 1.5;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.loading-overlay p {
  color: white;
  margin-top: 16px;
  font-size: 16px;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .booking-status-container {
    padding: 20px 16px;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .search-card {
    padding: 24px 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .search-btn {
    width: 100%;
  }
  
  .results-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .summary-section,
  .customer-section {
    grid-template-columns: 1fr;
  }
  
  .card-actions {
    flex-direction: column;
  }
  
  .action-btn {
    flex: none;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }
  
  .search-card {
    padding: 20px 16px;
  }
  
  .booking-card {
    margin: 0 -4px;
  }
  
  .vehicle-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
