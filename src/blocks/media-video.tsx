import React from 'react'
import { z } from 'zod'
import type { BlockPlugin } from '@/content/registry'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Sparkles } from 'lucide-react'
import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export const MediaVideoSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  description: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  meta: z.string().optional(),
  video: z.object({
    src: z.string().url(),
    type: z.string().default('video/mp4'),
    poster: z.string().url().optional(),
  }),
})

export type MediaVideoData = z.infer<typeof MediaVideoSchema>

const MediaVideoRender: React.FC<{ data: MediaVideoData }> = ({ data }) => {
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-xl overflow-hidden border border-muted-foreground/10">
      <div className="px-10 pt-12 pb-6 space-y-5">
        {data.eyebrow && (
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-clover-green uppercase tracking-[0.2em]">
            <Sparkles className="w-4 h-4" />
            {data.eyebrow}
          </div>
        )}
        <div className="flex flex-col gap-3 max-w-3xl">
          <h2 className="text-3xl leading-tight font-bold text-foreground">{data.title}</h2>
          {data.description.map((paragraph, index) => (
            <p key={index} className="text-base text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        {(data.tags.length > 0 || data.meta) && (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {data.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 rounded-full bg-clover-green/12 text-clover-green px-4 py-2 font-medium"
              >
                {tag}
              </span>
            ))}
            {data.meta && <span className="text-muted-foreground">{data.meta}</span>}
          </div>
        )}
      </div>
      <div className="px-6 pb-12">
        <AspectRatio ratio={16 / 9} className="rounded-[32px] overflow-hidden bg-[#0f3f3d]">
          <video
            controls
            poster={data.video.poster}
            className="h-full w-full object-cover"
          >
            <source src={data.video.src} type={data.video.type ?? 'video/mp4'} />
            您的浏览器暂不支持视频播放。
          </video>
        </AspectRatio>
      </div>
    </div>
  )
}

export const MediaVideoPlugin: BlockPlugin<MediaVideoData> = {
  type: 'media-video',
  label: 'Media Video',
  version: 1,
  schema: MediaVideoSchema,
  defaultData: {
    eyebrow: '视频课堂',
    title: '视频标题',
    description: ['视频介绍文字'],
    tags: ['标签'],
    meta: '时长 0:00',
    video: {
      src: 'https://cdn.coverr.co/videos/coverr-young-innovators-discussing-ideas-4087/1080p.mp4',
      type: 'video/mp4',
      poster: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80',
    },
  },
  Render: MediaVideoRender,
  Inspector: ({ value, onChange }) => {
    const form = useForm<MediaVideoData>({ resolver: zodResolver(MediaVideoSchema), defaultValues: value, mode: 'onChange' })
    const desc = useFieldArray({ control: form.control, name: 'description' })
    const tags = useFieldArray({ control: form.control, name: 'tags' })

    useEffect(() => {
      const sub = form.watch((vals) => onChange(vals as MediaVideoData))
      return () => sub.unsubscribe()
    }, [form, onChange])

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
          <Label>描述段落</Label>
          <div className="space-y-2">
            {desc.fields.map((f, idx) => (
              <div key={f.id} className="flex items-end gap-2">
                <Textarea rows={2} className="flex-1" {...form.register(`description.${idx}` as const)} />
                <Button type="button" variant="ghost" onClick={() => desc.remove(idx)}>
                  删除
                </Button>
              </div>
            ))}
            <Button type="button" size="sm" variant="outline" onClick={() => desc.append('')}>添加一段</Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label>标签</Label>
          <div className="space-y-2">
            {tags.fields.map((f, idx) => (
              <div key={f.id} className="flex items-center gap-2">
                <Input className="flex-1" {...form.register(`tags.${idx}` as const)} />
                <Button type="button" variant="ghost" onClick={() => tags.remove(idx)}>
                  删除
                </Button>
              </div>
            ))}
            <Button type="button" size="sm" variant="outline" onClick={() => tags.append('')}>添加标签</Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="meta">补充信息</Label>
          <Input id="meta" {...form.register('meta')} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="video.src">视频 URL</Label>
            <Input id="video.src" {...form.register('video.src', { required: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="video.type">MIME 类型</Label>
            <Input id="video.type" {...form.register('video.type')} />
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="video.poster">封面图</Label>
            <Input id="video.poster" {...form.register('video.poster')} />
          </div>
        </div>
      </form>
    )
  },
}
