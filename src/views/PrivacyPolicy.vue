<template>
  <div class="legal-page">
    <HeaderPage />
    <div class="legal-container">
      <div class="legal-header">
        <h1>{{ t('privacy.title') }}</h1>
        <p class="legal-update">{{ t('privacy.lastUpdate') }}: 17/03/2026</p>
      </div>

      <div class="legal-content">
        <!-- 1. Introdução -->
        <section class="legal-section">
          <h2>1. {{ t('privacy.introTitle') }}</h2>
          <p>{{ t('privacy.introText1') }}</p>
          <p>{{ t('privacy.introText2') }}</p>
        </section>

        <!-- 2. Responsável pelo Tratamento -->
        <section class="legal-section">
          <h2>2. {{ t('privacy.controllerTitle') }}</h2>
          <p>{{ t('privacy.controllerText1') }}</p>
          <ul class="contact-list">
            <li><strong>{{ t('privacy.controllerName') }}:</strong> Universal Rent-A-Car</li>
            <li><strong>Email:</strong> universal.r.car@gmail.com</li>
            <li><strong>{{ t('privacy.controllerPhone') }}:</strong> (+238) 978 13 04</li>
          </ul>
        </section>

        <!-- 3. Dados Recolhidos -->
        <section class="legal-section">
          <h2>3. {{ t('privacy.dataCollectedTitle') }}</h2>
          <p>{{ t('privacy.dataCollectedText1') }}</p>
          <h3>{{ t('privacy.dataIdentification') }}</h3>
          <ul>
            <li>{{ t('privacy.dataId1') }}</li>
            <li>{{ t('privacy.dataId2') }}</li>
            <li>{{ t('privacy.dataId3') }}</li>
            <li>{{ t('privacy.dataId4') }}</li>
            <li>{{ t('privacy.dataId5') }}</li>
          </ul>
          <h3>{{ t('privacy.dataUsage') }}</h3>
          <ul>
            <li>{{ t('privacy.dataUsage1') }}</li>
            <li>{{ t('privacy.dataUsage2') }}</li>
            <li>{{ t('privacy.dataUsage3') }}</li>
            <li>{{ t('privacy.dataUsage4') }}</li>
          </ul>
        </section>

        <!-- 4. Finalidade do Tratamento -->
        <section class="legal-section">
          <h2>4. {{ t('privacy.purposeTitle') }}</h2>
          <p>{{ t('privacy.purposeText1') }}</p>
          <ul>
            <li>{{ t('privacy.purpose1') }}</li>
            <li>{{ t('privacy.purpose2') }}</li>
            <li>{{ t('privacy.purpose3') }}</li>
            <li>{{ t('privacy.purpose4') }}</li>
            <li>{{ t('privacy.purpose5') }}</li>
            <li>{{ t('privacy.purpose6') }}</li>
          </ul>
        </section>

        <!-- 5. Base Legal -->
        <section class="legal-section">
          <h2>5. {{ t('privacy.legalBasisTitle') }}</h2>
          <p>{{ t('privacy.legalBasisText1') }}</p>
          <ul>
            <li><strong>{{ t('privacy.legalBasisConsent') }}:</strong> {{ t('privacy.legalBasisConsentDesc') }}</li>
            <li><strong>{{ t('privacy.legalBasisContract') }}:</strong> {{ t('privacy.legalBasisContractDesc') }}</li>
            <li><strong>{{ t('privacy.legalBasisLegal') }}:</strong> {{ t('privacy.legalBasisLegalDesc') }}</li>
            <li><strong>{{ t('privacy.legalBasisInterest') }}:</strong> {{ t('privacy.legalBasisInterestDesc') }}</li>
          </ul>
        </section>

        <!-- 6. Partilha de Dados -->
        <section class="legal-section">
          <h2>6. {{ t('privacy.dataSharingTitle') }}</h2>
          <p>{{ t('privacy.dataSharingText1') }}</p>
          <ul>
            <li>{{ t('privacy.dataSharing1') }}</li>
            <li>{{ t('privacy.dataSharing2') }}</li>
            <li>{{ t('privacy.dataSharing3') }}</li>
          </ul>
          <p>{{ t('privacy.dataSharingText2') }}</p>
        </section>

        <!-- 7. Transferência Internacional -->
        <section class="legal-section">
          <h2>7. {{ t('privacy.internationalTransferTitle') }}</h2>
          <p>{{ t('privacy.internationalTransferText1') }}</p>
          <p>{{ t('privacy.internationalTransferText2') }}</p>
        </section>

        <!-- 8. Conservação de Dados -->
        <section class="legal-section">
          <h2>8. {{ t('privacy.retentionTitle') }}</h2>
          <p>{{ t('privacy.retentionText1') }}</p>
          <p>{{ t('privacy.retentionText2') }}</p>
        </section>

        <!-- 9. Direitos dos Titulares -->
        <section class="legal-section">
          <h2>9. {{ t('privacy.rightsTitle') }}</h2>
          <p>{{ t('privacy.rightsText1') }}</p>
          <ul>
            <li><strong>{{ t('privacy.rightAccess') }}:</strong> {{ t('privacy.rightAccessDesc') }}</li>
            <li><strong>{{ t('privacy.rightRectification') }}:</strong> {{ t('privacy.rightRectificationDesc') }}</li>
            <li><strong>{{ t('privacy.rightErasure') }}:</strong> {{ t('privacy.rightErasureDesc') }}</li>
            <li><strong>{{ t('privacy.rightPortability') }}:</strong> {{ t('privacy.rightPortabilityDesc') }}</li>
            <li><strong>{{ t('privacy.rightRestriction') }}:</strong> {{ t('privacy.rightRestrictionDesc') }}</li>
            <li><strong>{{ t('privacy.rightObjection') }}:</strong> {{ t('privacy.rightObjectionDesc') }}</li>
          </ul>
          <p>{{ t('privacy.rightsText2') }}</p>
        </section>

        <!-- 10. Segurança -->
        <section class="legal-section">
          <h2>10. {{ t('privacy.securityTitle') }}</h2>
          <p>{{ t('privacy.securityText1') }}</p>
          <ul>
            <li>{{ t('privacy.security1') }}</li>
            <li>{{ t('privacy.security2') }}</li>
            <li>{{ t('privacy.security3') }}</li>
            <li>{{ t('privacy.security4') }}</li>
          </ul>
        </section>

        <!-- 11. Cookies -->
        <section class="legal-section">
          <h2>11. {{ t('privacy.cookiesTitle') }}</h2>
          <p>{{ t('privacy.cookiesText1') }}</p>
          <ul>
            <li><strong>{{ t('privacy.cookiesEssential') }}:</strong> {{ t('privacy.cookiesEssentialDesc') }}</li>
            <li><strong>{{ t('privacy.cookiesAnalytics') }}:</strong> {{ t('privacy.cookiesAnalyticsDesc') }}</li>
            <li><strong>{{ t('privacy.cookiesPreferences') }}:</strong> {{ t('privacy.cookiesPreferencesDesc') }}</li>
          </ul>
        </section>

        <!-- 12. Menores -->
        <section class="legal-section">
          <h2>12. {{ t('privacy.minorsTitle') }}</h2>
          <p>{{ t('privacy.minorsText1') }}</p>
        </section>

        <!-- 13. Alterações -->
        <section class="legal-section">
          <h2>13. {{ t('privacy.changesTitle') }}</h2>
          <p>{{ t('privacy.changesText1') }}</p>
        </section>

        <!-- 14. Reclamações -->
        <section class="legal-section">
          <h2>14. {{ t('privacy.complaintsTitle') }}</h2>
          <p>{{ t('privacy.complaintsText1') }}</p>
          <p>{{ t('privacy.complaintsText2') }}</p>
        </section>

        <!-- 15. Contactos -->
        <section class="legal-section">
          <h2>15. {{ t('privacy.contactTitle') }}</h2>
          <p>{{ t('privacy.contactText1') }}</p>
          <ul class="contact-list">
            <li><strong>Email:</strong> universal.r.car@gmail.com</li>
            <li><strong>{{ t('privacy.contactPhone') }}:</strong> (+238) 978 13 04 / (+238) 347 6581</li>
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

.legal-section h3 {
  font-size: 1.05rem;
  color: var(--secondary-color, #273F4F);
  font-weight: 600;
  margin: 16px 0 8px;
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
