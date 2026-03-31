<template>
  <section class="reviews-section-modern">
    <div class="section-header-modern reviews-header-custom">
      <div>
        <h3 class="section-title-modern">{{ t('vehicles.customerReviews') }}</h3>
        <div class="section-subtitle-modern">{{ t('vehicles.whatCustomersSay') }}</div>
      </div>
      <a-button type="link" class="view-all-reviews-btn">
        {{ t('vehicles.viewAllReviews') }}
        <RightOutlined />
      </a-button>
    </div>

    <div class="reviews-stats-modern">
      <div class="rating-overview">
        <div class="average-rating">
          <span class="rating-number">{{ evaluations?.statistics?.average_overall_rating }}</span>
          <div class="rating-stars">
            <a-rate :value="evaluations?.statistics?.average_overall_rating" disabled allow-half />
          </div>
          <span class="rating-count">{{ evaluations?.statistics?.total_evaluations }} {{ evaluations?.statistics?.total_evaluations === 1 ? 'avaliação' : 'avaliações' }}</span>
        </div>
      </div>

      <div class="rating-breakdown">
        <div class="rating-bar-item">
          <span class="star-label">5 ⭐</span>
          <div class="rating-bar">
            <div class="rating-fill" :style="`width: ${getRatingPercentage(5)}%`"></div>
          </div>
          <span class="rating-percentage">0%</span>
        </div>
        <div class="rating-bar-item">
          <span class="star-label">4 ⭐</span>
          <div class="rating-bar">
            <div class="rating-fill" :style="`width: ${getRatingPercentage(4)}%`"></div>
          </div>
          <span class="rating-percentage">{{ getRatingPercentage(4) }}%</span>
        </div>
        <div class="rating-bar-item">
          <span class="star-label">3 ⭐</span>
          <div class="rating-bar">
            <div class="rating-fill" :style="`width: ${getRatingPercentage(3)}%`"></div>
          </div>
          <span class="rating-percentage">{{ getRatingPercentage(3) }}%</span>
        </div>
        <div class="rating-bar-item">
          <span class="star-label">2 ⭐</span>
          <div class="rating-bar">
            <div class="rating-fill" :style="`width: ${getRatingPercentage(2)}%`"></div>
          </div>
          <span class="rating-percentage">{{ getRatingPercentage(2) }}%</span>
        </div>
        <div class="rating-bar-item">
          <span class="star-label">1 ⭐</span>
          <div class="rating-bar">
            <div class="rating-fill" :style="`width: ${getRatingPercentage(1)}%`"></div>
          </div>
          <span class="rating-percentage">{{ getRatingPercentage(1) }}%</span>
        </div>
      </div>
    </div>
    
    <div class="reviews-list-modern" v-if="!loading">
      <!-- Real API data only -->
      <template v-if="evaluations?.evaluations?.results.length > 0">
        <div 
          class="review-card-modern" 
          v-for="(evaluation, index) in evaluations?.evaluations?.results"
          :key="`eval-${evaluation.id || index}`"
        >
          <div class="review-header-modern">
            <div class="reviewer-info">
              <div class="reviewer-avatar">
                <span class="avatar-text">{{ getCustomerInitial(evaluation) }}</span>
              </div>
              <div class="reviewer-details">
                <h4 class="reviewer-name">{{ getCustomerName(evaluation) }}</h4>
                <div class="review-meta">
                  <span class="review-date-modern">{{ formatDate(evaluation.created_at) }}</span>
                  <span class="review-badge" :class="getRecommendationBadgeClass(evaluation)">
                    {{ getRecommendationBadge(evaluation) }}
                  </span>
                </div>
                <div class="rental-info" v-if="evaluation.rental_info">
                  <span class="rental-period">
                    Aluguel: {{ formatDateShort(evaluation.rental_info.start_date) }} - 
                    {{ formatDateShort(evaluation.rental_info.end_date) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="rating-stars">
              <a-rate :value="evaluation.overall_rating" disabled allow-half />
              <span class="rating-value">{{ evaluation.overall_rating }}/5</span>
            </div>
          </div>
          
          <div class="review-content-modern">
            <p class="review-text">{{ evaluation.comments || 'Sem comentários adicionais.' }}</p>
            
            <!-- Detailed ratings -->
            <div class="detailed-ratings">
              <div class="rating-detail">
                <span class="rating-label">Condição do Veículo:</span>
                <a-rate :value="evaluation.vehicle_condition_rating" disabled size="small" />
                <span class="rating-number">{{ evaluation.vehicle_condition_rating }}/5</span>
              </div>
              <div class="rating-detail">
                <span class="rating-label">Qualidade do Serviço:</span>
                <a-rate :value="evaluation.service_quality_rating" disabled size="small" />
                <span class="rating-number">{{ evaluation.service_quality_rating }}/5</span>
              </div>
              <!--div class="rating-detail">
                <span class="rating-label">Relação Qualidade/Preço:</span>
                <a-rate :value="evaluation.value_for_money_rating" disabled size="small" />
                <span class="rating-number">{{ evaluation.value_for_money_rating }}/5</span>
              </!--div-->
              <!--div class="rating-detail overall-rating">
                <span class="rating-label">Avaliação Geral:</span>
                <a-rate :value="evaluation.overall_rating" disabled size="small" />
                <span class="rating-number">{{ evaluation.overall_rating }}/5</span>
              </!--div-->
            </div>
            
            <div class="review-tags">
              <span class="review-tag" v-for="tag in getReviewTags(evaluation)" :key="tag">{{ tag }}</span>
            </div>
            
            <!-- Issues section -->
            <!--div v-if="evaluation.had_issues && evaluation.issue_description" class="issue-section">
              <div class="issue-badge">⚠️ Problemas relatados</div>
              <p class="issue-description">{{ evaluation.issue_description }}</p>
            </!--div-->

            <!-- Vehicle info -->
            <!--div class="vehicle-info" v-if="evaluation.vehicle_info">
              <span class="vehicle-tag">
                {{ evaluation.vehicle_info.brand }} {{ evaluation.vehicle_info.model }} ({{ evaluation.vehicle_info.year }})
              </span>
            </!--div-->
          </div>
        </div>
      </template>
      
      <!-- No reviews state -->
      <div v-else class="no-reviews-state">
        <div class="no-reviews-icon">📝</div>
        <h4>Nenhuma avaliação ainda</h4>
        <p>Seja o primeiro a avaliar este veículo!</p>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-else class="reviews-loading">
      <a-spin size="large" />
      <p>Carregando avaliações...</p>
    </div>
    
    <div class="reviews-actions">
      <a-button class="view-more-reviews-btn" size="large">
        {{ t('vehicles.viewMoreReviews') }}
      </a-button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue'
import { RightOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import { vehicleService } from '@/services/api'
import { message } from 'ant-design-vue'

const { t } = useI18n()

// Props
const props = defineProps({
  vehicleId: {
    type: [String, Number],
    required: true
  }
})

// State
const loading = ref(false)
const evaluations = ref({})

// Load evaluations from API
const loadEvaluations = async () => {
  if (!props.vehicleId) return
  
  loading.value = true
  try {
    console.log('[ReviewsSection] Loading evaluations for vehicle:', props.vehicleId)
    const response = await vehicleService.getVehicleEvaluations(props.vehicleId)

    if (response.data ) {
      evaluations.value = response.data
      console.log('[ReviewsSection] Loaded evaluations:', evaluations.value)
    } else {
      console.warn('[ReviewsSection] No evaluations data or invalid format:', response.data)
      evaluations.value = []
    }
  } catch (error) {
    console.error('[ReviewsSection] Error loading evaluations:', error)
    message.error('Erro ao carregar avaliações')
    evaluations.value = []
  } finally {
    loading.value = false
  }
}

// Helper functions for stats (using API data directly)
/*const getAverageRating = () => {
  if (evaluations.value?.evaluations?.results.length === 0) return 0
  const sum = evaluations.value.reduce((acc, evaluation) => acc + (evaluation.average_rating || evaluation.overall_rating), 0)
  return (sum / evaluations.value.length).toFixed(1)
}*/

/*const getTotalReviews = () => {
  return evaluations.value.length
}*/

const getRatingPercentage = (rating) => {
  if (evaluations.value?.evaluations?.results.length === 0) return 0
  const count = evaluations.value?.evaluations?.results.filter(evaluation => Math.floor(evaluation.overall_rating) === rating).length
  return Math.round((count / evaluations.value?.evaluations?.results.length) * 100)
}

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  } catch (error) {
    return dateString
  }
}

const formatDateShort = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    })
  } catch (error) {
    return dateString
  }
}

