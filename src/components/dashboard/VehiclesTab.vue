<template>
  <div class="vehicles-tab">
    <div class="tab-header">
      <h2 class="page-title">{{ t('vehicles.myVehicles') }}</h2>
      <a-button type="primary" size="large" @click="showAddVehicleModal = true">
        <PlusOutlined />
        {{ t('dashboard.addVehicle') }}
      </a-button>
    </div>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :lg="8" v-for="vehicle in vehicles" :key="vehicle.id">
        <a-card class="vehicle-card" hoverable>
          <template #cover>
            <div class="vehicle-image">
              <CarOutlined style="font-size: 3rem; color: #ccc;" />
            </div>
          </template>
          
          <a-card-meta
            :title="`${vehicle.brand} ${vehicle.model} (${vehicle.year})`"
            :description="vehicle.description"
          />
          
          <div class="vehicle-info">
            <div class="info-item">
              <strong>{{ t('vehicles.licensePlate') }}:</strong> {{ vehicle.licensePlate }}
            </div>
            <div class="info-item">
              <strong>{{ t('vehicles.dailyValue') }}:</strong> {{ formatCurrency(vehicle.dailyRate) }}
            </div>
            <div class="info-item">
              <strong>{{ t('vehicles.location') }}:</strong> {{ vehicle.location }}
            </div>
            <div class="info-item">
              <a-tag :color="vehicle.available ? 'green' : 'red'">
                {{ vehicle.available ? t('vehicles.available') : t('vehicles.unavailable') }}
              </a-tag>
            </div>
          </div>
          
          <template #actions>
            <EyeOutlined key="view" @click="viewVehicle(vehicle)" />
            <EditOutlined key="edit" @click="editVehicle(vehicle)" />
            <DeleteOutlined key="delete" @click="deleteVehicle(vehicle)" />
          </template>
        </a-card>
      </a-col>
    </a-row>

    <!-- Add Vehicle Modal -->
    <a-modal
      v-model:open="showAddVehicleModal"
      title="Adicionar Novo Veículo"
      @ok="handleAddVehicle"
      :confirmLoading="addVehicleLoading"
      width="600px"
    >
      <a-form :model="vehicleForm" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Marca">
              <a-input v-model:value="vehicleForm.brand" placeholder="Ex: Toyota" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Modelo">
              <a-input v-model:value="vehicleForm.model" placeholder="Ex: Corolla" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Ano">
              <a-input-number v-model:value="vehicleForm.year" :min="1990" :max="2024" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Placa">
              <a-input v-model:value="vehicleForm.licensePlate" placeholder="ABC-1234" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item label="Valor da Diária (R$)">
          <a-input-number v-model:value="vehicleForm.dailyRate" :min="0" :precision="2" style="width: 100%" />
        </a-form-item>
        
        <a-form-item label="Descrição">
          <a-textarea v-model:value="vehicleForm.description" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLanguageAndCurrency } from '../../composables/useLanguageAndCurrency'
import {
  CarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

// Use i18n and language/currency functionality
const { t } = useI18n()
const { formatCurrency } = useLanguageAndCurrency()

defineProps({
  vehicles: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['addVehicle', 'editVehicle', 'deleteVehicle', 'viewVehicle'])

const showAddVehicleModal = ref(false)
const addVehicleLoading = ref(false)

const vehicleForm = ref({
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  licensePlate: '',
  dailyRate: 0,
  description: ''
})

const handleAddVehicle = async () => {
  addVehicleLoading.value = true
  try {
    emit('addVehicle', { ...vehicleForm.value })
    showAddVehicleModal.value = false
    vehicleForm.value = {
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      dailyRate: 0,
      description: ''
    }
    message.success('Veículo adicionado com sucesso!')
  } catch (error) {
    message.error('Erro ao adicionar veículo')
  } finally {
    addVehicleLoading.value = false
  }
}

const viewVehicle = (vehicle) => {
  emit('viewVehicle', vehicle)
}

const editVehicle = (vehicle) => {
  emit('editVehicle', vehicle)
}

const deleteVehicle = (vehicle) => {
  emit('deleteVehicle', vehicle)
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

.vehicle-card {
  margin-bottom: 16px;
}

.vehicle-image {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.vehicle-info {
  margin-top: 16px;
}

.info-item {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .tab-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
}
</style>
