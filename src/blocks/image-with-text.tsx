import React, { useEffect } from 'react'
import { z } from 'zod'
import type { BlockPlugin } from '@/content/registry'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export const ImageWithTextSchema = z.object({
  layout: z.enum(['image-left', 'image-right']).default('image-left'),
  image: z.object({
    url: z.string().url(),
    alt: z.string().optional(),
  }),
  caption: z.string().optional(),
  body: z.array(z.string()).min(1),
})

export type ImageWithTextData = z.infer<typeof ImageWithTextSchema>

const ImageWithTextRender: React.FC<{ data: ImageWithTextData }> = ({ data }) => {
  const isImageLeft = data.layout === 'image-left'

  const renderImage = (extraClass?: string) => (
    <figure className={`space-y-6 ${extraClass ?? ''}`}>
      <div className="rounded-[32px] overflow-hidden shadow-xl">
        <div className="aspect-square">
          <img src={data.image.url} alt={data.image.alt ?? ''} className="h-full w-full object-cover" />
        </div>
      </div>
      {data.caption && (
        <figcaption className="text-base leading-relaxed text-muted-foreground border-l-2 border-clover-green pl-5">
          {data.caption}
        </figcaption>
      )}
    </figure>
  )

  const textSection = (
    <div className="space-y-5 text-base lg:text-lg leading-relaxed text-muted-foreground lg:self-center">
      {data.body.map((paragraph, idx) => (
        <p key={idx}>{paragraph}</p>
      ))}
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto grid lg:grid-cols-[minmax(280px,320px)_1fr] gap-10 items-center">
      {isImageLeft ? (
        <>
          {renderImage()}
          {textSection}
        </>
      ) : (
        <>
          {textSection}
          {renderImage('lg:order-last')}
        </>
      )}
    </div>
  )
}

export const ImageWithTextPlugin: BlockPlugin<ImageWithTextData> = {
  type: 'image-with-text',
  label: '图文组合',
  version: 1,
  schema: ImageWithTextSchema,
  defaultData: {
    layout: 'image-left',
    image: {
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      alt: '',
    },
    caption: '',
    body: ['正文内容'],
  },
  Render: ImageWithTextRender,
  Inspector: ({ value, onChange }) => {
    const form = useForm<ImageWithTextData>({ resolver: zodResolver(ImageWithTextSchema), defaultValues: value, mode: 'onChange' })
    const body = useFieldArray({ control: form.control, name: 'body' })

    useEffect(() => {
      const sub = form.watch((vals) => onChange(vals as ImageWithTextData))
      return () => sub.unsubscribe()
    }, [form, onChange])

    return (
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="layout">布局</Label>
          <select id="layout" className="w-full border rounded-md px-3 py-2" {...form.register('layout')}>
            <option value="image-left">图左文右</option>
            <option value="image-right">文左图右</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="image.url">图片 URL</Label>
            <Input id="image.url" {...form.register('image.url', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image.alt">替代文本</Label>
            <Input id="image.alt" {...form.register('image.alt')} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="caption">图片说明</Label>
          <Textarea id="caption" rows={2} {...form.register('caption')} />
        </div>

        <div className="space-y-2">
          <Label>正文段落</Label>
          <div className="space-y-2">
            {body.fields.map((f, idx) => (
              <div key={f.id} className="flex items-end gap-2">
                <Textarea rows={2} className="flex-1" {...form.register(`body.${idx}` as const)} />
                <Button type="button" variant="ghost" onClick={() => body.remove(idx)}>
                  删除
                </Button>
              </div>
            ))}
            <Button type="button" size="sm" variant="outline" onClick={() => body.append('')}>添加一段</Button>
          </div>
        </div>
      </form>
    )
  },
}
