<template>
  <div class="legal-page">
    <HeaderPage />
    <div class="legal-container">
      <div class="legal-content">
        <h1>{{ t('deliveryReturn.title') }}</h1>

        <div class="placeholder-banner">
          {{ t('deliveryReturn.placeholderNotice') }}
        </div>

        <section class="legal-section">
          <h2>1. {{ t('deliveryReturn.pickupTitle') }}</h2>
          <p>{{ t('deliveryReturn.pickupText') }}</p>
        </section>

        <section class="legal-section">
          <h2>2. {{ t('deliveryReturn.returnTitle') }}</h2>
          <p>{{ t('deliveryReturn.returnText') }}</p>
        </section>

        <section class="legal-section">
          <h2>3. {{ t('deliveryReturn.fuelTitle') }}</h2>
          <p class="placeholder-text">{{ t('deliveryReturn.fuelPlaceholder') }}</p>
        </section>

        <section class="legal-section">
          <h2>4. {{ t('deliveryReturn.lateReturnTitle') }}</h2>
          <p class="placeholder-text">{{ t('deliveryReturn.lateReturnPlaceholder') }}</p>
        </section>

        <section class="legal-section">
          <h2>5. {{ t('deliveryReturn.inspectionTitle') }}</h2>
          <p class="placeholder-text">{{ t('deliveryReturn.inspectionPlaceholder') }}</p>
        </section>

        <section class="legal-section">
          <p class="see-terms-link">
            {{ t('deliveryReturn.seeTermsIntro') }}
            <router-link to="/terms">{{ t('deliveryReturn.seeTermsLink') }}</router-link>.
          </p>
        </section>
      </div>

      <div class="legal-back">
        <router-link to="/" class="back-link">
          <LeftOutlined /> {{ t('common.back') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeaderPage from '@/components/HeaderPage.vue'
import { LeftOutlined } from '@ant-design/icons-vue'
import { watchEffect } from 'vue'
import { useLanguageAndCurrency } from '@/composables/useLanguageAndCurrency'

const { t } = useLanguageAndCurrency()

watchEffect(() => {
  document.title = `${t('deliveryReturn.title')} | Universal Rent-A-Car`
})
</script>

<style scoped>
.legal-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.legal-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px 60px;
}

.legal-content {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-top: 30px;
}

.legal-content h1 {
  font-size: 2rem;
  color: var(--secondary-color, #273F4F);
  font-weight: 700;
  margin-bottom: 20px;
}

.placeholder-banner {
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 28px;
}

.placeholder-text {
  font-style: italic;
  color: #92400e;
  background: #fffbeb;
  border-radius: 6px;
  padding: 10px 12px;
}

.legal-section {
  margin-bottom: 32px;
}

.legal-section:last-child {
  margin-bottom: 0;
}

.legal-section h2 {
  font-size: 1.25rem;
  color: var(--secondary-color, #273F4F);
  font-weight: 600;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--primary-color, #FE7743);
}

.legal-section p {
  color: #444;
  line-height: 1.8;
  margin-bottom: 10px;
  text-align: justify;
}

.see-terms-link {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

.see-terms-link a {
  color: var(--primary-color, #FE7743);
  font-weight: 600;
}

.legal-back {
  margin-top: 30px;
  text-align: center;
}

.back-link {
  color: var(--primary-color, #FE7743);
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: opacity 0.2s;
}

.back-link:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .legal-container {
    padding: 20px 16px 40px;
  }

  .legal-content {
    padding: 24px 20px;
  }
}
</style>
