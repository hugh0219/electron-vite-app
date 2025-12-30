# 🖱️ 自动鼠标控制应用

> 一个功能完整的跨平台自动化工具，使用 Electron + Vue 3 + TypeScript 构建。轻松创建、管理和执行自动化鼠标操作任务。

![License](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-brightgreen)
![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D)
![Electron](https://img.shields.io/badge/Electron-39.2-9FEAF9)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6)

## ✨ 核心功能

### 🎯 鼠标操作

- **移动鼠标** - 平滑移动到指定屏幕坐标
- **点击操作** - 支持左键、右键、中键
- **拖拽操作** - 从一个位置拖拽到另一个位置
- **滚动操作** - 水平和垂直滚动

### 📋 任务管理

- **屏幕选点** - 直接在屏幕上点击选择坐标
- **定时执行** - 在指定日期和时间自动运行
- **延迟执行** - 设置任务执行延迟时间
- **状态跟踪** - 实时显示任务执行状态

### 🎨 用户界面

- **响应式设计** - 适配各种屏幕尺寸
- **现代化 UI** - 使用 Tailwind CSS 构建
- **实时统计** - 任务数量和状态统计
- **直观操作** - 简洁清晰的用户交互

## 🚀 快速开始

### 1️⃣ 安装依赖

```bash
npm install
```

### 2️⃣ 启动开发服务器

```bash
npm run dev
```

### 3️⃣ 创建第一个任务

1. 点击"➕ 创建新任务"
2. 选择操作类型（如"移动鼠标"）
3. 使用"🎯 在屏幕上选择"选点
4. 点击"创建任务"

### 4️⃣ 运行任务

点击任务右侧的"运行"按钮立即执行

> 详见 [QUICK_START.md](./QUICK_START.md) 获取更多详细信息

## 📚 完整文档

| 文档                                                     | 描述                 |
| -------------------------------------------------------- | -------------------- |
| [QUICK_START.md](./QUICK_START.md)                       | 5分钟快速上手指南    |
| [SETUP_GUIDE.md](./SETUP_GUIDE.md)                       | 详细的安装和配置指南 |
| [MOUSE_CONTROL_GUIDE.md](./MOUSE_CONTROL_GUIDE.md)       | 功能使用说明文档     |
| [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | 技术实现细节说明     |
| [TESTING_GUIDE.md](./TESTING_GUIDE.md)                   | 测试和演示场景       |

## 🛠️ 技术栈

- **框架** - [Electron](https://www.electronjs.org) - 跨平台桌面应用开发
- **UI 框架** - [Vue 3](https://v3.vuejs.org) - 渐进式 JavaScript 框架
- **语言** - [TypeScript](https://www.typescriptlang.org) - 类型安全的 JavaScript
- **路由** - [Vue Router](https://router.vuejs.org) - Vue 官方路由库
- **状态管理** - [Pinia](https://pinia.vuejs.org) - 类型安全的状态管理
- **样式** - [Tailwind CSS](https://tailwindcss.com) - 实用型 CSS 框架
- **构建工具** - [electron-vite](https://electron-vite.org) - 下一代构建工具
- **鼠标控制** - [robotjs](https://github.com/octalmage/robotjs) - 自动化鼠标和键盘

## 📁 项目结构

```
src/
├── main/                           # Electron 主进程
│   ├── index.ts                    # 应用入口和 IPC 处理
│   └── mouse-controller.ts         # 鼠标控制核心类
├── preload/                        # Electron 预加载脚本
│   ├── index.ts                    # IPC 桥接 API
│   └── index.d.ts                  # TypeScript 类型定义
└── renderer/
    └── src/
        ├── App.vue                 # 根组件
        ├── main.ts                 # Vue 应用入口
        ├── router/                 # 路由配置
        ├── stores/                 # Pinia 状态管理
        │   ├── app.ts
        │   └── mouse.ts
        ├── views/                  # 页面组件
        │   ├── MouseControl.vue    # 主控制面板
        │   ├── About.vue           # 关于页面
        │   └── Welcome.vue         # 欢迎页面
        ├── components/             # 可复用组件
        │   ├── TaskForm.vue        # 任务表单
        │   ├── TaskList.vue        # 任务列表
        │   └── ScreenPointPicker.vue # 屏幕选点器
        └── assets/                 # 样式和资源
```

## 🎯 主要特性

### 屏幕选点系统

直接在屏幕上点击选择坐标位置，无需手动输入

```typescript
// 用户点击"在屏幕上选择"按钮后：
// 1. 全屏覆盖层出现
// 2. 显示十字准星和坐标
// 3. 用户点击目标位置
// 4. 坐标自动填充到表单
```

### 定时任务调度

在指定日期和时间自动执行任务

```typescript
// 创建定时任务
const task = await mouseStore.addTask({
  action: 'click',
  x: 100,
  y: 100,
  scheduledTime: new Date('2024-01-01 10:00:00').getTime()
})
// 应用在指定时间自动执行
```

### 任务状态管理

完整的任务生命周期管理

```
待执行 → 执行中 → 已完成
              └─→ 失败
```

## 📊 应用架构

```
┌─────────────────────────────────────────┐
│         用户界面 (Vue 3)                 │
│  (MouseControl, TaskForm, TaskList)     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│        状态管理 (Pinia Store)             │
│      (mouse store, app store)           │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    IPC 通信 (Preload Scripts)            │
│  (window.api.mouse.* 方法)               │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    主进程 (Electron Main)                │
│  (IPC 处理和协调)                        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    鼠标控制 (MouseController)            │
│  (robotjs API 调用)                     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         操作系统                          │
│    (鼠标和系统事件)                      │
└─────────────────────────────────────────┘
```

## 🔧 脚本命令

### 开发命令

```bash
npm run dev              # 启动开发服务器
npm run start            # 预览打包应用
```

### 构建命令

```bash
npm run build            # 完整构建
npm run build:win        # Windows 平台构建
npm run build:mac        # macOS 平台构建
npm run build:linux      # Linux 平台构建
```

### 质量检查

```bash
npm run lint             # ESLint 代码检查
npm run typecheck        # TypeScript 类型检查
npm run format           # Prettier 代码格式化
```

## ⚙️ 配置说明

### 开发环境要求

- Node.js >= 14.0
- npm >= 6.0 或 yarn

### 系统要求

- Windows 10+
- macOS 10.13+
- Linux (Ubuntu 18.04+)

### Windows 特殊要求

如果 robotjs 安装失败：

1. 安装 Python 3（添加到 PATH）
2. 安装 Visual Studio Build Tools 2022
3. 重新运行 `npm install`

详见 [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 🐛 常见问题

### Q: robotjs 编译失败

**A:** 参考 SETUP_GUIDE.md 中的故障排除部分

### Q: 鼠标控制无效

**A:** 确保目标坐标在屏幕范围内，检查应用权限

### Q: 定时任务不执行

**A:** 检查系统时间和日期设置，确保任务时间未过期

更多 FAQ 见 [MOUSE_CONTROL_GUIDE.md](./MOUSE_CONTROL_GUIDE.md)

## 🧪 测试和演示

参考 [TESTING_GUIDE.md](./TESTING_GUIDE.md) 获取：

- 完整的测试场景
- 功能验收标准
- 演示用例
- 性能基准

## 📈 功能扩展建议

1. **录制和回放** - 记录和重放操作序列
2. **条件判断** - 基于屏幕状态执行任务
3. **脚本支持** - 支持自定义 JavaScript 脚本
4. **云同步** - 任务云端备份和同步
5. **快捷键** - 全局快捷键支持
6. **任务链** - 按顺序执行多个任务
7. **图像识别** - 基于图像匹配的操作

## 🔒 安全性

- ✅ Electron 沙箱模式
- ✅ 完整的输入验证
- ✅ 错误异常处理
- ✅ 权限管理
- ✅ 无数据上传

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 技术支持

1. 查看对应的文档文件
2. 按 F12 打开开发者工具查看错误日志
3. 查看浏览器控制台的详细信息

## 🎓 学习资源

- [Electron 官方文档](https://www.electronjs.org/docs)
- [Vue 3 官方文档](https://v3.vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

## 🙏 致谢

感谢所有开源项目的贡献者！

---

**开始您的自动化之旅吧！** 🚀

有问题？查看[完整文档](./QUICK_START.md)或提交 Issue。
