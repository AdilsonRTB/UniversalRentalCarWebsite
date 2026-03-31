<template>
  <div class="notifications-content">
    <div class="breadcrumb-modern">
      <router-link to="/owner-dashboard?tab=overview" class="breadcrumb-link">Dashboard</router-link>
      <span class="breadcrumb-separator">›</span>
      <span class="breadcrumb-current">Notificações</span>

    </div>
    <!-- Header Section -->
    <section class="header-section">
      <h3 class="section-title">
        <BellOutlined />
        Notificações
      </h3>
      
      <!-- Quick Stats -->
      <div class="quick-stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon-bg">
            <BellOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalCount }}</div>
            <div class="stat-label">Total</div>
          </div>
        </div>
        
        <div class="stat-card accent">
          <div class="stat-icon-bg">
            <ExclamationCircleOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ unreadCount }}</div>
            <div class="stat-label">Não Lidas</div>
          </div>
        </div>
        
        <div class="stat-card secondary">
          <div class="stat-icon-bg">
            <FireOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ urgentCount }}</div>
            <div class="stat-label">Urgentes</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Actions & Filters Section -->
    <section class="actions-section">
      <div class="actions-card">
        <div class="actions-header">
          <h4>Controles e Filtros</h4>
          <div class="header-actions">
            <a-button type="text" size="small" @click="markAllAsRead">
              <CheckOutlined />
              Marcar Todas Lidas
            </a-button>
            <a-button type="text" size="small" @click="clearRead">
              <DeleteOutlined />
              Limpar Lidas
            </a-button>
          </div>
        </div>
        
        <div class="filters-grid">
          <div class="filter-item">
            <label>Categoria</label>
            <a-select
              v-model:value="selectedCategory"
              placeholder="Todas as categorias"
              style="width: 100%"
              allow-clear
            >
              <a-select-option value="booking">Reservas</a-select-option>
              <a-select-option value="payment">Pagamentos</a-select-option>
              <a-select-option value="review">Avaliações</a-select-option>
              <a-select-option value="system">Sistema</a-select-option>
            </a-select>
          </div>
          
          <div class="filter-item">
            <label>Status</label>
            <a-select
              v-model:value="selectedStatus"
              placeholder="Todos os status"
              style="width: 100%"
              allow-clear
            >
              <a-select-option value="unread">Não Lidas</a-select-option>
              <a-select-option value="read">Lidas</a-select-option>
              <a-select-option value="urgent">Urgentes</a-select-option>
            </a-select>
          </div>
          
          <div class="filter-item">
            <label>Ordenar por</label>
            <a-select
              v-model:value="sortBy"
              placeholder="Ordenação"
              style="width: 100%"
            >
              <a-select-option value="date-desc">Data (Mais recente)</a-select-option>
              <a-select-option value="date-asc">Data (Mais antiga)</a-select-option>
              <a-select-option value="priority">Prioridade</a-select-option>
              <a-select-option value="unread-first">Não lidas primeiro</a-select-option>
            </a-select>
          </div>
        </div>
      </div>
    </section>

    <!-- Notifications List -->
    <section class="notifications-section">
      <div class="section-header">
        <h4>{{ filteredNotifications.length }} notificação(ões) encontrada(s)</h4>
        <div class="header-controls">
          <a-button type="text" size="small" @click="markAllAsRead">
            <CheckOutlined />
            Marcar todas como lidas
          </a-button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <a-spin size="large" />
        <p>Carregando notificações...</p>
      </div>

      <div class="notifications-list" v-else-if="paginatedNotifications.length > 0">
        <div 
          v-for="notification in paginatedNotifications"
          :key="notification.id" 
          :class="[
            'notification-item',
            notification.type,
            { 
              'unread': !notification.read,
              'urgent': notification.priority === 'high'
            }
          ]"
          @click="openNotificationDetails(notification)"
        >
          <!-- Notification Icon -->
          <div class="notification-icon">
            <div class="icon-wrapper" :class="notification.type">
              <BellOutlined v-if="notification.type === 'booking'" />
              <CheckOutlined v-else-if="notification.type === 'payment'" />
              <FireOutlined v-else-if="notification.type === 'review'" />
              <ExclamationCircleOutlined v-else />
            </div>
            <div v-if="!notification.read" class="unread-dot"></div>
          </div>

          <!-- Notification Content -->
          <div class="notification-body">
            <div class="notification-header">
              <h5 class="notification-title">{{ notification.title }}</h5>
              <div class="notification-meta">
                <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
                <a-tag 
                  v-if="notification.priority === 'high'" 
                  color="red"
                  size="small"
                  class="priority-tag"
                >
                  URGENTE
                </a-tag>
              </div>
            </div>
            
            <p class="notification-message">{{ notification.message }}</p>
            
            <!-- Category Badge -->
            <div class="notification-footer">
              <a-tag :color="getCategoryColor(notification.type)" size="small">
                {{ getCategoryLabel(notification.type) }}
              </a-tag>
            </div>
          </div>

          <!-- Action Menu -->
          <div class="notification-menu">
            <a-dropdown placement="bottomRight" trigger="click">
              <template #overlay>
                <a-menu>
                  <a-menu-item @click.stop="toggleReadStatus(notification)">
                    <EyeOutlined v-if="notification.read" />
                    <EyeInvisibleOutlined v-else />
                    {{ notification.read ? 'Marcar como não lida' : 'Marcar como lida' }}
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item @click.stop="deleteNotification(notification.id)" danger>
                    <DeleteOutlined />
                    Excluir notificação
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button type="text" size="small" @click.stop>
                <MoreOutlined />
              </a-button>
            </a-dropdown>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <InboxOutlined class="empty-icon" />
        <h4>Nenhuma notificação encontrada</h4>
        <p>Não há notificações que correspondam aos filtros selecionados.</p>
      </div>
    </section>

    <!-- Pagination -->
    <div v-if="filteredNotifications.length > pageSize" class="pagination-wrapper">
      <a-pagination
        v-model:current="currentPage"
        :total="filteredNotifications.length"
        :page-size="pageSize"
        :show-size-changer="false"
        show-quick-jumper
        show-less-items
      />
    </div>

    <!-- Notification Details Modal -->
    <a-modal
      v-model:open="detailsModalVisible"
      :title="selectedNotification?.title"
      :width="800"
      centered
      :footer="null"
      class="notification-details-modal"
    >
      <div v-if="selectedNotification" class="notification-details">
        <!-- Notification Info -->
        <div class="details-header">
          <a-tag :color="getCategoryColor(selectedNotification.type)" size="large">
            {{ getCategoryLabel(selectedNotification.type) }}
          </a-tag>
          <a-tag 
            v-if="selectedNotification.priority === 'high'" 
            color="red"
            size="large"
          >
            URGENTE
          </a-tag>
          <span class="details-date">{{ formatDetailDate(selectedNotification.createdAt) }}</span>
        </div>

        <!-- HTML Content -->
        <div class="details-content">
          <div v-if="selectedNotification.apiData?.html_content" class="html-content" v-html="selectedNotification.apiData.html_content"></div>
          <div v-else class="text-content">
            <p>{{ selectedNotification.message }}</p>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { 
  BellOutlined,
  ExclamationCircleOutlined,
  FireOutlined,
  CheckOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  MoreOutlined,
  InboxOutlined
} from '@ant-design/icons-vue'

