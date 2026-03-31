<template>
  <div class="owner-dashboard-modern">
    <a-spin :spinning="loading" size="large">
      <HeaderPage/>
      
      <!-- Hero Dashboard Section -->
      <section class="hero-dashboard-section" >
        <div class="hero-dashboard-container">
          <div class="hero-dashboard-content">
            <div class="welcome-section">
              <div class="user-welcome">
                <div class="welcome-avatar">
                  <a-avatar size="80" class="avatar-gradient">
                    <UserOutlined />
                  </a-avatar>
                  <div class="status-indicator"></div>
                </div>
                <div class="welcome-text">
                  <h1 class="welcome-title">{{ t('dashboard.welcomeTitle', { name: `${customer?.first_name} ${customer?.last_name}` }) }}</h1>
                  <!--p class="welcome-subtitle">{{ t('dashboard.manageReservations') }}</!--p-->
                </div>
              </div>
              
              <div class="quick-stats">
                <div class="stat-card-hero">
                  <div class="stat-icon">
                    <BookOutlined />
                  </div>
                  <div class="stat-info">
                    <span class="stat-number">{{ customer?.rental_count }}</span>
                    <span class="stat-label">{{ t('dashboard.totalReservationsLabel') }}</span>
                  </div>
                </div>
                <div class="stat-card-hero">
                  <div class="stat-icon">
                    <BookOutlined />
                  </div>
                  <div class="stat-info">
                    <span class="stat-number">{{ customer?.active_rentals }}</span>
                    <span class="stat-label">{{ t('dashboard.activeReservationsLabel') }}</span>
                  </div>
                </div>
                <!--div class="stat-card-hero">
                  <div class="stat-icon">
                    <StarOutlined />
                  </div>
                  <div class="stat-info">
                    <span class="stat-number">{{ userStats.loyaltyPoints }}</span>
                    <span class="stat-label">Pontos</span>
                  </div>
                </!--div>
                <div-- class="stat-card-hero">
                  <div class="stat-icon">
                    <TrophyOutlined />
                  </div>
                  <div class="stat-info">
                    <span class="stat-number">{{ getClientClassification() }}</span>
                    <span class="stat-label">{{ t('dashboard.classificationLabel') }}</span>
                  </div>
                </div-->
                

              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <div class="main-content-container">
        <a-row :gutter="[32, 32]">
          <!-- Main Content - Full Width -->
          <a-col :xs="24">
            <div class="main-content-modern">


              <!-- Tab Content -->
              <div class="tab-content-modern">
              <!-- Overview Tab -->
              <OverviewTab
                v-if="activeTab === 'overview'"
                :user="user"
                :userStats="userStats"
                :recentActivities="recentActivities"
                :getClientClassification="getClientClassification"
                @quickAction="handleQuickAction"
              />

              <!-- Notifications Tab -->
              <NotificationsTab
                v-if="activeTab === 'notifications'"
              />
              
              <!-- Messages Tab -->
              <MessagesTab 
                v-if="activeTab === 'messages'"
              />
              
              <!-- Client Points Tab -->
              <ClientPointsTab 
                v-if="activeTab === 'client-points'"
                :user="user"
                :userStats="userStats"
                @useDiscount="useDiscount"
              />
              
              <!-- Client Rating Tab -->
              <ClientRatingTab 
                v-if="activeTab === 'client-rating'"
                :user="user"
                :getClientClassification="getClientClassification"
              />
              
              <!-- Digital Wallet Tab -->
              <DigitalWalletTab 
                v-if="activeTab === 'digital-wallet'"
                @buyPoints="buyPoints"
              />
              
              <!-- My Bookings Tab -->
              <MyBookingsTab
                v-if="activeTab === 'my-bookings'"
                :myBookings="myBookings"
                :getStatusColor="getStatusColor"
                :getStatusLabel="getStatusLabel"
                @viewBookingDetails="viewMyBookingDetails"
                @contactOwner="contactOwner"
                @cancelBooking="cancelMyBooking"
                @filterBookings="filterMyBookings"
                @refreshBookings="getRentalCustomers"
                :backgroundHero="'linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%) !important'"
              />
              <!-- Profile Tab -->
              <ProfileTab
                v-if="activeTab === 'profile'"
                :user="user"
                @updateProfile="handleUpdateProfile"
                @updatePassword="handleUpdatePassword"
              />
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    </a-spin>
    
    <!-- Modals with Modern Design -->
    <a-modal
      v-model:open="vehicleDetailsVisible"
      :title="t('dashboard.vehicleDetails')"
      :footer="null"
      width="900px"
      class="modern-modal"
    >
      <div v-if="selectedVehicle" class="modal-content-modern">
        <a-descriptions :column="2" bordered class="modern-descriptions">
          <a-descriptions-item :label="t('dashboard.brand')">{{ selectedVehicle.brand }}</a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.model')">{{ selectedVehicle.model }}</a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.year')">{{ selectedVehicle.year }}</a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.plate')">{{ selectedVehicle.licensePlate }}</a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.type')">{{ getVehicleTypeLabel(selectedVehicle.type) }}</a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.dailyRate')">R$ {{ selectedVehicle.dailyRate?.toFixed(2) }}</a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.location')">{{ selectedVehicle.location }}</a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.status')">
            <a-tag :color="selectedVehicle.available ? 'green' : 'red'" class="modern-tag">
              {{ selectedVehicle.available ? t('dashboard.available') : t('dashboard.unavailable') }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.description')" :span="2">
            {{ selectedVehicle.description || t('dashboard.noDescriptionProvided') }}
          </a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.features')" :span="2">
            <a-tag v-for="feature in selectedVehicle.features" :key="feature" color="blue" class="modern-tag">
              {{ getFeatureLabel(feature) }}
            </a-tag>
          </a-descriptions-item>
        </a-descriptions>
        
        <div class="modal-divider"></div>
        
        <h4 class="modal-section-title">{{ t('dashboard.statistics') }}</h4>
        <a-row :gutter="16" class="stats-grid-modern">
          <a-col :span="6">
            <div class="stat-card-modern">
              <a-statistic :title="t('dashboard.totalBookingsStats')" :value="selectedVehicle.totalBookings || 0" />
            </div>
          </a-col>
          <a-col :span="6">
            <div class="stat-card-modern">
              <a-statistic :title="t('dashboard.totalRevenue')" :value="selectedVehicle.totalRevenue || 0" prefix="R$" :precision="2" />
            </div>
          </a-col>
          <a-col :span="6">
            <div class="stat-card-modern">
              <a-statistic :title="t('dashboard.averageRating')" :value="selectedVehicle.rating || 0" suffix="/5" :precision="1" />
            </div>
          </a-col>
          <a-col :span="6">
            <div class="stat-card-modern">
              <a-statistic :title="t('dashboard.occupancyRate')" :value="selectedVehicle.occupancyRate || 0" suffix="%" />
            </div>
          </a-col>
        </a-row>
      </div>
    </a-modal>
    
    <!-- Reservation Details Modal -->
    <a-modal
      v-model:open="reservationDetailsVisible"
      :title="t('dashboard.reservationDetails')"
      :footer="null"
      width="800px"
      class="modern-modal"
    >
      <div v-if="selectedReservation" class="modal-content-modern">
        <a-descriptions :column="2" bordered class="modern-descriptions">
          <a-descriptions-item :label="t('dashboard.reservationId')">{{ selectedReservation.id }}</a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.status')">
            <a-tag :color="getStatusColor(selectedReservation.status)" class="modern-tag">
              {{ getStatusLabel(selectedReservation.status) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.client')">{{ selectedReservation.clientName }}</a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.contact')">{{ selectedReservation.clientPhone }}</a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.vehicle')">{{ selectedReservation.vehicleBrand }} {{ selectedReservation.vehicleModel }}</a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.plate')">{{ selectedReservation.vehiclePlate }}</a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.pickupDate')">{{ formatDate(selectedReservation.startDate) }}</a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.returnDate')">{{ formatDate(selectedReservation.endDate) }}</a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.days')">{{ selectedReservation.totalDays }}</a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.totalValue')">R$ {{ selectedReservation.totalPrice?.toFixed(2) }}</a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.createdAt')">{{ formatDateTime(selectedReservation.createdAt) }}</a-descriptions-item>
          <a-descriptions-item :label="t('dashboard.lastUpdate')">{{ formatDateTime(selectedReservation.updatedAt) }}</a-descriptions-item>
        </a-descriptions>
        
        <div class="modal-divider"></div>
        
        <div class="reservation-actions-modern">
          <a-space>
            <a-button 
              v-if="selectedReservation.status === 'PENDING'" 
              type="primary"
              class="action-btn-modern"
              @click="confirmReservation(selectedReservation)"
            >
              {{ t('dashboard.confirmReservation') }}
            </a-button>
            <a-button 
              v-if="['PENDING', 'CONFIRMED'].includes(selectedReservation.status)" 
              danger
              class="action-btn-modern"
              @click="cancelReservation(selectedReservation)"
            >
              {{ t('dashboard.cancelReservation') }}
            </a-button>
            <a-button 
              class="action-btn-modern"
              @click="contactClient(selectedReservation)"
            >
              <MessageOutlined />
              {{ t('dashboard.contactClient') }}
            </a-button>
          </a-space>
        </div>
      </div>
    </a-modal>
    
    <!-- Buy Points Modal -->
    <a-modal
      v-model:open="buyPointsModalVisible"
      :title="t('dashboard.buyPoints')"
      :footer="null"
      width="600px"
      class="modern-modal"
    >
      <div class="modal-content-modern">
        <a-form layout="vertical" @submit.prevent="buyPoints" class="modern-form">
          <a-form-item :label="t('dashboard.pointsQuantity')">
            <a-select v-model:value="buyPointsForm.amount" size="large" class="modern-select">
              <a-select-option :value="25">25 Pontos - R$ 12,50</a-select-option>
              <a-select-option :value="50">50 Pontos - R$ 25,00</a-select-option>
              <a-select-option :value="100">100 Pontos - R$ 50,00</a-select-option>
              <a-select-option :value="200">200 Pontos - R$ 100,00</a-select-option>
            </a-select>
          </a-form-item>
          
          <a-form-item :label="t('dashboard.paymentMethod')">
            <a-radio-group v-model:value="buyPointsForm.paymentMethod" class="modern-radio-group">
              <a-radio value="credit_card">{{ t('dashboard.creditCard') }}</a-radio>
              <a-radio value="debit_card">{{ t('dashboard.debitCard') }}</a-radio>
              <a-radio value="pix">{{ t('dashboard.pix') }}</a-radio>
            </a-radio-group>
          </a-form-item>
          
          <div class="points-pricing-modern">
            <a-alert 
              :message="t('dashboard.pointsEquivalent')" 
              type="info" 
              show-icon 
              class="modern-alert"
            />
            <div class="total-price-modern">
              <strong>{{ t('dashboard.total') }}: R$ {{ (buyPointsForm.amount * 0.5).toFixed(2) }}</strong>
            </div>
          </div>
          
          <a-form-item style="margin-top: 32px;">
            <a-space size="large">
              <a-button type="primary" html-type="submit" size="large" class="action-btn-modern">
                <CreditCardOutlined />
                {{ t('dashboard.buyPointsButton') }}
              </a-button>
              <a-button @click="buyPointsModalVisible = false" size="large" class="action-btn-modern">
                {{ t('dashboard.cancel') }}
              </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  UserOutlined,
  BookOutlined,
  /*StarOutlined,
  TrophyOutlined,
  MessageOutlined,
  CreditCardOutlined*/
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

