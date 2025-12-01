<template>
  <div class="messages-container">
    <div class="breadcrumb-modern">
      <span class="breadcrumb-current">Area Pessoal</span>
      <span class="breadcrumb-separator">›</span>
      <router-link to="/owner-dashboard?tab=overview" class="breadcrumb-link">Dashboard</router-link>
    </div>
    <!-- Header -->
    <div class="messages-header">
      <div class="header-content">
        <h2 class="messages-title">
          <MessageOutlined class="title-icon" />
          Mensagens
        </h2>
        <div class="header-actions">
          <a-button type="primary" @click="startNewConversation">
            <PlusOutlined />
            Nova Conversa
          </a-button>
        </div>
      </div>
    </div>

    <div class="messages-layout">
      <!-- Conversations List -->
      <div class="conversations-sidebar">
        <div class="conversations-header">
          <a-input-search
            v-model:value="searchQuery"
            placeholder="Buscar conversas..."
            @search="searchConversations"
            class="conversation-search"
          />
        </div>
        
        <div class="conversations-list">
          <div 
            v-for="conversation in filteredConversations"
            :key="conversation.id"
            class="conversation-item"
            :class="{ 'active': activeConversation?.id === conversation.id, 'unread': conversation.unreadCount > 0 }"
            @click="selectConversation(conversation)"
          >
            <div class="conversation-avatar">
              <a-avatar :src="conversation.avatar" :size="40">
                {{ conversation.name.charAt(0) }}
              </a-avatar>
              <div v-if="conversation.online" class="online-indicator"></div>
            </div>
            
            <div class="conversation-content">
              <div class="conversation-header">
                <h4 class="conversation-name">{{ conversation.name }}</h4>
                <span class="conversation-time">{{ formatTime(conversation.lastMessageTime) }}</span>
              </div>
              <div class="conversation-preview">
                <p class="last-message">{{ conversation.lastMessage }}</p>
                <a-badge 
                  v-if="conversation.unreadCount > 0" 
                  :count="conversation.unreadCount" 
                  class="unread-badge"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Area -->
      <div class="chat-area">
        <div v-if="!activeConversation" class="no-conversation">
          <MessageOutlined class="no-conversation-icon" />
          <h3>Selecione uma conversa</h3>
          <p>Escolha uma conversa existente ou inicie uma nova para começar a trocar mensagens.</p>
        </div>
        
        <div v-else class="chat-container">
          <!-- Chat Header -->
          <div class="chat-header">
            <div class="chat-contact">
              <a-avatar :src="activeConversation.avatar" :size="32">
                {{ activeConversation.name.charAt(0) }}
              </a-avatar>
              <div class="contact-info">
                <h4>{{ activeConversation.name }}</h4>
                <span class="contact-status">
                  {{ activeConversation.online ? 'Online' : `Visto por último ${formatTime(activeConversation.lastSeen)}` }}
                </span>
              </div>
            </div>
            
            <div class="chat-actions">
              <a-button type="text" @click="viewContactInfo">
                <InfoCircleOutlined />
              </a-button>
              <a-dropdown>
                <a-button type="text">
                  <MoreOutlined />
                </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="block">Bloquear usuário</a-menu-item>
                    <a-menu-item key="report">Reportar</a-menu-item>
                    <a-menu-item key="clear">Limpar conversa</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>

          <!-- Messages List -->
          <div class="messages-list" ref="messagesContainer">
            <div 
              v-for="message in activeConversation.messages"
              :key="message.id"
              class="message-wrapper"
              :class="{ 'own-message': message.senderId === currentUserId }"
            >
              <div class="message-bubble">
                <div v-if="message.type === 'text'" class="message-text">
                  {{ message.content }}
                </div>
                
                <div v-else-if="message.type === 'image'" class="message-image">
                  <img :src="message.content" :alt="message.alt" @click="previewImage(message.content)" />
                </div>
                
                <div v-else-if="message.type === 'booking'" class="message-booking">
                  <div class="booking-card">
                    <CarOutlined class="booking-icon" />
                    <div class="booking-info">
                      <h5>{{ message.content.vehicleName }}</h5>
                      <p>{{ message.content.dates }}</p>
                      <p class="booking-price">{{ message.content.price }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="message-time">
                  {{ formatMessageTime(message.timestamp) }}
                  <CheckOutlined 
                    v-if="message.senderId === currentUserId && message.read" 
                    class="read-indicator"
                  />
                </div>
              </div>
            </div>
            
            <div v-if="isTyping" class="typing-indicator">
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span class="typing-text">{{ activeConversation.name }} está digitando...</span>
            </div>
          </div>

          <!-- Message Input -->
          <div class="message-input-area">
            <div class="input-toolbar">
              <a-button type="text" @click="attachFile">
                <PaperClipOutlined />
              </a-button>
              <a-button type="text" @click="attachImage">
                <PictureOutlined />
              </a-button>
            </div>
            
            <div class="input-container">
              <a-textarea
                v-model:value="newMessage"
                :rows="1"
                :auto-size="{ minRows: 1, maxRows: 4 }"
                placeholder="Digite sua mensagem..."
                @keydown.enter.exact="sendMessage"
                @keydown.shift.enter.prevent="newMessage += '\n'"
                @input="handleTyping"
                class="message-input"
              />
              <a-button 
                type="primary" 
                @click="sendMessage"
                :disabled="!newMessage.trim()"
                class="send-button"
              >
                <SendOutlined />
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import {
  MessageOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  CarOutlined,
  CheckOutlined,
  PaperClipOutlined,
  PictureOutlined,
  SendOutlined
} from '@ant-design/icons-vue'

// Component state
const conversations = ref([])
const activeConversation = ref(null)
const searchQuery = ref('')
const newMessage = ref('')
const isTyping = ref(false)
const currentUserId = ref(1) // Mock current user ID
const messagesContainer = ref(null)

// Mock data for demonstration
const mockConversations = [
  {
    id: 1,
    name: 'João Silva',
    avatar: null,
    online: true,
    lastSeen: new Date(),
    lastMessage: 'Obrigado pela reserva! O carro está pronto.',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
    unreadCount: 2,
    messages: [
      {
        id: 1,
        senderId: 2,
        type: 'text',
        content: 'Olá! Gostaria de alugar seu BMW X5 para o fim de semana.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true
      },
      {
        id: 2,
        senderId: 1,
        type: 'text',
        content: 'Oi! Claro, está disponível. Qual seria a data?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
        read: true
      },
      {
        id: 3,
        senderId: 2,
        type: 'booking',
        content: {
          vehicleName: 'BMW X5 2023',
          dates: '25-27 Out 2025',
          price: 'R$ 450,00/dia'
        },
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true
      },
      {
        id: 4,
        senderId: 2,
        type: 'text',
        content: 'Obrigado pela reserva! O carro está pronto.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false
      }
    ]
  },
  {
    id: 2,
    name: 'Maria Santos',
    avatar: null,
    online: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
    lastMessage: 'Perfeito! Até amanhã então.',
    lastMessageTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
    unreadCount: 0,
    messages: [
      {
        id: 1,
        senderId: 3,
        type: 'text',
        content: 'Olá! Preciso devolver o carro amanhã. Qual o horário?',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: true
      },
      {
        id: 2,
        senderId: 1,
        type: 'text',
        content: 'Pode ser até às 18h no mesmo local da retirada.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000 + 10 * 60 * 1000),
        read: true
      },
      {
        id: 3,
        senderId: 3,
        type: 'text',
        content: 'Perfeito! Até amanhã então.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        read: true
      }
    ]
  },
  {
    id: 3,
    name: 'Pedro Oliveira',
    avatar: null,
    online: true,
    lastSeen: new Date(),
    lastMessage: 'Você: Obrigado pela avaliação!',
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unreadCount: 0,
    messages: [
      {
        id: 1,
        senderId: 4,
        type: 'text',
        content: 'Excelente experiência! Carro impecável e atendimento nota 10.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 5 * 60 * 1000),
        read: true
      },
      {
        id: 2,
        senderId: 1,
        type: 'text',
        content: 'Obrigado pela avaliação!',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true
      }
    ]
  }
]

// Computed properties
const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value
  
  return conversations.value.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Methods
const formatTime = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))

  if (days > 0) {
    return `${days}d`
  } else if (hours > 0) {
    return `${hours}h`
  } else if (minutes > 0) {
    return `${minutes}m`
  } else {
    return 'agora'
  }
}

