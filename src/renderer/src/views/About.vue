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
        ← 返回
      </button>

      <!-- Content -->
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">🖱️ 自动鼠标控制</h1>
        <p class="text-gray-600 text-lg mb-6">一个强大的自动化工具，让您轻松控制鼠标操作</p>

        <div class="space-y-8 text-gray-700">
          <!-- 项目概述 -->
          <section>
            <h2 class="text-2xl font-bold text-indigo-600 mb-3">📋 项目概述</h2>
            <p class="leading-relaxed">
              {{ appStore.appTitle }} 是一个基于 Electron + Vue 3 + TypeScript 构建的桌面应用程序。
              该项目展示了如何使用现代 Web 技术构建功能强大的跨平台桌面应用。
              通过简洁直观的用户界面，用户可以轻松创建、管理和执行自动化鼠标操作任务。
            </p>
          </section>

          <!-- 核心功能 -->
          <section>
            <h2 class="text-2xl font-bold text-indigo-600 mb-3">✨ 核心功能</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                <h3 class="font-bold mb-2 text-blue-900">🎯 屏幕选点</h3>
                <p class="text-sm text-gray-700">
                  直接在屏幕上选择目标位置，实时显示坐标，无需手动输入
                </p>
              </div>
              <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                <h3 class="font-bold mb-2 text-green-900">⏰ 定时执行</h3>
                <p class="text-sm text-gray-700">支持设置任务执行时间，自动在指定时刻执行</p>
              </div>
              <div class="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600">
                <h3 class="font-bold mb-2 text-purple-900">📋 任务管理</h3>
                <p class="text-sm text-gray-700">
                  完整的任务生命周期管理，支持创建、编辑、删除和执行
                </p>
              </div>
              <div class="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                <h3 class="font-bold mb-2 text-orange-900">🔄 多种操作</h3>
                <p class="text-sm text-gray-700">支持移动、点击、拖拽、滚动等多种鼠标操作</p>
              </div>
            </div>
          </section>

          <!-- 技术栈 -->
          <section>
            <h2 class="text-2xl font-bold text-indigo-600 mb-3">🛠️ 技术栈</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="flex items-center gap-3">
                <span class="text-2xl">⚛️</span>
                <div>
                  <h4 class="font-semibold">Electron</h4>
                  <p class="text-sm text-gray-600">跨平台桌面应用开发框架</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-2xl">💚</span>
                <div>
                  <h4 class="font-semibold">Vue 3</h4>
                  <p class="text-sm text-gray-600">现代化的 JavaScript 框架</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-2xl">🔷</span>
                <div>
                  <h4 class="font-semibold">TypeScript</h4>
                  <p class="text-sm text-gray-600">静态类型检查和更好的开发体验</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-2xl">🎨</span>
                <div>
                  <h4 class="font-semibold">Tailwind CSS</h4>
                  <p class="text-sm text-gray-600">实用型 CSS 框架，快速构建 UI</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-2xl">🔀</span>
                <div>
                  <h4 class="font-semibold">Vue Router</h4>
                  <p class="text-sm text-gray-600">Vue 官方路由库</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-2xl">📦</span>
                <div>
                  <h4 class="font-semibold">Pinia</h4>
                  <p class="text-sm text-gray-600">类型安全的状态管理</p>
                </div>
              </div>
            </div>
          </section>

          <!-- 支持的操作 -->
          <section>
            <h2 class="text-2xl font-bold text-indigo-600 mb-3">🖱️ 支持的操作类型</h2>
            <div class="bg-gray-50 p-6 rounded-lg">
              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <span class="text-xl">1️⃣</span>
                  <div>
                    <h4 class="font-semibold">移动鼠标</h4>
                    <p class="text-sm text-gray-600">将鼠标平滑地移动到指定的屏幕坐标位置</p>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <span class="text-xl">2️⃣</span>
                  <div>
                    <h4 class="font-semibold">点击操作</h4>
                    <p class="text-sm text-gray-600">支持左键、右键、中键点击，可指定点击位置</p>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <span class="text-xl">3️⃣</span>
                  <div>
                    <h4 class="font-semibold">拖拽操作</h4>
                    <p class="text-sm text-gray-600">
                      从一个位置平滑拖拽到另一个位置，支持自定义拖拽时间
                    </p>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <span class="text-xl">4️⃣</span>
                  <div>
                    <h4 class="font-semibold">滚动操作</h4>
                    <p class="text-sm text-gray-600">
                      在指定位置进行水平或垂直滚动，支持自定义滚动距离
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <!-- 项目结构 -->
          <section>
            <h2 class="text-2xl font-bold text-indigo-600 mb-3">📂 项目结构</h2>
            <pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>electron-vite-app/
├── src/
│   ├── main/                    # 主进程代码
│   │   ├── index.ts             # 应用入口
│   │   └── mouse-controller.ts  # 鼠标控制核心逻辑
│   ├── preload/
│   │   ├── index.ts             # 预加载脚本
│   │   └── index.d.ts           # 类型定义
│   └── renderer/
│       └── src/
│           ├── views/           # 页面组件
│           │   ├── MouseControl.vue  # 主控制面板
│           │   └── About.vue         # 关于页面
│           ├── components/      # 可复用组件
│           │   ├── TaskForm.vue      # 任务表单
│           │   ├── TaskList.vue      # 任务列表
│           │   └── ScreenPointPicker.vue # 屏幕点选
│           ├── stores/          # Pinia 状态管理
│           │   ├── app.ts       # 应用状态
│           │   └── mouse.ts     # 鼠标操作状态
│           ├── router/          # 路由配置
│           ├── App.vue          # 根组件
│           └── main.ts          # 应用入口
├── electron.vite.config.ts     # Electron Vite 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 项目依赖配置</code></pre>
          </section>

          <!-- 快速开始 -->
          <section>
            <h2 class="text-2xl font-bold text-indigo-600 mb-3">🚀 快速开始</h2>
            <div class="bg-indigo-50 p-4 rounded-lg space-y-3">
              <p><strong>1. 安装依赖</strong></p>
              <p class="text-sm font-mono bg-gray-900 text-green-400 p-2 rounded">npm install</p>

              <p><strong>2. 启动开发服务器</strong></p>
              <p class="text-sm font-mono bg-gray-900 text-green-400 p-2 rounded">npm run dev</p>

              <p><strong>3. 构建应用</strong></p>
              <p class="text-sm font-mono bg-gray-900 text-green-400 p-2 rounded">
                npm run build:win # Windows
              </p>
            </div>
          </section>

          <!-- 使用场景 -->
          <section>
            <h2 class="text-2xl font-bold text-indigo-600 mb-3">💡 典型使用场景</h2>
            <ul class="space-y-2 text-gray-700">
              <li>✓ 重复性工作自动化 - 减少手动操作</li>
              <li>✓ 定时任务执行 - 在指定时间自动运行</li>
              <li>✓ 软件测试 - 自动化 UI 测试用例</li>
              <li>✓ 数据输入 - 快速填充表单数据</li>
              <li>✓ 演示和录制 - 自动化演示流程</li>
              <li>✓ 系统维护 - 自动化系统检查和操作</li>
            </ul>
          </section>

          <!-- 许可证 -->
          <section>
            <h2 class="text-2xl font-bold text-indigo-600 mb-3">📄 许可证</h2>
            <p class="text-gray-700">该项目采用 MIT 许可证发布，可自由使用、修改和分发。</p>
          </section>
        </div>

        <!-- 返回按钮 -->
        <div class="mt-8 text-center">
          <button
            class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            @click="goHome"
          >
            🚀 开始使用
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