// Import child components
import HeaderPage from '@/components/HeaderPage.vue'
import OverviewTab from '@/components/dashboard/OverviewTab.vue'
import NotificationsTab from '@/components/dashboard/NotificationsTab.vue'
import MessagesTab from '@/components/dashboard/MessagesTab.vue'
import ClientPointsTab from '@/components/dashboard/ClientPointsTab.vue'
import ClientRatingTab from '@/components/dashboard/ClientRatingTab.vue'
import DigitalWalletTab from '@/components/dashboard/DigitalWalletTab.vue'
import MyBookingsTab from '@/components/dashboard/MyBookingsTab.vue'
import ProfileTab from '@/components/dashboard/ProfileTab.vue'
import { authService, bookingService } from '../services/api'

const router = useRouter()
const route = useRoute()

// Internationalization
const { t } = useI18n()

const loading = ref(false)

const customer = ref(null)

// Debug logging
console.log('[OwnerDashboard] Component initializing...')
console.log('[OwnerDashboard] Current route:', route.path)
console.log('[OwnerDashboard] Query params:', route.query)

// Get active tab from query parameters
const activeTab = computed(() => {
  return route.query.tab || 'overview'
})

// Get background gradient for hero section


// Get customer datas
const getCustomerData = async () => {
  loading.value = true
  try {
    const response = await authService.me()
    customer.value = response.data
    console.log('[OwnerDashboard] Fetched customer data:', customer.value)
  } catch (error) {
    console.error('[OwnerDashboard] Error fetching customer data:', error)
    message.error(t('dashboard.errorLoadingClientData'))
  } finally {
    loading.value = false
  }
}



