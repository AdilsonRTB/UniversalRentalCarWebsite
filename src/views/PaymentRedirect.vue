<template>
  <div class="payment-redirect-container">
    <HeaderPage />
    <div class="payment-redirect-card">
      <a-spin v-if="!errorMessage" size="large" />
      <h2 v-if="!errorMessage">{{ t('payment.redirecting') }}</h2>
      <p v-if="!errorMessage" class="subtitle">{{ t('payment.redirectingSubtitle') }}</p>

      <a-result
        v-else
        status="error"
        :title="t('payment.initiateError')"
        :sub-title="errorMessage"
      >
        <template #extra>
          <a-button type="primary" @click="goBack">{{ t('payment.backToBooking') }}</a-button>
        </template>
      </a-result>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import HeaderPage from '../components/HeaderPage.vue'
import { paymentService } from '../services/api'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const errorMessage = ref('')

// Builds a hidden auto-submit form and posts the browser to the SISP payment page.
function submitPaymentForm(actionUrl, fields) {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = actionUrl

  Object.keys(fields).forEach((key) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = key
    input.value = fields[key]
    form.appendChild(input)
  })

  document.body.appendChild(form)
  form.submit()
}

onMounted(async () => {
  const rentalId = route.params.rentalId
  try {
    const response = await paymentService.initiatePayment(rentalId)
    const { action_url: actionUrl, fields } = response.data
    submitPaymentForm(actionUrl, fields)
  } catch (error) {
    errorMessage.value = error.response?.data?.error || ''
  }
})

function goBack() {
  router.push('/owner-dashboard?tab=my-bookings')
}
</script>

<style scoped>
.payment-redirect-container {
  min-height: 100vh;
  background: #f7f7fb;
}

.payment-redirect-card {
  max-width: 480px;
  margin: 80px auto;
  padding: 48px 32px;
  text-align: center;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}

.payment-redirect-card h2 {
  margin-top: 24px;
}

.subtitle {
  color: #666;
}
</style>
