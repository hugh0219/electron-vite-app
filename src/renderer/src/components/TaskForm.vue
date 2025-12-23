<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MouseTask } from '@renderer/stores/mouse'
import ScreenPointPicker from './ScreenPointPicker.vue'

interface TaskFormData {
  action: 'move' | 'click' | 'drag' | 'scroll'
  x: number
  y: number
  targetX?: number
  targetY?: number
  button: 'left' | 'right' | 'middle'
  delay?: number
  scrollX?: number
  scrollY?: number
  scheduledTime?: number
  description?: string
}

const emit = defineEmits<{
  submit: [task: Omit<MouseTask, 'id' | 'createdAt' | 'status'>]
  cancel: []
}>()

const props = defineProps<{
  task?: Omit<MouseTask, 'id' | 'createdAt' | 'status'>
}>()

const isPointPickerActive = ref(false)
const pickingTarget = ref<'start' | 'end'>('start')

const form = ref<TaskFormData>({
  action: 'move',
  x: 0,
  y: 0,
  button: 'left',
  description: '',
  ...props.task
})

const scheduleDate = ref('')
const scheduleTime = ref('')

const actionOptions = [
  { value: 'move', label: '移动鼠标' },
  { value: 'click', label: '点击' },
  { value: 'drag', label: '拖拽' },
  { value: 'scroll', label: '滚动' }
]

const buttonOptions = [
  { value: 'left', label: '左键' },
  { value: 'right', label: '右键' },
  { value: 'middle', label: '中键' }
]

const needsTarget = computed(() => form.value.action === 'drag')
const needsButton = computed(() => form.value.action === 'click')
const needsScroll = computed(() => form.value.action === 'scroll')

const handlePointPicked = (point: { x: number; y: number }) => {
  if (pickingTarget.value === 'start') {
    form.value.x = point.x
    form.value.y = point.y
  } else {
    form.value.targetX = point.x
    form.value.targetY = point.y
  }
  isPointPickerActive.value = false
}

const startPointPicking = (target: 'start' | 'end') => {
  pickingTarget.value = target
  isPointPickerActive.value = true
}

const handleScheduleChange = () => {
  if (scheduleDate.value && scheduleTime.value) {
    const dateTime = new Date(`${scheduleDate.value}T${scheduleTime.value}`)
    form.value.scheduledTime = dateTime.getTime()
  }
}

const handleSubmit = () => {
  const task: Omit<MouseTask, 'id' | 'createdAt' | 'status'> = {
    action: form.value.action,
    x: form.value.x,
    y: form.value.y,
    button: form.value.button,
    delay: form.value.delay ? Number(form.value.delay) : undefined,
    scheduledTime: form.value.scheduledTime,
    description: form.value.description,
    ...(needsTarget.value && {
      targetX: form.value.targetX,
      targetY: form.value.targetY
    }),
    ...(needsScroll.value && {
      scrollX: form.value.scrollX ? Number(form.value.scrollX) : 0,
      scrollY: form.value.scrollY ? Number(form.value.scrollY) : 0
    })
  }
  emit('submit', task)
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-gray-900">{{ task ? '编辑任务' : '新建任务' }}</h2>

    <ScreenPointPicker
      :is-active="isPointPickerActive"
      @point-selected="handlePointPicked"
      @cancel="() => { isPointPickerActive = false }"
    />

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- 任务描述 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">任务描述（可选）</label>
        <input
          v-model="form.description"
          type="text"
          placeholder="如：点击保存按钮"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- 操作类型 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">操作类型</label>
        <select
          v-model="form.action"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option v-for="opt in actionOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>

      <!-- 起始位置 -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">起始 X</label>
          <input
            v-model.number="form.x"
            type="number"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">起始 Y</label>
          <input
            v-model.number="form.y"
            type="number"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        type="button"
        class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        @click="startPointPicking('start')"
      >
        🎯 在屏幕上选择起始位置
      </button>

      <!-- 拖拽目标位置 -->
      <template v-if="needsTarget">
        <div class="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">目标 X</label>
            <input
              v-model.number="form.targetX"
              type="number"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">目标 Y</label>
            <input
              v-model.number="form.targetY"
              type="number"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="button"
          class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          @click="startPointPicking('end')"
        >
          🎯 在屏幕上选择目标位置
        </button>
      </template>

      <!-- 点击按钮选择 -->
      <template v-if="needsButton">
        <div class="pt-4 border-t">
          <label class="block text-sm font-medium text-gray-700 mb-2">点击按钮</label>
          <select
            v-model="form.button"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option v-for="opt in buttonOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </template>

      <!-- 滚动参数 -->
      <template v-if="needsScroll">
        <div class="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">水平滚动</label>
            <input
              v-model.number="form.scrollX"
              type="number"
              placeholder="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">垂直滚动</label>
            <input
              v-model.number="form.scrollY"
              type="number"
              placeholder="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </template>

      <!-- 延迟和定时 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">延迟执行（毫秒）</label>
          <input
            v-model.number="form.delay"
            type="number"
            placeholder="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div class="col-span-1 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">定时执行（可选）</label>
          <div class="grid grid-cols-2 gap-2">
            <input
              v-model="scheduleDate"
              type="date"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @change="handleScheduleChange"
            />
            <input
              v-model="scheduleTime"
              type="time"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @change="handleScheduleChange"
            />
          </div>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="flex gap-4 pt-6 border-t">
        <button
          type="submit"
          class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          {{ task ? '更新任务' : '创建任务' }}
        </button>
        <button
          type="button"
          class="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
          @click="$emit('cancel')"
        >
          取消
        </button>
      </div>
    </form>
  </div>
</template>