const userStats = ref({
  activeBookings: 2,
  totalBookings: 15,
  totalSpent: 2850.00,
  nextTripDays: 5,
  availablePoints: 12,
  totalDiscountsUsed: 3,
  totalReservations: 15,
  loyaltyPoints: 85
})

// COMMENTED OUT - Owner Stats (Future Implementation)
/*
const ownerStats = ref({
  activeVehicles: 3,
  monthlyReservations: 12,
  occupancyRate: 75,
  monthlyEarnings: 3250.00,
  availablePoints: 85,
  totalPointsSpent: 30,
  totalPointsEarned: 115
})
*/

const myBookings = ref([])

const getRentalCustomers = async () => {
  loading.value = true
  try {
    const response = await bookingService.getBookingsByCustomer()
    myBookings.value = response.data
    console.log('[OwnerDashboard] Fetched rental customers data:', myBookings.value)
  } catch (error) {
    console.error('[OwnerDashboard] Error fetching rental customers data:', error)
    message.error(t('dashboard.errorLoadingRentalData'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getCustomerData()
  getRentalCustomers()
})




const recentActivities = ref([
  {
    id: '1',
    description: 'Nova reserva recebida para Toyota Corolla',
    time: 'Há 2 horas',
    icon: 'CalendarOutlined',
    color: '#FE7743'
  },
  {
    id: '2',
    description: 'Reserva confirmada para Honda Civic',
    time: 'Ontem',
    icon: 'CheckCircleOutlined',
    color: '#447D9B'
  }
])

const vehicleDetailsVisible = ref(false)
const reservationDetailsVisible = ref(false)
const buyPointsModalVisible = ref(false)
const selectedVehicle = ref(null)
const selectedReservation = ref(null)

const buyPointsForm = ref({
  amount: 50,
  paymentMethod: 'credit_card'
})


const getStatusColor = (status) => {
  const colors = {
    PENDING: '#FE7743',
    CONFIRMED: '#447D9B',
    ACTIVE: '#52c41a',
    COMPLETED: '#D7D7D7',
    CANCELLED: '#ff4d4f'
  }
  return colors[status] || '#D7D7D7'
}

const getStatusLabel = (status) => {
  const labels = {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmada',
    ACTIVE: 'Ativa',
    COMPLETED: 'Concluída',
    CANCELLED: 'Cancelada'
  }
  return labels[status] || status
}

const getVehicleTypeLabel = (type) => {
  const labels = {
    CAR: 'Carro',
    MOTORCYCLE: 'Moto',
    VAN: 'Van',
    TRUCK: 'Caminhão'
  }
  return labels[type] || type
}

const getFeatureLabel = (feature) => {
  const labels = {
    air_conditioning: 'Ar Condicionado',
    automatic: 'Câmbio Automático',
    bluetooth: 'Bluetooth',
    gps: 'GPS',
    leather_seats: 'Bancos de Couro',
    sunroof: 'Teto Solar'
  }
  return labels[feature] || feature
}

const formatDate = (dateString) => {
  return dayjs(dateString).format('DD/MM/YYYY')
}

const formatDateTime = (dateString) => {
  return dayjs(dateString).format('DD/MM/YYYY HH:mm')
}



// Handler methods for child components
const handleQuickAction = (action) => {
  switch (action) {
    case 'search':
      router.push('/search')
      break
    case 'my-bookings':
      router.push('/owner-dashboard?tab=my-bookings')
      break
    case 'wallet':
      router.push('/owner-dashboard?tab=digital-wallet')
      break
    case 'use-points':
      router.push('/owner-dashboard?tab=client-points')
      break
    case 'buy-points':
      router.push('/owner-dashboard?tab=digital-wallet')
      message.info(t('dashboard.redirectingToBuyPoints'))
      break
    case 'set-goals':
      message.info('Funcionalidade de definir metas em desenvolvimento')
      break
    case 'view-all-activities':
      message.info('Visualizando todas as atividades...')
      break
    case 'view-all-notifications':
      message.info('Visualizando todas as notificações...')
      break
    case 'optimize-schedule':
      message.info('Otimizando agenda baseada em insights...')
      break
    case 'renew-documents':
      router.push('/owner-dashboard?tab=profile')
      message.info(t('dashboard.redirectingToDocumentRenewal'))
      break
    case 'messages':
      router.push('/owner-dashboard?tab=messages')
      message.info('Abrindo mensagens...')
      break
    case 'notifications':
      router.push('/owner-dashboard?tab=notifications')
      message.info('Abrindo notificações...')
      break

    case 'enable-auto-responses':
      router.push('/owner-dashboard?tab=profile')
      message.info('Configurando respostas automáticas...')
      break
    default:
      message.info(`Ação rápida: ${action}`)
  }
}

const getClientClassification = (rating) => {
  if (rating >= 4.5) return 'Premium'
  if (rating >= 4.0) return 'Ouro'
  if (rating >= 3.5) return 'Prata'
  if (rating >= 3.0) return 'Bronze'
  return 'Iniciante'
}
// ...existing code...
</script>

<style scoped>
/* Modern Dashboard Styles - Following VehicleSearch/Details Pattern */
.owner-dashboard-modern {
  min-height: 100vh;
  background: #f5f7fa;

}

/* Hero Dashboard Section */
.hero-dashboard-section {
  position: relative;
  padding: 120px 0 80px 0;
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%) !important;
  overflow: hidden;
}

.hero-dashboard-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.hero-dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 2;
}