import { ref, computed, onMounted } from 'vue'
import { vehicleService, authService } from '../../services/api'

// Reactive data
const notifications = ref([])
const selectedCategory = ref('')
const selectedStatus = ref('')
const sortBy = ref('date-desc')
const currentPage = ref(1)
const pageSize = ref(6)
const isLoading = ref(false)
const customer = ref(null)
const detailsModalVisible = ref(false)
const selectedNotification = ref(null)

// LocalStorage key for read notifications
const READ_NOTIFICATIONS_KEY = 'read_notifications'

// Load customer data
const loadCustomerData = async () => {
  try {
    const response = await authService.me()
    customer.value = response.data
  } catch (error) {
    console.error('Error loading customer data:', error)
  }
}

// Get read notifications from localStorage
const getReadNotifications = () => {
  try {
    const stored = localStorage.getItem(READ_NOTIFICATIONS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    return []
  }
}

// Save read notifications to localStorage
const saveReadNotifications = (readIds) => {
  try {
    localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(readIds))
  } catch (error) {
    console.error('Error saving read notifications:', error)
  }
}

// Map notification type from API to component type
const mapNotificationType = (apiType) => {
  if (apiType.includes('rental') || apiType.includes('booking')) return 'booking'
  if (apiType.includes('payment')) return 'payment'
  if (apiType.includes('review') || apiType.includes('evaluation')) return 'review'
  return 'system'
}

