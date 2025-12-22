<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '@renderer/stores/app'

const router = useRouter()
const appStore = useAppStore()

const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

const goToAbout = () => {
  router.push('/about')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <img
          alt="logo"
          class="logo mx-auto mb-6"
          src="@renderer/assets/electron.svg"
          style="width: 120px"
        />
        <h1 class="text-4xl font-bold text-gray-900 mb-3">{{ appStore.appTitle }}</h1>
        <div class="text-indigo-600 font-semibold text-lg">Powered by electron-vite</div>
      </div>

      <!-- Main Content -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div class="text-gray-700 text-center mb-8">
          <p class="text-xl mb-4">
            Build an Electron app with
            <span class="font-bold text-green-600">Vue</span>
            and
            <span class="font-bold text-blue-600">TypeScript</span>
          </p>
          <p class="text-gray-600">This project integrates Router, Pinia, and Tailwind CSS</p>
        </div>

        <!-- Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <a
            href="https://electron-vite.org/"
            target="_blank"
            rel="noreferrer"
            class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-center font-semibold"
          >
            📚 Documentation
          </a>
          <button
            class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            @click="ipcHandle"
          >
            💬 Send IPC
          </button>
          <button
            class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
            @click="goToAbout"
          >
            ℹ️ About
          </button>
        </div>

        <!-- Info Box -->
        <div class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <p class="text-sm text-gray-700">
            💡 <strong>Tip:</strong> Press <code class="bg-gray-200 px-2 py-1 rounded">F12</code> to
            open the Developer Tools
          </p>
        </div>
      </div>

      <!-- Features -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="text-4xl mb-3">🚀</div>
          <h3 class="font-bold text-lg mb-2 text-gray-900">Vue Router</h3>
          <p class="text-gray-600 text-sm">Client-side routing with nested routes</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="text-4xl mb-3">📦</div>
          <h3 class="font-bold text-lg mb-2 text-gray-900">Pinia</h3>
          <p class="text-gray-600 text-sm">State management for Vue 3</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div class="text-4xl mb-3">🎨</div>
          <h3 class="font-bold text-lg mb-2 text-gray-900">Tailwind CSS</h3>
          <p class="text-gray-600 text-sm">Utility-first CSS framework</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  opacity: 0.8;
  transition: opacity 0.3s;
}

.logo:hover {
  opacity: 1;
}
</style>