.hero-dashboard-content {
  color: white;
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

.user-welcome {
  display: flex;
  align-items: center;
  gap: 24px;
}

.welcome-avatar {
  position: relative;
}

.avatar-gradient {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.status-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 16px;
  height: 16px;
  background: #52c41a;
  border-radius: 50%;
  border: 3px solid white;
}

.welcome-text h1.welcome-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: white;
}

.welcome-text p.welcome-subtitle {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
}

.quick-stats {
  display: flex;
  gap: 24px;
}

.stat-card-hero {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 140px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px auto;
  font-size: 24px;
  color: white;
}

.stat-info .stat-number {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: white;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-info .stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Main Content Container */
.main-content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;
  margin-top: -40px;
  position: relative;
  z-index: 10;
}

/* Sidebar */
.sidebar-modern {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  height: fit-content;
  position: sticky;
  top: 120px;
}

/* Navigation */
.navigation-modern {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-section-title {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 12px 0;
  padding: 0 16px;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  color: #6b7280;
}

.nav-item:hover {
  background: #f8fafc;
  color: #667eea;
  transform: translateX(4px);
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.nav-text {
  font-weight: 500;
  font-size: 14px;
}

/* Main Content */
.main-content-modern {
  background: white;
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.content-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 40px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-bottom: 1px solid #f0f0f0;
}

.header-info h1.page-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #111827;
}

.header-info p.page-subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 16px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn-modern {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  height: 44px;
  padding: 0 24px;
  font-weight: 600;
  color: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s;
}

.action-btn-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  color: white;
}

