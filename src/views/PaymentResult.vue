<template>
  <div class="payment-result-container">
    <HeaderPage />
    <div class="payment-result-card">
      <a-spin v-if="isLoading" size="large" :tip="t('payment.checkingStatus')" />

      <template v-else>
        <a-result
          :status="resultStatus"
          :title="resultTitle"
          :sub-title="resultSubtitle"
        >
          <template #extra>
            <a-button v-if="canRetry" @click="tryAgain">
              {{ t('payment.tryAgain') }}
            </a-button>
            <a-button type="primary" @click="goToDashboard">{{ t('payment.goToDashboard') }}</a-button>
            <a-button @click="goToBookingStatus">{{ t('payment.goToBookingStatus') }}</a-button>
          </template>
        </a-result>

        <!-- Detalhes da Reserva -->
        <section v-if="rental" class="details-block">
          <h3 class="details-block-title">{{ t('payment.reservationDetailsTitle') }}</h3>
          <table class="details-table">
            <tbody>
              <tr>
                <th>{{ t('payment.detailVehicle') }}</th>
                <td>{{ vehicleName }}</td>
              </tr>
              <tr v-if="rental.vehicle_info?.registration_number">
                <th>{{ t('payment.detailPlate') }}</th>
                <td>{{ rental.vehicle_info.registration_number }}</td>
              </tr>
              <tr>
                <th>{{ t('payment.detailStartDate') }}</th>
                <td>{{ formatDate(rental.start_date) }}</td>
              </tr>
              <tr>
                <th>{{ t('payment.detailEndDate') }}</th>
                <td>{{ formatDate(rental.end_date) }}</td>
              </tr>
              <tr>
                <th>{{ t('payment.detailDays') }}</th>
                <td>{{ rental.number_of_days }}</td>
              </tr>
              <tr>
                <th>{{ t('payment.detailPickupLocation') }}</th>
                <td>{{ pickupLocationName }}</td>
              </tr>
              <tr>
                <th>{{ t('payment.detailReturnLocation') }}</th>
                <td>{{ returnLocationName }}</td>
              </tr>
              <tr class="details-row-strong">
                <th>{{ t('payment.detailEstimatedTotal') }}</th>
                <td>{{ formatMoney(rental.subtotal) }}</td>
              </tr>
              <tr>
                <th>{{ t('payment.detailDeposit') }}</th>
                <td>{{ formatMoney(rental.security_deposit) }}</td>
              </tr>
              <tr class="details-row-total">
                <th>{{ t('payment.detailTotal') }}</th>
                <td>{{ formatMoney(rental.total_amount) }}</td>
              </tr>
              <template v-if="payment?.status === 'authorized'">
                <tr>
                  <th>{{ t('payment.detailTransactionRef') }}</th>
                  <td>{{ payment.merchant_ref }}<span v-if="payment.transaction_id"> ({{ payment.transaction_id }})</span></td>
                </tr>
                <tr>
                  <th>{{ t('payment.detailPaymentDate') }}</th>
                  <td>{{ formatDate(payment.updated_at) }}</td>
                </tr>
                <tr v-if="payment.dcc_applied">
                  <th>{{ t('payment.detailDccNotice') }}</th>
                  <td>{{ payment.dcc_amount }} {{ payment.dcc_currency }}<span v-if="payment.dcc_rate"> · {{ t('payment.detailDccRate') }}: {{ payment.dcc_rate }}</span></td>
                </tr>
              </template>
            </tbody>
          </table>
        </section>

        <!-- Contacto de apoio (pagamento com sucesso) -->
        <section v-if="payment?.status === 'authorized'" class="details-block support-contact-block">
          <h3 class="details-block-title">{{ t('payment.supportContactTitle') }}</h3>
          <p class="support-contact-intro">{{ t('payment.supportContactIntro') }}</p>
          <ul class="support-contact-list">
            <li><a :href="`mailto:${SUPPORT_EMAIL}`"><MailOutlined /> {{ SUPPORT_EMAIL }}</a></li>
            <li><a :href="SUPPORT_WHATSAPP_URL" target="_blank" rel="noopener noreferrer"><WhatsAppOutlined /> {{ SUPPORT_WHATSAPP }}</a></li>
          </ul>
        </section>

        <!-- Dados bancários (só em cancelamento / erro) -->
        <BankTransferDetails
          v-if="rental && showBankDetails"
          top-divider
          :rental-code="rental.rental_code"
          :hint="t('payment.bankDetailsHint')"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { MailOutlined, WhatsAppOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import HeaderPage from '../components/HeaderPage.vue'
import BankTransferDetails from '../components/BankTransferDetails.vue'
import { paymentService, bookingService, vehicleService } from '../services/api'
import { SUPPORT_EMAIL, SUPPORT_WHATSAPP, SUPPORT_WHATSAPP_URL } from '../constants/contact'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const isLoading = ref(true)
const payment = ref(null)
const rental = ref(null)
const locations = ref([])
const isInvalidToken = ref(false)

const STATUS_MAP = {
  authorized: { status: 'success', titleKey: 'payment.successTitle', subtitleKey: 'payment.successSubtitle' },
  declined: { status: 'error', titleKey: 'payment.declinedTitle', subtitleKey: 'payment.declinedSubtitle' },
  cancelled: { status: 'warning', titleKey: 'payment.cancelledTitle', subtitleKey: 'payment.cancelledSubtitle' },
  error: { status: 'error', titleKey: 'payment.errorTitle', subtitleKey: 'payment.errorSubtitle' },
  pending: { status: 'info', titleKey: 'payment.checkingStatus', subtitleKey: '' },
}

const BANK_DETAIL_STATUSES = ['declined', 'cancelled', 'error']

const resultStatus = computed(() => {
  if (isInvalidToken.value) return 'error'
  return STATUS_MAP[payment.value?.status]?.status || 'error'
})
const resultTitle = computed(() => {
  if (isInvalidToken.value) return t('payment.invalidTitle')
  return t(STATUS_MAP[payment.value?.status]?.titleKey || 'payment.errorTitle')
})
const resultSubtitle = computed(() => {
  if (isInvalidToken.value) return t('payment.invalidSubtitle')
  const key = STATUS_MAP[payment.value?.status]?.subtitleKey
  return key ? t(key) : ''
})

const canRetry = computed(() => payment.value && payment.value.status !== 'authorized' && !isInvalidToken.value)
const showBankDetails = computed(() => BANK_DETAIL_STATUSES.includes(payment.value?.status))

const vehicleName = computed(() => {
  const v = rental.value?.vehicle_info
  if (!v) return '-'
  return `${v.brand || ''} ${v.model || ''}${v.year ? ` (${v.year})` : ''}`.trim()
})

const locationName = (id, custom) => {
  if (custom) return custom
  const loc = locations.value.find((l) => l.id === id)
  return loc?.name || '-'
}
const pickupLocationName = computed(() =>
  locationName(rental.value?.pickup_location, rental.value?.pickup_location_custom))
const returnLocationName = computed(() =>
  locationName(rental.value?.return_location, rental.value?.return_location_custom))

const formatDate = (value) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '-')

