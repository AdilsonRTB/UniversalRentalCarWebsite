<template>
  <div class="legal-page">
    <HeaderPage />
    <div class="legal-container">
      <div class="legal-content">
        <h1>{{ t('contact.title') }}</h1>
        <p class="contact-intro">{{ t('contact.intro') }}</p>

        <section class="legal-section">
          <ul class="contact-list-page">
            <li>
              <MailOutlined />
              <div>
                <strong>{{ t('contact.emailLabel') }}</strong>
                <a :href="`mailto:${SUPPORT_EMAIL}`">{{ SUPPORT_EMAIL }}</a>
              </div>
            </li>
            <li>
              <WhatsAppOutlined />
              <div>
                <strong>{{ t('contact.whatsappLabel') }}</strong>
                <a :href="SUPPORT_WHATSAPP_URL" target="_blank" rel="noopener noreferrer">{{ SUPPORT_WHATSAPP }}</a>
              </div>
            </li>
            <li>
              <PhoneOutlined />
              <div>
                <strong>{{ t('contact.phoneLabel') }}</strong>
                <a :href="SUPPORT_PHONE_TEL_URL">{{ SUPPORT_PHONE }}</a>
              </div>
            </li>
            <li>
              <EnvironmentOutlined />
              <div>
                <strong>{{ t('contact.addressLabel') }}</strong>
                <a :href="SUPPORT_ADDRESS_MAP_URL" target="_blank" rel="noopener noreferrer">{{ SUPPORT_ADDRESS }}</a>
              </div>
            </li>
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
import { LeftOutlined, MailOutlined, WhatsAppOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons-vue'
import { watchEffect } from 'vue'
import { useLanguageAndCurrency } from '@/composables/useLanguageAndCurrency'
import {
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_TEL_URL,
  SUPPORT_WHATSAPP,
  SUPPORT_WHATSAPP_URL,
  SUPPORT_ADDRESS,
  SUPPORT_ADDRESS_MAP_URL,
} from '@/constants/contact'

const { t } = useLanguageAndCurrency()

watchEffect(() => {
  document.title = `${t('contact.title')} | Universal Rent-A-Car`
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
  margin-bottom: 8px;
}

.contact-intro {
  color: #444;
  line-height: 1.8;
  margin-bottom: 24px;
}

.contact-list-page {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-list-page li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  font-size: 20px;
  color: var(--primary-color, #FE7743);
}

.contact-list-page li div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-list-page strong {
  font-size: 14px;
  color: #6b7280;
  font-weight: 600;
}

.contact-list-page a {
  color: var(--secondary-color, #273F4F);
  font-weight: 600;
  font-size: 16px;
  text-decoration: none;
}

.contact-list-page a:hover {
  text-decoration: underline;
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
