import React, { useEffect } from 'react'
import { z } from 'zod'
import type { BlockPlugin } from '@/content/registry'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export const RichTextSchema = z.object({
  content: z.string().min(1),
  align: z.enum(['left', 'center']).default('left'),
  maxWidth: z.enum(['sm', 'md', 'lg', 'xl']).default('lg'),
})

export type RichTextData = z.infer<typeof RichTextSchema>

const MAX_WIDTH_CLASS: Record<RichTextData['maxWidth'], string> = {
  sm: 'max-w-2xl',
  md: 'max-w-3xl',
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
}

const renderInline = (text: string) => {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
  return tokens.filter(Boolean).map((token, index) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      )
    }
    if (token.startsWith('*') && token.endsWith('*')) {
      return (
        <em key={index} className="italic text-muted-foreground">
          {token.slice(1, -1)}
        </em>
      )
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code
          key={index}
          className="rounded-md bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground"
        >
          {token.slice(1, -1)}
        </code>
      )
    }
    return <React.Fragment key={index}>{token}</React.Fragment>
  })
}

const renderBlock = (block: string, index: number) => {
  const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
  if (lines.length === 0) return null

  const isList = lines.every((line) => line.startsWith('- '))
  if (isList) {
    return (
      <ul key={index} className="list-disc space-y-2 pl-6 text-muted-foreground">
        {lines.map((item, itemIdx) => (
          <li key={itemIdx}>{renderInline(item.replace(/^-\s*/, ''))}</li>
        ))}
      </ul>
    )
  }

  const headingMatch = lines[0].match(/^(#{1,3})\s+(.*)$/)
  if (headingMatch) {
    const level = headingMatch[1].length
    const headingText = headingMatch[2]
    const rest = lines.slice(1).join(' ')
    if (level === 1) {
      return (
        <div key={index} className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">
            {renderInline(headingText)}
          </h2>
          {rest && <p className="text-lg text-muted-foreground">{renderInline(rest)}</p>}
        </div>
      )
    }
    if (level === 2) {
      return (
        <div key={index} className="space-y-2">
          <h3 className="text-2xl font-semibold text-foreground">
            {renderInline(headingText)}
          </h3>
          {rest && <p className="text-muted-foreground">{renderInline(rest)}</p>}
        </div>
      )
    }
    return (
      <div key={index} className="space-y-2">
        <h4 className="text-xl font-semibold text-foreground">
          {renderInline(headingText)}
        </h4>
        {rest && <p className="text-muted-foreground">{renderInline(rest)}</p>}
      </div>
    )
  }

  return (
    <p key={index} className="text-base leading-relaxed text-muted-foreground">
      {renderInline(lines.join(' '))}
    </p>
  )
}

const RichTextRender: React.FC<{ data: RichTextData }> = ({ data }) => {
  const blocks = data.content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  return (
    <div
      className={cn(
        'space-y-6',
        MAX_WIDTH_CLASS[data.maxWidth],
        'mx-auto',
        data.align === 'center' && 'text-center [&_ul]:mx-auto [&_ul]:list-inside'
      )}
    >
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  )
}

export const RichTextPlugin: BlockPlugin<RichTextData> = {
  type: 'rich-text',
  label: '富文本内容',
  version: 1,
  schema: RichTextSchema,
  defaultData: {
    content: '# 小节标题\n\n这是正文段落，可以使用 **加粗**、*斜体* 或 `代码` 高亮。',
    align: 'left',
    maxWidth: 'lg',
  },
  Render: RichTextRender,
  Inspector: ({ value, onChange }) => {
    const form = useForm<RichTextData>({ resolver: zodResolver(RichTextSchema), defaultValues: value, mode: 'onChange' })
    useEffect(() => {
      const sub = form.watch((vals) => onChange(vals as RichTextData))
      return () => sub.unsubscribe()
    }, [form, onChange])

    return (
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="content">内容（支持简化 Markdown 标记）</Label>
          <Textarea id="content" rows={8} {...form.register('content', { required: true })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="align">对齐</Label>
            <select id="align" className="w-full border rounded-md px-3 py-2" {...form.register('align')}>
              <option value="left">居左</option>
              <option value="center">居中</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxWidth">最大宽度</Label>
            <select id="maxWidth" className="w-full border rounded-md px-3 py-2" {...form.register('maxWidth')}>
              <option value="sm">sm</option>
              <option value="md">md</option>
              <option value="lg">lg</option>
              <option value="xl">xl</option>
            </select>
          </div>
        </div>
      </form>
    )
  },
}