const formatMoney = (value) => {
  const n = Number(value) || 0
  const currency = rental.value?.currency || 'CVE'
  return `${n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`
}

onMounted(async () => {
  const token = route.params.token
  if (token === 'invalid') {
    isInvalidToken.value = true
    isLoading.value = false
    return
  }
  try {
    const response = await paymentService.getPaymentStatusByToken(token)
    payment.value = response.data

    const rentalCode = payment.value?.rental_code
    if (rentalCode) {
      const [rentalRes, locationsRes] = await Promise.allSettled([
        bookingService.getRentalDetails(rentalCode),
        vehicleService.getAllLocations(),
      ])
      if (rentalRes.status === 'fulfilled') rental.value = rentalRes.value.data
      if (locationsRes.status === 'fulfilled') locations.value = locationsRes.value.data || []
    }
  } catch (error) {
    isInvalidToken.value = true
  } finally {
    isLoading.value = false
  }
})

function tryAgain() {
  const rentalId = payment.value?.rental_id || rental.value?.id
  router.push(rentalId ? `/payment/${rentalId}` : '/')
}

function goToDashboard() {
  router.push('/owner-dashboard?tab=my-bookings')
}

function goToBookingStatus() {
  const code = rental.value?.rental_code || payment.value?.rental_code
  router.push({ name: 'BookingStatus', query: code ? { code } : {} })
}
</script>

<style scoped>
.payment-result-container {
  min-height: 100vh;
  background: #f7f7fb;
}

.payment-result-card {
  max-width: 640px;
  margin: 80px auto;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}

.details-block {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.details-block-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 12px;
}

.details-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.details-table th,
.details-table td {
  text-align: left;
  padding: 8px 10px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: top;
}

.details-table th {
  color: #6b7280;
  font-weight: 600;
  white-space: nowrap;
  width: 45%;
}

.details-table td {
  color: #111827;
  font-weight: 600;
}

.details-row-strong td {
  color: #059669;
}

.details-row-total th,
.details-row-total td {
  font-size: 15px;
  font-weight: 800;
  color: #111827;
  border-bottom: none;
}

.support-contact-intro {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 10px;
}

.support-contact-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.support-contact-list a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #4680ff;
  font-weight: 600;
  font-size: 14px;
}

@media (max-width: 480px) {
  .payment-result-card {
    margin: 40px 12px;
    padding: 20px;
  }

  .details-table th {
    width: auto;
    white-space: normal;
  }
}
</style>
