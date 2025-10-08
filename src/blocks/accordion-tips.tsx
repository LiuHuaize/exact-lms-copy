import React, { useEffect } from 'react'
import { z } from 'zod'
import type { BlockPlugin } from '@/content/registry'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export const AccordionTipsSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  items: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
      })
    )
    .min(1),
})

export type AccordionTipsData = z.infer<typeof AccordionTipsSchema>

const AccordionTipsRender: React.FC<{ data: AccordionTipsData }> = ({ data }) => {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-[36px] shadow-xl p-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {data.eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-clover-green">
              {data.eyebrow}
            </span>
          )}
          <h3 className="mt-2 text-2xl font-semibold text-foreground">{data.title}</h3>
        </div>
        {data.description && <p className="text-sm text-muted-foreground max-w-sm">{data.description}</p>}
      </div>
      <Accordion type="multiple" className="space-y-4">
        {data.items.map((item) => (
          <AccordionItem key={item.id} value={item.id} className="border border-muted-foreground/10 rounded-2xl px-4">
            <AccordionTrigger className="text-base font-semibold text-foreground">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export const AccordionTipsPlugin: BlockPlugin<AccordionTipsData> = {
  type: 'accordion-tips',
  label: 'Accordion Tips',
  version: 1,
  schema: AccordionTipsSchema,
  defaultData: {
    eyebrow: '深入思考',
    title: '展开小贴士，继续自我挑战',
    description: '根据你的节奏逐条阅读，每完成一条就写下一个具体行动。',
    items: [
      { id: 'tip-1', title: '提示 1', content: '内容 1' },
      { id: 'tip-2', title: '提示 2', content: '内容 2' },
    ],
  },
  Render: AccordionTipsRender,
  Inspector: ({ value, onChange }) => {
    const form = useForm<AccordionTipsData>({ resolver: zodResolver(AccordionTipsSchema), defaultValues: value, mode: 'onChange' })
    const items = useFieldArray({ control: form.control, name: 'items' })

    useEffect(() => {
      const sub = form.watch((vals) => onChange(vals as AccordionTipsData))
      return () => sub.unsubscribe()
    }, [form, onChange])

    const addItem = () => {
      items.append({ id: `tip-${Math.random().toString(36).slice(2, 6)}`, title: '新的提示', content: '' })
    }

    return (
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="eyebrow">眉题</Label>
          <Input id="eyebrow" {...form.register('eyebrow')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">标题</Label>
          <Input id="title" {...form.register('title', { required: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">描述</Label>
          <Textarea id="description" rows={3} {...form.register('description')} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>提示条目</Label>
            <Button type="button" size="sm" variant="outline" onClick={addItem}>
              新增
            </Button>
          </div>
          <div className="space-y-3">
            {items.fields.map((f, idx) => (
              <div key={f.id} className="rounded-md border p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor={`items.${idx}.id`}>ID</Label>
                    <Input id={`items.${idx}.id`} {...form.register(`items.${idx}.id` as const)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`items.${idx}.title`}>标题</Label>
                    <Input id={`items.${idx}.title`} {...form.register(`items.${idx}.title` as const)} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`items.${idx}.content`}>内容</Label>
                  <Textarea id={`items.${idx}.content`} rows={3} {...form.register(`items.${idx}.content` as const)} />
                </div>
                <div className="flex items-center justify-end">
                  <Button type="button" variant="ghost" onClick={() => items.remove(idx)}>
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
