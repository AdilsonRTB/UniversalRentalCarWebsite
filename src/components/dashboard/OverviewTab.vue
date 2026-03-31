<template>
  <div class="overview-tab-content">

    <div class="breadcrumb-modern">
      <!--span class="breadcrumb-current">Area Pessoal</!--span>
      <span-- class="breadcrumb-separator">›</span-->
      <router-link to="/owner-dashboard?tab=overview" class="breadcrumb-link">Dashboard</router-link>
    </div>
    <!-- Quick Actions Grid -->
    <section class="quick-actions-section">

      <h3 class="section-title">{{ t('dashboard.quickActions') }}</h3>
      <div class="actions-grid">
        <div class="action-card search" @click="$emit('quickAction', 'search')">
          <div class="action-icon">
            <SearchOutlined />
          </div>
          <div class="action-content">
            <h4>{{ t('dashboard.searchVehicles') }}</h4>
            <p>{{ t('dashboard.findIdealVehicle') }}</p>
          </div>
          <div class="action-arrow">
            <ArrowRightOutlined />
          </div>
        </div>
        
        <div class="action-card bookings" @click="$emit('quickAction', 'my-bookings')">
          <div class="action-icon">
            <CalendarOutlined />
          </div>
          <div class="action-content">
            <h4>{{ t('dashboard.myBookings') }}</h4>
            <p>{{ t('dashboard.manageBookings') }}</p>
          </div>
          <div class="action-arrow">
            <ArrowRightOutlined />
          </div>
        </div>
        
        <div class="action-card notifications" @click="$emit('quickAction', 'notifications')">
          <div class="action-icon">
            <BellOutlined />
          </div>
          <div class="action-content">
            <h4>{{ t('dashboard.notificationsTitle') }}</h4>
            <p>{{ t('dashboard.checkNotifications') }}</p>
          </div>
          <div class="action-arrow">
            <ArrowRightOutlined />
          </div>
        </div>
        
        <!--div class="action-card messages" @click="$emit('quickAction', 'messages')">
          <div class="action-icon">
            <MessageOutlined />
          </div>
          <div class="action-content">
            <h4>Mensagens</h4>
            <p>Chat e suporte</p>
          </div>
          <div class="action-arrow">
            <ArrowRightOutlined />
          </div>
        </!--div-->
        
        <!-- Comentado temporariamente -->
        <!-- 
        <div class="action-card wallet" @click="$emit('quickAction', 'wallet')">
          <div class="action-icon">
            <WalletOutlined />
          </div>
          <div class="action-content">
            <h4>{{ t('dashboard.wallet') }}</h4>
            <p>Carteira e pagamentos</p>
          </div>
          <div class="action-arrow">
            <ArrowRightOutlined />
          </div>
        </div>
        
        <div class="action-card points" @click="$emit('quickAction', 'use-points')">
          <div class="action-icon">
            <GiftOutlined />
          </div>
          <div class="action-content">
            <h4>Usar Pontos</h4>
            <p>Troque por descontos</p>
          </div>
          <div class="action-arrow">
            <ArrowRightOutlined />
          </div>
        </div>
        -->
      </div>
    </section>

    <!-- Statistics Overview -->
    <section class="stats-overview-section">
      <h3 class="section-title">{{ t('dashboard.activitySummary') }}</h3>
      
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon-bg">
            <BookOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ userStats.totalBookings }}</div>
            <div class="stat-label">{{ t('dashboard.totalBookingsLabel') }}</div>
            <div class="stat-change positive">
              <ArrowUpOutlined /> +{{ userStats.bookingGrowth || 15 }}% {{ t('dashboard.thisMonthGrowth') }}
            </div>
          </div>
        </div>
        
        <div class="stat-card secondary">
          <div class="stat-icon-bg">
            <StarOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ userStats.availablePoints }}</div>
            <div class="stat-label">{{ t('dashboard.availablePointsLabel') }}</div>
            <div class="stat-change">
              ≈ {{ formatCurrency(userStats.availablePoints * 0.5) }} {{ t('dashboard.pointsDiscount') }}
            </div>
          </div>
        </div>
        
        <div class="stat-card accent">
          <div class="stat-icon-bg">
            <TrophyOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ user.clientRating.toFixed(1) }}</div>
            <div class="stat-label">{{ t('dashboard.clientRating') }}</div>
            <div class="stat-change">
              {{ getClientClassification(user.clientRating) }}
            </div>
          </div>
        </div>
        
        <!--div-- class="stat-card neutral">
          <div class="stat-icon-bg">
            <WalletOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ formatCurrency(userStats.totalSpent) }}</div>
            <div class="stat-label">Total Gasto</div>
            <div class="stat-change">
              {{ formatCurrency(userStats.totalSpent / 12) }}/mês médio
            </div>
          </div>
        </!--div-->
      </div>
    </section>

    <!-- Performance Charts -->
    <section class="performance-section">
      <div class="performance-grid">
        <!-- Spending Chart -->
        <!--div-- class="chart-card">
          <div class="chart-header">
            <h4>{{ t('dashboard.spendingHistory') }}</h4>
            <a-select v-model:value="chartPeriod" size="small">
              <a-select-option value="6months">{{ t('dashboard.months6') }}</a-select-option>
              <a-select-option value="12months">{{ t('dashboard.months12') }}</a-select-option>
            </a-select>
          </div>
          
          <div class="chart-summary">
            <div class="summary-item">
              <div class="summary-value">{{ formatCurrency(monthlySpending.reduce((a, b) => a + b, 0)) }}</div>
              <div class="summary-label">{{ t('dashboard.totalPeriod') }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-value positive">+{{ getGrowthPercentage() }}%</div>
              <div class="summary-label">{{ t('dashboard.growth') }}</div>
            </div>
          </div>
          
          <div class="mini-chart">
            <div v-for="(spending, index) in monthlySpending" :key="index" class="chart-bar">
              <div 
                class="bar-fill" 
                :style="{ height: (spending / Math.max(...monthlySpending) * 100) + '%' }"
              ></div>
              <div class="bar-label">{{ getMonthLabel(index) }}</div>
            </div>
          </div>
        </!--div-->
        
        <!-- Metrics Circles -->
        <!--div-- class="metrics-card">
          <div class="metrics-header">
            <h4>{{ t('dashboard.performanceTitle') }}</h4>
          </div>
          
          <div class="metrics-grid">
            <div class="metric-circle-item">
              <div class="metric-circle" :style="{ '--progress': (userStats.totalBookings / 20 * 100) }">
                <div class="metric-value">{{ userStats.totalBookings }}</div>
                <div class="metric-label">{{ t('dashboard.bookingsLabel') }}</div>
              </div>
            </div>
            
            <div class="metric-circle-item">
              <div class="metric-circle" :style="{ '--progress': 85 }">
                <div class="metric-value">85%</div>
                <div class="metric-label">{{ t('dashboard.satisfaction') }}</div>
              </div>
            </div>
            
            <div class="metric-circle-item">
              <div class="metric-circle" :style="{ '--progress': user.clientRating * 20 }">
                <div class="metric-value">{{ user.clientRating.toFixed(1) }}</div>
                <div class="metric-label">{{ t('dashboard.rating') }}</div>
              </div>
            </div>
          </div>
          
          <div class="performance-insights">
            <div class="insight-item">
              <TrendingUpOutlined class="insight-icon positive" />
              <div class="insight-content">
                <span class="insight-title">{{ t('dashboard.positivetrend') }}</span>
                <span class="insight-desc">+23% {{ t('dashboard.bookingsVsPrevious') }}</span>
              </div>
            </div>
          </div>
        </!--div-->
      </div>
    </section>

    <!-- Goals & Achievements -->
    <!--section class="goals-section">
      <h3 class="section-title">{{ t('dashboard.goalsAchievementsTitle') }}</h3>
      
      <div class="goals-grid">
        <div v-for="goal in clientGoals" :key="goal.id" class="goal-card" :class="{ completed: goal.completed }">
          <div class="goal-progress-ring" :style="{ '--progress': (goal.current / goal.target) * 100 }">
            <div class="goal-icon" :style="{ backgroundColor: goal.color }">
              <CalendarOutlined v-if="goal.icon === 'CalendarOutlined'" />
              <StarOutlined v-else-if="goal.icon === 'StarOutlined'" />
              <WalletOutlined v-else />
            </div>
          </div>
          
          <div class="goal-content">
            <h4 class="goal-title">{{ goal.title }}</h4>
            <p class="goal-description">{{ goal.description }}</p>
            
            <div class="goal-progress">
              <div class="progress-text">
                <span class="current">{{ goal.current }}</span>
                <span class="separator">/</span>
                <span class="target">{{ goal.target }}</span>
              </div>
              <div class="progress-percentage">{{ Math.round((goal.current / goal.target) * 100) }}%</div>
            </div>
            
            <div class="goal-reward">
              🎁 {{ goal.reward }}
            </div>
          </div>
          
          <div v-if="goal.completed" class="completion-badge">
            <CheckCircleOutlined />
          </div>
        </div>
      </div>
    </section-->
  </div>
</template>

<script setup>
import { 
  CalendarOutlined,
  BookOutlined,
  StarOutlined,
  //WalletOutlined,
  //CheckCircleOutlined,
  SearchOutlined,
  ArrowUpOutlined,
  //TrendingUpOutlined,
  ArrowRightOutlined,
  BellOutlined,
  //MessageOutlined,
  TrophyOutlined
} from '@ant-design/icons-vue'

import { defineProps, defineEmits, ref } from 'vue'
import { useLanguageAndCurrency } from '../../composables/useLanguageAndCurrency'

// Use language functionality
const { t, formatCurrency } = useLanguageAndCurrency()

defineProps({
  user: Object,
  userStats: Object,
  recentActivities: Array,
  getClientClassification: Function
})

defineEmits(['quickAction'])

// Reactive data
//const chartPeriod = ref('6months')

// Mock data for client spending history
//const monthlySpending = ref([1200, 1800, 2100, 1900, 2600, 3200])

const user = ref({
  clientRating: 4.5
})

// Client-focused goals
/*const clientGoals = ref([
  {
    id: 1,
    title: 'Viajante Frequente',
    description: '10 reservas este ano',
    current: 6,
    target: 10,
    color: '#52c41a',
    icon: 'CalendarOutlined',
    completed: false,
    reward: '+100 pontos bônus'
  },
  {
    id: 2,
    title: 'Economia Verde',
    description: '5 veículos elétricos',
    current: 2,
    target: 5,
    color: '#1890ff',
    icon: 'StarOutlined',
    completed: false,
    reward: '15% desconto na próxima'
  },
  {
    id: 3,
    title: 'Cliente Premium',
    description: 'R$ 5.000 em reservas',
    current: 3200,
    target: 5000,
    color: '#722ed1',
    icon: 'WalletOutlined',
    completed: false,
    reward: 'Upgrade gratuito'
  }
])*/

// Helper functions
/*const getMonthLabel = (index) => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
  return months[index] || 'N/A'
}

const getGrowthPercentage = () => {
  if (monthlySpending.value.length < 2) return 0
  const first = monthlySpending.value[0]
  const last = monthlySpending.value[monthlySpending.value.length - 1]
  return ((last - first) / first * 100).toFixed(1)
}*/
</script>

<style scoped>
/* Overview Tab Content - Integrado com OwnerDashboard */
.overview-tab-content {
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

/* Quick Actions Section */
.quick-actions-section {
  margin-bottom: 32px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.action-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent-gradient);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  border-color: #667eea;
}

.action-card:hover::before {
  transform: scaleX(1);
}

.action-card.search {
  --accent-gradient: linear-gradient(135deg, #667eea, #764ba2);
}

.action-card.bookings {
  --accent-gradient: linear-gradient(135deg, #f093fb, #f5576c);
}

.action-card.notifications {
  --accent-gradient: linear-gradient(135deg, #4facfe, #00f2fe);
}

.action-card.messages {
  --accent-gradient: linear-gradient(135deg, #43e97b, #38f9d7);
}

.action-card.wallet {
  --accent-gradient: linear-gradient(135deg, #4facfe, #00f2fe);
}

.action-card.points {
  --accent-gradient: linear-gradient(135deg, #43e97b, #38f9d7);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  background: var(--accent-gradient);
  flex-shrink: 0;
}

.action-content {
  flex: 1;
}

.action-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.action-content p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.action-arrow {
  color: #9ca3af;
  transition: all 0.3s ease;
}

.action-card:hover .action-arrow {
  color: #667eea;
  transform: translateX(4px);
}

/* Statistics Overview */
.stats-overview-section {
  margin-bottom: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
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
  --stat-gradient: linear-gradient(135deg, #667eea, #764ba2);
}

.stat-card.secondary {
  --stat-gradient: linear-gradient(135deg, #f093fb, #f5576c);
}

.stat-card.accent {
  --stat-gradient: linear-gradient(135deg, #43e97b, #38f9d7);
}

.stat-card.neutral {
  --stat-gradient: linear-gradient(135deg, #6b7280, #374151);
}

.stat-icon-bg {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: var(--stat-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  margin-bottom: 16px;
}

.stat-content .stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-content .stat-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-change.positive {
  color: #059669;
}

/* Performance Section */
.performance-section {
  margin-bottom: 32px;
}

.performance-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.chart-card,
.metrics-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
}

.chart-header,
.metrics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h4,
.metrics-header h4 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.chart-summary {
  display: flex;
  gap: 32px;
  margin-bottom: 20px;
}

.summary-item {
  text-align: center;
}

.summary-value {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.summary-value.positive {
  color: #059669;
}

.summary-label {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.mini-chart {
  display: flex;
  align-items: end;
  gap: 8px;
  height: 80px;
  padding: 0 8px;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: all 0.3s ease;
}

.bar-label {
  font-size: 10px;
  color: #6b7280;
  font-weight: 500;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.metric-circle-item {
  text-align: center;
}

.metric-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: conic-gradient(#667eea calc(var(--progress) * 1%), #e5e7eb 0);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 auto 8px;
}

.metric-circle::before {
  content: '';
  position: absolute;
  width: 44px;
  height: 44px;
  background: white;
  border-radius: 50%;
}

.metric-value,
.metric-label {
  position: relative;
  z-index: 1;
}

.metric-value {
  font-size: 12px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.metric-label {
  font-size: 10px;
  color: #6b7280;
}

.performance-insights {
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
}

.insight-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.insight-icon.positive {
  color: #059669;
  font-size: 16px;
}

.insight-content {
  display: flex;
  flex-direction: column;
}

.insight-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.insight-desc {
  font-size: 12px;
  color: #6b7280;
}

/* Goals Section */
.goals-section {
  margin-bottom: 32px;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.goal-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  position: relative;
  transition: all 0.3s ease;
}

.goal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.goal-card.completed {
  border-color: #059669;
  background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
}

.goal-progress-ring {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: conic-gradient(#e5e7eb calc(var(--progress) * 1%), transparent 0);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.goal-progress-ring::before {
  content: '';
  position: absolute;
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 50%;
}

.goal-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  position: relative;
  z-index: 1;
}

.goal-content {
  flex: 1;
}

.goal-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.goal-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
}

.goal-progress {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-text {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.separator {
  color: #9ca3af;
  margin: 0 4px;
}

.progress-percentage {
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
}

.goal-reward {
  background: #fef3c7;
  color: #d97706;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.completion-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  color: #059669;
  font-size: 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .performance-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .chart-summary {
    gap: 16px;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .goals-grid {
    grid-template-columns: 1fr;
  }
  
  .goal-card {
    flex-direction: column;
    text-align: center;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
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
</style>