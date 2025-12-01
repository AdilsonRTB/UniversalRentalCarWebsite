<template>
  <div class="promotions-tab">
    <div class="tab-header">
      <h2 class="page-title">Promoções</h2>
      <a-button type="primary" @click="showCreatePromotionModal = true">
        <PlusOutlined />
        Nova Promoção
      </a-button>
    </div>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :lg="8" v-for="promotion in promotions" :key="promotion.id">
        <a-card class="promotion-card">
          <template #title>
            <div class="promotion-header">
              <span>{{ promotion.title }}</span>
              <a-tag :color="promotion.active ? 'green' : 'red'">
                {{ promotion.active ? 'Ativa' : 'Inativa' }}
              </a-tag>
            </div>
          </template>

          <div class="promotion-content">
            <p>{{ promotion.description }}</p>
            
            <div class="promotion-details">
              <div class="detail-item">
                <strong>Desconto:</strong> {{ promotion.discountPercentage }}%
              </div>
              <div class="detail-item">
                <strong>Válida até:</strong> {{ formatDate(promotion.validUntil) }}
              </div>
              <div class="detail-item">
                <strong>Usos:</strong> {{ promotion.usageCount }} / {{ promotion.maxUsage || 'Ilimitado' }}
              </div>
            </div>
          </div>

          <template #actions>
            <EditOutlined key="edit" @click="editPromotion(promotion)" />
            <DeleteOutlined key="delete" @click="deletePromotion(promotion)" />
            <a-switch 
              :checked="promotion.active" 
              @change="togglePromotion(promotion)"
              size="small"
            />
          </template>
        </a-card>
      </a-col>
    </a-row>

    <!-- Create/Edit Promotion Modal -->
    <a-modal
      v-model:open="showCreatePromotionModal"
      :title="editingPromotion ? 'Editar Promoção' : 'Nova Promoção'"
      @ok="handleSavePromotion"
      :confirmLoading="promotionLoading"
    >
      <a-form :model="promotionForm" layout="vertical">
        <a-form-item label="Título">
          <a-input v-model:value="promotionForm.title" placeholder="Nome da promoção" />
        </a-form-item>
        
        <a-form-item label="Descrição">
          <a-textarea v-model:value="promotionForm.description" :rows="3" />
        </a-form-item>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Desconto (%)">
              <a-input-number 
                v-model:value="promotionForm.discountPercentage" 
                :min="1" 
                :max="100" 
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Uso Máximo">
              <a-input-number 
                v-model:value="promotionForm.maxUsage" 
                :min="1" 
                placeholder="Deixe vazio para ilimitado"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item label="Válida até">
          <a-date-picker 
            v-model:value="promotionForm.validUntil" 
            format="DD/MM/YYYY"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

defineProps({
  promotions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['createPromotion', 'updatePromotion', 'deletePromotion', 'togglePromotion'])

const showCreatePromotionModal = ref(false)
const promotionLoading = ref(false)
const editingPromotion = ref(null)

const promotionForm = ref({
  title: '',
  description: '',
  discountPercentage: 10,
  maxUsage: null,
  validUntil: null
})

const handleSavePromotion = async () => {
  promotionLoading.value = true
  try {
    if (editingPromotion.value) {
      emit('updatePromotion', {
        ...editingPromotion.value,
        ...promotionForm.value
      })
    } else {
      emit('createPromotion', { ...promotionForm.value })
    }
    
    showCreatePromotionModal.value = false
    resetForm()
    message.success(editingPromotion.value ? 'Promoção atualizada!' : 'Promoção criada!')
  } catch (error) {
    message.error('Erro ao salvar promoção')
  } finally {
    promotionLoading.value = false
  }
}

const editPromotion = (promotion) => {
  editingPromotion.value = promotion
  promotionForm.value = {
    title: promotion.title,
    description: promotion.description,
    discountPercentage: promotion.discountPercentage,
    maxUsage: promotion.maxUsage,
    validUntil: dayjs(promotion.validUntil)
  }
  showCreatePromotionModal.value = true
}

const deletePromotion = (promotion) => {
  emit('deletePromotion', promotion)
}

const togglePromotion = (promotion) => {
  emit('togglePromotion', promotion)
}

const resetForm = () => {
  promotionForm.value = {
    title: '',
    description: '',
    discountPercentage: 10,
    maxUsage: null,
    validUntil: null
  }
  editingPromotion.value = null
}

const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YYYY')
}
</script>

<style scoped>
.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
  color: #273F4F;
}

.promotion-card {
  margin-bottom: 16px;
}

.promotion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.promotion-content {
  margin-bottom: 16px;
}

.promotion-details {
  margin-top: 16px;
}

.detail-item {
  margin-bottom: 8px;
  color: #666;
}

@media (max-width: 768px) {
  .tab-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
}
</style>
