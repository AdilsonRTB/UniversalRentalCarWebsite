<template>
    <!-- Success Stories -->
        <div class="success-stories">
          <div class="stories-header">
            <h3>Histórias de Sucesso</h3>
            <p>Veja como nossa plataforma transforma experiências</p>
          </div>
          
          <a-row :gutter="[24, 24]">
            <a-col :xs="24" :md="12" :lg="6">
              <div class="story-card">
                <div class="story-avatar">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face" alt="João" />
                </div>
                <div class="story-content">
                  <h4>João Silva</h4>
                  <span class="story-role">Proprietário</span>
                  <p>"Consegui rentabilizar meu carro em 300% no primeiro ano!"</p>
                  <div class="story-stats">
                    <span>💰 R$ 2.500/mês</span>
                  </div>
                </div>
              </div>
            </a-col>
            
            <a-col :xs="24" :md="12" :lg="6">
              <div class="story-card">
                <div class="story-avatar">
                  <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face" alt="Maria" />
                </div>
                <div class="story-content">
                  <h4>Maria Santos</h4>
                  <span class="story-role">Locatária</span>
                  <p>"Economia de 60% comparado às locadoras tradicionais!"</p>
                  <div class="story-stats">
                    <span>💡 15 viagens</span>
                  </div>
                </div>
              </div>
            </a-col>
            
            <a-col :xs="24" :md="12" :lg="6">
              <div class="story-card">
                <div class="story-avatar">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face" alt="Carlos" />
                </div>
                <div class="story-content">
                  <h4>Carlos Lima</h4>
                  <span class="story-role">Empresário</span>
                  <p>"Solução perfeita para a frota da minha empresa!"</p>
                  <div class="story-stats">
                    <span>🚗 12 veículos</span>
                  </div>
                </div>
              </div>
            </a-col>

            <a-col :xs="24" :md="12" :lg="6">
              <div class="story-card">
                <div class="story-avatar">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face" alt="Ana" />
                </div>
                <div class="story-content">
                  <h4>Ana Costa</h4>
                  <span class="story-role">Viajante</span>
                  <p>"Experiências incríveis em cada destino que visito!"</p>
                  <div class="story-stats">
                    <span>✈️ 8 cidades</span>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
</template>

<style scoped>
.success-stories {
  margin-bottom: 80px;
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
}

.story-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  border-color: #FE7743;
}

.story-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 16px;
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

</style>