import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 状态
  const theme = ref<'light' | 'dark'>('light')
  const appTitle = ref('Auto Control App')

  // 方法
  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
  }

  const setAppTitle = (newTitle: string) => {
    appTitle.value = newTitle
  }

  return {
    theme,
    appTitle,
    setTheme,
    setAppTitle
  }
})