const getCustomerName = (evaluation) => {
  return evaluation.customer_info?.full_name || 'Cliente Anônimo'
}

const getCustomerInitial = (evaluation) => {
  const name = getCustomerName(evaluation)
  return name.charAt(0).toUpperCase()
}

const getRecommendationBadge = (evaluation) => {
  if (evaluation.would_recommend) {
    return 'Recomenda'
  } else if (evaluation.had_issues) {
    return 'Com problemas'
  }
  return 'Boa experiência'
}

const getRecommendationBadgeClass = (evaluation) => {
  if (evaluation.would_recommend) {
    return 'excellent'
  } else if (evaluation.had_issues) {
    return 'issues'
  }
  return 'good'
}

const getReviewTags = (evaluation) => {
  const tags = []
  
  if (evaluation.vehicle_condition_rating >= 4) {
    tags.push('Bem mantido')
  }
  if (evaluation.service_quality_rating >= 4) {
    tags.push('Bom atendimento')
  }
  if (evaluation.value_for_money_rating >= 4) {
    tags.push('Bom custo-benefício')
  }
  if (evaluation.would_recommend) {
    tags.push('Recomenda')
  }
  if (evaluation.overall_rating >= 4.5) {
    tags.push('Excelente')
  }
  if (evaluation.rental_info?.status === 'completed') {
    tags.push('Aluguel concluído')
  }
  
  return tags
}

