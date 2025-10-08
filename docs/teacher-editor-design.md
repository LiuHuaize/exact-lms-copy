# 教师端 Editor 设计与前端模块化方案

本文档阐述在现有代码基础上（Vite + React + TS + Tailwind + shadcn/radix）建设教师端 Editor 的整体方向、目标、步骤与原因，并给出关键模块（含你提到的绿色渐变大卡片/底部白色 CTA 卡片）在数据模型与组件层的落地思路。

---

## 1. 背景与现状

- 课程学习页将多个内容/互动板块写在单个页面中：
  - 斜切 Banner/Hero：`src/pages/ActivityLearn.tsx:210`、`src/pages/ActivityDetail.tsx:27`
  - 音频卡：`src/pages/ActivityLearn.tsx:244`
  - 图文两列：`src/pages/ActivityLearn.tsx:281`
  - 绿色标题大卡（品牌渐变）：`src/pages/ActivityLearn.tsx:380~404`
  - 翻转卡片：`src/pages/ActivityLearn.tsx:431`
  - 拖拽匹配练习：`src/pages/ActivityLearn.tsx:478`
  - 底部白色结语+CTA 卡：`src/pages/ActivityLearn.tsx:598`
- 现状问题：文案与结构耦合在页面里，新增/复用板块或让教师改内容，需要改代码与重新发布。

---

## 2. 最终要达到的目标（Definition of Done）

- 教师端可视化编辑课程，无需写代码：插入/排序/配置各类“内容块（Block）”。
- 学习端与编辑端共用“Block 渲染器”，做到“一个 JSON，两个端渲染一致”。
- 模块化与可扩展：任何新板块（如翻转卡/拖拽/渐变大卡/Banner）以插件方式注册，低成本复用与演进。
- 一致的品牌与可访问性：色彩/间距/阴影受 Design Token 约束；自动对比度与交互完整性校验。


---

## 3. 为什么这么做（Rationale）

- 解耦“内容/交互设计”与“前端代码发布”，提升课程上线效率与可维护性。
- 统一渲染与编辑模型，避免两套实现导致的样式/行为漂移。
- 通过 Block 注册表实现“可插拔”，让互动题型与视觉组件可渐进扩展、可灰度回退。
- 版本化与校验使内容安全可控，减少老师误操作带来的线上风险。

---

## 4. 核心设计

### 4.1 内容数据模型（简化示意）

```ts
// src/content/types.ts（建议）
export type ActivityDocument = {
  id: string
  title: string
  cover?: string
  meta?: { grade?: string; durationMin?: number; tags?: string[] }
  lessons: Lesson[]
}

export type Lesson = {
  id: string
  title: string
  outline?: string
  sections: Section[]
}

export type Section = {
  id: string
  title?: string
  layout?: 'single' | 'two-col' | 'full'
  blocks: BlockNode[]
}

export type BlockNode = {
  id: string
  type: string             // 例如 'banner' | 'section-card' | 'flip-cards' | ...
  version: number
  data: unknown            // 由具体 Block 的 zod schema 约束
  visibility?: Visibility  // 可选条件渲染
}

export type Visibility = {
  roles?: string[]
  locale?: string[]
}
```

### 4.2 Block 插件注册表

```ts
// src/content/registry.ts（建议）
export type BlockPlugin<T> = {
  type: string
  label: string
  icon?: React.ComponentType
  version: number
  schema: ZodSchema<T>
  defaultData: T
  Render: React.FC<{ data: T }>
  Inspector: React.FC<{ value: T; onChange: (next: T) => void }>
  migrate?: (old: any) => T
}

export const BlockRegistry: Record<string, BlockPlugin<any>> = {}
```

- 新增模块只需注册到 `BlockRegistry`，无需修改 Editor/Renderer 主干。
- 升级模块时提升 `version`，并提供 `migrate` 确保老数据兼容。

### 4.3 重点 Block：SectionCard（满足截图两种卡片）

用途：
- 标题/分节卡（绿色品牌渐变，圆角大阴影）
- 结语/行动卡（白底、圆角、按钮 CTA）

Schema（建议）：
```ts
export type SectionCardData = {
  variant: 'brand-gradient' | 'white-cta' | 'plain'
  eyebrow?: string
  title: string
  description?: string
  align?: 'center' | 'left'
  containerWidth?: 'sm' | 'md' | 'lg' | 'xl'
  radius?: 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  shadow?: 'none' | 'sm' | 'lg' | 'xl' | '2xl'
  theme?: { gradientPreset?: 'clover' | 'teal'; bg?: string; text?: string }
  ctas?: Array<{ label: string; href?: string; actionId?: string; style?: 'primary'|'outline'|'ghost' }>
  spacing?: { pt?: 'xs'|'sm'|'md'|'lg'; pb?: 'xs'|'sm'|'md'|'lg'; mt?: 'none'|'sm'|'md'; mb?: 'none'|'sm'|'md' }
}
```

Editor 侧属性：内容（eyebrow/title/description）、主题预设/渐变、对齐/圆角/阴影/间距、CTA 列表；自动对比度检测。

与现页映射：
- 绿色标题卡 → `variant='brand-gradient'`（参考 `src/pages/ActivityLearn.tsx:380~404`）
- 白色 CTA 卡 → `variant='white-cta'`（参考 `src/pages/ActivityLearn.tsx:598`）

### 4.4 其他 Block（初始集）

