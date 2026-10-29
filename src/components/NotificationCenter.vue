<template>
  <div class="notifications-container">
    <!-- Toast notifications -->
    <div class="toasts">
      <transition-group name="toast">
        <div 
          v-for="toast in notificationStore.toasts"
          :key="toast.id"
          class="toast"
          :class="`toast-${toast.type}`"
        >
          <span class="toast-icon">{{ toastIcons[toast.type] }}</span>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" @click="notificationStore.removeToast(toast.id)">✕</button>
        </div>
      </transition-group>
    </div>

    <!-- Notification center button -->
    <div class="notification-button">
      <button class="icon-btn notification-btn" @click="showCenter = !showCenter" title="Notificacions">
        <svg class="btn-svg" viewBox="0 0 24 24">
          <path :d="mdiBell" fill="currentColor" />
        </svg>
        <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
      </button>
    </div>

    <!-- Notification center -->
    <div v-if="showCenter" class="notification-center">
      <div class="center-header">
        <h3>Notificacions</h3>
        <div class="header-actions">
          <button v-if="unreadCount > 0" @click="notificationStore.markAllAsRead()" class="link-btn">
            Marcar tot com llegit
          </button>
          <button @click="showCenter = false" class="close-btn icon-btn-small">
            <svg class="btn-svg-small" viewBox="0 0 24 24">
              <path :d="mdiClose" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      <div class="center-tabs">
        <button 
          class="tab"
          :class="{ active: filterType === 'all' }"
          @click="filterType = 'all'"
        >
          Tots
        </button>
        <button 
          class="tab"
          :class="{ active: filterType === 'trip' }"
          @click="filterType = 'trip'"
        >
          🚗 Viatges
        </button>
        <button 
          class="tab"
          :class="{ active: filterType === 'payment' }"
          @click="filterType = 'payment'"
        >
          💳 Pagaments
        </button>
      </div>

      <div class="notifications-list">
        <div v-if="filteredNotifications.length === 0" class="empty-state">
          <p>✓ No hi ha notificacions noves</p>
        </div>

        <div 
          v-for="notif in filteredNotifications"
          :key="notif.id"
          class="notification-item"
          :class="{ unread: !notif.read }"
          @click="notificationStore.markAsRead(notif.id)"
        >
          <div class="notif-icon">{{ getNotifIcon(notif.type) }}</div>
          <div class="notif-content">
            <strong>{{ notif.title }}</strong>
            <p>{{ notif.message }}</p>
            <span class="notif-time">{{ formatTime(notif.timestamp) }}</span>
          </div>
          <div v-if="notif.action" class="notif-action">
            <button class="btn-link">{{ notif.action }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Support chat -->
    <div class="support-chat" :class="{ open: supportChatOpen }">
      <button class="icon-btn support-btn" @click="toggleSupportChat" title="Suport en viu">
        <svg class="btn-svg" viewBox="0 0 24 24">
          <path :d="mdiChat" fill="currentColor" />
        </svg>
        <span v-if="unreadMessages > 0" class="badge support-badge">{{ unreadMessages }}</span>
      </button>

      <div v-if="supportChatOpen" class="chat-box">
        <div class="chat-header">
          <strong>Suport en viu</strong>
          <button @click="toggleSupportChat" class="close-btn icon-btn-small" style="color: white;">
            <svg class="btn-svg-small" viewBox="0 0 24 24">
              <path :d="mdiClose" fill="currentColor" />
            </svg>
          </button>
        </div>

        <div class="chat-messages">
          <div 
            v-for="msg in supportMessages"
            :key="msg.id"
            class="message"
            :class="msg.isUser ? 'user-message' : 'support-message'"
          >
            <div class="message-avatar">
              {{ msg.isUser ? '👤' : '👨‍💼' }}
            </div>
            <div class="message-content">
              <strong>{{ msg.from }}</strong>
              <p>{{ msg.text }}</p>
              <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <input 
            v-model="chatMessage"
            type="text"
            placeholder="Escriu un missatge..."
            @keyup.enter="sendMessage"
          />
          <button @click="sendMessage" class="send-btn icon-btn-small" :disabled="!chatMessage.trim()">
            <svg class="btn-svg-small" viewBox="0 0 24 24">
              <path :d="mdiSend" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useNotificationStore } from '../store/notificationStore';
import { useAuthStore } from '../store/authStore';
import {
  mdiBell,
  mdiChat,
  mdiClose,
  mdiSend
} from '@mdi/js';

const notificationStore = useNotificationStore();
const authStore = useAuthStore();

const showCenter = ref(false);
const filterType = ref('all');
const chatMessage = ref('');

const unreadCount = computed(() => notificationStore.unreadCount);
const unreadMessages = computed(() => notificationStore.supportChat.unreadMessages);
const supportChatOpen = computed(() => notificationStore.supportChat.isOpen);
const supportMessages = computed(() => notificationStore.supportChat.messages);

