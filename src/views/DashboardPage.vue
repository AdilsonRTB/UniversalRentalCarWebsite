<template>
  <div class="dashboard">
    <div class="dashboard-container">
      <a-row :gutter="24">
        <!-- Sidebar -->
        <a-col :xs="24" :lg="6">
          <a-card class="sidebar-card">
            <div class="user-profile">
              <a-avatar size="large" class="user-avatar">
                <UserOutlined />
              </a-avatar>
              <h4 class="username">{{ user.username }}</h4>
              <p class="user-role">{{ getRoleLabel(user.role) }}</p>
            </div>
            
            <a-menu
              :selectedKeys="[activeTab]"
              mode="vertical"
              class="sidebar-menu"
              @select="handleMenuSelect"
            >
              <a-menu-item key="overview">
                <DashboardOutlined />
                Visão Geral
              </a-menu-item>
              
              <a-menu-item v-if="user.role === 'CLIENT'" key="bookings">
                <CalendarOutlined />
                Minhas Reservas
              </a-menu-item>
              
              <a-menu-item v-if="user.role === 'OWNER'" key="vehicles">
                <CarOutlined />
                Meus Veículos
              </a-menu-item>
              
              <a-menu-item v-if="user.role === 'OWNER'" key="owner-bookings">
                <UnorderedListOutlined />
                Reservas Recebidas
              </a-menu-item>
              
              <a-menu-item key="profile">
                <SettingOutlined />
                Perfil
              </a-menu-item>
            </a-menu>
          </a-card>
        </a-col>
        
        <!-- Main Content -->
        <a-col :xs="24" :lg="18">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="overview-tab">
            <h2 class="page-title">Visão Geral</h2>
            
            <a-row :gutter="[16, 16]" class="stats-row">
              <a-col v-if="user.role === 'CLIENT'" :xs="24" :md="12">
                <a-card class="stat-card primary">
                  <a-statistic
                    title="Reservas Ativas"
                    :value="stats.activeBookings"
                    :value-style="{ color: '#fff' }"
                  >
                    <template #prefix>
                      <CalendarOutlined style="color: #fff;" />
                    </template>
                  </a-statistic>
                </a-card>
              </a-col>
              
              <a-col v-if="user.role === 'CLIENT'" :xs="24" :md="12">
                <a-card class="stat-card secondary">
                  <a-statistic
                    title="Total Gasto"
                    :value="stats.totalSpent"
                    prefix="R$"
                    :precision="2"
                    :value-style="{ color: '#fff' }"
                  >
                    <template #prefix>
                      <DollarOutlined style="color: #fff;" />
                    </template>
                  </a-statistic>
                </a-card>
              </a-col>
              
              <a-col v-if="user.role === 'OWNER'" :xs="24" :md="12">
                <a-card class="stat-card accent">
                  <a-statistic
                    title="Veículos Cadastrados"
                    :value="stats.totalVehicles"
                    :value-style="{ color: '#fff' }"
                  >
                    <template #prefix>
                      <CarOutlined style="color: #fff;" />
                    </template>
                  </a-statistic>
                </a-card>
              </a-col>
              
              <a-col v-if="user.role === 'OWNER'" :xs="24" :md="12">
                <a-card class="stat-card primary">
                  <a-statistic
                    title="Receita Total"
                    :value="stats.totalEarnings"
                    prefix="R$"
                    :precision="2"
                    :value-style="{ color: '#fff' }"
                  >
                    <template #prefix>
                      <LineChartOutlined style="color: #fff;" />
                    </template>
                  </a-statistic>
                </a-card>
              </a-col>
            </a-row>
            
            <a-card title="Atividades Recentes" class="activity-card">
              <a-timeline>
                <a-timeline-item color="#FE7743">
                  <template #dot>
                    <PlusOutlined style="color: #FE7743;" />
                  </template>
                  <p>Nova reserva criada</p>
                  <p class="activity-time">Há 2 horas</p>
                </a-timeline-item>
                
                <a-timeline-item color="#447D9B">
                  <template #dot>
                    <CheckOutlined style="color: #447D9B;" />
                  </template>
                  <p>Reserva confirmada</p>
                  <p class="activity-time">Ontem</p>
                </a-timeline-item>
              </a-timeline>
            </a-card>
          </div>
          
          <!-- Client Bookings Tab -->
          <div v-if="activeTab === 'bookings'" class="bookings-tab">
            <div class="tab-header">
              <h2 class="page-title">Minhas Reservas</h2>
              <a-button type="primary" @click="$router.push('/search')">
                <PlusOutlined />
                Nova Reserva
              </a-button>
            </div>
            
            <a-row :gutter="[16, 16]">
              <a-col v-for="booking in bookings" :key="booking.id" :xs="24" :md="12">
                <a-card class="booking-card">
                  <div class="booking-header">
                    <h4>{{ booking.vehicle?.brand }} {{ booking.vehicle?.model }}</h4>
                    <a-tag :color="getStatusColor(booking.status)">
                      {{ getStatusLabel(booking.status) }}
                    </a-tag>
                  </div>
                  
                  <a-space direction="vertical" style="width: 100%;">
                    <div class="booking-info">
                      <CalendarOutlined />
                      <span>{{ formatDate(booking.startDate) }} - {{ formatDate(booking.endDate) }}</span>
                    </div>
                    
                    <div class="booking-info">
                      <DollarOutlined />
                      <span>R$ {{ booking.totalPrice }}</span>
                    </div>
                  </a-space>
                  
                  <div class="booking-actions">
                    <a-button type="primary" ghost>Ver Detalhes</a-button>
                    <a-button 
                      v-if="booking.status === 'PENDING'"
                      danger
                      ghost
                    >
                      Cancelar
                    </a-button>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </div>
          
          <!-- Owner Vehicles Tab -->
          <div v-if="activeTab === 'vehicles'" class="vehicles-tab">
            <div class="tab-header">
              <h2 class="page-title">Meus Veículos</h2>
              <a-button type="primary" @click="showAddVehicleModal = true">
                <PlusOutlined />
                Adicionar Veículo
              </a-button>
            </div>
            
            <a-row :gutter="[16, 16]">
              <a-col v-for="vehicle in vehicles" :key="vehicle.id" :xs="24" :md="12">
                <a-card class="vehicle-card">
                  <div class="vehicle-header">
                    <h4>{{ vehicle.brand }} {{ vehicle.model }}</h4>
                    <a-tag :color="vehicle.available ? '#447D9B' : '#D7D7D7'">
                      {{ vehicle.available ? 'Disponível' : 'Indisponível' }}
                    </a-tag>
                  </div>
                  
                  <a-space direction="vertical" style="width: 100%;">
                    <div class="vehicle-info">
                      <CalendarOutlined />
                      <span>{{ vehicle.year }}</span>
                    </div>
                    
                    <div class="vehicle-info">
                      <DollarOutlined />
                      <span>R$ {{ vehicle.dailyRate }}/dia</span>
                    </div>
                  </a-space>
                  
                  <div class="vehicle-actions">
                    <a-button type="primary" ghost>Editar</a-button>
                    <a-button 
                      :type="vehicle.available ? 'default' : 'primary'"
                      ghost
                    >
                      {{ vehicle.available ? 'Desativar' : 'Ativar' }}
                    </a-button>
                  </div>
                </a-card>
              </a-col>
            </a-row>
          </div>
          
          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="profile-tab">
            <h2 class="page-title">Meu Perfil</h2>
            
            <a-card>
              <a-form @submit="updateProfile" layout="vertical">
                <a-row :gutter="16">
                  <a-col :xs="24" :md="12">
                    <a-form-item label="Usuário">
                      <a-input
                        v-model:value="user.username"
                        disabled
                      />
                    </a-form-item>
                  </a-col>
                  
                  <a-col :xs="24" :md="12">
                    <a-form-item label="Email">
                      <a-input
                        v-model:value="user.email"
                        type="email"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-row :gutter="16">
                  <a-col :xs="24" :md="12">
                    <a-form-item label="Nova Senha">
                      <a-input-password
                        v-model:value="profileForm.newPassword"
                        placeholder="Deixe em branco para manter a atual"
                      />
                    </a-form-item>
                  </a-col>
                  
                  <a-col :xs="24" :md="12">
                    <a-form-item label="Confirmar Nova Senha">
                      <a-input-password
                        v-model:value="profileForm.confirmPassword"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                
                <a-form-item>
                  <a-button type="primary" html-type="submit">
                    Salvar Alterações
                  </a-button>
                </a-form-item>
              </a-form>
            </a-card>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  UserOutlined, 
  DashboardOutlined, 
  CalendarOutlined, 
  CarOutlined, 
  UnorderedListOutlined, 
  SettingOutlined,
  PlusOutlined,
  CheckOutlined,
  DollarOutlined,
  LineChartOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'



