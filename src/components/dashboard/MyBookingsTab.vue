<template>
  <div class="my-bookings-content">

    <div class="breadcrumb-modern">
      <!--router-link to="/owner-dashboard?tab=overview" class="breadcrumb-link">Dashboard</!--router-link-->
      <span class="breadcrumb-link">Dashboard</span>
      <span class="breadcrumb-separator">›</span>
      <span class="breadcrumb-current">{{ $t('bookings.myBookingsClient') }}</span>

    </div>

    <!-- Actions & Filters Section -->
    <section class="actions-section">
      <div class="actions-card">
        <div class="actions-header">
          <h4>{{ $t('bookings.actionsAndFilters') }}</h4>
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
            <label>{{ $t('bookings.status') }}</label>
            <a-select
              v-model:value="statusFilter"
              :placeholder="$t('bookings.filterByStatus')"
              style="width: 100%"
              allow-clear
            >
              <a-select-option value="pending">{{ $t('bookings.pending') }}</a-select-option>
              <a-select-option value="confirmed">{{ $t('bookings.confirmed') }}</a-select-option>
              <a-select-option value="active">{{ $t('bookings.active') }}</a-select-option>
              <a-select-option value="completed">{{ $t('bookings.completed') }}</a-select-option>
              <a-select-option value="cancelled">{{ $t('bookings.cancelled') }}</a-select-option>
            </a-select>
          </div>
          
          <div class="filter-item">
            <label>{{ $t('bookings.period') }}</label>
            <a-range-picker 
              v-model:value="dateRange"
              style="width: 100%"
              format="DD/MM/YYYY"
              :placeholder="[$t('common.startDate'), $t('common.endDate')]"
            />
          </div>
          
          <div class="filter-item">
            <label>{{ $t('bookings.sortBy') }}</label>
            <a-select
              v-model:value="sortBy"
              :placeholder="$t('bookings.sortBy')"
              style="width: 100%"
            >
              <a-select-option value="date-desc">{{ $t('bookings.sortDateNewest') }}</a-select-option>
              <a-select-option value="date-asc">{{ $t('bookings.sortDateOldest') }}</a-select-option>
              <a-select-option value="price-desc">{{ $t('bookings.sortValueHighest') }}</a-select-option>
              <a-select-option value="price-asc">{{ $t('bookings.sortValueLowest') }}</a-select-option>
            </a-select>
          </div>
        </div>

        <!-- Clear Filters Button -->
        <div class="filters-actions" v-if="hasActiveFilters">
          <a-button @click="clearFilters" class="clear-filters-btn">
            <DeleteOutlined /> {{ $t('bookings.clearFilters') }}
          </a-button>
        </div>
      </div>
    </section>

    <!-- Bookings Grid -->
    <section class="bookings-section">
      <div class="bookings-header">
        <h4>{{ filteredBookings.length }} {{ $t('bookings.bookingsFound') }}</h4>
        <a-space>
          <a-button @click="refreshBookings">
            <ReloadOutlined /> {{ $t('bookings.update') }}
          </a-button>
        </a-space>
      </div>

      <div class="bookings-grid" v-if="filteredBookings.length > 0">
        <div 
          v-for="booking in paginatedBookings"
          :key="booking.id" 
          class="booking-card"
          :class="{ 
            'pending': booking.status === 'pending',
            'confirmed': booking.status === 'confirmed',
            'active': booking.status === 'active',
            'completed': booking.status === 'completed',
            'cancelled': booking.status === 'cancelled'
          }"
        >
          <!-- Vehicle Image/Icon -->
          <div class="vehicle-cover">
            <div class="vehicle-icon-wrapper">
              <CarOutlined class="vehicle-icon-similar" v-if="!booking.vehicle_info.primary_photo && !booking.vehicle_info.photo"/>
              <img :src="url + (booking.vehicle_info.primary_photo || booking.vehicle_info.photo)" :alt="`${booking.vehicle_info?.brand} ${booking.vehicle_info?.model}`" class="vehicle-photo-modern" v-else/>
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
                <span class="summary-value price">{{ formatPrice(booking.total_amount) }}</span>
              </div>
            </div>
            <div class="summary-item">
              <ClockCircleOutlined />
              <div class="summary-info">
                <span class="summary-label">{{ $t('bookings.days') }}</span>
                <span class="summary-value">{{ booking.days_duration }} {{ $t('bookings.daysLabel') }}</span>
              </div>
            </div>
          </div>

          <!-- Progress Bar (for active bookings) -->
          <div v-if="['pending', 'confirmed'].includes(booking.status)" class="progress-section">
            <div class="progress-info">
              <span>{{ $t('bookings.tripProgress') }}</span>
              <span>{{ getBookingProgress(booking) }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: getBookingProgress(booking) + '%' }"></div>
            </div>
          </div>
          <div v-else class="progress-section">
            <div class="progress-info">
              <span>{{ $t('bookings.tripProgress') }}</span>
              <span> </span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: getBookingProgress(booking) + '%' }"></div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card-actions">
            <a-button @click="navigateToVehicleDetails(booking)" class="action-btn">
              <EyeOutlined /> {{ $t('bookings.details') }}
            </a-button>
            <!--a-button @click="navigateToMessages" class="action-btn">
              <MessageOutlined /> Contato
            </!--a-button-->
            <!--a-button
              v-if="['pending', 'confirmed'].includes(booking.status)"
              danger
              @click="$emit('cancel-booking', booking)"
              class="action-btn"
            >
              <DeleteOutlined /> {{ $t('bookings.cancel') }}
            </a-button-->
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
        <h4>{{ $t('bookings.noBookingsFound') }}</h4>
        <p>{{ $t('bookings.noBookingsMessage') }}</p>
        <a-button type="primary" @click="navigateToSearch">
          <PlusOutlined /> {{ $t('bookings.makeNewBooking') }}
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
          :showTotal="paginationShowTotal"
        />
      </div>
    </section>

    <!-- Booking Details Modal -->
    <a-modal
      v-model:open="detailsModalVisible"
      :title="$t('bookings.rentalDetails')"
      :width="800"
      :footer="null"
      @cancel="closeDetailsModal"
    >
      <div class="details-modal-content" v-if="selectedBookingDetails">
        <!-- Vehicle Info -->
        <div class="details-section">
          <h4 class="details-section-title">
            <CarOutlined /> {{ $t('bookings.vehicleInformation') }}
          </h4>
          <div class="details-vehicle-card">
            <div class="details-vehicle-image">
              <CarOutlined v-if="!selectedBookingDetails.vehicle_info?.primary_photo && !selectedBookingDetails.vehicle_info?.photo" />
              <img :src="url + (selectedBookingDetails.vehicle_info?.primary_photo || selectedBookingDetails.vehicle_info?.photo)" :alt="selectedBookingDetails.vehicle_info?.brand" v-else />
            </div>
            <div class="details-vehicle-info">
              <h5>{{ selectedBookingDetails.vehicle_info?.brand }} {{ selectedBookingDetails.vehicle_info?.model }}</h5>
              <p><strong>{{ $t('bookings.year') }}:</strong> {{ selectedBookingDetails.vehicle_info?.year }}</p>
              <p><strong>{{ $t('bookings.plate') }}:</strong> {{ selectedBookingDetails.vehicle_info?.registration_number }}</p>
            </div>
          </div>
        </div>

        <!-- Rental Period -->
        <div class="details-section">
          <h4 class="details-section-title">
            <CalendarOutlined /> {{ $t('bookings.rentalPeriod') }}
          </h4>
          <div class="details-grid">
            <div class="details-item">
              <span class="details-label">{{ $t('bookings.startDate') }}</span>
              <span class="details-value">{{ formatDate(selectedBookingDetails.start_date) }}</span>
            </div>
            <div class="details-item">
              <span class="details-label">{{ $t('bookings.endDate') }}</span>
              <span class="details-value">{{ formatDate(selectedBookingDetails.end_date) }}</span>
            </div>
            <div class="details-item">
              <span class="details-label">{{ $t('bookings.duration') }}</span>
              <span class="details-value">{{ selectedBookingDetails.days_duration }} {{ $t('bookings.daysLabel') }}</span>
            </div>
            <div class="details-item">
              <span class="details-label">{{ $t('bookings.status') }}</span>
              <span class="details-value" :class="selectedBookingDetails.status.toLowerCase()">
                {{ selectedBookingDetails.status_display }}
              </span>
            </div>
          </div>
        </div>

        <!-- Locations -->
        <div class="details-section">
          <h4 class="details-section-title">
            <EnvironmentOutlined /> {{ $t('bookings.locations') }}
          </h4>
          <div class="details-grid">
            <div class="details-item">
              <span class="details-label">{{ $t('bookings.pickupLocation') }}</span>
              <span class="details-value">{{ selectedBookingDetails.pickup_location_info?.name || '-' }}</span>
              <span class="details-subtext" v-if="selectedBookingDetails.pickup_location_info?.address">
                {{ selectedBookingDetails.pickup_location_info.address }}
              </span>
            </div>
            <div class="details-item">
              <span class="details-label">{{ $t('bookings.returnLocation') }}</span>
              <span class="details-value">{{ selectedBookingDetails.return_location_info?.name || '-' }}</span>
              <span class="details-subtext" v-if="selectedBookingDetails.return_location_info?.address">
                {{ selectedBookingDetails.return_location_info.address }}
              </span>
            </div>
          </div>
        </div>

        <!-- Additional Services -->
        <div class="details-section" v-if="selectedBookingDetails.driver || selectedBookingDetails.car_seat || hasServiceFees(selectedBookingDetails)">
          <h4 class="details-section-title">
            <CheckCircleOutlined /> {{ $t('bookings.additionalServices') }}
          </h4>
          <div class="details-services">
            <div class="service-tag" v-if="selectedBookingDetails.driver">
              <UserOutlined /> {{ $t('bookings.driverService') }}
              <span class="service-price">{{ formatPrice(selectedBookingDetails.payment_details?.driver_fee_total || 0) }}</span>
            </div>
            <div class="service-tag" v-if="selectedBookingDetails.car_seat">
              <SafetyOutlined /> {{ $t('bookings.carSeat') }}
              <span class="service-price">{{ formatPrice(selectedBookingDetails.payment_details?.car_seat_fee_total || 0) }}</span>
            </div>
            <div class="service-tag service-fee-tag" v-if="selectedBookingDetails.service_fees?.insurance_fee > 0">
              <SafetyOutlined /> {{ $t('bookings.insuranceFee') }}
              <span class="service-price">{{ formatPrice(selectedBookingDetails.service_fees.insurance_fee) }}</span>
            </div>
            <div class="service-tag service-fee-tag" v-if="selectedBookingDetails.service_fees?.security_deposit > 0">
              <DollarOutlined /> {{ $t('bookings.securityDeposit') }}
              <span class="service-price">{{ formatPrice(selectedBookingDetails.service_fees.security_deposit) }}</span>
            </div>
            <div class="service-tag service-fee-tag" v-if="selectedBookingDetails.service_fees?.commission_amount > 0">
              <PercentageOutlined /> {{ $t('bookings.commission') }}
              <span class="service-price">{{ formatPrice(selectedBookingDetails.service_fees.commission_amount) }}</span>
            </div>
            <div class="service-tag service-fee-tag" v-if="selectedBookingDetails.service_fees?.late_return_fee > 0">
              <ClockCircleOutlined /> {{ $t('bookings.lateReturnFee') }}
              <span class="service-price">{{ formatPrice(selectedBookingDetails.service_fees.late_return_fee) }}</span>
            </div>
            <div class="service-tag service-fee-tag" v-if="selectedBookingDetails.service_fees?.damage_fee > 0">
              <ToolOutlined /> {{ $t('bookings.damageFee') }}
              <span class="service-price">{{ formatPrice(selectedBookingDetails.service_fees.damage_fee) }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Details -->
        <div class="details-section">
          <h4 class="details-section-title">
            <DollarOutlined /> {{ $t('bookings.paymentDetails') }}
          </h4>
          <div class="details-payment">
            <div class="payment-row">
              <span>{{ $t('bookings.dailyRate') }}</span>
              <span>{{ formatPrice(selectedBookingDetails.daily_rate) }}</span>
            </div>
            <div class="payment-row">
              <span>{{ $t('bookings.subtotal') }} ({{ selectedBookingDetails.days_duration }} {{ $t('bookings.daysLabel') }})</span>
              <span>{{ formatPrice(selectedBookingDetails.subtotal) }}</span>
            </div>
            <div class="payment-row" v-if="selectedBookingDetails.payment_details?.total_services_fees > 0">
              <span>{{ $t('bookings.servicesFees') }}</span>
              <span>{{ formatPrice(selectedBookingDetails.payment_details.total_services_fees) }}</span>
            </div>
            <div class="payment-row total">
              <span>{{ $t('bookings.total') }}</span>
              <span>{{ formatPrice(selectedBookingDetails.total_amount) }}</span>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="details-section" v-if="selectedBookingDetails.notes">
          <h4 class="details-section-title">
            <FileTextOutlined /> {{ $t('bookings.notes') }}
          </h4>
          <div class="details-notes">
            {{ selectedBookingDetails.notes }}
          </div>
        </div>

        <!-- Created Date -->
        <div class="details-footer">
          <span class="details-created">
            {{ $t('bookings.bookedOn') }}: {{ formatDate(selectedBookingDetails.created_at) }}
          </span>
        </div>
      </div>
    </a-modal>

    <!-- Rating Modal -->
    <a-modal
      v-model:open="ratingModalVisible"
      :title="$t('bookings.rateRental')"
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
            <p>{{ $t('bookings.period') }}: {{ formatDate(selectedBooking.start_date) }} - {{ formatDate(selectedBooking.end_date) }}</p>
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
            :label="$t('bookings.overallRating')"
            name="overall_rating"
            :rules="[{ required: true, message: $t('bookings.overallRatingError') }]"
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
            :label="$t('bookings.vehicleCondition')" 
            name="vehicle_condition_rating"
            :rules="[{ required: true, message: $t('bookings.vehicleConditionError') }]"
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
            :label="$t('bookings.serviceQuality')" 
            name="service_quality_rating"
            :rules="[{ required: true, message: $t('bookings.serviceQualityError') }]"
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
            :label="$t('bookings.valueForMoney')" 
            name="value_for_money_rating"
            :rules="[{ required: true, message: $t('bookings.valueForMoneyError') }]"
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
              :placeholder="$t('bookings.commentsPlaceholder')"
              :rows="4"
              :maxlength="500"
              show-count
            />
          </a-form-item>

          <!-- Would Recommend -->
          <a-form-item  name="would_recommend">
            <a-radio-group v-model:value="ratingForm.would_recommend" style="display: flex; gap: 12px;">
              <a-radio :value="true">{{ $t('bookings.wouldRecommend') }}</a-radio>
              <a-radio :value="false">{{ $t('bookings.wouldNotRecommend') }}</a-radio>
            </a-radio-group>
          </a-form-item>

          <!-- Had Issues -->
          <a-form-item  name="had_issues">
            <a-radio-group v-model:value="ratingForm.had_issues" @change="onIssuesChange" style="display: flex; gap: 12px;">
              <a-radio :value="false">{{ $t('bookings.noProblems') }}</a-radio>
              <a-radio :value="true">{{ $t('bookings.hadProblems') }}</a-radio>
            </a-radio-group>
          </a-form-item>

          <!-- Issue Description (conditional) -->
          <a-form-item 
            v-if="ratingForm.had_issues"
            name="issue_description"
            :rules="ratingForm.had_issues ? [{ required: true, message: $t('bookings.issueDescriptionError') }] : []"
          >
            <a-textarea
              v-model:value="ratingForm.issue_description"
              :placeholder="$t('bookings.issueDescriptionPlaceholder')"
              :rows="3"
              :maxlength="300"
              show-count
            />
          </a-form-item>

          <!-- Form Actions -->
          <div class="form-actions">
            <a-button @click="closeRatingModal" style="margin-right: 12px">
              {{ $t('common.cancel') }}
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
              {{ $t('bookings.submitRating') }}
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
  //DeleteOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  ReloadOutlined,
  InboxOutlined,
  StarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
  FileTextOutlined,
  PercentageOutlined,
  ToolOutlined
} from '@ant-design/icons-vue'

