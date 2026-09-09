<template>
  <div class="payment-result-container">
    <HeaderPage />
    <div class="payment-result-card">
      <a-spin v-if="isLoading" size="large" :tip="t('payment.checkingStatus')" />

      <a-result
        v-else
        :status="resultStatus"
        :title="resultTitle"
        :sub-title="resultSubtitle"
      >
        <template #extra>
          <a-button v-if="payment?.status !== 'authorized'" @click="tryAgain">
            {{ t('payment.tryAgain') }}
          </a-button>
          <a-button type="primary" @click="goToDashboard">{{ t('payment.goToDashboard') }}</a-button>
          <a-button @click="goToBookingStatus">{{ t('payment.goToBookingStatus') }}</a-button>
        </template>
      </a-result>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import HeaderPage from '../components/HeaderPage.vue'
import { paymentService } from '../services/api'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const isLoading = ref(true)
const payment = ref(null)
const isInvalidToken = ref(false)

const STATUS_MAP = {
  authorized: { status: 'success', titleKey: 'payment.successTitle', subtitleKey: 'payment.successSubtitle' },
  declined: { status: 'error', titleKey: 'payment.declinedTitle', subtitleKey: 'payment.declinedSubtitle' },
  cancelled: { status: 'warning', titleKey: 'payment.cancelledTitle', subtitleKey: 'payment.cancelledSubtitle' },
  error: { status: 'error', titleKey: 'payment.errorTitle', subtitleKey: 'payment.errorSubtitle' },
  pending: { status: 'info', titleKey: 'payment.checkingStatus', subtitleKey: '' },
}

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
  } catch (error) {
    isInvalidToken.value = true
  } finally {
    isLoading.value = false
  }
})

function tryAgain() {
  if (payment.value?.rental_id) {
    router.push(`/payment/${payment.value.rental_id}`)
  } else {
    router.push('/')
  }
}

function goToDashboard() {
  router.push('/owner-dashboard?tab=my-bookings')
}

function goToBookingStatus() {
  router.push('/booking-status')
}
</script>

<style scoped>
.payment-result-container {
  min-height: 100vh;
  background: #f7f7fb;
}

.payment-result-card {
  max-width: 560px;
  margin: 80px auto;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}
</style>