const formatMessageTime = (date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

const selectConversation = (conversation) => {
  activeConversation.value = conversation
  // Mark messages as read
  conversation.unreadCount = 0
  conversation.messages.forEach(msg => {
    if (msg.senderId !== currentUserId.value) {
      msg.read = true
    }
  })
  
  nextTick(() => {
    scrollToBottom()
  })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !activeConversation.value) return

  const message = {
    id: Date.now(),
    senderId: currentUserId.value,
    type: 'text',
    content: newMessage.value.trim(),
    timestamp: new Date(),
    read: false
  }

  activeConversation.value.messages.push(message)
  activeConversation.value.lastMessage = `Você: ${newMessage.value.trim()}`
  activeConversation.value.lastMessageTime = new Date()
  
  newMessage.value = ''
  
  nextTick(() => {
    scrollToBottom()
  })

  // Simulate response after 2 seconds
  setTimeout(() => {
    if (activeConversation.value) {
      const response = {
        id: Date.now() + 1,
        senderId: activeConversation.value.id + 1,
        type: 'text',
        content: 'Obrigado pela mensagem! Vou responder em breve.',
        timestamp: new Date(),
        read: false
      }
      
      activeConversation.value.messages.push(response)
      activeConversation.value.lastMessage = response.content
      activeConversation.value.lastMessageTime = new Date()
      activeConversation.value.unreadCount += 1
      
      nextTick(() => {
        scrollToBottom()
      })
    }
  }, 2000)
}

