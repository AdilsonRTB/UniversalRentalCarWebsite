<template>
    <!-- Success Stories -->
        <div class="success-stories">
          <div class="stories-header">
            <h3>{{ $t('evaluations.title') }}</h3>
            <p>{{ $t('evaluations.subtitle') }}</p>
          </div>
          
          <a-carousel
            :dots="evaluations.length > 1"
            :infinite="dynamicCarouselSettings.infinite"
            :slidesToShow="dynamicCarouselSettings.slidesToShow"
            :slidesToScroll="1"
            autoplay
            :autoplaySpeed="4000"
            :responsive="carouselResponsive"
            :arrows="evaluations.length > dynamicCarouselSettings.slidesToShow"
            class="evaluations-carousel"
          >
            <div v-for="(evaluation, index) in evaluations" :key="index" class="carousel-slide">
              <div class="story-card">
                <a-comment>

                  <template #author><h4>{{ evaluation.customer_info.full_name }}</h4></template>
                  <template #avatar>
                    <div class="story-avatar">
                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1B7Cc2RgL0MKHiALbNRzEqENaNh4J5QsDoQ&s" alt="placeholder" />
                    </div>
                  </template>
                  <template #content>

                    <a-typography-paragraph
                      :ellipsis="{ rows: 4, expandable: true, symbol: $t('common.readMore') }"
                      :content="evaluation.comments"

                    />
                  </template>
                  <template #datetime>
                    <a-tooltip :title="dayjs(evaluation.created_at).format('YYYY-MM-DD HH:mm:ss')">
                      <span>{{ dayjs(evaluation.created_at).fromNow() }}</span>
                    </a-tooltip>
                  </template>
                  <div>
                    <a-space>
                      <span>{{ $t('bookings.overallRating') }}: </span>
                      <a-rate :value="evaluation.overall_rating" disabled />
                    </a-space>
                  </div>
                  <div>
                    <a-space>
                      <span>{{ $t('bookings.vehicleCondition') }}: </span>
                      <a-rate :value="evaluation.vehicle_condition_rating" disabled />
                    </a-space>
                  </div>
                  <a-space>
                    <span>{{ $t('bookings.serviceQuality') }}: </span>
                    <a-rate :value="evaluation.service_quality_rating" disabled />
                  </a-space>
                </a-comment>
              </div>
            </div>
          </a-carousel>
        </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { vehicleService } from '@/services/api';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import "dayjs/locale/pt";
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
dayjs.locale('pt');

const { t } = useI18n();

const evaluations = ref([]);

// Configurações dinâmicas do carrossel
const dynamicCarouselSettings = computed(() => {
  const evaluationsCount = evaluations.value.length;
  
  // Se tem menos de 3 avaliações, mostrar apenas o número disponível
  const maxSlidesToShow = Math.min(evaluationsCount, 3);
  
  return {
    slidesToShow: maxSlidesToShow,
    slidesToScroll: 1,
    infinite: evaluationsCount > maxSlidesToShow, // Só ser infinito se tiver mais slides que os mostrados
    autoplay: evaluationsCount > 1 // Só autoplay se tiver mais de 1 avaliação
  };
});

const carouselResponsive = computed(() => {
  const evaluationsCount = evaluations.value.length;
  
  return [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: Math.min(evaluationsCount, 3),
        slidesToScroll: 1,
        infinite: evaluationsCount > Math.min(evaluationsCount, 3)
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: Math.min(evaluationsCount, 2),
        slidesToScroll: 1,
        infinite: evaluationsCount > Math.min(evaluationsCount, 2)
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: evaluationsCount > 1
      }
    }
  ];
});

const getEvaluationsStats = async () => {
  try {
    const response = await vehicleService.getAllEvaluations();
    evaluations.value = response.data.filter(evaluation => evaluation.overall_rating > 3);
    return response.data;
  } catch (error) {
    console.error(t('evaluations.errors.fetchStatistics'), error);
    return null;
  }
};

onMounted(async () => {
  await getEvaluationsStats();
});

</script>

<style scoped>
.success-stories {
  margin-bottom: 48px;
  position: relative;
  z-index: 1;
}

.stories-header {
  text-align: center;
  margin-bottom: 48px;
}

.stories-header h3 {
  font-size: 36px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 12px;
}

.stories-header p {
  font-size: 18px;
  color: #64748b;
}

.story-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  height: 100%;
  min-height: 200px;
  width: 100%;
}

.story-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  border-color: #FE7743;
}

.story-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 10px;
  border: 3px solid #FE7743;
}

.story-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.story-content h4 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.story-role {
  font-size: 14px;
  color: #FE7743;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.story-content p {
  font-size: 16px;
  color: #64748b;
  margin: 12px 0;
  line-height: 1.5;
  font-style: italic;
}

.story-stats {
  font-size: 14px;
  font-weight: 600;
  color: #10b981;
}

/* Carousel Styles */
.evaluations-carousel {
  position: relative;
}

.carousel-slide {
  padding: 10px;
}

:deep(.ant-carousel .slick-slide) {
  padding: 0 12px;
  box-sizing: border-box;
}

:deep(.ant-carousel .slick-list) {
  margin: 0 -12px;
}

:deep(.ant-carousel .slick-dots) {
  bottom: -50px;
}

:deep(.ant-carousel .slick-dots li button) {
  background: #d1d5db;
  border-radius: 50%;
  width: 12px;
  height: 12px;
}

:deep(.ant-carousel .slick-dots li.slick-active button) {
  background: #FE7743;
}

:deep(.ant-carousel .slick-arrow) {
  z-index: 2;
  width: 40px;
  height: 40px;
  background: white;
  border: 2px solid #FE7743;
  border-radius: 50%;
  color: #FE7743;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

:deep(.ant-carousel .slick-arrow:hover) {
  background: #FE7743;
  color: white;
  transform: scale(1.1);
}

:deep(.ant-carousel .slick-prev) {
  left: -20px;
}

:deep(.ant-carousel .slick-next) {
  right: -20px;
}

:deep(.ant-carousel .slick-arrow.slick-disabled) {
  opacity: 0.3;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  :deep(.ant-carousel .slick-arrow) {
    display: none !important;
  }
  
  .carousel-slide {
    padding: 0 8px;
  }
  
  :deep(.ant-carousel .slick-slide) {
    padding: 0 8px;
  }
  
  :deep(.ant-carousel .slick-list) {
    margin: 0 -8px;
  }
}

</style>