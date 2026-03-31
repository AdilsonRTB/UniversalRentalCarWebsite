<template>
  <div class="legal-page">
    <HeaderPage />
    <div class="legal-container">
      <div class="legal-header">
        <h1>{{ t('terms.title') }}</h1>
        <p class="legal-update">{{ t('terms.lastUpdate') }}: 17/03/2026</p>
      </div>

      <div class="legal-content">
        <!-- 1. Introdução -->
        <section class="legal-section">
          <h2>1. {{ t('terms.introTitle') }}</h2>
          <p>{{ t('terms.introText1') }}</p>
          <p>{{ t('terms.introText2') }}</p>
        </section>

        <!-- 2. Definições -->
        <section class="legal-section">
          <h2>2. {{ t('terms.definitionsTitle') }}</h2>
          <ul>
            <li><strong>{{ t('terms.defPlatform') }}:</strong> {{ t('terms.defPlatformDesc') }}</li>
            <li><strong>{{ t('terms.defUser') }}:</strong> {{ t('terms.defUserDesc') }}</li>
            <li><strong>{{ t('terms.defOwner') }}:</strong> {{ t('terms.defOwnerDesc') }}</li>
            <li><strong>{{ t('terms.defClient') }}:</strong> {{ t('terms.defClientDesc') }}</li>
            <li><strong>{{ t('terms.defVehicle') }}:</strong> {{ t('terms.defVehicleDesc') }}</li>
            <li><strong>{{ t('terms.defReservation') }}:</strong> {{ t('terms.defReservationDesc') }}</li>
          </ul>
        </section>

        <!-- 3. Condições de Acesso -->
        <section class="legal-section">
          <h2>3. {{ t('terms.accessTitle') }}</h2>
          <p>{{ t('terms.accessText1') }}</p>
          <ul>
            <li>{{ t('terms.accessReq1') }}</li>
            <li>{{ t('terms.accessReq2') }}</li>
            <li>{{ t('terms.accessReq3') }}</li>
            <li>{{ t('terms.accessReq4') }}</li>
          </ul>
        </section>

        <!-- 4. Registo e Conta -->
        <section class="legal-section">
          <h2>4. {{ t('terms.accountTitle') }}</h2>
          <p>{{ t('terms.accountText1') }}</p>
          <p>{{ t('terms.accountText2') }}</p>
          <p>{{ t('terms.accountText3') }}</p>
        </section>

        <!-- 5. Reservas e Pagamentos -->
        <section class="legal-section">
          <h2>5. {{ t('terms.bookingTitle') }}</h2>
          <p>{{ t('terms.bookingText1') }}</p>
          <p>{{ t('terms.bookingText2') }}</p>
          <p>{{ t('terms.bookingText3') }}</p>
          <p>{{ t('terms.bookingText4') }}</p>
        </section>

        <!-- 6. Cancelamento -->
        <section class="legal-section">
          <h2>6. {{ t('terms.cancellationTitle') }}</h2>
          <p>{{ t('terms.cancellationText1') }}</p>
          <p>{{ t('terms.cancellationText2') }}</p>
          <p>{{ t('terms.cancellationText3') }}</p>
        </section>

        <!-- 7. Obrigações do Cliente -->
        <section class="legal-section">
          <h2>7. {{ t('terms.clientObligationsTitle') }}</h2>
          <ul>
            <li>{{ t('terms.clientOb1') }}</li>
            <li>{{ t('terms.clientOb2') }}</li>
            <li>{{ t('terms.clientOb3') }}</li>
            <li>{{ t('terms.clientOb4') }}</li>
            <li>{{ t('terms.clientOb5') }}</li>
          </ul>
        </section>

        <!-- 8. Obrigações do Proprietário -->
        <section class="legal-section">
          <h2>8. {{ t('terms.ownerObligationsTitle') }}</h2>
          <ul>
            <li>{{ t('terms.ownerOb1') }}</li>
            <li>{{ t('terms.ownerOb2') }}</li>
            <li>{{ t('terms.ownerOb3') }}</li>
            <li>{{ t('terms.ownerOb4') }}</li>
            <li>{{ t('terms.ownerOb5') }}</li>
          </ul>
        </section>

        <!-- 9. Responsabilidade -->
        <section class="legal-section">
          <h2>9. {{ t('terms.liabilityTitle') }}</h2>
          <p>{{ t('terms.liabilityText1') }}</p>
          <p>{{ t('terms.liabilityText2') }}</p>
          <p>{{ t('terms.liabilityText3') }}</p>
        </section>

        <!-- 10. Proteção de Dados -->
        <section class="legal-section">
          <h2>10. {{ t('terms.dataProtectionTitle') }}</h2>
          <p>{{ t('terms.dataProtectionText1') }}</p>
          <p>{{ t('terms.dataProtectionText2') }}</p>
        </section>

        <!-- 11. Propriedade Intelectual -->
        <section class="legal-section">
          <h2>11. {{ t('terms.intellectualPropertyTitle') }}</h2>
          <p>{{ t('terms.intellectualPropertyText1') }}</p>
          <p>{{ t('terms.intellectualPropertyText2') }}</p>
        </section>

        <!-- 12. Resolução de Litígios -->
        <section class="legal-section">
          <h2>12. {{ t('terms.disputeTitle') }}</h2>
          <p>{{ t('terms.disputeText1') }}</p>
          <p>{{ t('terms.disputeText2') }}</p>
        </section>

        <!-- 13. Lei Aplicável -->
        <section class="legal-section">
          <h2>13. {{ t('terms.applicableLawTitle') }}</h2>
          <p>{{ t('terms.applicableLawText1') }}</p>
        </section>

        <!-- 14. Alterações -->
        <section class="legal-section">
          <h2>14. {{ t('terms.changesTitle') }}</h2>
          <p>{{ t('terms.changesText1') }}</p>
          <p>{{ t('terms.changesText2') }}</p>
        </section>

        <!-- 15. Contactos -->
        <section class="legal-section">
          <h2>15. {{ t('terms.contactTitle') }}</h2>
          <p>{{ t('terms.contactText1') }}</p>
          <ul class="contact-list">
            <li><strong>Email:</strong> universal.r.car@gmail.com</li>
            <li><strong>{{ t('terms.contactPhone') }}:</strong> (+238) 978 13 04 / (+238) 347 6581</li>
          </ul>
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
import { useLanguageAndCurrency } from '@/composables/useLanguageAndCurrency'

const { t } = useLanguageAndCurrency()
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

.legal-header {
  text-align: center;
  margin-bottom: 40px;
}

.legal-header h1 {
  font-size: 2rem;
  color: var(--secondary-color, #273F4F);
  font-weight: 700;
  margin-bottom: 8px;
}

.legal-update {
  color: #888;
  font-size: 0.95rem;
}

.legal-content {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
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

.legal-section ul {
  padding-left: 24px;
  margin: 12px 0;
}

.legal-section ul li {
  color: #444;
  line-height: 1.8;
  margin-bottom: 6px;
}

.contact-list li {
  list-style: none;
  margin-bottom: 4px;
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

  .legal-header h1 {
    font-size: 1.5rem;
  }

  .legal-content {
    padding: 24px 20px;
  }

  .legal-section h2 {
    font-size: 1.1rem;
  }
}
</style>