import dayjs from 'dayjs'
import { defineProps, defineEmits, ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLanguageAndCurrency } from '../../composables/useLanguageAndCurrency'
import { baseURL, vehicleService } from '../../services/api'

const url = computed(() => baseURL)

// Internationalization
const { t } = useI18n()

const { currentCurrency } = useLanguageAndCurrency()
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
const pageSize = ref(5)
const dateRange = ref([])
const sortBy = ref('date-desc')
const statusFilter = ref(null)
const config = ref({})

// Load system config for exchange rates
const loadSystemConfig = async () => {
  try {
    const response = await vehicleService.getSystemConfig()
    config.value = response.data
  } catch (error) {
    console.error('Erro ao carregar configuração do sistema:', error)
  }
}

// Convert CVE to selected currency
const convertFromCVE = (amountInCVE) => {
  if (!amountInCVE || !config.value) return amountInCVE
  
  const amount = parseFloat(amountInCVE)
  
  switch (currentCurrency.value) {
    case 'USD': {
      const usdRate = parseFloat(config.value.usd_exchange_rate || 100)
      return amount / usdRate
    }
    case 'EUR': {
      const eurRate = parseFloat(config.value.euro_exchange_rate || 100)
      return amount / eurRate
    }
    case 'CVE':
    default:
      return amount
  }
}

