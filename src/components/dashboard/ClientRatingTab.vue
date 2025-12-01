<template>
  <div class="client-rating-tab">
    <h2 class="page-title">Minha Classificação (Cliente)</h2>
    
    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :lg="12">
        <a-card title="Classificação Atual" class="rating-card">
          <div class="rating-display-large">
            <div class="rating-circle">
              <div class="rating-value-large">{{ user.clientRating.toFixed(1) }}</div>
              <div class="rating-max">/5.0</div>
            </div>
            <div class="rating-stars-large">
              <a-rate :value="user.clientRating" disabled allow-half />
            </div>
            <div class="classification-badge">
              <a-tag color="#FE7743" class="classification-tag">
                {{ getClientClassification(user.clientRating) }}
              </a-tag>
            </div>
            <p class="rating-text">Baseado em {{ user.totalRatings }} avaliações</p>
          </div>
        </a-card>
      </a-col>
      
      <a-col :xs="24" :lg="12">
        <a-card title="Benefícios da Classificação" class="benefits-card">
          <div class="benefits-list">
            <div class="benefit-item" :class="{ 'active': user.clientRating >= 4.5 }">
              <TrophyOutlined class="benefit-icon vip" />
              <div class="benefit-content">
                <h4>Cliente VIP (4.5+)</h4>
                <ul>
                  <li>Prioridade no atendimento</li>
                  <li>Descontos especiais</li>
                  <li>Acesso antecipado a promoções</li>
                </ul>
              </div>
            </div>
            
            <div class="benefit-item" :class="{ 'active': user.clientRating >= 4.0 }">
              <TrophyOutlined class="benefit-icon premium" />
              <div class="benefit-content">
                <h4>Cliente Premium (4.0+)</h4>
                <ul>
                  <li>Atendimento prioritário</li>
                  <li>Cashback em pontos</li>
                  <li>Flexibilidade de cancelamento</li>
                </ul>
              </div>
            </div>
            
            <div class="benefit-item" :class="{ 'active': user.clientRating >= 3.5 }">
              <TrophyOutlined class="benefit-icon gold" />
              <div class="benefit-content">
                <h4>Cliente Ouro (3.5+)</h4>
                <ul>
                  <li>Suporte especializado</li>
                  <li>Pontos bônus mensais</li>
                </ul>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    
    <a-card title="Histórico de Avaliações" style="margin-top: 24px;">
      <div class="rating-breakdown">
        <div class="rating-bar">
          <span>5 estrelas</span>
          <a-progress :percent="65" :show-info="false" stroke-color="#52c41a" />
          <span>15</span>
        </div>
        <div class="rating-bar">
          <span>4 estrelas</span>
          <a-progress :percent="26" :show-info="false" stroke-color="#fadb14" />
          <span>6</span>
        </div>
        <div class="rating-bar">
          <span>3 estrelas</span>
          <a-progress :percent="9" :show-info="false" stroke-color="#fa8c16" />
          <span>2</span>
        </div>
        <div class="rating-bar">
          <span>2 estrelas</span>
          <a-progress :percent="0" :show-info="false" stroke-color="#ff4d4f" />
          <span>0</span>
        </div>
        <div class="rating-bar">
          <span>1 estrela</span>
          <a-progress :percent="0" :show-info="false" stroke-color="#ff4d4f" />
          <span>0</span>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { TrophyOutlined } from '@ant-design/icons-vue'
import { defineProps } from 'vue'

defineProps({
  user: Object,
  getClientClassification: Function
})
</script>

<style scoped>
.rating-display-large {
  text-align: center;
  padding: 20px;
}

.rating-circle {
  display: inline-flex;
  align-items: baseline;
  margin-bottom: 16px;
}

.rating-value-large {
  font-size: 4rem;
  font-weight: bold;
  color: #FE7743;
  line-height: 1;
}

.rating-max {
  font-size: 1.5rem;
  color: #666;
  margin-left: 4px;
}

.rating-stars-large {
  margin-bottom: 16px;
}

.rating-stars-large .ant-rate {
  font-size: 24px;
}

.classification-tag {
  font-size: 16px !important;
  padding: 8px 16px !important;
  border-radius: 20px !important;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  opacity: 0.5;
  transition: all 0.3s;
}

.benefit-item.active {
  opacity: 1;
  border-color: #FE7743;
  background-color: #fff7f5;
}

.benefit-icon {
  font-size: 24px;
  margin-right: 12px;
  margin-top: 4px;
}

.benefit-icon.vip {
  color: #722ed1;
}

.benefit-icon.premium {
  color: #fa8c16;
}

.benefit-icon.gold {
  color: #fadb14;
}

.benefit-content h4 {
  margin: 0 0 8px 0;
  color: #273F4F;
}

.benefit-content ul {
  margin: 0;
  padding-left: 16px;
}

.benefit-content li {
  color: #666;
  margin-bottom: 4px;
}

.rating-breakdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-bar span:first-child {
  min-width: 80px;
  color: #666;
}

.rating-bar span:last-child {
  min-width: 30px;
  text-align: right;
  color: #273F4F;
  font-weight: 600;
}

.rating-bar .ant-progress {
  flex: 1;
}
</style>