const filteredNotifications = computed(() => {
  if (filterType.value === 'all') {
    return notificationStore.notifications;
  }
  return notificationStore.notifications.filter(n => n.channel === filterType.value);
});

const toastIcons = {
  success: '✓',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
};

const getNotifIcon = (type) => {
  const icons = {
    trip_created: '📝',
    driver_assigned: '👤',
    trip_started: '🚗',
    trip_completed: '✓',
    payment_processing: '⏳',
    payment_success: '✓',
    payment_failed: '❌',
    emergency_assigned: '🚨',
    promo: '🎁'
  };
  return icons[type] || '🔔';
};

const formatTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'ara';
  if (minutes < 60) return `fa ${minutes}m`;
  if (hours < 24) return `fa ${hours}h`;
  if (days < 7) return `fa ${days}d`;
  
  return new Date(date).toLocaleDateString('ca-ES');
};

const toggleSupportChat = () => {
  notificationStore.toggleSupportChat();
};

const sendMessage = () => {
  if (chatMessage.value.trim()) {
    notificationStore.sendSupportMessage(
      chatMessage.value,
      authStore.currentUser?.name || 'Usuario'
    );
    chatMessage.value = '';
    // Auto-scroll al final
    setTimeout(() => {
      const chatBox = document.querySelector('.chat-messages');
      if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, 0);
  }
};
</script>

<style scoped>
.notifications-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
}

/* Toasts */
.toasts {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: fixed;
  bottom: 100px;
  right: 20px;
  max-width: 300px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  animation: slideIn 0.3s ease;
}

.toast-success {
  border-left: 4px solid var(--success-color);
}

.toast-error {
  border-left: 4px solid var(--danger-color);
}

.toast-warning {
  border-left: 4px solid #ff9800;
}

.toast-info {
  border-left: 4px solid var(--primary-color);
}

.toast-icon {
  font-size: 18px;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  font-size: 16px;
}

/* Notification button */
.notification-button {
  position: relative;
}

.icon-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  border: none;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(46, 125, 110, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(46, 125, 110, 0.4);
}

.icon-btn:active {
  transform: scale(0.95);
}

.btn-svg {
  width: 24px;
  height: 24px;
}

.btn-svg-small {
  width: 18px;
  height: 18px;
}

.icon-btn-small {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.icon-btn-small:hover {
  background: #f0f0f0;
  color: #333;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--secondary-color);
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
}

.support-badge {
  background: #667eea;
}

/* Notification center */
.notification-center {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 380px;
  max-height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

.center-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.center-header h3 {
  margin: 0;
  font-size: 16px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.link-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}

.link-btn:hover {
  text-decoration: underline;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #999;
}

.center-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab {
  flex: 1;
  padding: 12px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  color: #999;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.notifications-list {
  flex: 1;
  overflow-y: auto;
  max-height: 350px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
  font-size: 14px;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notification-item:hover {
  background: #f9f9f9;
}

.notification-item.unread {
  background: #f0f9ff;
  border-left: 3px solid var(--primary-color);
}

.notif-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.notif-content {
  flex: 1;
}

.notif-content strong {
  display: block;
  font-size: 13px;
  margin-bottom: 3px;
}

.notif-content p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.notif-time {
  display: block;
  font-size: 11px;
  color: #999;
  margin-top: 3px;
}

.notif-action {
  flex-shrink: 0;
}

.btn-link {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  text-decoration: underline;
}

/* Support chat */
.support-chat {
  position: relative;
}

.support-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  margin-top: 10px;
}

.support-btn:hover {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.chat-box {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 380px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.chat-header strong {
  font-size: 14px;
  font-weight: 600;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  gap: 10px;
  animation: slideIn 0.3s ease;
}

.message.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
  font-size: 24px;
}

.message-content {
  flex: 1;
}

.message-content strong {
  display: block;
  font-size: 12px;
  margin-bottom: 3px;
}

.message-content p {
  margin: 0;
  padding: 10px 12px;
  background: #f0f0f0;
  border-radius: 8px;
  font-size: 13px;
  word-wrap: break-word;
}

.user-message .message-content p {
  background: var(--primary-color);
  color: white;
}

.message-time {
  display: block;
  font-size: 11px;
  color: #999;
  margin-top: 3px;
}

.chat-input {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #eee;
}

.chat-input input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
}

.chat-input input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.send-btn {
  background: var(--primary-color);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:hover:not(:disabled) {
  background: var(--primary-dark);
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Responsive */
@media (max-width: 480px) {
  .notifications-container {
    bottom: 10px;
    right: 10px;
  }

  .notification-center,
  .chat-box {
    width: calc(100vw - 20px);
    max-width: 380px;
  }

  .toasts {
    right: 10px;
    max-width: calc(100vw - 20px);
  }
}
</style>