.tab-content-modern {
  padding: 40px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .hero-dashboard-container {
    padding: 0 20px;
  }
  
  .main-content-container {
    padding: 20px;
  }
  
  .quick-stats {
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .stat-card-hero {
    min-width: 120px;
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .hero-dashboard-section {
    padding: 80px 0 60px 0;
  }
  
  .hero-dashboard-container {
    padding: 0 16px;
  }
  
  .welcome-section {
    flex-direction: column;
    text-align: center;
    gap: 32px;
  }
  
  .user-welcome {
    flex-direction: column;
    gap: 16px;
  }
  
  .welcome-text h1.welcome-title {
    font-size: 36px;
  }
  
  .quick-stats {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .main-content-container {
    margin-top: -20px;
    padding: 16px;
  }
  
  .dashboard-layout {
    gap: 20px;
  }
  
  .sidebar-modern {
    order: 2;
    top: auto;
    position: static;
    padding: 24px;
  }
  
  .main-content-modern {
    order: 1;
  }
  
  .content-header-modern {
    flex-direction: column;
    gap: 20px;
    padding: 24px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: center;
  }
  
  .tab-content-modern {
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .hero-dashboard-section {
    padding: 60px 0 40px 0;
  }
  
  .welcome-text h1.welcome-title {
    font-size: 28px;
  }
  
  .welcome-text p.welcome-subtitle {
    font-size: 16px;
  }
  
  .quick-stats {
    gap: 12px;
  }
  
  .stat-card-hero {
    min-width: 100px;
    padding: 16px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
    margin-bottom: 12px;
  }
  
  .stat-info .stat-number {
    font-size: 24px;
  }
  
  .stat-info .stat-label {
    font-size: 12px;
  }
  
  .sidebar-modern {
    padding: 20px;
  }
  
  .content-header-modern {
    padding: 20px;
  }
  
  .tab-content-modern {
    padding: 20px;
  }
  
  .header-info h1.page-title {
    font-size: 24px;
  }
}

/* Modal Styles */
.modern-modal :deep(.ant-modal-content) {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.modern-modal :deep(.ant-modal-header) {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-bottom: 1px solid #f0f0f0;
  padding: 24px 32px;
}

.modern-modal :deep(.ant-modal-title) {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.modal-content-modern {
  padding: 8px;
}

.modern-descriptions :deep(.ant-descriptions-item-label) {
  background: #fafafa;
  font-weight: 600;
  color: #374151;
}

.modern-tag {
  border-radius: 8px;
  font-weight: 500;
}

.modal-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 32px 0;
}

.modal-section-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 24px 0;
}

.stats-grid-modern .stat-card-modern {
  background: #fafafa;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.reservation-actions-modern {
  margin-top: 24px;
}

.modern-form .ant-form-item-label {
  font-weight: 600;
  color: #374151;
}

.modern-select,
.modern-radio-group {
  border-radius: 8px;
}

.points-pricing-modern {
  background: #fafafa;
  border-radius: 12px;
  padding: 20px;
  margin: 24px 0;
}

.modern-alert {
  border-radius: 8px;
  margin-bottom: 16px;
}

.total-price-modern {
  text-align: center;
  font-size: 24px;
  color: #667eea;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .dashboard-container-modern {
    padding: 20px;
    padding-top: 100px; /* Space for fixed header */
  }
}

.sidebar-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: none;
}

.owner-profile {
  text-align: center;
  margin-bottom: 24px;
}

.owner-avatar {
  background-color: #FE7743;
  margin-bottom: 12px;
}

.owner-name {
  color: #273F4F;
  margin: 8px 0 4px 0;
}

.owner-role {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.section-title {
  color: #273F4F;
  margin: 32px 0 16px 0;
  font-size: 1.25rem;
  border-bottom: 2px solid #FE7743;
  padding-bottom: 8px;
  display: inline-block;
}

.section-title:first-of-type {
  margin-top: 0;
}

.sidebar-menu {
  border: none;
  background: transparent;
}

.sidebar-menu .ant-menu-item {
  border-radius: 8px;
  margin: 4px 0;
  padding: 12px 16px;
  height: auto;
}

.sidebar-menu .ant-menu-item-selected {
  background-color: #FE7743;
  color: white;
}

.sidebar-menu .ant-menu-item:hover {
  background-color: rgba(254, 119, 67, 0.1);
}

.page-title {
  color: #273F4F;
  margin-bottom: 24px;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  color: white;
}

.stat-card.primary {
  background: linear-gradient(135deg, #FE7743 0%, #e55a2b 100%);
}

.stat-card.secondary {
  background: linear-gradient(135deg, #273F4F 0%, #1a2b36 100%);
}

.stat-card.accent {
  background: linear-gradient(135deg, #447D9B 0%, #356277 100%);
}

.stat-card.neutral {
  background: linear-gradient(135deg, #D7D7D7 0%, #c0c0c0 100%);
}

.activity-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 16px;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0 0 4px 0;
  color: #273F4F;
}

.activity-time {
  color: #666;
}

.vehicle-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: none;
}

.vehicle-image {
  height: 200px;
  background: linear-gradient(135deg, #D7D7D7 0%, #447D9B 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.vehicle-icon {
  font-size: 64px;
  color: #273F4F;
}

.vehicle-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-tag {
  margin-left: 8px;
}

.vehicle-info p {
  margin: 4px 0;
  color: #666;
}

.booking-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: none;
}

.booking-vehicle-image {
  height: 150px;
  background: linear-gradient(135deg, #D7D7D7 0%, #447D9B 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.booking-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.booking-info p {
  margin: 4px 0;
  color: #666;
}

.profile-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.chart-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.chart-placeholder {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.promotion-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.promotion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.promotion-header h4 {
  margin: 0;
  color: #273F4F;
}

.promotion-details p {
  margin: 4px 0;
  color: #666;
}

.promotion-actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.reservation-actions {
  text-align: center;
}

.points-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.points-summary {
  padding: 8px 0;
}

.points-balance {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.points-icon {
  font-size: 2.5rem;
  color: #FE7743;
  margin-right: 16px;
}

.points-icon.client {
  color: #447D9B;
}

.points-info h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #273F4F;
}

.points-info p {
  margin: 4px 0 0 0;
  color: #666;
}

.points-history h4 {
  color: #273F4F;
  margin-bottom: 16px;
}

.point-transaction {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.point-transaction:last-child {
  border-bottom: none;
}

.point-deduction {
  color: #ff4d4f;
  font-weight: 600;
}

.point-addition {
  color: #52c41a;
  font-weight: 600;
}

.rating-display {
  margin: 16px 0;
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-text {
  color: #666;
  font-size: 14px;
}

.discount-info h4 {
  color: #273F4F;
  margin-bottom: 12px;
}

.discount-item {
  padding: 4px 0;
  color: #666;
}

.points-pricing {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
}

/* Client Points Styles */
.client-points-tab .points-progress h4 {
  color: #273F4F;
  margin-bottom: 12px;
}

.points-stats .ant-statistic {
  text-align: center;
}

.discount-card .discount-item {
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: all 0.3s;
}

.discount-card .discount-item.available {
  border-color: #52c41a;
  background-color: #f6ffed;
}

.discount-card .discount-item .discount-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.discount-card .discount-points {
  font-weight: 600;
  color: #FE7743;
}

.discount-card .discount-percent {
  font-weight: 600;
  color: #273F4F;
}

/* Client Rating Styles */
.rating-display-large {
  text-align: center;
  padding: 20px;
}

.rating-circle {
  display: inline-flex;
  align-items: baseline;
  margin-bottom: 16px;
}

.rating-value-large {
  font-size: 4rem;
  font-weight: bold;
  color: #FE7743;
  line-height: 1;
}

.rating-max {
  font-size: 1.5rem;
  color: #666;
  margin-left: 4px;
}

.rating-stars-large {
  margin-bottom: 16px;
}

.rating-stars-large .ant-rate {
  font-size: 24px;
}

.classification-tag {
  font-size: 16px !important;
  padding: 8px 16px !important;
  border-radius: 20px !important;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  opacity: 0.5;
  transition: all 0.3s;
}

.benefit-item.active {
  opacity: 1;
  border-color: #FE7743;
  background-color: #fff7f5;
}

.benefit-icon {
  font-size: 24px;
  margin-right: 12px;
  margin-top: 4px;
}

.benefit-icon.vip {
  color: #722ed1;
}

.benefit-icon.premium {
  color: #fa8c16;
}

.benefit-icon.gold {
  color: #fadb14;
}

.benefit-content h4 {
  margin: 0 0 8px 0;
  color: #273F4F;
}

.benefit-content ul {
  margin: 0;
  padding-left: 16px;
}

.benefit-content li {
  color: #666;
  margin-bottom: 4px;
}

.rating-breakdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-bar span:first-child {
  min-width: 80px;
  color: #666;
}

.rating-bar span:last-child {
  min-width: 30px;
  text-align: right;
  color: #273F4F;
  font-weight: 600;
}

.rating-bar .ant-progress {
  flex: 1;
}

/* Digital Wallet Styles */
.wallet-card .wallet-summary {
  padding: 8px 0;
}

.wallet-balance {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.wallet-icon {
  font-size: 3rem;
  color: #FE7743;
  margin-right: 16px;
}

.wallet-info h3 {
  margin: 0;
  font-size: 2rem;
  color: #273F4F;
}

.wallet-info p {
  margin: 4px 0 0 0;
  color: #666;
}

.wallet-alerts {
  margin-top: 16px;
}

.pricing-card .pricing-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pricing-option {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  position: relative;
  transition: all 0.3s;
}

.pricing-option:hover {
  border-color: #FE7743;
  box-shadow: 0 2px 8px rgba(254, 119, 67, 0.2);
}

.pricing-option.popular {
  border-color: #FE7743;
  background-color: #fff7f5;
}

.pricing-badge {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #FE7743;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.pricing-header h4 {
  margin: 0 0 8px 0;
  color: #273F4F;
}

.pricing-value {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
}

.pricing-value .price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #FE7743;
}

.pricing-value .points {
  color: #666;
  font-size: 14px;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pricing-features li {
  padding: 4px 0;
  color: #666;
  position: relative;
  padding-left: 16px;
}

.pricing-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #52c41a;
  font-weight: bold;
}

.transaction-history {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: all 0.3s;
}

.transaction-item:hover {
  background-color: #fafafa;
}

.transaction-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: white;
}

.transaction-icon.success {
  background-color: #52c41a;
}

.transaction-icon.deduction {
  background-color: #ff4d4f;
}

.transaction-content {
  flex: 1;
}

.transaction-title {
  font-weight: 600;
  color: #273F4F;
  margin-bottom: 4px;
}

.transaction-date {
  color: #666;
  font-size: 14px;
}

.transaction-amount {
  font-weight: 600;
  font-size: 16px;
}

.transaction-amount.success {
  color: #52c41a;
}

.transaction-amount.deduction {
  color: #ff4d4f;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container-modern {
    padding: 16px;
    padding-top: 90px; /* Space for smaller fixed header */
  }

  .sidebar-modern {
    position: static;
    margin-bottom: 20px;
  }

  .content-header-modern {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
    padding: 24px;
  }

  .tab-content-modern {
    padding: 20px;
  }

  .profile-stats {
    justify-content: center;
    gap: 32px;
  }

  .nav-section {
    gap: 8px;
  }

  .nav-item {
    padding: 10px 12px;
  }
}

@media (max-width: 480px) {
  .dashboard-container-modern {
    padding-top: 80px; /* Space for mobile fixed header */
  }

  .content-header-modern {
    padding: 16px;
  }

  .tab-content-modern {
    padding: 16px;
  }

  .header-info h1.page-title {
    font-size: 24px;
  }

  .sidebar-modern {
    padding: 20px;
  }
}
</style>


