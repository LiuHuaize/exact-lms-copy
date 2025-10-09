import React, { useEffect } from 'react'
import { z } from 'zod'
import type { BlockPlugin } from '@/content/registry'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export const ImageWithListSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  items: z.array(z.string()).min(1),
  image: z.object({
    url: z.string().url(),
    alt: z.string().optional(),
  }),
  caption: z.string().optional(),
})

export type ImageWithListData = z.infer<typeof ImageWithListSchema>

const ImageWithListRender: React.FC<{ data: ImageWithListData }> = ({ data }) => {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 grid lg:grid-cols-[1fr_minmax(280px,320px)] gap-12 items-center">
      <div>
        {data.eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-clover-green">
            {data.eyebrow}
          </span>
        )}
        <h2 className="text-2xl font-semibold text-foreground mb-6">{data.title}</h2>
        {data.description && <p className="text-base text-muted-foreground mb-6">{data.description}</p>}
        <ul className="space-y-4 text-base text-muted-foreground">
          {data.items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-clover-green" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <figure className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-lg">
          <div className="aspect-square">
            <img src={data.image.url} alt={data.image.alt ?? ''} className="h-full w-full object-cover" />
          </div>
        </div>
        {data.caption && (
          <figcaption className="text-base leading-relaxed text-muted-foreground border-l-2 border-clover-green/70 pl-5">
            {data.caption}
          </figcaption>
        )}
      </figure>
    </div>
  )
}

export const ImageWithListPlugin: BlockPlugin<ImageWithListData> = {
  type: 'image-with-list',
  label: '图文要点',
  version: 1,
  schema: ImageWithListSchema,
  defaultData: {
    eyebrow: '模块分类',
    title: '标题',
    description: '',
    items: ['要点 A', '要点 B', '要点 C'],
    image: {
      url: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=900&q=80',
      alt: '',
    },
    caption: '',
  },
  Render: ImageWithListRender,
  Inspector: ({ value, onChange }) => {
    const form = useForm<ImageWithListData>({
      resolver: zodResolver(ImageWithListSchema),
      defaultValues: value,
      mode: 'onChange',
    })
    const items = useFieldArray({ control: form.control, name: 'items' })

    useEffect(() => {
      const subscription = form.watch((vals) => onChange(vals as ImageWithListData))
      return () => subscription.unsubscribe()
    }, [form, onChange])

    return (
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="eyebrow">眉题</Label>
          <Input id="eyebrow" placeholder="如：模块分类" {...form.register('eyebrow')} />
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
              添加
            </Button>
          </div>
          <div className="space-y-2">
            {items.fields.map((field, idx) => (
              <div key={field.id} className="flex items-end gap-2">
                <Textarea
                  rows={2}
                  className="flex-1"
                  placeholder={`要点 ${idx + 1}`}
                  {...form.register(`items.${idx}` as const, { required: true })}
                />
                <Button type="button" variant="ghost" onClick={() => items.remove(idx)}>
                  删除
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="image.url">图片 URL</Label>
            <Input id="image.url" placeholder="https://…" {...form.register('image.url', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image.alt">替代文本</Label>
            <Input id="image.alt" placeholder="用于无障碍说明" {...form.register('image.alt')} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="caption">图片说明</Label>
          <Textarea id="caption" rows={2} placeholder="补充提示文字，可选" {...form.register('caption')} />
        </div>
      </form>
    )
  },
}
