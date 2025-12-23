<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore } from '@renderer/stores/app'

const router = useRouter()
const appStore = useAppStore()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Back Button -->
      <button
        class="mb-8 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold inline-flex items-center gap-2"
        @click="goHome"
      >
        ← Back to Home
      </button>

      <!-- Content -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-6">About This Project</h1>

        <div class="space-y-6 text-gray-700">
          <section>
            <h2 class="text-2xl font-bold text-indigo-600 mb-3">🎯 Project Overview</h2>
            <p>
              {{ appStore.appTitle }} is an Electron application built with modern web technologies.
              This project demonstrates best practices for building desktop applications with Vue 3,
              TypeScript, and a complete development toolchain.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-indigo-600 mb-3">🛠️ Tech Stack</h2>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li><strong>Electron</strong> - Build cross-platform desktop apps</li>
              <li><strong>Vue 3</strong> - Progressive JavaScript framework</li>
              <li><strong>TypeScript</strong> - Superset of JavaScript with static types</li>
              <li><strong>Electron Vite</strong> - Next generation build tool</li>
              <li><strong>Vue Router</strong> - Official router for Vue</li>
              <li><strong>Pinia</strong> - Intuitive, type-safe state management</li>
              <li><strong>Tailwind CSS</strong> - Utility-first CSS framework</li>
            </ul>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-indigo-600 mb-3">📚 Features</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-indigo-50 p-4 rounded-lg">
                <h3 class="font-bold mb-2">✅ Client-side Routing</h3>
                <p class="text-sm">Navigate between pages without page reloads</p>
              </div>
              <div class="bg-indigo-50 p-4 rounded-lg">
                <h3 class="font-bold mb-2">✅ Global State Management</h3>
                <p class="text-sm">Manage application state with Pinia stores</p>
              </div>
              <div class="bg-indigo-50 p-4 rounded-lg">
                <h3 class="font-bold mb-2">✅ Responsive Design</h3>
                <p class="text-sm">Beautiful UI with Tailwind CSS utilities</p>
              </div>
              <div class="bg-indigo-50 p-4 rounded-lg">
                <h3 class="font-bold mb-2">✅ Type Safety</h3>
                <p class="text-sm">Full TypeScript support for better DX</p>
              </div>
            </div>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-indigo-600 mb-3">📦 Project Structure</h2>
            <pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>src/
├── main/              # Main process (Electron)
├── preload/           # Preload scripts
└── renderer/
    └── src/
        ├── router/    # Vue Router config
        ├── stores/    # Pinia stores
        ├── views/     # Page components
        ├── components/# Reusable components
        ├── assets/    # Static assets
        └── main.ts    # Entry point</code></pre>
          </section>
        </div>

        <!-- Back to Home Button -->
        <div class="mt-8 text-center">
          <button
            class="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
            @click="goHome"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
pre {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>