const handleTyping = () => {
  // Simulate typing indicator
  isTyping.value = true
  setTimeout(() => {
    isTyping.value = false
  }, 2000)
}

const startNewConversation = () => {
  message.info('Funcionalidade de nova conversa em desenvolvimento')
}

const searchConversations = () => {
  // Search is handled by computed property
}

const viewContactInfo = () => {
  message.info('Visualizando informações do contato...')
}

const attachFile = () => {
  message.info('Anexar arquivo em desenvolvimento')
}

const attachImage = () => {
  message.info('Anexar imagem em desenvolvimento')
}

const previewImage = () => {
  message.info('Preview de imagem em desenvolvimento')
}

// Lifecycle
onMounted(() => {
  conversations.value = [...mockConversations]
})
</script>

<style scoped>
.messages-container {
  height: calc(100vh - 200px);
  max-width: 1200px;
  margin: 0 auto;
}

.messages-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.messages-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #273F4F;
}

.title-icon {
  font-size: 28px;
  color: #1890ff;
}

.messages-layout {
  display: flex;
  height: calc(100% - 120px);
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.conversations-sidebar {
  width: 350px;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
}

.conversations-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.conversation-search {
  width: 100%;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f9f9f9;
  position: relative;
}

.conversation-item:hover {
  background: #f5f5f5;
}

.conversation-item.active {
  background: #e6f7ff;
  border-right: 3px solid #1890ff;
}

.conversation-item.unread {
  background: #f6ffed;
}

.conversation-avatar {
  position: relative;
  flex-shrink: 0;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #52c41a;
  border: 2px solid white;
  border-radius: 50%;
}

.conversation-content {
  flex: 1;
  min-width: 0;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.conversation-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #273F4F;
  truncate: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.conversation-time {
  font-size: 11px;
  color: #999;
  flex-shrink: 0;
}

.conversation-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.last-message {
  margin: 0;
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.unread-badge {
  flex-shrink: 0;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.no-conversation {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  text-align: center;
  padding: 40px;
}

.no-conversation-icon {
  font-size: 64px;
  margin-bottom: 20px;
  color: #d9d9d9;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}

.chat-contact {
  display: flex;
  align-items: center;
  gap: 12px;
}

.contact-info h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #273F4F;
}

.contact-status {
  font-size: 12px;
  color: #999;
}

.chat-actions {
  display: flex;
  gap: 8px;
}

.messages-list {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-wrapper {
  display: flex;
  justify-content: flex-start;
}

.message-wrapper.own-message {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 70%;
  background: #f5f5f5;
  border-radius: 16px;
  padding: 12px 16px;
  position: relative;
}

.own-message .message-bubble {
  background: #1890ff;
  color: white;
}

.message-text {
  word-wrap: break-word;
  line-height: 1.4;
}

.message-image img {
  max-width: 200px;
  border-radius: 8px;
  cursor: pointer;
}

.message-booking {
  background: transparent;
  padding: 0;
}

.booking-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border: 1px solid #e6f7ff;
  border-radius: 8px;
  padding: 12px;
}

.booking-icon {
  font-size: 24px;
  color: #1890ff;
}

.booking-info h5 {
  margin: 0 0 4px 0;
  font-weight: 600;
}

.booking-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.booking-price {
  color: #52c41a !important;
  font-weight: 600;
}

.message-time {
  font-size: 10px;
  color: #999;
  text-align: right;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

.own-message .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.read-indicator {
  color: #52c41a;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 16px;
  align-self: flex-start;
}

.typing-dots {
  display: flex;
  gap: 2px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: #999;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

.typing-text {
  font-size: 12px;
  color: #999;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: scale(1);
    opacity: 0.7;
  }
  30% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.message-input-area {
  border-top: 1px solid #f0f0f0;
  padding: 16px 20px;
  background: #fafafa;
}

.input-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.input-container {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
}

.send-button {
  flex-shrink: 0;
  height: 40px;
  min-width: 40px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .messages-layout {
    flex-direction: column;
    height: auto;
  }
  
  .conversations-sidebar {
    width: 100%;
    height: 200px;
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .conversations-list {
    display: flex;
    overflow-x: auto;
    flex-direction: row;
  }
  
  .conversation-item {
    min-width: 200px;
    border-right: 1px solid #f9f9f9;
    border-bottom: none;
  }
  
  .chat-area {
    height: 400px;
  }
  
  .message-bubble {
    max-width: 85%;
  }
  
  .input-toolbar {
    justify-content: center;
  }
}


.breadcrumb-modern {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 14px;
}

.breadcrumb-link {
  color: rgba(22, 21, 21, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: black;
}

.breadcrumb-separator {
  color: rgba(8, 8, 8, 0.6);
  margin: 0 4px;
}

.breadcrumb-current {
  color: black;
  font-weight: 500;
}
</style>