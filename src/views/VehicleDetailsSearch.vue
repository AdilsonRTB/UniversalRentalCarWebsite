<template>
  <div class="vehicle-details-modern">
    <a-spin :spinning="loading" size="large">

      <!--section class="hero-details-section" >
        <div class="hero-details-container">
          <div class="hero-details-content">
            <div class="hero-title-section">
              <h1 class="vehicle-title-modern">{{ vehicle?.brand_name }} {{ vehicle?.model }}</h1>
              <div class="vehicle-meta-modern">
                <div class="meta-item">
                  <CalendarOutlined class="meta-icon" />
                  <span>{{ vehicle?.year }}</span>
                </div>
                <div class="meta-item">
                  <EnvironmentOutlined class="meta-icon" />
                  <span>Praia, Santiago</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </!--section-->

      <!-- Main Content -->
      <div class="vehicle-details-container">
        <div class="main-content-modern">
          <!-- Gallery Section -->
          <GallerySection
            :vehicle="vehicle"
            :vehicle-images="vehicleImages"
            :startDate="startDate" :endDate="endDate"
          />
          

        </div>
      </div>

    </a-spin>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue'

import GallerySection from '../views/GallerySectionSearch.vue'

import { vehicleService } from '../services/api'

const loading = ref(false)
const vehicle = ref({})


const props = defineProps({
  vehicleId: {
    type: Number,
    required: true
  },
  startDate: {
    type: String,
    default: null
  },
  endDate: {
    type: String,
    default: null
  }
})

// Mock vehicle images
const vehicleImages = ref([])





// Methods
const loadVehicleDetails = async () => {
  loading.value = true
  try {

    const response = await vehicleService.getVehicleById(props.vehicleId)
    vehicle.value = response.data
    vehicleImages.value = response.data.additional_photos || []
  } catch (error) {
    console.error('Erro ao carregar detalhes do veículo:', error)
    loadMockVehicles()
  } finally {
    loading.value = false
  }
}

const loadMockVehicles = () => {
  vehicle.value = {
    id: 1,
    brand_name: 'Toyota',
    model: 'Corolla',
    year: 2020,
    daily_rate: 50,
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit semper vel class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos orci varius natoque penatibus et magnis dis parturient montes nascetur ridiculus mus donec rhoncus eros lobortis nulla molestie mattis scelerisque maximus eget fermentum odio phasellus non purus est efficitur laoreet mauris pharetra vestibulum fusce dictum risus blandit quis suspendisse aliquet nisi sodales consequat magna ante condimentum neque at luctus nibh finibus facilisis dapibus etiam interdum tortor ligula congue sollicitudin erat viverra ac tincidunt nam porta elementum a enim euismod quam justo lectus commodo augue arcu dignissim velit aliquam imperdiet mollis nullam volutpat porttitor ullamcorper rutrum gravida cras eleifend turpis fames primis.',
    additional_photos: [
      {image: 'https://i.pinimg.com/1200x/e4/7e/44/e47e447d37b47b856e9b8fab3d746e39.jpg'},
      {image: 'https://i.pinimg.com/736x/f3/a5/a9/f3a5a9b46a984b78a710035df5526bb2.jpg'},
    ],
  }
  vehicleImages.value = vehicle.value.additional_photos
}

onMounted(() => {
  loadVehicleDetails()
})
</script>

<style scoped>
/* Modern Vehicle Details Styles */
.vehicle-details-modern {
  background: #f8fafc;
  padding-top: 30px;
  margin-top: 15px;
}

/* Hero Section */
.hero-details-section {
  padding: 0px 0 60px;
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%) !important;
  position: relative;
  overflow: hidden;
  height: 400px;
  border-radius: 20px;
}

.hero-details-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.hero-details-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 2;
}

.breadcrumb-modern {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 14px;
}

.breadcrumb-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: white;
}

.breadcrumb-separator {
  color: rgba(255, 255, 255, 0.6);
  margin: 0 4px;
}

.breadcrumb-current {
  color: white !important;
  font-weight: 500;
}

