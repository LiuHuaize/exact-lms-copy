# Repository Guidelines

## 项目结构与模块组织
- **`src/`**：React + TypeScript 源码按职责划分。`pages/` 存放路由页面，`components/` 为可复用 UI，`blocks/` 承载页面级区块，`renderers/` 负责富文本渲染，`hooks/` 收纳共享逻辑，`lib/` 放置工具函数与 API 封装。`main.tsx` 将 Vite 注入 `App.tsx` 并初始化全局 Provider。
- **`content/` 与 `docs/`**：维护 Markdown、JSON 等内容资源，新增文案请优先放在此处而非 `public/`。
- **`public/`**：静态资源按原样拷贝进构建产物，组件内引用时使用以 `/` 开头的路径。
- **`dist/`**：`npm run build` 生成的产物目录，请勿手动修改；排查异常时可先清理后重构建。

## 构建、测试与开发命令
- `npm install`：安装依赖；如使用 Bun，可改用 `bun install` 以匹配 `bun.lockb`。
- `npm run dev`：启动 Vite 开发服务器，默认监听 `http://localhost:5173`，支持热更新。
- `npm run build`：以默认 production 模式输出 `dist/` 生产包。
- `npm run build:dev`：以 development 模式构建，便于排查打包问题。
- `npm run preview`：本地预览最新构建产物，适合联调与冒烟测试。
- `npm run lint`：执行 ESLint，使用共享的 TypeScript + React 规则集。

## 代码风格与命名约定
- 遵循 `tsconfig.json` 设定的 TypeScript 严格性，组件 props 与返回值倾向显式声明类型。
- 组件文件使用帕斯卡命名（如 `ActivityCard.tsx`），自定义 Hook 以 camelCase 命名并存放在 `hooks/`。
- 样式依赖 Tailwind CSS，建议按布局 → 颜色 → 状态的顺序排列类名以提升可读性。
- ESLint 及 React Hooks 规则为参考标准，提交前务必运行 `npm run lint` 并修复告警。
- `tsconfig.json` 配置了 `@/` 路径别名，尽量避免在 `src/` 内部出现冗长的相对路径链。

## 测试指引
- 项目暂未内置自动化测试。若补充覆盖率，推荐使用 Vitest 搭配 React Testing Library，与 Vite 生态一致。
- 组件级测试紧邻源码命名为 `<Component>.test.tsx`；若出现共享夹具，可在 `src/__tests__/` 建立集成套件。
- 在自动化体系完善之前，通过 `npm run preview` 手工验证关键流程。

## 提交与 Pull Request 规范
- Git 历史多为精炼的单行摘要（常见中文描述)，保持该风格或采用简洁的英文祈使句，确保同一系列提交一致。
- PR 描述需关联相关 issue，并在 UI 改动时附带截图或短视频说明。
- 提交 PR 前确认 `npm run lint` 通过、开发服务器无控制台报错，并为新增路由或组件在 `docs/` 补充必要说明。