const activeTab = ref('overview')
const user = ref({
  username: '',
  email: '',
  role: ''
})
const stats = ref({
  activeBookings: 0,
  totalSpent: 0,
  totalVehicles: 0,
  totalEarnings: 0
})
const bookings = ref([])
const vehicles = ref([])
const profileForm = ref({
  newPassword: '',
  confirmPassword: ''
})
const showAddVehicleModal = ref(false)

const handleMenuSelect = ({ key }) => {
  activeTab.value = key
}

const loadUserData = async () => {
  try {
    // Simular dados do usuário (adaptar conforme API real)
    user.value = {
      username: 'usuario_teste',
      email: 'usuario@teste.com',
      role: localStorage.getItem('userRole') || 'CLIENT'
    }
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error)
  }
}

const loadDashboardData = async () => {
  try {
    if (user.value.role === 'CLIENT') {
      await loadClientData()
    } else if (user.value.role === 'OWNER') {
      await loadOwnerData()
    }
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error)
  }
}

const loadClientData = async () => {
  // Simular dados do cliente
  stats.value.activeBookings = 2
  stats.value.totalSpent = 850.00
  
  bookings.value = [
    {
      id: '1',
      vehicle: { brand: 'Toyota', model: 'Corolla' },
      startDate: '2024-06-25',
      endDate: '2024-06-27',
      totalPrice: 300.00,
      status: 'CONFIRMED'
    },
    {
      id: '2',
      vehicle: { brand: 'Honda', model: 'Civic' },
      startDate: '2024-07-01',
      endDate: '2024-07-03',
      totalPrice: 350.00,
      status: 'PENDING'
    }
  ]
}

