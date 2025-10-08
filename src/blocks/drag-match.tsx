import React from 'react'
import { z } from 'zod'
import type { BlockPlugin } from '@/content/registry'

export const DragMatchSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  options: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        targetId: z.string(),
      })
    )
    .min(1),
  targets: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
      })
    )
    .min(1),
  successMessage: z.string().default('太棒了！你正确完成了匹配。'),
  failureMessage: z.string().default('再试一次，思考一下这个行动更适合哪个阶段。'),
  footerNote: z.string().optional(),
})

export type DragMatchData = z.infer<typeof DragMatchSchema>

const DragMatchRender: React.FC<{ data: DragMatchData }> = ({ data }) => {
  const [activeDrag, setActiveDrag] = React.useState<string | null>(null)
  const [feedback, setFeedback] = React.useState<string | null>(null)
  const [placedOptions, setPlacedOptions] = React.useState<Record<string, string | null>>(() =>
    data.targets.reduce(
      (acc, target) => {
        acc[target.id] = null
        return acc
      },
      {} as Record<string, string | null>
    )
  )

  const handleDragStart = (id: string) => {
    setActiveDrag(id)
    setFeedback(null)
  }

  const handleDrop = (targetId: string) => {
    if (!activeDrag) return
    const option = data.options.find((opt) => opt.id === activeDrag)
    if (!option) return

    if (option.targetId === targetId) {
      setPlacedOptions((prev) => ({
        ...prev,
        [targetId]: option.label,
      }))
      setFeedback(data.successMessage)
    } else {
      setFeedback(data.failureMessage)
    }
    setActiveDrag(null)
  }

  const usedLabels = React.useMemo(() => new Set(Object.values(placedOptions).filter(Boolean) as string[]), [placedOptions])

  return (
    <div className="bg-white rounded-[36px] shadow-xl p-10 space-y-8">
      <div className="space-y-3">
        {data.eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-clover-green">
            {data.eyebrow}
          </span>
        )}
        <h3 className="text-2xl font-semibold text-foreground">{data.title}</h3>
        {data.description && (
          <p className="text-sm text-muted-foreground max-w-2xl">{data.description}</p>
        )}
      </div>
      <div className="space-y-10">
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3 lg:justify-items-center">
          {data.options.map((option) => {
            const isUsed = usedLabels.has(option.label)
            return (
              <div
                key={option.id}
                draggable={!isUsed}
                onDragStart={() => handleDragStart(option.id)}
                className={`w-full lg:w-auto lg:justify-self-center rounded-full px-6 py-3 text-sm font-medium text-center transition ${
                  isUsed
                    ? 'bg-muted text-muted-foreground border border-dashed border-muted-foreground/30 cursor-not-allowed'
                    : 'bg-white border border-muted-foreground/20 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing'
                }`}
              >
                {option.label}
              </div>
            )
          })}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {data.targets.map((target, index) => (
            <div
              key={target.id}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(target.id)}
              className="rounded-[28px] border-2 border-dashed border-[#0f6a60]/40 bg-[#f6fbf9] px-6 py-8 flex flex-col items-center text-center gap-4 transition hover:border-[#0f6a60]/80"
            >
              <div className="inline-flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#0f6a60]/40 text-sm font-semibold text-[#0f6a60]">
                  {index + 1}
                </span>
                <h4 className="text-base font-semibold text-foreground">{target.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed min-h-[72px] flex items-center justify-center">
                {placedOptions[target.id] ?? target.description}
              </p>
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#0f6a60]">
                拖到这里
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {feedback && (
          <div
            className={`rounded-3xl px-5 py-3 text-sm font-semibold ${
              feedback === data.successMessage
                ? 'bg-clover-green/12 text-clover-green'
                : 'bg-[#fef3c7] text-[#92400e]'
            }`}
          >
            {feedback}
          </div>
        )}
        {data.footerNote && <p className="text-xs text-muted-foreground">{data.footerNote}</p>}
      </div>
    </div>
  )
}

export const DragMatchPlugin: BlockPlugin<DragMatchData> = {
  type: 'drag-match',
  label: 'Drag Match',
  version: 1,
  schema: DragMatchSchema,
  defaultData: {
    eyebrow: '拖拽练习',
    title: '匹配练习标题',
    description: '描述',
    options: [
      { id: 'option-1', label: '选项 1', targetId: 'target-1' },
      { id: 'option-2', label: '选项 2', targetId: 'target-2' },
    ],
    targets: [
      { id: 'target-1', title: '目标 1', description: '目标描述' },
      { id: 'target-2', title: '目标 2', description: '目标描述' },
    ],
    successMessage: '太棒了！你正确完成了匹配。',
    failureMessage: '再试一次，思考一下这个行动更适合哪个阶段。',
    footerNote: '完成练习后记录收获。',
  },
  Render: DragMatchRender,
}
