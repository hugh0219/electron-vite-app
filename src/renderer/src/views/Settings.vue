<script setup lang="ts">
import StorageSettings from '@renderer/components/StorageSettings.vue'
</script>

<template>
  <div class="settings-page">
    <!-- 头部 -->
    <div class="header">
      <h1>⚙️ 应用设置</h1>
      <p>管理应用的各项设置</p>
    </div>

    <!-- 设置内容 -->
    <div class="settings-container">
      <StorageSettings />

      <!-- 其他设置可以添加在这里 -->
      <div class="settings-card">
        <div class="setting-section">
          <h3>🔄 其他设置</h3>
          <p class="description">更多设置项正在开发中...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px 16px;
}

.header {
  max-width: 800px;
  margin: 0 auto 32px;
  color: white;
}

.header h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: bold;
}

.header p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.settings-container {
  max-width: 800px;
  margin: 0 auto;
}

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
</style>
