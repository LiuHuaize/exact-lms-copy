import React, { useEffect } from 'react'
import { z } from 'zod'
import type { BlockPlugin } from '@/content/registry'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const paddingScale = ['xs', 'sm', 'md', 'lg'] as const
const marginScale = ['none', 'sm', 'md', 'lg'] as const
const widthScale = ['sm', 'md', 'lg', 'xl'] as const
const radiusScale = ['lg', 'xl', '2xl', '3xl', 'full'] as const
const shadowScale = ['none', 'sm', 'lg', 'xl', '2xl'] as const

type PaddingScale = (typeof paddingScale)[number]
type MarginScale = (typeof marginScale)[number]

const SpacingSchema = z
  .object({
    pt: z.enum(paddingScale).default('lg'),
    pb: z.enum(paddingScale).default('lg'),
    mt: z.enum(marginScale).default('none'),
    mb: z.enum(marginScale).default('none'),
  })
  .partial()
  .default({ pt: 'lg', pb: 'lg', mt: 'none', mb: 'none' })

const ThemeSchema = z
  .object({
    gradientPreset: z.enum(['clover', 'teal', 'midnight']).optional(),
    bg: z.string().optional(),
    text: z.string().optional(),
  })
  .partial()
  .default({})

export const SectionCardSchema = z.object({
  variant: z.enum(['brand-gradient', 'white-cta', 'plain']).default('plain'),
  eyebrow: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  items: z.array(z.string()).optional().default([]),
  align: z.enum(['center', 'left']).default('center'),
  containerWidth: z.enum(widthScale).default('lg'),
  radius: z.enum(radiusScale).default('3xl'),
  shadow: z.enum(shadowScale).default('xl'),
  spacing: SpacingSchema,
  theme: ThemeSchema,
  ctas: z
    .array(
      z.object({
        label: z.string(),
        href: z.string().optional(),
        actionId: z.string().optional(),
        style: z.enum(['primary', 'outline', 'ghost']).default('primary').optional(),
      })
    )
    .optional()
    .default([]),
})

export type SectionCardData = z.infer<typeof SectionCardSchema>

type SpacingResolved = {
  pt: PaddingScale
  pb: PaddingScale
  mt: MarginScale
  mb: MarginScale
}

const gradientPresets: Record<string, string> = {
  clover: 'from-[#0c5d52] via-[#0a514f] to-[#083d3b]',
  teal: 'from-[#0b7c70] via-[#0a6860] to-[#074640]',
  midnight: 'from-[#0a1833] via-[#0f274a] to-[#103853]',
}

const containerWidthClasses: Record<typeof widthScale[number], string> = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
}

const radiusClasses: Record<typeof radiusScale[number], string> = {
  lg: 'rounded-[28px]',
  xl: 'rounded-[32px]',
  '2xl': 'rounded-[36px]',
  '3xl': 'rounded-[40px]',
  full: 'rounded-full',
}

const shadowClasses: Record<typeof shadowScale[number], string> = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
}

const paddingTopClasses: Record<PaddingScale, string> = {
  xs: 'pt-8',
  sm: 'pt-10',
  md: 'pt-12',
  lg: 'pt-16',
}

const paddingBottomClasses: Record<PaddingScale, string> = {
  xs: 'pb-8',
  sm: 'pb-10',
  md: 'pb-12',
  lg: 'pb-16',
}

const marginTopClasses: Record<MarginScale, string> = {
  none: '',
  sm: 'mt-6',
  md: 'mt-10',
  lg: 'mt-16',
}

const marginBottomClasses: Record<MarginScale, string> = {
  none: '',
  sm: 'mb-6',
  md: 'mb-10',
  lg: 'mb-16',
}

const defaultSpacingByVariant: Record<SectionCardData['variant'], SpacingResolved> = {
  'brand-gradient': { pt: 'lg', pb: 'lg', mt: 'none', mb: 'none' },
  'white-cta': { pt: 'lg', pb: 'lg', mt: 'none', mb: 'none' },
  plain: { pt: 'md', pb: 'md', mt: 'none', mb: 'none' },
}

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ')

