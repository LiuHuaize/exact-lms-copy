import React, { useEffect } from 'react'
import { z } from 'zod'
import type { BlockPlugin } from '@/content/registry'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

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
  label: '拖拽匹配',
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
  Inspector: ({ value, onChange }) => {
    const form = useForm<DragMatchData>({
      resolver: zodResolver(DragMatchSchema),
      defaultValues: value,
      mode: 'onChange',
    })

    const options = useFieldArray({ control: form.control, name: 'options' })
    const targets = useFieldArray({ control: form.control, name: 'targets' })

    useEffect(() => {
      const subscription = form.watch((vals) => onChange(vals as DragMatchData))
      return () => subscription.unsubscribe()
    }, [form, onChange])

    const targetList = form.watch('targets')

    const appendTarget = () => {
      targets.append({
        id: `target-${Math.random().toString(36).slice(2, 6)}`,
        title: '新目标',
        description: '描述',
      })
    }

    const appendOption = () => {
      const fallbackTargetId = targetList?.[0]?.id ?? ''
      options.append({
        id: `option-${Math.random().toString(36).slice(2, 6)}`,
        label: '新的选项',
        targetId: fallbackTargetId,
      })
    }

    return (
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="eyebrow">眉题</Label>
          <Input id="eyebrow" placeholder="如：拖拽练习" {...form.register('eyebrow')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">标题</Label>
          <Input id="title" placeholder="请输入练习标题" {...form.register('title', { required: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">描述</Label>
          <Textarea id="description" rows={3} placeholder="告诉老师如何完成这个匹配题" {...form.register('description')} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>目标列表（拖放区域）</Label>
            <Button type="button" size="sm" variant="outline" onClick={appendTarget}>
              添加目标
            </Button>
          </div>
          <div className="space-y-3">
            {targets.fields.map((field, idx) => (
              <div key={field.id} className="rounded-md border p-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor={`targets.${idx}.id`}>目标 ID</Label>
                    <Input
                      id={`targets.${idx}.id`}
                      placeholder="需唯一，例如 target-1"
                      {...form.register(`targets.${idx}.id` as const, { required: true })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`targets.${idx}.title`}>标题</Label>
                    <Input
                      id={`targets.${idx}.title`}
                      placeholder="例如：行动阶段"
                      {...form.register(`targets.${idx}.title` as const, { required: true })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`targets.${idx}.description`}>描述</Label>
                  <Textarea
                    id={`targets.${idx}.description`}
                    rows={2}
                    placeholder="提示学员拖入正确选项后看到的内容"
                    {...form.register(`targets.${idx}.description` as const, { required: true })}
                  />
                </div>
                <div className="flex items-center justify-end">
                  <Button type="button" variant="ghost" onClick={() => targets.remove(idx)}>
                    删除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>选项列表（可拖动元素）</Label>
            <Button type="button" size="sm" variant="outline" onClick={appendOption}>
              添加选项
            </Button>
          </div>
          <div className="space-y-3">
            {options.fields.map((field, idx) => (
              <div key={field.id} className="rounded-md border p-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor={`options.${idx}.id`}>选项 ID</Label>
                    <Input
                      id={`options.${idx}.id`}
                      placeholder="需唯一，例如 option-1"
                      {...form.register(`options.${idx}.id` as const, { required: true })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`options.${idx}.label`}>显示文字</Label>
                    <Input
                      id={`options.${idx}.label`}
                      placeholder="例如：准备文案素材"
                      {...form.register(`options.${idx}.label` as const, { required: true })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`options.${idx}.targetId`}>对应目标 ID</Label>
                  <select
                    id={`options.${idx}.targetId`}
                    className="w-full border rounded-md px-3 py-2"
                    {...form.register(`options.${idx}.targetId` as const, { required: true })}
                  >
                    <option value="">请选择目标</option>
                    {targetList?.map((target, tIdx) => (
                      <option key={`${target.id}-${tIdx}`} value={target.id}>
                        {target.id}（{target.title || '未命名'}）
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-end">
                  <Button type="button" variant="ghost" onClick={() => options.remove(idx)}>
                    删除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="successMessage">正确反馈</Label>
          <Textarea
            id="successMessage"
            rows={2}
            placeholder="学员匹配正确后看到的反馈"
            {...form.register('successMessage', { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="failureMessage">错误反馈</Label>
          <Textarea
            id="failureMessage"
            rows={2}
            placeholder="学员匹配错误时的提醒"
            {...form.register('failureMessage', { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="footerNote">页脚提示</Label>
          <Textarea id="footerNote" rows={2} placeholder="可选：补充提醒或总结" {...form.register('footerNote')} />
        </div>
      </form>
    )
  },
}
