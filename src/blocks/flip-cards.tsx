import React from 'react'
import { z } from 'zod'
import type { BlockPlugin } from '@/content/registry'

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
  label: 'Flip Cards',
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
}