const resolveSpacing = (variant: SectionCardData['variant'], spacing?: SectionCardData['spacing']): SpacingResolved => {
  const base = defaultSpacingByVariant[variant]
  return {
    pt: (spacing?.pt as PaddingScale) ?? base.pt,
    pb: (spacing?.pb as PaddingScale) ?? base.pb,
    mt: (spacing?.mt as MarginScale) ?? base.mt,
    mb: (spacing?.mb as MarginScale) ?? base.mb,
  }
}

const buttonVariantMap: Record<'primary' | 'outline' | 'ghost', 'default' | 'outline' | 'ghost'> = {
  primary: 'default',
  outline: 'outline',
  ghost: 'ghost',
}

const SectionCardRender: React.FC<{ data: SectionCardData }> = ({ data }) => {
  const isCenter = data.align !== 'left'
  const spacing = resolveSpacing(data.variant, data.spacing)
  const outerClass = cx(
    containerWidthClasses[data.containerWidth],
    'mx-auto',
    marginTopClasses[spacing.mt],
    marginBottomClasses[spacing.mb]
  )
  const paddingClass = cx(paddingTopClasses[spacing.pt], paddingBottomClasses[spacing.pb])
  const radius = radiusClasses[data.radius]
  const shadow = shadowClasses[data.shadow]

  if (data.variant === 'brand-gradient') {
    const gradientPreset = data.theme?.gradientPreset ?? 'clover'
    const gradientClass = gradientPresets[gradientPreset] ?? gradientPresets.clover
    const backgroundStyle: React.CSSProperties = {}
    if (data.theme?.bg) backgroundStyle.background = data.theme.bg
    if (data.theme?.text) backgroundStyle.color = data.theme.text

    return (
      <div className={outerClass}>
        <div
          className={cx(
            'bg-gradient-to-br overflow-hidden text-white',
            gradientClass,
            radius,
            shadow
          )}
          style={backgroundStyle}
        >
          <div className={cx('px-10', paddingClass, isCenter ? 'text-center' : 'text-left')}>
            {data.eyebrow && (
              <p className={cx('text-sm uppercase tracking-[0.4em] text-white/70 mb-6', isCenter ? 'mx-auto' : '')}>
                {data.eyebrow}
              </p>
            )}
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">{data.title}</h2>
            {data.description && (
              <p
                className={cx(
                  'text-base max-w-3xl text-white/80',
                  isCenter ? 'mx-auto text-center' : 'text-left'
                )}
              >
                {data.description}
              </p>
            )}
            {data.items && data.items.length > 0 && (
              <ul
                className={cx(
                  'mt-8 space-y-3 text-base text-white/85',
                  isCenter ? 'mx-auto max-w-2xl text-left' : 'text-left'
                )}
              >
                {data.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-2 inline-block h-2 w-2 rounded-full bg-white/70" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (data.variant === 'white-cta') {
    const backgroundStyle: React.CSSProperties = {}
    if (data.theme?.bg) backgroundStyle.background = data.theme.bg
    if (data.theme?.text) backgroundStyle.color = data.theme.text

    return (
      <div className={outerClass}>
        <div
          className={cx(
            'bg-white text-center space-y-6 px-8 md:px-12',
            paddingClass,
            radius,
            shadow
          )}
          style={backgroundStyle}
        >
          {data.eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">
              {data.eyebrow}
            </p>
          )}
          <h3 className="text-3xl lg:text-4xl font-bold text-foreground">{data.title}</h3>
          {data.description && <p className="text-lg text-muted-foreground">{data.description}</p>}
          {data.items && data.items.length > 0 && (
            <ul
              className={cx(
                'space-y-3 text-base text-muted-foreground',
                isCenter ? 'mx-auto max-w-2xl text-left' : 'text-left'
              )}
            >
              {data.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-2 inline-block h-2 w-2 rounded-full bg-clover-green" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          {data.ctas && data.ctas.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {data.ctas.map((cta, idx) => {
                const variantKey = (cta.style ?? 'primary') as 'primary' | 'outline' | 'ghost'
                const buttonVariant = buttonVariantMap[variantKey]
                return (
                  <Button
                    key={idx}
                    asChild={Boolean(cta.href)}
                    size="lg"
                    variant={buttonVariant}
                    className="px-10 py-6 text-base font-semibold rounded-full"
                  >
                    {cta.href ? <a href={cta.href}>{cta.label}</a> : <span>{cta.label}</span>}
                  </Button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  const backgroundStyle: React.CSSProperties = {}
  if (data.theme?.bg) backgroundStyle.background = data.theme.bg
  if (data.theme?.text) backgroundStyle.color = data.theme.text

  return (
    <div className={outerClass}>
      <div
        className={cx(
          'bg-white border border-muted-foreground/10 px-8 md:px-10 space-y-6',
          paddingClass,
          radius,
          shadow
        )}
        style={backgroundStyle}
      >
        {data.eyebrow && (
          <p
            className={cx(
              'text-sm font-semibold uppercase tracking-[0.3em] text-clover-green',
              isCenter ? 'mx-auto text-center' : 'text-left'
            )}
          >
            {data.eyebrow}
          </p>
        )}
        <div className={cx('space-y-2', isCenter ? 'text-center' : 'text-left')}>
          <h3 className="text-2xl font-semibold text-foreground">{data.title}</h3>
          {data.description && <p className="text-muted-foreground">{data.description}</p>}
        </div>
        {data.items && data.items.length > 0 && (
          <ul
            className={cx(
              'space-y-3 text-base text-muted-foreground',
              isCenter ? 'mx-auto max-w-2xl text-left' : 'text-left'
            )}
          >
            {data.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-2 inline-block h-2 w-2 rounded-full bg-clover-green" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
        {data.ctas && data.ctas.length > 0 && (
          <div className={cx('flex flex-wrap gap-3', isCenter ? 'justify-center' : 'justify-start')}>
            {data.ctas.map((cta, idx) => {
              const variantKey = (cta.style ?? 'primary') as 'primary' | 'outline' | 'ghost'
              const buttonVariant = buttonVariantMap[variantKey]
              return (
                <Button
                  key={idx}
                  asChild={Boolean(cta.href)}
                  size="lg"
                  variant={buttonVariant}
                  className="px-8 py-4 text-sm font-semibold rounded-full"
                >
                  {cta.href ? <a href={cta.href}>{cta.label}</a> : <span>{cta.label}</span>}
                </Button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const sanitizeSectionCard = (input: SectionCardData): SectionCardData => {
  const trimmedEyebrow = input.eyebrow?.trim()
  const trimmedDescription = input.description?.trim()
  const items = (input.items ?? []).map((item) => item.trim()).filter(Boolean)
  const ctas = (input.ctas ?? [])
    .map((cta) => ({
      label: cta.label.trim(),
      href: cta.href?.trim() || undefined,
      actionId: cta.actionId?.trim() || undefined,
      style: (cta.style ?? 'primary') as 'primary' | 'outline' | 'ghost',
    }))
    .filter((cta) => cta.label.length > 0)

  const theme = (() => {
    const preset = input.theme?.gradientPreset
    const bg = input.theme?.bg?.trim()
    const text = input.theme?.text?.trim()
    if (!preset && !bg && !text) return {}
    return {
      ...(preset ? { gradientPreset: preset } : {}),
      ...(bg ? { bg } : {}),
      ...(text ? { text } : {}),
    }
  })()

  const spacing = {
    pt: input.spacing?.pt ?? defaultSpacingByVariant[input.variant].pt,
    pb: input.spacing?.pb ?? defaultSpacingByVariant[input.variant].pb,
    mt: input.spacing?.mt ?? defaultSpacingByVariant[input.variant].mt,
    mb: input.spacing?.mb ?? defaultSpacingByVariant[input.variant].mb,
  }

  return {
    ...input,
    eyebrow: trimmedEyebrow ? trimmedEyebrow : undefined,
    description: trimmedDescription ? trimmedDescription : undefined,
    items,
    ctas,
    theme,
    spacing,
  }
}

export const SectionCardPlugin: BlockPlugin<SectionCardData> = {
  type: 'section-card',
  label: '重点卡片',
  version: 2,
  schema: SectionCardSchema,
  defaultData: {
    variant: 'plain',
    title: '标题',
    description: '',
    items: [],
    align: 'center',
    containerWidth: 'lg',
    radius: '2xl',
    shadow: 'lg',
    spacing: { pt: 'md', pb: 'md', mt: 'none', mb: 'none' },
    theme: {},
    ctas: [],
  },
  Render: SectionCardRender,
  Inspector: ({ value, onChange }) => {
    const form = useForm<SectionCardData>({
      resolver: zodResolver(SectionCardSchema),
      defaultValues: value,
      mode: 'onChange',
    })

    const items = useFieldArray({ control: form.control, name: 'items' })
    const ctas = useFieldArray({ control: form.control, name: 'ctas' })

    useEffect(() => {
      form.reset(value)
    }, [value, form])

    useEffect(() => {
      const sub = form.watch((vals) => {
        const next = sanitizeSectionCard(vals as SectionCardData)
        if (next.title.trim().length > 0) {
          onChange(next)
        }
      })
      return () => sub.unsubscribe()
    }, [form, onChange])

    const variant = form.watch('variant')

    return (
      <form className="space-y-6">
        <section className="space-y-3">
          <Label htmlFor="variant">样式</Label>
          <select id="variant" className="w-full border rounded-md px-3 py-2" {...form.register('variant')}>
            <option value="plain">基础样式</option>
            <option value="brand-gradient">品牌渐变卡</option>
            <option value="white-cta">白底行动卡</option>
          </select>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="eyebrow">眉题</Label>
            <Input id="eyebrow" placeholder="例如：准备材料" {...form.register('eyebrow')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="align">对齐</Label>
            <select id="align" className="w-full border rounded-md px-3 py-2" {...form.register('align')}>
              <option value="center">居中</option>
              <option value="left">居左</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="containerWidth">宽度</Label>
            <select id="containerWidth" className="w-full border rounded-md px-3 py-2" {...form.register('containerWidth')}>
              <option value="sm">较窄</option>
              <option value="md">适中</option>
              <option value="lg">默认</option>
              <option value="xl">最宽</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="radius">圆角</Label>
            <select id="radius" className="w-full border rounded-md px-3 py-2" {...form.register('radius')}>
              <option value="lg">28px</option>
              <option value="xl">32px</option>
              <option value="2xl">36px</option>
              <option value="3xl">40px</option>
              <option value="full">全圆角</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="shadow">阴影</Label>
            <select id="shadow" className="w-full border rounded-md px-3 py-2" {...form.register('shadow')}>
              <option value="none">无</option>
              <option value="sm">细腻</option>
              <option value="lg">适中</option>
              <option value="xl">强调</option>
              <option value="2xl">强化</option>
            </select>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="spacing-pt">上内边距</Label>
            <select id="spacing-pt" className="w-full border rounded-md px-3 py-2" {...form.register('spacing.pt')}>
              <option value="xs">紧凑</option>
              <option value="sm">较紧</option>
              <option value="md">适中</option>
              <option value="lg">宽松</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="spacing-pb">下内边距</Label>
            <select id="spacing-pb" className="w-full border rounded-md px-3 py-2" {...form.register('spacing.pb')}>
              <option value="xs">紧凑</option>
              <option value="sm">较紧</option>
              <option value="md">适中</option>
              <option value="lg">宽松</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="spacing-mt">上外边距</Label>
            <select id="spacing-mt" className="w-full border rounded-md px-3 py-2" {...form.register('spacing.mt')}>
              <option value="none">无</option>
              <option value="sm">6px</option>
              <option value="md">10px</option>
              <option value="lg">16px</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="spacing-mb">下外边距</Label>
            <select id="spacing-mb" className="w-full border rounded-md px-3 py-2" {...form.register('spacing.mb')}>
              <option value="none">无</option>
              <option value="sm">6px</option>
              <option value="md">10px</option>
              <option value="lg">16px</option>
            </select>
          </div>
        </section>

        <section className="space-y-2">
          <Label htmlFor="title">标题</Label>
          <Input id="title" placeholder="请输入标题" {...form.register('title', { required: true })} />
        </section>

        <section className="space-y-2">
          <Label htmlFor="description">描述</Label>
          <Textarea id="description" rows={3} placeholder="补充说明，可选" {...form.register('description')} />
        </section>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>要点列表</Label>
            <Button type="button" size="sm" variant="outline" onClick={() => items.append('')}>
              添加要点
            </Button>
          </div>
          <div className="space-y-2">
            {items.fields.map((field, idx) => (
              <div key={field.id} className="flex items-end gap-2">
                <Textarea
                  rows={2}
                  className="flex-1"
                  placeholder={`要点 ${idx + 1}`}
                  {...form.register(`items.${idx}` as const)}
                />
                <Button type="button" variant="ghost" onClick={() => items.remove(idx)}>
                  删除
                </Button>
              </div>
            ))}
            {items.fields.length === 0 && <p className="text-xs text-muted-foreground">暂未添加要点</p>}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>行动按钮</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                ctas.append({ label: '了解更多', href: '', actionId: '', style: 'primary' })
              }
            >
              添加
            </Button>
          </div>
          <div className="space-y-3">
            {ctas.fields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-12 gap-3">
                <div className="col-span-4 space-y-1">
                  <Label htmlFor={`ctas-${idx}-label`}>按钮文字</Label>
                  <Input id={`ctas-${idx}-label`} {...form.register(`ctas.${idx}.label` as const)} />
                </div>
                <div className="col-span-4 space-y-1">
                  <Label htmlFor={`ctas-${idx}-href`}>链接地址（可选）</Label>
                  <Input
                    id={`ctas-${idx}-href`}
                    placeholder="例如 /activities 或 https://"
                    {...form.register(`ctas.${idx}.href` as const)}
                  />
                </div>
                <div className="col-span-3 space-y-1">
                  <Label htmlFor={`ctas-${idx}-style`}>样式</Label>
                  <select
                    id={`ctas-${idx}-style`}
                    className="w-full border rounded-md px-3 py-2"
                    {...form.register(`ctas.${idx}.style` as const)}
                  >
                    <option value="primary">实心</option>
                    <option value="outline">描边</option>
                    <option value="ghost">幽灵</option>
                  </select>
                </div>
                <div className="col-span-1 flex items-end">
                  <Button type="button" variant="ghost" onClick={() => ctas.remove(idx)}>
                    删除
                  </Button>
                </div>
                <div className="col-span-12 space-y-1">
                  <Label htmlFor={`ctas-${idx}-action`}>自定义动作 ID（可选）</Label>
                  <Input id={`ctas-${idx}-action`} {...form.register(`ctas.${idx}.actionId` as const)} />
                </div>
              </div>
            ))}
            {ctas.fields.length === 0 && <p className="text-xs text-muted-foreground">未添加按钮，保持为空即可。</p>}
          </div>
        </section>

        <section className="space-y-3">
          <Label>主题设置</Label>
          {variant === 'brand-gradient' && (
            <p className="text-xs text-muted-foreground">选择品牌渐变或自定义渐变背景。</p>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="theme-gradient">渐变预设</Label>
              <select id="theme-gradient" className="w-full border rounded-md px-3 py-2" {...form.register('theme.gradientPreset')}>
                <option value="clover">Clover</option>
                <option value="teal">Teal</option>
                <option value="midnight">Midnight</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme-bg">自定义背景（可选）</Label>
              <Input id="theme-bg" placeholder="如 linear-gradient(...) 或 #ffffff" {...form.register('theme.bg')} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="theme-text">自定义文字颜色（可选）</Label>
              <Input id="theme-text" placeholder="例如 #0f766e" {...form.register('theme.text')} />
            </div>
          </div>
        </section>
      </form>
    )
  },
  migrate: (old) => {
    if (typeof old !== 'object' || old === null) return SectionCardPlugin.defaultData
    const legacy = old as Partial<SectionCardData>
    const legacyItems = Array.isArray(legacy.items) ? legacy.items : []
    const legacyCtas = Array.isArray(legacy.ctas) ? legacy.ctas : []
    const baseVariant = legacy.variant ?? 'plain'
    const migrated: SectionCardData = {
      ...SectionCardPlugin.defaultData,
      ...legacy,
      variant: baseVariant,
      spacing: {
        ...SectionCardPlugin.defaultData.spacing,
        ...(legacy.spacing ?? {}),
      },
      theme: {
        ...SectionCardPlugin.defaultData.theme,
        ...(legacy.theme ?? {}),
      },
      ctas: legacyCtas
        .map((cta) => ({
          label: cta.label,
          href: cta.href,
          actionId: 'actionId' in cta ? (cta.actionId as string | undefined) : undefined,
          style: (cta.style ?? 'primary') as 'primary' | 'outline' | 'ghost',
        }))
        .filter((cta) => typeof cta.label === 'string'),
      items: legacyItems.filter((item): item is string => typeof item === 'string'),
    }
    return migrated
  },
}