// Format price with currency symbol
const formatPrice = (amountInCVE) => {
  const convertedAmount = convertFromCVE(amountInCVE)
  
  switch (currentCurrency.value) {
    case 'USD':
      return `$${convertedAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`
    case 'EUR':
      return `${convertedAmount.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}€`
    case 'CVE':
    default:
      return `${convertedAmount.toLocaleString('pt-PT')} CVE`
  }
}

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

// Details modal data
const detailsModalVisible = ref(false)
const selectedBookingDetails = ref(null)

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

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(booking => booking.status === statusFilter.value)
  }

  // Date range filter
  if (dateRange.value && dateRange.value.length === 2) {
    const [startDate, endDate] = dateRange.value
    filtered = filtered.filter(booking => {
      const bookingStart = dayjs(booking.start_date)
      const bookingEnd = dayjs(booking.end_date)
      return bookingStart.isBetween(startDate, endDate, 'day', '[]') ||
             bookingEnd.isBetween(startDate, endDate, 'day', '[]')
    })
  }

  // Sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return dayjs(b.start_date).valueOf() - dayjs(a.start_date).valueOf()
      case 'date-asc':
        return dayjs(a.start_date).valueOf() - dayjs(b.start_date).valueOf()
      case 'price-desc':
        return parseFloat(b.total_amount) - parseFloat(a.total_amount)
      case 'price-asc':
        return parseFloat(a.total_amount) - parseFloat(b.total_amount)
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

