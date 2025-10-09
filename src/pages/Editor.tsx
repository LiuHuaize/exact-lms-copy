import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { BlockNode, Section } from '@/content/types'
import { LessonRenderer } from '@/renderers/LessonRenderer'
import { BlockRegistry, type BlockPlugin } from '@/content/registry'
import { validateLessonDocument, type LessonDocument } from '@/content/schema'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'

type SelectedRef = {
  sectionIndex: number
  blockIndex: number
}

const Editor: React.FC = () => {
  const { lessonId } = useParams()
  const [doc, setDoc] = useState<LessonDocument | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [selected, setSelected] = useState<SelectedRef | null>(null)

  const contentPath = `/content/${lessonId ?? 'lesson-001'}.json`

  useEffect(() => {
    fetch(contentPath)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json: unknown) => {
        const result = validateLessonDocument(json)
        if (!result.success) {
          console.group('[Editor] Lesson JSON validation issues')
          result.issues.forEach((i) => console.warn(`${i.level.toUpperCase()}: ${i.message}`, i.path))
          console.groupEnd()
        }
        if (result.data) {
          setDoc(result.data)
          setSections(result.data.sections)
        } else {
          type MaybeLesson = { id?: string; title?: string; sections?: unknown }
          const maybe = json as MaybeLesson
          if (Array.isArray(maybe.sections)) {
            setDoc({ id: maybe.id ?? 'unknown', title: maybe.title ?? '', sections: maybe.sections as Section[] })
            setSections(maybe.sections as Section[])
          }
        }
      })
      .catch((err) => console.error('[Editor] Failed to load lesson JSON', err))
  }, [contentPath])

  const selectedBlock: { node: BlockNode; plugin?: BlockPlugin<unknown> } | null = useMemo(() => {
    if (!selected) return null
    const s = sections[selected.sectionIndex]
    if (!s) return null
    const node = s.blocks[selected.blockIndex]
    if (!node) return null
    const plugin = BlockRegistry[node.type]
    return { node: node as BlockNode, plugin }
  }, [selected, sections])

  const updateSelectedBlockData = (nextData: unknown) => {
    if (!selected) return
    setSections((prev) =>
      prev.map((sec, si) =>
        si !== selected.sectionIndex
          ? sec
          : {
              ...sec,
              blocks: sec.blocks.map((b, bi) => (bi === selected.blockIndex ? { ...b, data: nextData } : b)),
            }
      )
    )
  }

  const selectedId = selected ? sections[selected.sectionIndex]?.blocks[selected.blockIndex]?.id : undefined
  const idIndexMap = useMemo(() => {
    const map = new Map<string, SelectedRef>()
    sections.forEach((sec, si) => sec.blocks.forEach((b, bi) => map.set(b.id, { sectionIndex: si, blockIndex: bi })))
    return map
  }, [sections])

  const handleSelectById = (id: string) => {
    const ref = idIndexMap.get(id)
    if (ref) setSelected(ref)
  }

  const pluginList = useMemo(() => Object.values(BlockRegistry), [])
  const [newType, setNewType] = useState<string>(() => pluginList[0]?.type ?? '')

  const genId = (type: string) => `${type}-${Math.random().toString(36).slice(2, 8)}`

  const handleInsert = () => {
    const plugin = BlockRegistry[newType]
    if (!plugin) return
    const node: BlockNode = {
      id: genId(plugin.type),
      type: plugin.type,
      version: plugin.version,
      data: JSON.parse(JSON.stringify(plugin.defaultData)) as unknown,
    }
    setSections((prev) => {
      if (!selected) {
        if (prev.length === 0) return prev
        const first = { ...prev[0], blocks: [node, ...prev[0].blocks] }
        return [first, ...prev.slice(1)]
      }
      return prev.map((sec, si) => {
        if (si !== selected.sectionIndex) return sec
        const blocks = [...sec.blocks]
        blocks.splice(selected.blockIndex + 1, 0, node)
        return { ...sec, blocks }
      })
    })
  }

  const removeSelected = () => {
    if (!selected) return
    const { sectionIndex, blockIndex } = selected
    setSections((prev) =>
      prev.map((sec, si) =>
        si !== sectionIndex ? sec : { ...sec, blocks: sec.blocks.filter((_, bi) => bi !== blockIndex) }
      )
    )
    setSelected(null)
  }

  const moveSelected = (dir: -1 | 1) => {
    if (!selected) return
    setSections((prev) =>
      prev.map((sec, si) => {
        if (si !== selected.sectionIndex) return sec
        const blocks = [...sec.blocks]
        const from = selected.blockIndex
        const to = from + dir
        if (to < 0 || to >= blocks.length) return sec
        const [item] = blocks.splice(from, 1)
        blocks.splice(to, 0, item)
        return { ...sec, blocks }
      })
    )
    setSelected((sel) => (sel ? { ...sel, blockIndex: sel.blockIndex + dir } : sel))
  }

  const addSection = () => {
    const id = `sec-${Math.random().toString(36).slice(2, 6)}`
    setSections((prev) => [...prev, { id, title: undefined, layout: 'full', blocks: [] }])
  }

  const moveSection = (index: number, dir: -1 | 1) => {
    setSections((prev) => {
      const next = [...prev]
      const to = index + dir
      if (to < 0 || to >= next.length) return prev
      const [item] = next.splice(index, 1)
      next.splice(to, 0, item)
      return next
    })
    setSelected((sel) => (sel && sel.sectionIndex === index ? { ...sel, sectionIndex: sel.sectionIndex + dir } : sel))
  }

  const deleteSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index))
    setSelected((sel) => (sel && sel.sectionIndex === index ? null : sel))
  }

  const exportJson = () => {
    const name = `${lessonId ?? doc?.id ?? 'lesson'}.json`
    const payload: LessonDocument = {
      id: doc?.id ?? (lessonId ?? 'lesson'),
      title: doc?.title ?? '',
      sections,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }

  // Import JSON
  const handleImport = (file: File) => {
    file
      .text()
      .then((txt) => {
        const json = JSON.parse(txt)
        const result = validateLessonDocument(json)
        if (!result.success) {
          console.group('[Editor] Imported JSON validation issues')
          result.issues.forEach((i) => console.warn(`${i.level.toUpperCase()}: ${i.message}`, i.path))
          console.groupEnd()
        }
        if (result.data) {
          setDoc(result.data)
          setSections(result.data.sections)
          setSelected(null)
        }
      })
      .catch((e) => console.error('[Editor] Import failed', e))
  }

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      <header className="bg-white border-b">
        <div className="px-6 py-3 flex items-center gap-3 justify-between">
          <div className="font-semibold">课程编辑 · {doc?.title ?? lessonId}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={`/activities/${doc?.id ?? lessonId ?? 'demo'}/learn`} target="_blank" rel="noreferrer">
                学生视角预览
              </a>
            </Button>
            <label className="inline-flex items-center">
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.currentTarget.files?.[0]
                  if (f) handleImport(f)
                  e.currentTarget.value = ''
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => (e.currentTarget.previousElementSibling as HTMLInputElement)?.click()}
              >
                导入 JSON 文件
              </Button>
            </label>
            <Button variant="default" size="sm" onClick={exportJson}>
              下载 JSON 文件
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Outline */}
        <aside className="w-[320px] bg-white h-full overflow-y-auto border-r">
          <div className="px-5 py-4 border-b space-y-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">内容模块</div>
              <p className="text-xs text-muted-foreground">挑选模块后，会插入到当前选中的位置。</p>
            </div>
            <select
              className="w-full rounded-xl border border-muted-foreground/20 bg-white px-3 py-2 text-sm shadow-sm"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            >
              {pluginList.map((p) => (
                <option key={p.type} value={p.type}>
                  {p.label}
                </option>
              ))}
            </select>
            <Button className="w-full gap-2" onClick={handleInsert} disabled={!sections.length}>
              <Plus className="h-4 w-4" /> 插入模块
            </Button>
            <Separator />
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">课程大纲</div>
              <p className="text-xs text-muted-foreground">调整章节顺序或维护章节内容。</p>
            </div>
            <Button variant="outline" className="w-full gap-2" onClick={addSection}>
              <Plus className="h-4 w-4" /> 新增章节
            </Button>
          </div>
          <div className="p-4 space-y-4">
            {sections.map((section, si) => (
              <Card key={section.id} className="bg-muted/40 border-muted-foreground/20 shadow-sm">
                <div className="flex items-start justify-between px-4 py-3">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      章节 {si + 1}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">{section.title ?? '未命名章节'}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => moveSection(si, -1)}
                      disabled={si === 0}
                      aria-label="上移 Section"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => moveSection(si, 1)}
                      disabled={si === sections.length - 1}
                      aria-label="下移 Section"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteSection(si)} aria-label="删除 Section">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="px-4 py-3 space-y-2">
                  {section.blocks.map((b, bi) => {
                    const isActive = selected?.sectionIndex === si && selected?.blockIndex === bi
                    const plugin = BlockRegistry[b.type]
                    return (
                      <button
                        key={b.id}
                        className={`w-full text-left rounded-xl border px-3 py-2 transition ${
                          isActive
                            ? 'border-clover-green bg-clover-green/10 text-foreground shadow-sm'
                            : 'border-transparent bg-white hover:border-muted-foreground/30'
                        }`}
                        onClick={() => setSelected({ sectionIndex: si, blockIndex: bi })}
                      >
                        <div className="text-sm font-medium">{plugin?.label ?? b.type}</div>
                        <div className="text-xs text-muted-foreground truncate">{b.id}</div>
                      </button>
                    )
                  })}
                  {section.blocks.length === 0 && (
                    <div className="text-xs text-muted-foreground">本章节暂时没有内容，点击上方按钮插入模块。</div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex-1 h-full overflow-y-auto p-6">
          <div className="space-y-6">
            <LessonRenderer sections={sections} selectedId={selectedId} onSelectBlock={handleSelectById} />
          </div>
        </main>

        {/* Inspector */}
        <aside className="w-[360px] bg-white h-full overflow-y-auto border-l">
          <div className="px-4 py-3 text-sm font-semibold text-muted-foreground">内容设置</div>
          <Separator />
          <div className="p-4">
            {!selectedBlock && <div className="text-sm text-muted-foreground">请先在左侧选择一个模块，右侧才可编辑内容。</div>}
            {selectedBlock && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{selectedBlock.plugin?.label ?? selectedBlock.node.type}</div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => moveSelected(-1)} aria-label="上移模块">
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => moveSelected(1)} aria-label="下移模块">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={removeSelected} aria-label="删除模块">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {selectedBlock.plugin?.Inspector ? (
                  <selectedBlock.plugin.Inspector value={selectedBlock.node.data} onChange={updateSelectedBlockData} />
                ) : (
                  <div className="text-xs text-muted-foreground">此模块暂未提供 Inspector。</div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Editor
