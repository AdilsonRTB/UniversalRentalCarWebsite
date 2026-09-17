<template>
  <section class="bank-transfer-block" :class="{ 'bank-transfer-block-divided': topDivider }">
    <h4 class="bank-transfer-title">💳 {{ t('payment.bankDetailsTitle') }}</h4>
    <p v-if="hint" class="bank-transfer-hint">{{ hint }}</p>
    <table class="bank-transfer-table">
      <tbody>
        <tr>
          <th>{{ t('payment.bankHolder') }}</th>
          <td>{{ BANK.holder }}</td>
        </tr>
        <tr>
          <th>{{ t('payment.bankName') }}</th>
          <td>{{ BANK.bank }}</td>
        </tr>
        <tr>
          <th>{{ t('payment.bankAccountType') }}</th>
          <td>{{ BANK.accountType }}</td>
        </tr>
        <tr>
          <th>{{ t('payment.bankAccountNumber') }}</th>
          <td>{{ BANK.account }}</td>
        </tr>
        <tr>
          <th>NIB</th>
          <td>{{ BANK.nib }}</td>
        </tr>
        <tr>
          <th>IBAN</th>
          <td>{{ BANK.iban }}</td>
        </tr>
        <tr>
          <th>SWIFT/BIC</th>
          <td>{{ BANK.swift }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="rentalCode" class="bank-transfer-warning">
      ⚠️ {{ t('payment.bankRefIntro') }}
      <a :href="`mailto:${BANK.email}`">{{ BANK.email }}</a>
      {{ t('payment.bankRefOr') }}
      <a :href="BANK.whatsappUrl" target="_blank" rel="noopener">{{ BANK.whatsapp }}</a>
      {{ t('payment.bankRefCode', { code: rentalCode }) }}
    </p>
    <p v-if="showCancellationWarning" class="bank-transfer-warning">
      ⚠️ {{ t('payment.bankCancellationWarning') }}
    </p>
  </section>
</template>

<script setup>
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import { SUPPORT_EMAIL, SUPPORT_WHATSAPP, SUPPORT_WHATSAPP_URL } from '../constants/contact'

defineProps({
  rentalCode: { type: String, default: '' },
  hint: { type: String, default: '' },
  showCancellationWarning: { type: Boolean, default: true },
  // Acrescenta uma linha separadora acima (para encaixar debaixo de outra secção).
  topDivider: { type: Boolean, default: false },
})

const { t } = useI18n()

const BANK = {
  holder: 'UNIVERSAL LDA',
  bank: 'BAI - Banco Angolano de Investimentos',
  accountType: 'Conta BAI',
  account: '100400069902001',
  nib: '000810040006990200106',
  iban: 'CV64000810040006990200106',
  swift: 'BAIPCVCV',
  email: SUPPORT_EMAIL,
  whatsapp: SUPPORT_WHATSAPP,
  whatsappUrl: SUPPORT_WHATSAPP_URL,
}
</script>

<style scoped>
.bank-transfer-block {
  margin-top: 20px;
}

.bank-transfer-block-divided {
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.bank-transfer-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px;
}

.bank-transfer-hint {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px;
}

.bank-transfer-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.bank-transfer-table th,
.bank-transfer-table td {
  text-align: left;
  padding: 7px 8px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: top;
}

.bank-transfer-table th {
  color: #6b7280;
  font-weight: 600;
  white-space: nowrap;
  width: 45%;
}

.bank-transfer-table td {
  color: #111827;
  font-weight: 600;
}

.bank-transfer-warning {
  font-size: 12px;
  color: #92400e;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 10px 12px;
  margin-top: 10px;
  line-height: 1.5;
}

.bank-transfer-warning a {
  color: #b45309;
  font-weight: 700;
}

@media (max-width: 480px) {
  .bank-transfer-table th {
    width: auto;
    white-space: normal;
  }
}
</style>
