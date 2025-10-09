import React from 'react'
import { z } from 'zod'
import type { BlockPlugin } from '@/content/registry'
import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export const SectionCardSchema = z.object({
  variant: z.enum(['brand-gradient', 'white-cta', 'plain']).default('plain'),
  eyebrow: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  items: z.array(z.string()).optional().default([]),
  align: z.enum(['center', 'left']).default('center'),
  ctas: z
    .array(
      z.object({
        label: z.string(),
        href: z.string().optional(),
      })
    )
    .optional()
    .default([]),
})

export type SectionCardData = z.infer<typeof SectionCardSchema>

const SectionCardRender: React.FC<{ data: SectionCardData }> = ({ data }) => {
  const isCenter = data.align !== 'left'

  if (data.variant === 'brand-gradient') {
    return (
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#0c5d52] via-[#0a514f] to-[#083d3b] rounded-[40px] text-white overflow-hidden shadow-2xl">
        <div className={`px-10 py-16 ${isCenter ? 'text-center' : ''}`}>
          {data.eyebrow && (
            <p className={`text-sm uppercase tracking-[0.4em] text-white/70 mb-6 ${isCenter ? '' : ''}`}>
              {data.eyebrow}
            </p>
          )}
          <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${isCenter ? '' : ''}`}>{data.title}</h2>
          {data.description && (
            <p className={`text-base max-w-3xl ${isCenter ? 'mx-auto' : ''} text-white/80`}>{data.description}</p>
          )}
          {data.items && data.items.length > 0 && (
            <ul
              className={`mt-8 space-y-3 text-base text-white/85 ${
                isCenter ? 'mx-auto max-w-2xl text-left' : ''
              }`}
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
    )
  }

  if (data.variant === 'white-cta') {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-[36px] shadow-xl p-12 text-center space-y-6">
        <h3 className="text-3xl lg:text-4xl font-bold text-foreground">{data.title}</h3>
        {data.description && <p className="text-lg text-muted-foreground">{data.description}</p>}
        {data.ctas && data.ctas.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {data.ctas.map((cta, idx) => (
              <Button
                key={idx}
                asChild={Boolean(cta.href)}
                size="lg"
                className="px-10 py-6 text-base font-semibold rounded-full"
              >
                {cta.href ? <a href={cta.href}>{cta.label}</a> : <span>{cta.label}</span>}
              </Button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // plain
  return (
    <div className={`max-w-5xl mx-auto bg-white rounded-[32px] shadow p-10 space-y-6 ${isCenter ? 'text-center' : ''}`}>
      {data.eyebrow && (
        <p
          className={`text-sm font-semibold uppercase tracking-[0.3em] text-clover-green ${
            isCenter ? 'mx-auto' : ''
          }`}
        >
          {data.eyebrow}
        </p>
      )}
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-foreground">{data.title}</h3>
        {data.description && <p className="text-muted-foreground">{data.description}</p>}
      </div>
      {data.items && data.items.length > 0 && (
        <ul
          className={`space-y-3 text-base text-muted-foreground ${
            isCenter ? 'mx-auto max-w-2xl text-left' : ''
          }`}
        >
          {data.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="mt-2 inline-block h-2 w-2 rounded-full bg-clover-green" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export const SectionCardPlugin: BlockPlugin<SectionCardData> = {
  type: 'section-card',
  label: '重点卡片',
  version: 1,
  schema: SectionCardSchema,
  defaultData: {
    variant: 'plain',
    title: '标题',
    description: '',
    items: [],
    align: 'center',
    ctas: [],
  },
  Render: SectionCardRender,
  Inspector: ({ value, onChange }) => {
    const form = useForm<SectionCardData>({
      resolver: zodResolver(SectionCardSchema),
      defaultValues: value,
      mode: 'onChange',
    })

    const { fields, append, remove } = useFieldArray({ control: form.control, name: 'ctas' })
    const items = useFieldArray({ control: form.control, name: 'items' })

    // Live-sync to parent on any valid change
    useEffect(() => {
      const sub = form.watch((vals) => {
        const next = vals as SectionCardData
        // Basic sanity: must have title
        if (next && typeof next.title === 'string') onChange(next)
      })
      return () => sub.unsubscribe()
    }, [form, onChange])

    return (
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="variant">样式</Label>
          <select id="variant" className="w-full border rounded-md px-3 py-2" {...form.register('variant')}>
            <option value="plain">基础样式</option>
            <option value="brand-gradient">品牌渐变卡</option>
            <option value="white-cta">白底行动卡</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="eyebrow">眉题</Label>
          <Input id="eyebrow" placeholder="例如：准备材料" {...form.register('eyebrow')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">标题</Label>
          <Input id="title" placeholder="请输入标题" {...form.register('title', { required: true })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">描述</Label>
          <Textarea id="description" rows={3} placeholder="补充说明，可选" {...form.register('description')} />
        </div>

        <div className="space-y-2">
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
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="align">对齐</Label>
          <select id="align" className="w-full border rounded-md px-3 py-2" {...form.register('align')}>
            <option value="center">居中</option>
            <option value="left">居左</option>
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>行动按钮</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => append({ label: '了解更多', href: '/activities' })}
            >
              添加
            </Button>
          </div>
          <div className="space-y-3">
            {fields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5 space-y-1">
                  <Label htmlFor={`ctas.${idx}.label`}>按钮文字</Label>
                  <Input id={`ctas.${idx}.label`} {...form.register(`ctas.${idx}.label` as const)} />
                </div>
                <div className="col-span-6 space-y-1">
                  <Label htmlFor={`ctas.${idx}.href`}>链接地址（可选）</Label>
                  <Input id={`ctas.${idx}.href`} placeholder="例如 /activities 或 https://" {...form.register(`ctas.${idx}.href` as const)} />
                </div>
                <div className="col-span-1">
                  <Button type="button" variant="ghost" onClick={() => remove(idx)}>
                    删除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    )
  },
}