const loadOwnerData = async () => {
  // Simular dados do proprietário
  stats.value.totalVehicles = 3
  stats.value.totalEarnings = 2500.00
  
  vehicles.value = [
    {
      id: '1',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      dailyRate: 150.00,
      available: true
    },
    {
      id: '2',
      brand: 'Honda',
      model: 'Civic',
      year: 2019,
      dailyRate: 175.00,
      available: false
    }
  ]
}

const updateProfile = async () => {
  if (profileForm.value.newPassword && 
      profileForm.value.newPassword !== profileForm.value.confirmPassword) {
    message.error('As senhas não coincidem')
    return
  }
  
  try {
    // Implementar atualização do perfil
    message.success('Perfil atualizado com sucesso!')
  } catch (error) {
    message.error('Erro ao atualizar perfil')
    console.error('Erro:', error)
  }
}

const getRoleLabel = (role) => {
  const labels = {
    CLIENT: 'Cliente',
    OWNER: 'Proprietário',
    ADMIN: 'Administrador'
  }
  return labels[role] || role
}

const getStatusLabel = (status) => {
  const labels = {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmada',
    CANCELLED: 'Cancelada',
    COMPLETED: 'Concluída'
  }
  return labels[status] || status
}

const getStatusColor = (status) => {
  const colors = {
    PENDING: '#FE7743',
    CONFIRMED: '#447D9B',
    CANCELLED: '#ff4d4f',
    COMPLETED: '#D7D7D7'
  }
  return colors[status] || '#D7D7D7'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

onMounted(async () => {
  await loadUserData()
  await loadDashboardData()
})
</script>

<style scoped>
.dashboard {
  background: #f0f2f5;
  min-height: calc(100vh - 134px);
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.sidebar-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: none;
}

.user-profile {
  text-align: center;
  margin-bottom: 24px;
}

.user-avatar {
  background: #FE7743;
  margin-bottom: 16px;
}

.username {
  margin: 8px 0 4px;
  color: #273F4F;
  font-weight: 600;
}

.user-role {
  color: #666;
  margin: 0;
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

.activity-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.activity-time {
  color: #666;
  font-size: 12px;
  margin: 0;
}

.booking-card, .vehicle-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.booking-card:hover, .vehicle-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.booking-header, .vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.booking-header h4, .vehicle-header h4 {
  margin: 0;
  color: #273F4F;
  font-size: 16px;
}

.booking-info, .vehicle-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  margin: 8px 0;
}

.booking-actions, .vehicle-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }
  
  .tab-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .booking-actions, .vehicle-actions {
    flex-direction: column;
  }
}
</style>

