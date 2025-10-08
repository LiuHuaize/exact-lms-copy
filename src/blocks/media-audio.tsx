import React from 'react'
import { z } from 'zod'
import type { BlockPlugin } from '@/content/registry'
import { Button } from '@/components/ui/button'
import { Play, Volume2, List } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export const MediaAudioSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  progressPercent: z.number().min(0).max(100).default(0),
  durationLabel: z.string().optional(),
  speedLabel: z.string().optional(),
  listLabel: z.string().optional(),
  primaryActionLabel: z.string().optional(),
})

export type MediaAudioData = z.infer<typeof MediaAudioSchema>

const MediaAudioRender: React.FC<{ data: MediaAudioData }> = ({ data }) => {
  return (
    <div className="bg-white rounded-[32px] shadow-xl border border-muted-foreground/10 px-8 py-7 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="space-y-2">
          {data.eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-clover-green">
              {data.eyebrow}
            </span>
          )}
          <h2 className="text-2xl font-semibold text-foreground">{data.title}</h2>
        </div>
        {data.description && <p className="text-sm text-muted-foreground max-w-sm">{data.description}</p>}
      </div>
      <div className="rounded-[24px] bg-[#f5f9f7] border border-[#d7ebe0] px-5 py-4 flex flex-wrap items-center gap-4">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-[#0f6a60] text-white hover:bg-[#0c564d]"
          aria-label={data.primaryActionLabel ?? '播放'}
        >
          <Play className="w-5 h-5 ml-0.5" />
        </Button>
        <div className="flex items-center gap-4 flex-1 min-w-[200px]">
          <Volume2 className="w-5 h-5 text-[#0f6a60]" />
          <div className="flex-1 h-1 rounded-full bg-white shadow-inner">
            <div
              className="h-full rounded-full bg-[#0f6a60]"
              style={{ width: `${data.progressPercent ?? 0}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
          {data.durationLabel && <span>{data.durationLabel}</span>}
          {data.speedLabel && <span>{data.speedLabel}</span>}
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-[#5c6f66]" />
            {data.listLabel && <span>{data.listLabel}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export const MediaAudioPlugin: BlockPlugin<MediaAudioData> = {
  type: 'media-audio',
  label: 'Media Audio',
  version: 1,
  schema: MediaAudioSchema,
  defaultData: {
    eyebrow: '音频课程',
    title: '音频模块标题',
    description: '描述',
    progressPercent: 0,
    durationLabel: '0:00',
    speedLabel: '1x',
    listLabel: '播放列表',
    primaryActionLabel: '播放',
  },
  Render: MediaAudioRender,
  Inspector: ({ value, onChange }) => {
    const form = useForm<MediaAudioData>({
      resolver: zodResolver(MediaAudioSchema),
      defaultValues: value,
      mode: 'onChange',
    })

    useEffect(() => {
      const sub = form.watch((vals) => onChange(vals as MediaAudioData))
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
          <Label htmlFor="description">描述</Label>
          <Textarea id="description" rows={3} {...form.register('description')} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="progressPercent">进度 %</Label>
            <Input id="progressPercent" type="number" min={0} max={100} {...form.register('progressPercent', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="durationLabel">时长标签</Label>
            <Input id="durationLabel" {...form.register('durationLabel')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="speedLabel">倍速标签</Label>
            <Input id="speedLabel" {...form.register('speedLabel')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="listLabel">列表标签</Label>
            <Input id="listLabel" {...form.register('listLabel')} />
          </div>
        </div>
      </form>
    )
  },
}
