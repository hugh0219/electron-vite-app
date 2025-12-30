<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  complete: []
}>()

const showWizard = ref(true)
const step = ref(1)
const selectedLocation = ref('')
const isLoading = ref(false)

const skipWizard = () => {
  showWizard.value = false
  emit('complete')
}

const selectLocation = async () => {
  isLoading.value = true
  try {
    const result = await window.api.storage.selectLocation()

    if (result.success) {
      selectedLocation.value = result.path ?? ''
      step.value = 2
    }
  } catch (error) {
    console.error('选择位置失败:', error)
  } finally {
    isLoading.value = false
  }
}

const completeWizard = () => {
  showWizard.value = false
  emit('complete')
}
</script>

<template>
  <div v-if="showWizard" class="wizard-overlay">
    <div class="wizard-modal">
      <!-- 步骤 1: 欢迎 -->
      <div v-if="step === 1" class="wizard-step">
        <div class="wizard-icon">📁</div>
        <h2>欢迎！</h2>
        <p>这是你第一次使用本应用，让我们配置数据存储位置。</p>
        <p class="description">
          你可以选择一个特定的目录来存储任务数据，建议选择云盘目录以便自动备份。
        </p>

        <div class="wizard-options">
          <button class="btn-primary" :disabled="isLoading" @click="selectLocation">
            {{ isLoading ? '选择中...' : '📁 选择存储位置' }}
          </button>
          <button class="btn-secondary" @click="skipWizard">⏭️ 使用默认位置</button>
        </div>
      </div>

      <!-- 步骤 2: 确认 -->
      <div v-if="step === 2" class="wizard-step">
        <div class="wizard-icon">✅</div>
        <h2>完成！</h2>
        <p>存储位置已设置为：</p>
        <div class="location-display">
          <code>{{ selectedLocation }}</code>
        </div>
        <p class="description">
          应用会将所有任务数据保存到这个位置。你随时可以在设置页面修改存储位置。
        </p>

        <div class="wizard-options">
          <button class="btn-primary" @click="completeWizard">✨ 开始使用</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wizard-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.wizard-modal {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  padding: 40px;
  animation: slideUp 0.3s ease-out;
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

.wizard-step {
  text-align: center;
}

.wizard-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

h2 {
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

p {
  margin: 0 0 12px 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
}

.description {
  color: #9ca3af;
  font-size: 13px;
}

.location-display {
  background: #f3f4f6;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  border-left: 4px solid #3b82f6;
}

code {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  color: #111827;
  word-break: break-all;
}

.wizard-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}
</style>
