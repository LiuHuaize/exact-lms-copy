import React, { useEffect } from 'react'
import { z } from 'zod'
import type { BlockPlugin } from '@/content/registry'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export const FlipCardsSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  cards: z
    .array(
      z.object({
        prompt: z.string(),
        insight: z.string(),
      })
    )
    .min(1),
})

export type FlipCardsData = z.infer<typeof FlipCardsSchema>

const FlipCardsRender: React.FC<{ data: FlipCardsData }> = ({ data }) => {
  const [flippedState, setFlippedState] = React.useState<Record<number, boolean>>({})

  const toggleFlip = (index: number) => {
    setFlippedState((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return (
    <div className="bg-white rounded-[36px] shadow-xl p-10">
      <div className="space-y-2 mb-10">
        {data.eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-clover-green">
            {data.eyebrow}
          </span>
        )}
        <h3 className="text-2xl font-semibold text-foreground">{data.title}</h3>
        {data.description && (
          <p className="text-sm text-muted-foreground max-w-xl">{data.description}</p>
        )}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.cards.map((card, index) => {
          const flipped = Boolean(flippedState[index])
          return (
            <button
              key={card.prompt}
              onClick={() => toggleFlip(index)}
              className="group h-60 [perspective:1200px]"
            >
              <div
                className={`relative h-full w-full rounded-[28px] border border-muted-foreground/12 bg-gradient-to-br from-white to-white shadow-lg transition-transform duration-500 [transform-style:preserve-3d] ${
                  flipped ? '[transform:rotateY(180deg)]' : ''
                }`}
              >
                <div className="absolute inset-0 flex flex-col justify-between p-6 [backface-visibility:hidden]">
                  <span className="text-sm font-semibold text-clover-green">点击翻转</span>
                  <p className="text-lg font-semibold text-foreground leading-snug">{card.prompt}</p>
                  <span className="text-sm text-muted-foreground">思考 30 秒后再翻转查看提示</span>
                </div>
                <div className="absolute inset-0 flex flex-col justify-between rounded-[28px] bg-[#0a514f] p-6 text-white shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                    灵感提示
                  </span>
                  <p className="text-lg leading-relaxed">{card.insight}</p>
                  <span className="text-xs text-white/60">再次点击可回到问题面</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export const FlipCardsPlugin: BlockPlugin<FlipCardsData> = {
  type: 'flip-cards',
  label: '翻转卡片',
  version: 1,
  schema: FlipCardsSchema,
  defaultData: {
    eyebrow: '互动卡片',
    title: '翻转卡片标题',
    description: '为每张卡片准备提示文案。',
    cards: [
      {
        prompt: '问题 A',
        insight: '灵感提示 A',
      },
    ],
  },
  Render: FlipCardsRender,
  Inspector: ({ value, onChange }) => {
    const form = useForm<FlipCardsData>({
      resolver: zodResolver(FlipCardsSchema),
      defaultValues: value,
      mode: 'onChange',
    })
    const cards = useFieldArray({ control: form.control, name: 'cards' })

    useEffect(() => {
      const subscription = form.watch((vals) => onChange(vals as FlipCardsData))
      return () => subscription.unsubscribe()
    }, [form, onChange])

    const addCard = () => {
      cards.append({
        prompt: '新的问题',
        insight: '对应的提示',
      })
    }

    return (
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="eyebrow">眉题</Label>
          <Input id="eyebrow" placeholder="如：互动卡片" {...form.register('eyebrow')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">标题</Label>
          <Input id="title" placeholder="请输入标题" {...form.register('title', { required: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">描述</Label>
          <Textarea id="description" rows={3} placeholder="说明如何与卡片互动" {...form.register('description')} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>卡片列表</Label>
            <Button type="button" size="sm" variant="outline" onClick={addCard}>
              添加
            </Button>
          </div>
          <div className="space-y-3">
            {cards.fields.map((field, idx) => (
              <div key={field.id} className="rounded-md border p-3 space-y-3">
                <div className="space-y-1">
                  <Label htmlFor={`cards.${idx}.prompt`}>问题面文案</Label>
                  <Textarea
                    id={`cards.${idx}.prompt`}
                    rows={2}
                    placeholder="写给老师/学生的问题"
                    {...form.register(`cards.${idx}.prompt` as const, { required: true })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`cards.${idx}.insight`}>提示面文案</Label>
                  <Textarea
                    id={`cards.${idx}.insight`}
                    rows={2}
                    placeholder="翻转后展示的提示"
                    {...form.register(`cards.${idx}.insight` as const, { required: true })}
                  />
                </div>
                <div className="flex items-center justify-end">
                  <Button type="button" variant="ghost" onClick={() => cards.remove(idx)}>
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