.vehicle-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.availability-badge-modern,
.promotion-badge-modern,
.verified-badge-modern {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.availability-badge-modern.available {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  backdrop-filter: blur(10px);
}

.availability-badge-modern.unvailable {
  background: rgba(216, 7, 7, 0.2);
  color: #e8e0e0;
  backdrop-filter: blur(10px);
}

.promotion-badge-modern {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  backdrop-filter: blur(10px);
}

.verified-badge-modern {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  backdrop-filter: blur(10px);
}

.vehicle-title-modern {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
  color: white;
}

.vehicle-meta-modern {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
}

.meta-icon {
  font-size: 18px;
}

/* Main Content */
.vehicle-details-container {
  -max-width: 1200px;
  margin-top: 10px;
  padding: 0 0px;
}

.main-content-modern {
  margin-top: -40px;
  position: relative;
  z-index: 3;
}

/* Gallery Section */
.gallery-section-modern {
  margin-bottom: 40px;
}

.gallery-container {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.vehicle-image-carousel-modern {
  height: 400px;
}

.modern-carousel {
  height: 100%;
}

.carousel-slide-modern {
  height: 400px;
  position: relative;
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
  z-index: 4;
}

.action-btn-modern {
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-btn-modern:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Content Grid */
.content-grid-modern {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  margin-top: 40px;
}

/* Cards */
.specs-card-modern,
.features-card-modern,
.description-card-modern,
.booking-card-modern {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 24px;
}

.card-header-modern {
  padding: 24px 24px 0;
}

.card-title-modern {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.card-subtitle-modern {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
}

/* Specs Grid */
.specs-grid-modern {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 0 24px 24px;
}

.spec-item-modern {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
}

.spec-icon-modern {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.spec-content-modern {
  display: flex;
  flex-direction: column;
}

.spec-label-modern {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.spec-value-modern {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

/* Features Grid */
.features-grid-modern {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 0 24px 24px;
}

.feature-item-modern {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
}

.feature-icon {
  font-size: 16px;
}

.feature-icon.available {
  color: #22c55e;
}

.feature-text {
  font-size: 14px;
  color: #374151;
}

/* Description */
.description-content-modern {
  padding: 0 24px 24px;
}

.description-content-modern p {
  font-size: 15px;
  line-height: 1.6;
  color: #4b5563;
  margin: 0;
}

/* Booking Card */
.booking-card-modern {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.booking-header-modern {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.price-section-modern {
  text-align: center;
}

.original-price-modern {
  font-size: 16px;
  color: #9ca3af;
  text-decoration: line-through;
  margin-bottom: 4px;
}

.current-price-modern {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.price-value-modern {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
}

.price-period-modern {
  font-size: 18px;
  color: #6b7280;
}

.promotion-savings {
  font-size: 14px;
  color: #22c55e;
  font-weight: 500;
  margin-top: 8px;
}

/* Booking Form */
.booking-form-modern {
  padding: 24px;
}

.date-grid-modern {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.date-item-modern {
  margin-bottom: 0;
}

.modern-date-picker {
  width: 100%;
}

/* Booking Summary */
.booking-summary-modern {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.summary-item.total {
  border-top: 1px solid #e5e7eb;
  padding-top: 8px;
  margin-top: 8px;
  font-weight: 600;
}

.summary-label {
  color: #6b7280;
  font-size: 14px;
}

.summary-value {
  color: #1f2937;
  font-size: 14px;
  font-weight: 500;
}

/* Booking Actions */
.booking-actions-modern {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.book-now-btn-modern {
  height: 48px;
  background: #3b82f6;
  border: none;
  font-weight: 600;
  font-size: 16px;
}

.contact-owner-btn-modern {
  height: 48px;
  border: 1px solid #d1d5db;
  font-weight: 500;
  color: #374151;
}

.contact-owner-btn-modern:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-grid-modern {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .booking-card-modern {
    position: static;
  }
}

@media (max-width: 768px) {
  .vehicle-title-modern {
    font-size: 32px;
  }
  
  .specs-grid-modern,
  .features-grid-modern {
    grid-template-columns: 1fr;
  }
  
  .date-grid-modern {
    grid-template-columns: 1fr;
  }
  
  .vehicle-meta-modern {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}

/* Reviews Section */
.reviews-section-modern,
.similar-vehicles-section-modern {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin: 40px 0;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(229, 231, 235, 0.3);
}

.section-header-modern {
  margin-bottom: 40px;
  text-align: center;
  position: relative;
}

.reviews-header-custom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 20px;
  border-bottom: 2px solid #f3f4f6;
  margin-bottom: 24px;
  text-align: left;
}

.view-all-reviews-btn {
  color: #2563eb;
  padding: 8px 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s;
}

.view-all-reviews-btn:hover {
  background: #eff6ff;
  color: #1d4ed8;
}

.section-header-modern::after {
  content: '';
  position: absolute;
  bottom: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
}

.section-title-modern {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #1f2937 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.section-subtitle-modern {
  font-size: 18px;
  color: #6b7280;
  font-weight: 500;
}

/* Reviews Stats */
.reviews-stats-modern {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  margin-bottom: 40px;
  padding: 30px;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.rating-overview {
  text-align: center;
  position: relative;
}

.average-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.rating-number {
  font-size: 48px;
  font-weight: 800;
  color: #1f2937;
  line-height: 1;
}

.rating-count {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.rating-breakdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rating-bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.star-label {
  font-size: 14px;
  min-width: 40px;
  color: #374151;
  font-weight: 500;
}

.rating-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.rating-fill {
  height: 100%;
  background: #f59e0b;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.rating-percentage {
  font-size: 14px;
  min-width: 40px;
  text-align: right;
  color: #6b7280;
  font-weight: 500;
}

/* Reviews List */
.reviews-list-modern {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.review-card-modern {
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  transition: all 0.3s ease;
}

.review-card-modern:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-color: #3b82f6;
}

.review-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.reviewer-info {
  display: flex;
  gap: 12px;
}

.reviewer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 16px;
}

.reviewer-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.reviewer-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.review-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.review-date-modern {
  font-size: 13px;
  color: #6b7280;
}

.review-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.review-badge.excellent {
  background: #dcfce7;
  color: #166534;
}

.review-badge.good {
  background: #dbeafe;
  color: #1d4ed8;
}

.review-content-modern {
  margin-top: 16px;
}

.review-text {
  font-size: 15px;
  line-height: 1.6;
  color: #374151;
  margin: 0 0 16px 0;
}

.review-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.review-tag {
  padding: 6px 12px;
  background: #f3f4f6;
  color: #374151;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #e5e7eb;
}

.reviews-actions {
  text-align: center;
}

.view-more-reviews-btn {
  height: 44px;
  padding: 0 32px;
  font-weight: 500;
  border: 1px solid #d1d5db;
  color: #374151;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.view-more-reviews-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #f8fafc;
}

/* Similar Vehicles */
.similar-vehicles-grid-modern {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.similar-vehicle-card-modern {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.similar-vehicle-card-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border-color: #2563eb;
}

.similar-vehicle-image-modern {
  height: 180px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e5e7eb;
}

.vehicle-icon-similar {
  font-size: 48px;
  color: #94a3b8;
  opacity: 0.7;
}

.promotion-badge-similar {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.similar-vehicle-content-modern {
  padding: 20px;
}

.vehicle-header-similar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.vehicle-title-similar {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  line-height: 1.3;
}

.vehicle-year-similar {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.vehicle-location-similar {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #6b7280;
}

.location-icon-similar {
  font-size: 14px;
}

.vehicle-features-mini {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.feature-mini {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 4px;
  background: #f9fafb;
  border-radius: 8px;
  font-size: 11px;
  color: #6b7280;
  text-align: center;
}

.feature-mini span {
  font-weight: 500;
}

.vehicle-price-section {
  margin-bottom: 16px;
}

.price-info {
  text-align: center;
}

.original-price-grid {
  font-size: 13px;
  color: #9ca3af;
  text-decoration: line-through;
  margin-bottom: 2px;
}

.current-price-grid {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.price-period-grid {
  font-size: 13px;
  color: #6b7280;
  margin-left: 4px;
}

.view-details-btn {
  height: 36px;
  font-size: 14px;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-grid-modern {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .booking-card-modern {
    position: static;
  }

  .reviews-stats-modern {
    grid-template-columns: 1fr;
    gap: 24px;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .vehicle-title-modern {
    font-size: 32px;
  }
  
  .specs-grid-modern,
  .features-grid-modern {
    grid-template-columns: 1fr;
  }
  
  .date-grid-modern {
    grid-template-columns: 1fr;
  }
  
  .vehicle-meta-modern {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .similar-vehicles-grid-modern {
    grid-template-columns: 1fr;
  }

  .vehicle-features-mini {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .reviews-header-custom {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .view-all-reviews-btn {
    align-self: flex-start;
  }
}
</style>