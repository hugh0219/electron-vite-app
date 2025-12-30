<script setup lang="ts">
import { ref, onMounted } from 'vue'

const storageLocation = ref('')
const isLoading = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error' | ''>('')

onMounted(async () => {
  await loadStorageLocation()
})

const loadStorageLocation = async () => {
  try {
    storageLocation.value = await window.api.storage.getLocation()
  } catch (error) {
    console.error('获取存储位置失败:', error)
    message.value = '获取存储位置失败'
    messageType.value = 'error'
  }
}

const selectStorageLocation = async () => {
  isLoading.value = true
  try {
    const result = await window.api.storage.selectLocation()

    if (result.canceled) {
      message.value = '已取消'
      messageType.value = ''
    } else if (result.success) {
      storageLocation.value = result.path ?? ''
      message.value = `✅ 存储位置已更改为: ${result.path}`
      messageType.value = 'success'
      setTimeout(() => {
        message.value = ''
        messageType.value = ''
      }, 3000)
    } else {
      message.value = `❌ 错误: ${result.error}`
      messageType.value = 'error'
    }
  } catch (error) {
    console.error('选择存储位置失败:', error)
    message.value = '选择存储位置失败'
    messageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="settings-card">
    <div class="setting-section">
      <h3>📁 数据存储位置</h3>
      <p class="description">任务数据会保存到选定的位置。应用重启后会从这个位置加载数据。</p>

      <div class="location-info">
        <p>
          <strong>当前位置：</strong>
        </p>
        <code>{{ storageLocation }}</code>
      </div>

      <button :disabled="isLoading" class="btn-primary" @click="selectStorageLocation">
        {{ isLoading ? '选择中...' : '📁 更改存储位置' }}
      </button>

      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>

      <div class="info-box">
        <p class="info-title">💡 提示</p>
        <ul>
          <li>选择一个您有读写权限的目录</li>
          <li>建议选择云盘同步的目录（如 OneDrive、iCloud Drive）实现数据备份</li>
          <li>更改位置后，原位置的数据不会被自动删除</li>
          <li>如果选择的目录不存在，会自动创建</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.setting-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.description {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.location-info {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.location-info p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #374151;
}

code {
  display: block;
  padding: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  color: #111827;
  word-break: break-all;
}

.btn-primary {
  padding: 10px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.message {
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
}

.message.success {
  background: #d1fae5;
  color: #065f46;
  border-left: 4px solid #10b981;
}

.message.error {
  background: #fee2e2;
  color: #7f1d1d;
  border-left: 4px solid #ef4444;
}

.info-box {
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
  padding: 12px;
  border-radius: 8px;
}

.info-title {
  margin: 0 0 8px 0;
  font-weight: 600;
  color: #1e40af;
  font-size: 14px;
}

.info-box ul {
  margin: 0;
  padding-left: 20px;
  color: #1e40af;
  font-size: 13px;
}

.info-box li {
  margin-bottom: 6px;
  line-height: 1.5;
}
</style>