// Load notifications from API
const loadNotifications = async () => {
  if (!customer.value) return
  
  isLoading.value = true
  try {
    const response = await vehicleService.getNotifications(customer.value.id)
    const readIds = getReadNotifications()
    
    // Map API data to component format
    notifications.value = response.data.notifications.map(notif => ({
      id: notif.id,
      type: mapNotificationType(notif.notification_type),
      title: notif.subject,
      message: notif.content,
      priority: notif.notification_type === 'rental_booking' ? 'high' : 'normal',
      read: readIds.includes(notif.id),
      createdAt: new Date(notif.created_at),
      apiData: notif // Store original data
    }))
  } catch (error) {
    console.error('Error loading notifications:', error)
  } finally {
    isLoading.value = false
  }
}

// Computed properties
const totalCount = computed(() => notifications.value.length)

const unreadCount = computed(() => 
  notifications.value.filter(n => !n.read).length
)

const urgentCount = computed(() => 
  notifications.value.filter(n => n.priority === 'high').length
)

const filteredNotifications = computed(() => {
  let filtered = [...notifications.value]

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(n => n.type === selectedCategory.value)
  }

  // Filter by status
  if (selectedStatus.value) {
    switch (selectedStatus.value) {
      case 'unread':
        filtered = filtered.filter(n => !n.read)
        break
      case 'read':
        filtered = filtered.filter(n => n.read)
        break
      case 'urgent':
        filtered = filtered.filter(n => n.priority === 'high')
        break
    }
  }

  // Sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'date-asc':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'priority': {
        const priorityOrder = { high: 3, normal: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      case 'unread-first':
        return (b.read ? 0 : 1) - (a.read ? 0 : 1)
      default:
        return 0
    }
  })

  return filtered
})

const paginatedNotifications = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredNotifications.value.slice(start, end)
})

// Methods
const openNotificationDetails = (notification) => {
  selectedNotification.value = notification
  detailsModalVisible.value = true
  markAsRead(notification)
}

const formatTime = (date) => {
  const now = new Date()
  const notifDate = new Date(date)
  const diffMs = now - notifDate
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Agora mesmo'
  if (diffMins < 60) return `${diffMins}m atrás`
  if (diffHours < 24) return `${diffHours}h atrás`
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return `${diffDays} dias atrás`
  
  return notifDate.toLocaleDateString('pt-BR')
}

const formatDetailDate = (date) => {
  const notifDate = new Date(date)
  return notifDate.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
  
  // Update localStorage
  const allIds = notifications.value.map(n => n.id)
  saveReadNotifications(allIds)
}

const clearRead = () => {
  notifications.value = notifications.value.filter(n => !n.read)
}

const markAsRead = (notification) => {
  if (!notification.read) {
    notification.read = true
    
    // Update localStorage
    const readIds = getReadNotifications()
    if (!readIds.includes(notification.id)) {
      readIds.push(notification.id)
      saveReadNotifications(readIds)
    }
  }
}

const toggleReadStatus = (notification) => {
  notification.read = !notification.read
  
  // Update localStorage
  const readIds = getReadNotifications()
  if (notification.read) {
    if (!readIds.includes(notification.id)) {
      readIds.push(notification.id)
      saveReadNotifications(readIds)
    }
  } else {
    const index = readIds.indexOf(notification.id)
    if (index > -1) {
      readIds.splice(index, 1)
      saveReadNotifications(readIds)
    }
  }
}

const deleteNotification = (id) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

const getCategoryColor = (type) => {
  const colors = {
    booking: 'blue',
    payment: 'green',
    review: 'orange',
    system: 'purple'
  }
  return colors[type] || 'default'
}

const getCategoryLabel = (type) => {
  const labels = {
    booking: 'Reserva',
    payment: 'Pagamento', 
    review: 'Avaliação',
    system: 'Sistema'
  }
  return labels[type] || 'Notificação'
}