- `banner`（斜切 Hero）：背景图/视频、覆盖色、不透明度、clip 角度；映射 `src/pages/ActivityLearn.tsx:210`、`src/pages/ActivityDetail.tsx:27`。
- `rich-text`：Tiptap/Lexical 文档或 Markdown。
- `image`：比例/圆角/焦点点位/alt。
- `media-audio`、`media-video`：基础播放控制、字幕/文本稿。
- `text-media-2col`：图文两列组合（参考 `src/pages/ActivityLearn.tsx:281`）。
- `flip-cards`：`items[{front,back,media?}]`、翻转方式（参考 `:431`）。
- `drag-match`：`targets`/`options`/`feedback` 与完整性校验（参考 `:478`）。
- `accordion`：多条折叠提示（参考 `:520+`）。

---

## 5. 编辑器（教师端）架构

- 左侧：
  - 模块库（按“结构/媒体/互动/高级”分组，来源 BlockRegistry）
  - 大纲（Section/Block 层级，可拖拽排序、显隐切换）
- 中间画布：
  - 真渲染（与学习端一致），插入位高亮，断点预览（桌面/平板/手机）
  - dnd-kit 实现块拖入/拖出/排序
- 右侧属性面板：
  - zod + react-hook-form 根据 schema 自动生成控件
  - 高级属性：可见性（角色/设备/语言）、无障碍（对比度）、动画（可选）
- 顶部：草稿/发布、历史版本、预览链接、校验告警
- 素材库：统一上传与复用，焦点点位/裁剪/替代文本/版权信息

技术栈建议：dnd-kit、tiptap/lexical、react-hook-form + zod、Zustand（编辑状态）+ react-query（远端读写）。

---

## 6. 与现有代码的对接策略

1) 渲染分层：
- 新增 `src/renderers/LessonRenderer.tsx`、`BlockRenderer.tsx`，接收 Lesson/Block JSON 渲染。
- `ActivityLearn` 初期可“半数据驱动”：仅将两处卡片与 Banner 切换为 JSON 渲染，其余仍保留硬编码（风险低/回归小）。

2) BlockRegistry 起步：
- 先注册 `section-card`、`banner`、`rich-text`、`image`、`media-audio`，满足当下页面。
- 后续逐步把 `flip-cards`、`drag-match` 迁移成 Block。

3) 数据来源：
- 本地 JSON（开发期）→ 后续切到服务端内容接口；草稿/发布在接口侧区分。

---

## 7. 版本化与校验

- 草稿/发布双轨：Editor 编辑草稿，点击“发布”生成不可变版本供学习端使用。
- Block 版本迁移：每个插件维护 `version + migrate()`；升级时自动迁移老数据并落盘。
- 校验：
  - schema 校验（必填、类型、范围）
  - 交互完整性（如 drag-match 选项与目标必须一一覆盖）
  - 可访问性（对比度、alt/captions/transcript）

---

## 8. 实施步骤（里程碑）

- M0（基础设施，1 周）
  - 定义 `types.ts`、`registry.ts` 与 `BlockRenderer`
  - 实现 `section-card`（含“品牌渐变/白色 CTA”两个预设），在 `ActivityLearn` 中用 JSON 驱动替换两处卡片
  - 建“本地 JSON 文档加载”与简单草稿文件

- M1（核心模块，1 周）
  - 实现 `banner`、`media-audio`、`rich-text`、`image`、`text-media-2col`
  - 将 `ActivityLearn` 中对应区域替换为数据驱动渲染

- M2（互动与校验，1-2 周）
  - 实现 `flip-cards`、`drag-match` Block 与 Inspector；加入交互完整性校验

- M3（Editor 外壳，1 周）
  - 左侧模块库/大纲、右侧属性面板、画布插入/排序、断点预览
  - 草稿/发布切换与版本历史（先本地模拟）

- M4（素材库与无障碍，0.5-1 周）
  - 素材管理、对比度/alt/字幕检查、国际化基础

- M5（灰度/回归，0.5 周）
  - 内测教师使用与回收反馈，修复与文档完善

---

## 9. 成功指标（度量）

- 教师新增一节课从 0 到发布 ≤ 30 分钟
- 课程页面完全由 JSON 驱动，研发不参与改文案/排版
- 新增一种互动题型 ≤ 1 天（含 Inspector）
- 无障碍/校验告警率显著下降，移动端可读性达标

---

## 10. 风险与应对

- 复杂度提升：通过“预设 + Token 约束”减少老师可操作自由度，保证一致性。
- 性能：大页面分段懒加载 Block；图片用 `srcset`/压缩；交互块按需加载。
- 迁移成本：分阶段替换；保留硬编码作为兜底（feature flag 切换）。

---

## 11. 立即可做的下一步

- 建立 `BlockRegistry` 雏形与 `section-card` 插件（两种预设），在 `ActivityLearn` 页面以 JSON 驱动替换：
  - 绿色渐变标题卡（`src/pages/ActivityLearn.tsx:380~404`）
  - 白色结语 CTA 卡（`src/pages/ActivityLearn.tsx:598`）
- 同步输出 `schema.ts` 与 Inspector 字段清单，方便后续 Editor 表单自动生成。

---

如需，我可以按本文档路线先提交 `section-card` 的类型与渲染骨架，保持现有页面视觉与行为不变，仅把数据抽出为 JSON，以便你快速验证工作方式。

