<template>
  <div class="qr-scanner-container">
    <!-- Modal do Scanner -->
    <a-modal
      v-model:open="isModalOpen"
      title="Escanear QR Code"
      :footer="null"
      width="500px"
      centered
      @cancel="closeScanner"
    >
      <div class="scanner-content">
        <!-- Video element para a câmera -->
        <div class="camera-container">
          <video
            ref="videoElement"
            v-show="isCameraActive"
            class="camera-video"
            autoplay
            playsinline
          ></video>
          
          <!-- Canvas para processar frames -->
          <canvas
            ref="canvasElement"
            style="display: none;"
          ></canvas>
          
          <!-- Loading state -->
          <div v-if="isLoading" class="loading-container">
            <a-spin size="large" />
            <p>Inicializando câmera...</p>
          </div>
          
          <!-- Error state -->
          <div v-if="error" class="error-container">
            <ExclamationCircleOutlined class="error-icon" />
            <p>{{ error }}</p>
            <a-button @click="startCamera" type="primary">
              Tentar Novamente
            </a-button>
          </div>
        </div>
        
        <!-- Instruções -->
        <div class="instructions">
          <p><CameraOutlined /> Posicione o QR code dentro da área da câmera</p>
          <p>O código será detectado automaticamente</p>
        </div>
      </div>
      
      <!-- Botões do modal -->
      <template #footer>
        <div class="modal-footer">
          <a-button @click="closeScanner">
            Cancelar
          </a-button>
          <a-button 
            v-if="isCameraActive" 
            @click="stopCamera"
            type="default"
          >
            Parar Câmera
          </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onUnmounted, defineProps, defineEmits, defineExpose } from 'vue'
import { message } from 'ant-design-vue'
import { CameraOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'

// Props
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'qrCodeDetected'])

// Refs
const videoElement = ref(null)
const canvasElement = ref(null)
const isModalOpen = ref(false)
const isCameraActive = ref(false)
const isLoading = ref(false)
const error = ref('')
const mediaStream = ref(null)
const scanningInterval = ref(null)

// Função para abrir o scanner
const openScanner = async () => {
  isModalOpen.value = true
  await startCamera()
}

// Função para fechar o scanner
const closeScanner = () => {
  stopCamera()
  isModalOpen.value = false
  emit('update:modelValue', false)
}

// Função para iniciar a câmera
const startCamera = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    // Solicitar acesso à câmera
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // Câmera traseira preferida
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    })
    
    mediaStream.value = stream
    videoElement.value.srcObject = stream
    
    // Aguardar o video estar pronto
    videoElement.value.onloadedmetadata = () => {
      isCameraActive.value = true
      isLoading.value = false
      startScanning()
    }
    
  } catch (err) {
    console.error('Erro ao acessar câmera:', err)
    isLoading.value = false
    
    if (err.name === 'NotAllowedError') {
      error.value = 'Permissão para usar a câmera foi negada. Verifique as configurações do seu navegador.'
    } else if (err.name === 'NotFoundError') {
      error.value = 'Nenhuma câmera foi encontrada no dispositivo.'
    } else {
      error.value = 'Erro ao acessar a câmera. Verifique se ela está disponível.'
    }
  }
}

// Função para parar a câmera
const stopCamera = () => {
  if (scanningInterval.value) {
    clearInterval(scanningInterval.value)
    scanningInterval.value = null
  }
  
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop())
    mediaStream.value = null
  }
  
  isCameraActive.value = false
}

// Função para iniciar o scanning
const startScanning = () => {
  scanningInterval.value = setInterval(() => {
    scanForQRCode()
  }, 500) // Escanear a cada 500ms
}

// Função para escanear QR code
const scanForQRCode = () => {
  if (!videoElement.value || !canvasElement.value || !isCameraActive.value) {
    return
  }
  
  const video = videoElement.value
  const canvas = canvasElement.value
  const context = canvas.getContext('2d')
  
  // Definir tamanho do canvas
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  
  // Capturar frame do video
  context.drawImage(video, 0, 0, canvas.width, canvas.height)
  
  // Tentar decodificar QR code usando uma biblioteca simples
  try {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const qrCode = detectQRCode(imageData)
    
    if (qrCode) {
      onQRCodeDetected(qrCode)
    }
  } catch (error) {
    console.log('Erro ao processar frame:', error)
  }
}

// Função simples para detectar padrões de QR code (implementação básica)
const detectQRCode = () => {
  // Esta é uma implementação muito básica
  // Em um projeto real, você usaria uma biblioteca como jsQR ou qr-scanner
  
  // Por enquanto, vamos simular a detecção
  // Em uma implementação real, você instalaria: npm install jsqr
  // e importaria: import jsQR from 'jsqr'
  // return jsQR(imageData.data, imageData.width, imageData.height)
  
  return null // Placeholder para implementação real
}

// Função chamada quando QR code é detectado
const onQRCodeDetected = (qrData) => {
  try {
    // Parse do QR code (assumindo formato JSON ou texto simples)
    let bookingData
    
    if (qrData.data.startsWith('{')) {
      // Se for JSON
      bookingData = JSON.parse(qrData.data)
    } else {
      // Se for texto simples, assumir formato: BOOKING_NUMBER|EMAIL
      const parts = qrData.data.split('|')
      if (parts.length >= 2) {
        bookingData = {
          bookingNumber: parts[0],
          email: parts[1]
        }
      } else {
        bookingData = {
          bookingNumber: qrData.data,
          email: ''
        }
      }
    }
    
    message.success('QR Code detectado com sucesso!')
    emit('qrCodeDetected', bookingData)
    closeScanner()
    
  } catch (error) {
    console.error('Erro ao processar QR code:', error)
    message.error('QR Code inválido ou formato não reconhecido')
  }
}

// Função pública para abrir o scanner
const open = () => {
  openScanner()
}

// Cleanup ao desmontar componente
onUnmounted(() => {
  stopCamera()
})

// Expor funções públicas
defineExpose({
  open
})
</script>

<style scoped>
.qr-scanner-container {
  /* Container styles se necessário */
}

.scanner-content {
  text-align: center;
}

.camera-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto 20px auto;
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-video {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: cover;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
}

.loading-container p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
}

.error-icon {
  font-size: 48px;
  color: #ff4d4f;
}

.error-container p {
  margin: 0;
  color: #666;
  text-align: center;
  line-height: 1.5;
}

.instructions {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-top: 16px;
}

.instructions p {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.instructions p:first-child {
  font-weight: 600;
  color: #333;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

/* Responsive */
@media (max-width: 768px) {
  .camera-container {
    max-width: 100%;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .modal-footer .ant-btn {
    width: 100%;
  }
}
</style>