// Initialize notifications
onMounted(async () => {
  await loadCustomerData()
  await loadNotifications()
})
</script>

<style scoped>
/* Notifications Content - Integrado com OwnerDashboard */
.notifications-content {
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

/* Notifications Section */
.notifications-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 4px;
}

.section-header h4 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.header-controls {
  display: flex;
  gap: 8px;
}

/* Notifications List - List Style Layout */
.notifications-list {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-item.unread {
  background: linear-gradient(135deg, #fefeff 0%, #f0f9ff 100%);
  border-left: 4px solid #3b82f6;
}

.notification-item.urgent {
  background: linear-gradient(135deg, #fefeff 0%, #fef2f2 100%);
  border-left: 4px solid #dc2626;
}

/* Notification Icon */
.notification-icon {
  position: relative;
  flex-shrink: 0;
}

.icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  background: var(--icon-gradient);
}

.icon-wrapper.booking {
  --icon-gradient: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.icon-wrapper.payment {
  --icon-gradient: linear-gradient(135deg, #059669, #047857);
}

.icon-wrapper.review {
  --icon-gradient: linear-gradient(135deg, #f59e0b, #d97706);
}

.icon-wrapper.system {
  --icon-gradient: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.unread-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  background: #3b82f6;
  border: 2px solid white;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

/* Notification Body */
.notification-body {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 16px;
}

.notification-title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.notification-time {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
}

.priority-tag {
  font-size: 11px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px;
}

.notification-message {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.notification-footer {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Notification Menu */
.notification-menu {
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.notification-item:hover .notification-menu {
  opacity: 1;
}

/* Header Actions */
.header-actions {
  display: flex;
  gap: 8px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.empty-icon {
  font-size: 48px;
  color: #d1d5db;
  margin-bottom: 16px;
}

.empty-state h4 {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.loading-state p {
  margin-top: 16px;
  font-size: 14px;
  color: #6b7280;
}

/* Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding: 20px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .notifications-content {
    padding: 16px;
  }

  .quick-stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
    gap: 12px;
  }

  .stat-icon-bg {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .stat-content .stat-value {
    font-size: 20px;
  }

  .actions-card {
    padding: 16px;
  }

  .actions-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .header-actions {
    justify-content: flex-start;
  }

  .filters-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .header-controls {
    justify-content: flex-start;
  }

  .notification-item {
    padding: 16px;
    gap: 12px;
  }

  .notification-header {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .notification-meta {
    justify-content: flex-start;
  }

  .notification-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .notification-actions {
    justify-content: flex-start;
  }

  .notification-menu {
    opacity: 1;
    position: absolute;
    top: 16px;
    right: 16px;
  }

  .empty-state {
    padding: 40px 20px;
  }

  .empty-icon {
    font-size: 36px;
  }

  .pagination-wrapper {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .stat-card {
    flex-direction: column;
    text-align: center;
    padding: 16px;
  }

  .stat-icon-bg {
    margin: 0 auto 8px;
  }

  .notification-item {
    padding: 12px;
  }

  .icon-wrapper {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .notification-title {
    font-size: 14px;
  }

  .notification-message {
    font-size: 13px;
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

/* Notification Details Modal */
.notification-details-modal :deep(.ant-modal-header) {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-bottom: none;
  padding: 20px 24px;
}

.notification-details-modal :deep(.ant-modal-title) {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.notification-details-modal :deep(.ant-modal-close) {
  color: white;
}

.notification-details-modal :deep(.ant-modal-close:hover) {
  background: rgba(255, 255, 255, 0.1);
}

.notification-details {
  padding: 0;
}

.details-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 20px;
}

.details-date {
  margin-left: auto;
  font-size: 14px;
  color: #6b7280;
}

.details-content {
  margin-bottom: 24px;
  max-height: 600px;
  overflow-y: auto;
}

.html-content {
  line-height: 1.6;
}

/* Reset styles for email HTML */
.html-content table {
  border-collapse: collapse;
  width: 100%;
}

.html-content p {
  margin: 0 0 10px 0;
}

.text-content {
  background: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #3b82f6;
}

.text-content p {
  font-size: 15px;
  color: #374151;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}
</style>