import React from 'react'
import { z } from 'zod'
import type { BlockPlugin } from '@/content/registry'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowUp } from 'lucide-react'

export const BannerSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  bgImage: z.string().url(),
  topRightLabel: z.string().optional(),
})

export type BannerData = z.infer<typeof BannerSchema>

const BannerRender: React.FC<{ data: BannerData }> = ({ data }) => {
  return (
    <div className="relative overflow-hidden flex-shrink-0">
      <div className="absolute inset-0">
        <img src={data.bgImage} alt="Hero background" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#0a514f]/80" />
      </div>
      <div className="relative px-10 pt-14 pb-24 text-white">
        <div className="flex items-center justify-between gap-6">
          <div className="flex flex-col gap-4">
            {data.eyebrow && (
              <span className="text-sm font-semibold tracking-[0.3em] uppercase text-white/70">
                {data.eyebrow}
              </span>
            )}
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">{data.title}</h1>
            {data.subtitle && <p className="text-base max-w-xl text-white/70">{data.subtitle}</p>}
          </div>
          {data.topRightLabel && (
            <div className="hidden lg:flex items-center gap-3 text-sm font-medium text-white/80">
              <ArrowUp className="w-4 h-4" />
              <span>{data.topRightLabel}</span>
            </div>
          )}
        </div>
      </div>
      <div className="h-16 bg-white" style={{ clipPath: 'polygon(0 35%, 100% 0, 100% 100%, 0% 100%)' }} />
    </div>
  )
}

export const BannerPlugin: BlockPlugin<BannerData> = {
  type: 'banner',
  label: 'Banner',
  version: 1,
  schema: BannerSchema,
  defaultData: {
    eyebrow: '第 1 课，共 4 课',
    title: '标题',
    subtitle: '',
    bgImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80',
    topRightLabel: '返回模块',
  },
  Render: BannerRender,
  Inspector: ({ value, onChange }) => {
    const form = useForm<BannerData>({
      resolver: zodResolver(BannerSchema),
      defaultValues: value,
      mode: 'onChange',
    })

    useEffect(() => {
      const sub = form.watch((vals) => {
        onChange(vals as BannerData)
      })
      return () => sub.unsubscribe()
    }, [form, onChange])

    return (
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="eyebrow">眉题</Label>
          <Input id="eyebrow" placeholder="第 1 课" {...form.register('eyebrow')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">标题</Label>
          <Input id="title" placeholder="请输入标题" {...form.register('title', { required: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">副标题</Label>
          <Input id="subtitle" placeholder="补充说明" {...form.register('subtitle')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bgImage">背景图 URL</Label>
          <Input id="bgImage" placeholder="https://..." {...form.register('bgImage', { required: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="topRightLabel">右上角标签</Label>
          <Input id="topRightLabel" placeholder="返回模块" {...form.register('topRightLabel')} />
        </div>
      </form>
    )
  },
}
