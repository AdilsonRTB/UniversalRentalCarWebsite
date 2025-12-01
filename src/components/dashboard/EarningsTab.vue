<template>
  <div class="earnings-tab">
    <h2 class="page-title">{{ $t('earnings.earningsReport') }}</h2>
    
    <a-row :gutter="[16, 16]" class="earnings-stats">
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="stat-card primary">
          <a-statistic
            :title="$t('earnings.earningsThisMonth')"
            :value="earningsData.monthlyEarnings"
            :prefix="formatCurrency(0).slice(0, -4)"
            :precision="2"
            :value-style="{ color: '#fff' }"
          >
            <template #prefix>
              <DollarOutlined style="color: #fff;" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="stat-card secondary">
          <a-statistic
            :title="$t('earnings.totalEarnings')"
            :value="earningsData.totalEarnings"
            :prefix="formatCurrency(0).slice(0, -4)"
            :precision="2"
            :value-style="{ color: '#fff' }"
          />
        </a-card>
      </a-col>
      
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="stat-card accent">
          <a-statistic
            :title="$t('earnings.occupancyRate')"
            :value="earningsData.occupancyRate"
            suffix="%"
            :value-style="{ color: '#fff' }"
          />
        </a-card>
      </a-col>
      
      <a-col :xs="24" :sm="12" :lg="6">
        <a-card class="stat-card neutral">
          <a-statistic
            :title="$t('earnings.completedReservations')"
            :value="earningsData.completedReservations"
            :value-style="{ color: '#fff' }"
          />
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" style="margin-top: 24px;">
      <a-col :xs="24" :lg="12">
        <a-card :title="$t('earnings.earningsPerMonth')" class="chart-card">
          <div class="chart-placeholder">
            <BarChartOutlined style="font-size: 3rem; color: #ccc;" />
            <p>{{ $t('earnings.monthlyEarningsChart') }}</p>
          </div>
        </a-card>
      </a-col>
      
      <a-col :xs="24" :lg="12">
        <a-card :title="$t('earnings.distributionByVehicle')" class="chart-card">
          <div class="chart-placeholder">
            <PieChartOutlined style="font-size: 3rem; color: #ccc;" />
            <p>{{ $t('earnings.vehicleDistributionChart') }}</p>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-card :title="$t('earnings.transactionHistory')" style="margin-top: 24px;">
      <a-table
        :columns="transactionsColumns"
        :dataSource="transactionHistory"
        :pagination="{ pageSize: 10 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'amount'">
            <span :class="{ 'positive-amount': record.amount > 0, 'negative-amount': record.amount < 0 }">
              {{ record.amount > 0 ? '+' : '' }}{{ formatCurrency(Math.abs(record.amount)) }}
            </span>
          </template>
          
          <template v-if="column.key === 'date'">
            {{ formatDate(record.date) }}
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import {
  DollarOutlined,
  BarChartOutlined,
  PieChartOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { useLanguageAndCurrency } from '../../composables/useLanguageAndCurrency'

const { t } = useI18n()
const { formatCurrency } = useLanguageAndCurrency()

defineProps({
  earningsData: {
    type: Object,
    default: () => ({
      monthlyEarnings: 0,
      totalEarnings: 0,
      occupancyRate: 0,
      completedReservations: 0
    })
  },
  transactionHistory: {
    type: Array,
    default: () => []
  }
})

const transactionsColumns = computed(() => [
  {
    title: t('earnings.date'),
    dataIndex: 'date',
    key: 'date'
  },
  {
    title: t('earnings.description'),
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: t('earnings.amount'),
    dataIndex: 'amount',
    key: 'amount'
  },
  {
    title: t('earnings.status'),
    dataIndex: 'status',
    key: 'status'
  }
])

const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}
</script>

<style scoped>
.page-title {
  margin-bottom: 24px;
  color: #273F4F;
}

.earnings-stats {
  margin-bottom: 24px;
}

.stat-card {
  text-align: center;
}

.stat-card.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card.secondary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stat-card.accent {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stat-card.neutral {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.chart-card {
  height: 300px;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}

.positive-amount {
  color: #52c41a;
  font-weight: 600;
}

.negative-amount {
  color: #ff4d4f;
  font-weight: 600;
}
</style>