const hasActiveFilters = computed(() => {
  return statusFilter.value !== null || (dateRange.value && dateRange.value.length === 2)
})

// Watch filters to reset pagination
watch([statusFilter, dateRange, sortBy], () => {
  currentPage.value = 1
})

// Pagination text function
const paginationShowTotal = (total, range) => {
  return `${range[0]}-${range[1]} ${t('bookings.paginationTotal')} ${total} ${t('bookings.myBookingsClient').toLowerCase()}`
}

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

const clearFilters = () => {
  statusFilter.value = null
  dateRange.value = []
  sortBy.value = 'date-desc'
  currentPage.value = 1
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
  if (rating <= 1) return t('bookings.ratingVeryBad')
  if (rating <= 2) return t('bookings.ratingBad')
  if (rating <= 3) return t('bookings.ratingRegular')
  if (rating <= 4) return t('bookings.ratingGood')
  return t('bookings.ratingExcellent')
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

    refreshBookings()
    
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
  router.push({ path: '/', hash: '#filtro' })
}

const navigateToVehicleDetails = (booking) => {
  selectedBookingDetails.value = booking
  detailsModalVisible.value = true
}

const closeDetailsModal = () => {
  detailsModalVisible.value = false
  selectedBookingDetails.value = null
}

const hasServiceFees = (booking) => {
  if (!booking || !booking.service_fees) return false
  const { insurance_fee, security_deposit, commission_amount, late_return_fee, damage_fee } = booking.service_fees
  return (insurance_fee > 0 || security_deposit > 0 || commission_amount > 0 || late_return_fee > 0 || damage_fee > 0)
}

