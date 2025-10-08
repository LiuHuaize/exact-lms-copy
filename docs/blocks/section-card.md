# Block: section-card

字段与说明（用于 Editor Inspector）

- variant: 'brand-gradient' | 'white-cta' | 'plain'（样式预设）
- eyebrow?: string（眉题）
- title: string（标题，必填）
- description?: string（描述）
- align?: 'center' | 'left'（对齐，默认 center）
- ctas?: Array<{ label: string; href?: string }>（CTA 按钮列表）

默认值（与实现同步）：

```
{
  variant: 'plain',
  title: '标题',
  description: '',
  align: 'center',
  ctas: []
}
```

渲染映射：

- brand-gradient: 用于绿色品牌渐变大卡（章节分隔/标题）
- white-cta: 用于底部白色 CTA 卡（结语 + 行动）
- plain: 基础卡片样式