// Lifecycle
onMounted(() => {
  loadEvaluations()
})
</script>

<style scoped>
/* Reviews Section */
.reviews-section-modern {
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

.section-title-modern {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle-modern {
  color: #6b7280;
  font-size: 16px;
  margin-top: 8px;
}

/* Reviews Stats */
.reviews-stats-modern {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 32px;
  margin-bottom: 32px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.rating-overview {
  text-align: center;
}

.average-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.rating-number {
  font-size: 48px;
  font-weight: 700;
  color: #111827;
}

.rating-count {
  color: #6b7280;
  font-size: 14px;
}

.rating-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.star-label {
  min-width: 40px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
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
  background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 4px;
}

.rating-percentage {
  min-width: 35px;
  text-align: right;
  font-size: 12px;
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
}

.review-card-modern:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
  flex-shrink: 0;
}

.avatar-text {
  text-transform: uppercase;
}

.reviewer-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.reviewer-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.review-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.review-date-modern {
  color: #6b7280;
  font-size: 14px;
}

.review-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.review-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.review-badge.excellent {
  background: #dcfce7;
  color: #166534;
}

.review-badge.good {
  background: #dbeafe;
  color: #1e40af;
}

.review-badge.issues {
  background: #fef3c7;
  color: #d97706;
}

.rental-info {
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
}

.rental-period {
  font-style: italic;
}

.rating-value {
  margin-left: 8px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
}

.rating-number {
  margin-left: 8px;
  color: #6b7280;
  font-size: 11px;
  min-width: 24px;
  display: inline-block;
}

.vehicle-info {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.vehicle-tag {
  background: #f8fafc;
  color: #475569;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  display: inline-block;
}

.review-badge.good {
  background: #fef3c7;
  color: #92400e;
}

.review-content-modern {
  margin-top: 16px;
}

.review-text {
  color: #374151;
  line-height: 1.6;
  margin: 0 0 12px 0;
  font-size: 15px;
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
  background: white;
  border: 2px solid #e5e7eb;
  color: #374151;
  font-weight: 500;
  height: 48px;
  padding: 0 32px;
  border-radius: 12px;
}

.view-more-reviews-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

/* New styles for API data */
.detailed-ratings {
  margin: 16px 0;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 3px solid #3b82f6;
}

.rating-detail {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.rating-detail.overall-rating {
  border-top: 1px solid #e5e7eb;
  padding-top: 8px;
  margin-top: 12px;
  font-weight: 600;
}

.rating-detail.overall-rating .rating-label {
  color: #1f2937;
  font-weight: 600;
}

.rating-detail:last-child {
  margin-bottom: 0;
}

.rating-label {
  font-size: 14px;
  color: #4b5563;
  font-weight: 500;
}

.issue-section {
  margin-top: 16px;
  padding: 12px;
  background: #fef2f2;
  border-radius: 8px;
  border-left: 3px solid #ef4444;
}

.issue-badge {
  font-size: 12px;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 8px;
}

.issue-description {
  font-size: 14px;
  color: #7f1d1d;
  margin: 0;
  font-style: italic;
}

.no-reviews-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.no-reviews-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-reviews-state h4 {
  color: #374151;
  margin-bottom: 8px;
}

.no-reviews-state p {
  color: #9ca3af;
  margin: 0;
}

.reviews-loading {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.reviews-loading p {
  margin-top: 16px;
  color: #9ca3af;
}

/* Responsive */
@media (max-width: 768px) {
  .reviews-header-custom {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .view-all-reviews-btn {
    align-self: flex-start;
  }
  
  .reviews-stats-modern {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 16px;
  }
  
  /* Mobile responsiveness for new elements */
  .detailed-ratings {
    padding: 12px;
  }
  
  .rating-detail {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .issue-section {
    padding: 8px;
  }
  
  .no-reviews-state {
    padding: 40px 16px;
  }
  
  .reviews-loading {
    padding: 40px 16px;
  }
}
</style>