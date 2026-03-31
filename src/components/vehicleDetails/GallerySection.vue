<template>
  <section class="gallery-section-modern">
    <div class="gallery-container">
      <div class="vehicle-image-carousel-modern">
        <a-carousel :autoplay="true" class="modern-carousel">
          <div v-for="(image, index) in vehicleImages" :key="index" class="carousel-slide-modern">
            <img :src="formatImageUrl(image.image)" :alt="`${vehicle?.brand_name} ${vehicle?.model} - Imagem ${index + 1}`" class="vehicle-image-modern" />
            <div class="image-overlay-actions">
              <!--a-button type="text" class="action-btn-modern">
                <CarOutlined style="font-size: large;"/>
              </!--a-button-->
              <a-button type="text" class="action-btn-modern" @click="shareLink">
                <ShareAltOutlined />
              </a-button>
              <a-button type="text" class="action-btn-modern" @click="visible = true">
                <ExpandOutlined />
              </a-button>
            </div>
          </div>
        </a-carousel>
      </div>
    </div>
  </section>
  <div style="display: none">
    <a-image-preview-group :preview="{ visible, onVisibleChange: vis => (visible = vis) }">
          <a-image v-for="(image, index) in vehicleImages" :key="index"
            :src="formatImageUrl(image.image)"
          />

        </a-image-preview-group>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { ShareAltOutlined, ExpandOutlined } from '@ant-design/icons-vue'
import { useUtilities } from '../../composables/utilits.js'

const { formatImageUrl } = useUtilities()

const visible = ref(false);

const shareLink = () => {
  const linkToShare = window.location.href
  if (navigator.share) {
    navigator.share({
      title: document.title,
      url: linkToShare
    }).catch(err => console.error('Erro ao compartilhar', err))
  } else {
    alert('Compartilhamento não suportado nesse navegador.')
  }
}

defineProps({
  vehicle: {
    type: Object,
    required: true
  },
  vehicleImages: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
/* Gallery Section */
.gallery-section-modern {
  margin-bottom: 40px;
}

.gallery-container {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.vehicle-image-carousel-modern {
  position: relative;
}

.modern-carousel {
  border-radius: 20px;
}

.carousel-slide-modern {
  position: relative;
  height: 400px;
}

.vehicle-image-modern {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay-actions {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 12px;
}

.action-btn-modern {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.action-btn-modern:hover {
  background: white;
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}
</style>