/// <reference types="vite/client" />

import type { Router } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
  // 显式声明 useRouter 函数
  export function useRouter(): Router
}
