<template>
  <div class="digital-wallet-tab">
    <h2 class="page-title">Carteira Digital</h2>
    
    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :lg="16">
        <a-card title="Carteira Digital (Proprietário)" class="wallet-card">
          <div class="wallet-summary">
            <div class="wallet-balance">
              <WalletOutlined class="wallet-icon" />
              <div class="wallet-info">
                <h3>{{ ownerStats.availablePoints }} Pontos</h3>
                <p>Saldo disponível na carteira</p>
              </div>
            </div>
            
            <a-divider />
            
            <a-row :gutter="[16, 16]">
              <a-col :xs="24" :sm="8">
                <a-statistic 
                  title="Total Gasto" 
                  :value="ownerStats.totalPointsSpent" 
                  suffix="pontos"
                  :value-style="{ color: '#ff4d4f' }"
                />
              </a-col>
              <a-col :xs="24" :sm="8">
                <a-statistic 
                  title="Total Comprado" 
                  :value="ownerStats.totalPointsEarned" 
                  suffix="pontos"
                  :value-style="{ color: '#52c41a' }"
                />
              </a-col>
              <a-col :xs="24" :sm="8">
                <a-statistic 
                  title="Economia Total" 
                  :value="(ownerStats.totalPointsEarned * 0.5)"
                  prefix="R$"
                  :precision="2"
                  :value-style="{ color: '#1890ff' }"
                />
              </a-col>
            </a-row>
            
            <a-divider />
            
            <div class="wallet-actions">
              <a-button type="primary" size="large" @click="$emit('show-buy-points-modal')" block>
                <CreditCardOutlined />
                Comprar Pontos
              </a-button>
            </div>
            
            <div class="wallet-alerts">
              <a-alert 
                message="Custo: 10 pontos por veículo registrado" 
                type="info" 
                show-icon 
                style="margin: 16px 0 8px 0;"
              />
              <a-alert 
                message="Desconto: 1 ponto por reserva concluída" 
                type="warning" 
                show-icon 
              />
            </div>
          </div>
        </a-card>
      </a-col>
      
      <a-col :xs="24" :lg="8">
        <a-card title="Planos de Pontos" class="pricing-card">
          <div class="pricing-options">
            <div class="pricing-option">
              <div class="pricing-header">
                <h4>Pacote Básico</h4>
                <div class="pricing-value">
                  <span class="price">R$ 12,50</span>
                  <span class="points">25 pontos</span>
                </div>
              </div>
              <ul class="pricing-features">
                <li>2-3 veículos</li>
                <li>Validade: 6 meses</li>
              </ul>
            </div>
            
            <div class="pricing-option popular">
              <div class="pricing-badge">Mais Popular</div>
              <div class="pricing-header">
                <h4>Pacote Padrão</h4>
                <div class="pricing-value">
                  <span class="price">R$ 25,00</span>
                  <span class="points">50 pontos</span>
                </div>
              </div>
              <ul class="pricing-features">
                <li>5 veículos</li>
                <li>Validade: 12 meses</li>
              </ul>
            </div>
            
            <div class="pricing-option">
              <div class="pricing-header">
                <h4>Pacote Premium</h4>
                <div class="pricing-value">
                  <span class="price">R$ 50,00</span>
                  <span class="points">100 pontos</span>
                </div>
              </div>
              <ul class="pricing-features">
                <li>10 veículos</li>
                <li>Validade: 12 meses</li>
                <li>Suporte prioritário</li>
              </ul>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    
    <a-card title="Histórico de Transações" style="margin-top: 24px;">
      <div class="transaction-history">
        <div class="transaction-item">
          <div class="transaction-icon success">
            <CreditCardOutlined />
          </div>
          <div class="transaction-content">
            <div class="transaction-title">Compra de pontos - Pacote Padrão</div>
            <div class="transaction-date">14/07/2025 - 14:30</div>
          </div>
          <div class="transaction-amount success">+50 pontos</div>
        </div>
        
        <div class="transaction-item">
          <div class="transaction-icon deduction">
            <CarOutlined />
          </div>
          <div class="transaction-content">
            <div class="transaction-title">Veículo registrado - Honda Civic</div>
            <div class="transaction-date">13/07/2025 - 10:15</div>
          </div>
          <div class="transaction-amount deduction">-10 pontos</div>
        </div>
        
        <div class="transaction-item">
          <div class="transaction-icon deduction">
            <CalendarOutlined />
          </div>
          <div class="transaction-content">
            <div class="transaction-title">Reserva confirmada - Toyota Corolla</div>
            <div class="transaction-date">12/07/2025 - 16:45</div>
          </div>
          <div class="transaction-amount deduction">-1 ponto</div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { 
  WalletOutlined,
  CreditCardOutlined,
  CarOutlined,
  CalendarOutlined
} from '@ant-design/icons-vue'

import { defineProps, defineEmits } from 'vue'

defineProps({
  ownerStats: Object
})

defineEmits(['show-buy-points-modal'])
</script>

<style scoped>
.wallet-summary {
  padding: 8px 0;
}

.wallet-balance {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.wallet-icon {
  font-size: 3rem;
  color: #FE7743;
  margin-right: 16px;
}

.wallet-info h3 {
  margin: 0;
  font-size: 2rem;
  color: #273F4F;
}

.wallet-info p {
  margin: 4px 0 0 0;
  color: #666;
}

.wallet-alerts {
  margin-top: 16px;
}

.pricing-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pricing-option {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  position: relative;
  transition: all 0.3s;
}

.pricing-option:hover {
  border-color: #FE7743;
  box-shadow: 0 2px 8px rgba(254, 119, 67, 0.2);
}

.pricing-option.popular {
  border-color: #FE7743;
  background-color: #fff7f5;
}

.pricing-badge {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #FE7743;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.pricing-header h4 {
  margin: 0 0 8px 0;
  color: #273F4F;
}

.pricing-value {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
}

.pricing-value .price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #FE7743;
}

.pricing-value .points {
  color: #666;
  font-size: 14px;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pricing-features li {
  padding: 4px 0;
  color: #666;
  position: relative;
  padding-left: 16px;
}

.pricing-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #52c41a;
  font-weight: bold;
}

.transaction-history {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: all 0.3s;
}

.transaction-item:hover {
  background-color: #fafafa;
}

.transaction-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: white;
}

.transaction-icon.success {
  background-color: #52c41a;
}

.transaction-icon.deduction {
  background-color: #ff4d4f;
}

.transaction-content {
  flex: 1;
}

.transaction-title {
  font-weight: 600;
  color: #273F4F;
  margin-bottom: 4px;
}

.transaction-date {
  color: #666;
  font-size: 14px;
}

.transaction-amount {
  font-weight: 600;
  font-size: 16px;
}

.transaction-amount.success {
  color: #52c41a;
}

.transaction-amount.deduction {
  color: #ff4d4f;
}
</style>