// Load config on mount
onMounted(() => {
  loadSystemConfig()
})

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

/* Filters Actions */
.filters-actions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.clear-filters-btn {
  border-radius: 8px;
  font-weight: 500;
  color: #dc2626;
  border-color: #dc2626;
  transition: all 0.3s ease;
}

.clear-filters-btn:hover {
  background: #dc2626;
  color: white;
  border-color: #dc2626;
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

/* Details Modal Styles */
.details-modal-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 4px;
}

.details-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.details-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.details-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.details-section-title .anticon {
  color: #667eea;
  font-size: 18px;
}

.details-vehicle-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.details-vehicle-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  flex-shrink: 0;
  overflow: hidden;
}

.details-vehicle-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.details-vehicle-info h5 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.details-vehicle-info p {
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.details-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.details-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
}

.details-value {
  font-size: 14px;
  color: #111827;
  font-weight: 600;
}

.details-subtext {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

.details-services {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.service-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #f0f4ff, #e0e7ff);
  border: 1px solid #c7d2fe;
  border-radius: 8px;
  font-size: 14px;
  color: #4338ca;
  font-weight: 500;
}

.service-tag .anticon {
  font-size: 16px;
}

.service-price {
  margin-left: 8px;
  padding-left: 8px;
  border-left: 1px solid #c7d2fe;
  color: #059669;
  font-weight: 600;
}

.service-fee-tag {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 1px solid #fbbf24;
  color: #92400e;
}

.service-fee-tag .anticon {
  color: #d97706;
}

.service-fee-tag .service-price {
  border-left-color: #fbbf24;
  color: #d97706;
}

.details-payment {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
}

.payment-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
  color: #374151;
}

.payment-row:not(:last-child) {
  border-bottom: 1px solid #e5e7eb;
}

.payment-row.total {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 2px solid #d1d5db;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.payment-row.total span:last-child {
  color: #059669;
  font-size: 18px;
}

.details-notes {
  padding: 12px 16px;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 8px;
  font-size: 14px;
  color: #78350f;
  line-height: 1.6;
}

.details-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.details-created {
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
}

/* Responsive Details Modal */
@media (max-width: 768px) {
  .details-vehicle-card {
    flex-direction: column;
    text-align: center;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .details-services {
    flex-direction: column;
  }
  
  .service-tag {
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .details-modal-content {
    padding: 0;
  }
  
  .details-section {
    margin-bottom: 16px;
    padding-bottom: 16px;
  }
  
  .details-section-title {
    font-size: 14px;
  }
  
  .details-vehicle-card {
    padding: 12px;
  }
  
  .details-vehicle-image {
    width: 60px;
    height: 60px;
  }
  
  .payment-row {
    font-size: 13px;
  }
  
  .payment-row.total {
    font-size: 14px;
  }
}
</style>
