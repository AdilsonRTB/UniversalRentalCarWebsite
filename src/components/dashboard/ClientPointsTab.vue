<template>
  <div class="client-points-tab">
    <h2 class="page-title">Meus Pontos (Cliente)</h2>
    
    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :lg="16">
        <a-card title="Sistema de Pontos" class="points-system-card">
          <div class="points-summary">
            <div class="points-balance">
              <StarOutlined class="points-icon client" />
              <div class="points-info">
                <h3>{{ userStats.availablePoints }} Pontos</h3>
                <p>Disponíveis para desconto</p>
              </div>
            </div>
            
            <a-divider />
            
            <a-row :gutter="[16, 16]">
              <a-col :xs="24" :lg="12">
                <div class="points-progress">
                  <h4>Progresso para Próximo Desconto</h4>
                  <a-progress 
                    :percent="(userStats.availablePoints % 10) * 10" 
                    :show-info="false"
                    stroke-color="#FE7743"
                  />
                  <small>{{ userStats.availablePoints % 10 }}/10 pontos para próximo nível</small>
                </div>
              </a-col>
              <a-col :xs="24" :lg="12">
                <div class="points-stats">
                  <a-statistic title="Total Ganho" :value="user.totalPointsEarned" suffix="pontos" />
                  <a-statistic title="Descontos Usados" :value="userStats.totalDiscountsUsed" style="margin-top: 16px;" />
                </div>
              </a-col>
            </a-row>
            
            <a-divider />
            
            <a-alert 
              message="Ganho: 1 ponto por reserva concluída" 
              type="success" 
              show-icon 
              style="margin-bottom: 16px;"
            />
            
            <div class="points-history">
              <h4>Histórico de Pontos</h4>
              <div class="point-transaction">
                <span>Reserva concluída - Toyota Corolla</span>
                <span class="point-addition">+1 ponto</span>
              </div>
              <div class="point-transaction">
                <span>Desconto usado (10%)</span>
                <span class="point-deduction">-10 pontos</span>
              </div>
              <div class="point-transaction">
                <span>Reserva concluída - Honda Civic</span>
                <span class="point-addition">+1 ponto</span>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      
      <a-col :xs="24" :lg="8">
        <a-card title="Tabela de Descontos" class="discount-card">
          <div class="discount-table">
            <div class="discount-item" :class="{ 'available': userStats.availablePoints >= 5 }">
              <div class="discount-info">
                <span class="discount-points">5 pontos</span>
                <span class="discount-percent">5% desconto</span>
              </div>
              <a-tag v-if="userStats.availablePoints >= 5" color="success">Disponível</a-tag>
              <a-button 
                v-if="userStats.availablePoints >= 5" 
                type="primary" 
                size="small"
                @click="$emit('use-discount', 5, 5)"
                style="margin-top: 8px;"
              >
                Usar Desconto
              </a-button>
            </div>
            
            <div class="discount-item" :class="{ 'available': userStats.availablePoints >= 10 }">
              <div class="discount-info">
                <span class="discount-points">10 pontos</span>
                <span class="discount-percent">10% desconto</span>
              </div>
              <a-tag v-if="userStats.availablePoints >= 10" color="success">Disponível</a-tag>
              <a-button 
                v-if="userStats.availablePoints >= 10" 
                type="primary" 
                size="small"
                @click="$emit('use-discount', 10, 10)"
                style="margin-top: 8px;"
              >
                Usar Desconto
              </a-button>
            </div>
            
            <div class="discount-item" :class="{ 'available': userStats.availablePoints >= 15 }">
              <div class="discount-info">
                <span class="discount-points">15 pontos</span>
                <span class="discount-percent">15% desconto</span>
              </div>
              <a-tag v-if="userStats.availablePoints >= 15" color="success">Disponível</a-tag>
              <a-button 
                v-if="userStats.availablePoints >= 15" 
                type="primary" 
                size="small"
                @click="$emit('use-discount', 15, 15)"
                style="margin-top: 8px;"
              >
                Usar Desconto
              </a-button>
            </div>
            
            <div class="discount-item" :class="{ 'available': userStats.availablePoints >= 20 }">
              <div class="discount-info">
                <span class="discount-points">20 pontos</span>
                <span class="discount-percent">20% desconto</span>
              </div>
              <a-tag v-if="userStats.availablePoints >= 20" color="success">Disponível</a-tag>
              <a-button 
                v-if="userStats.availablePoints >= 20" 
                type="primary" 
                size="small"
                @click="$emit('use-discount', 20, 20)"
                style="margin-top: 8px;"
              >
                Usar Desconto
              </a-button>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { StarOutlined } from '@ant-design/icons-vue'
import { defineProps, defineEmits } from 'vue'

defineProps({
  user: Object,
  userStats: Object
})

defineEmits(['use-discount'])
</script>

<style scoped>
.points-progress h4 {
  color: #273F4F;
  margin-bottom: 12px;
}

.points-stats .ant-statistic {
  text-align: center;
}

.points-balance {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.points-icon {
  font-size: 2.5rem;
  color: #447D9B;
  margin-right: 16px;
}

.points-info h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #273F4F;
}

.points-info p {
  margin: 4px 0 0 0;
  color: #666;
}

.points-history h4 {
  color: #273F4F;
  margin-bottom: 16px;
}

.point-transaction {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.point-transaction:last-child {
  border-bottom: none;
}

.point-deduction {
  color: #ff4d4f;
  font-weight: 600;
}

.point-addition {
  color: #52c41a;
  font-weight: 600;
}

.discount-card .discount-item {
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: all 0.3s;
}

.discount-card .discount-item.available {
  border-color: #52c41a;
  background-color: #f6ffed;
}

.discount-card .discount-item .discount-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.discount-card .discount-points {
  font-weight: 600;
  color: #FE7743;
}

.discount-card .discount-percent {
  font-weight: 600;
  color: #273F4F;
}
</style>
