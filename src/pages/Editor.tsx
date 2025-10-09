import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { BlockNode, Section } from '@/content/types'
import { LessonRenderer } from '@/renderers/LessonRenderer'
import { BlockRegistry, type BlockPlugin } from '@/content/registry'
import { validateLessonDocument, type LessonDocument } from '@/content/schema'
import { lessonManifest, resolveLessonAsset } from '@/content/lessonManifest'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'

type SelectedRef = {
  sectionIndex: number
  blockIndex: number
}

const Editor: React.FC = () => {
  const { lessonId } = useParams()
  const [doc, setDoc] = useState<LessonDocument | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [selected, setSelected] = useState<SelectedRef | null>(null)
  const [focusedSectionIndex, setFocusedSectionIndex] = useState<number | null>(null)

  const fallbackLesson = lessonManifest[0]
  const fallbackLessonId = fallbackLesson?.id ?? 'lesson-001'
  const normalizedLessonId = typeof lessonId === 'string' ? lessonId.trim() : ''

  const fetchCandidates = useMemo(() => {
    const seen = new Set<string>()
    const entries: { lessonId: string; url: string }[] = []

    const push = (idValue: string, url?: string) => {
      if (!idValue || !url || seen.has(url)) return
      seen.add(url)
      entries.push({ lessonId: idValue, url })
    }

    if (normalizedLessonId) {
      push(normalizedLessonId, resolveLessonAsset(normalizedLessonId))
      push(normalizedLessonId, `/content/${normalizedLessonId}.json`)
    }

    if (fallbackLesson) {
      push(fallbackLesson.id, fallbackLesson.assetUrl)
      push(fallbackLesson.id, `/content/${fallbackLesson.id}.json`)
    }

    return entries
  }, [fallbackLesson, normalizedLessonId])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      for (const candidate of fetchCandidates) {
        try {
          const res = await fetch(candidate.url)
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`)
          }
          const json: unknown = await res.json()
          const result = validateLessonDocument(json)
          if (!result.success) {
            console.group('[Editor] Lesson JSON validation issues')
            result.issues.forEach((i) => console.warn(`${i.level.toUpperCase()}: ${i.message}`, i.path))
            console.groupEnd()
          }

          if (cancelled) return

          if (result.data) {
            setDoc(result.data)
            setSections(result.data.sections)
            console.info('[Editor] Lesson JSON loaded', { source: candidate.url, lessonId: result.data.id })
            return
          }

          type MaybeLesson = { id?: string; title?: string; sections?: unknown }
          const maybe = json as MaybeLesson
          if (Array.isArray(maybe.sections) && !cancelled) {
            const fallbackDoc: LessonDocument = {
              id: maybe.id ?? candidate.lessonId ?? 'unknown',
              title: maybe.title ?? '',
              sections: maybe.sections as Section[],
            }
            setDoc(fallbackDoc)
            setSections(fallbackDoc.sections)
            console.info('[Editor] Loaded lesson JSON with relaxed shape', {
              source: candidate.url,
              lessonId: fallbackDoc.id,
            })
            return
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error))
          console.warn('[Editor] Failed to load lesson JSON candidate', { candidate, error: err })
        }
      }

      if (!cancelled) {
        console.error('[Editor] Exhausted all lesson JSON candidates without success', fetchCandidates)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [fetchCandidates])

  useEffect(() => {
    if (!sections.length) {
      setFocusedSectionIndex(null)
      return
    }
    setFocusedSectionIndex((prev) => {
      if (prev !== null && prev >= 0 && prev < sections.length) {
        return prev
      }
      return 0
    })
  }, [sections])

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
    if (ref) {
      setFocusedSectionIndex(ref.sectionIndex)
      setSelected(ref)
    }
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
    if (selected) {
      setFocusedSectionIndex(selected.sectionIndex)
    } else {
      setFocusedSectionIndex((prev) => (prev !== null ? prev : 0))
    }
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
    setSelected(null)
    setFocusedSectionIndex(sections.length)
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
    setFocusedSectionIndex((prev) => {
      if (prev === null) return prev
      if (prev === index) return index + dir
      if (prev === index + dir) return prev - dir
      return prev
    })
  }

  const deleteSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index))
    setSelected((sel) => (sel && sel.sectionIndex === index ? null : sel))
    setFocusedSectionIndex((prev) => {
      if (prev === null) return prev
      if (prev === index) return null
      if (prev > index) return prev - 1
      return prev
    })
  }

  const exportJson = () => {
    const inferredId = (doc?.id ?? normalizedLessonId) || fallbackLessonId || 'lesson'
    const name = `${inferredId}.json`
    const payload: LessonDocument = {
      id: inferredId,
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

  const updateSectionMeta = (sectionIndex: number, updates: Partial<Section>) => {
    setSections((prev) => {
      let mutated = false
      const nextSections = prev.map((sec, si) => {
        if (si !== sectionIndex) return sec

        let result = sec
        const ensureClone = () => {
          if (result === sec) {
            result = { ...sec }
          }
        }

        if ('title' in updates) {
          const nextTitle = updates.title
          const currentTitle = 'title' in sec ? sec.title : undefined
          if (currentTitle !== nextTitle) {
            ensureClone()
            if (nextTitle === undefined || nextTitle === '') {
              delete result.title
            } else {
              result.title = nextTitle
            }
            mutated = true
          }
        }

        if ('layout' in updates) {
          const nextLayout = updates.layout
          if (sec.layout !== nextLayout) {
            ensureClone()
            if (!nextLayout) {
              delete result.layout
            } else {
              result.layout = nextLayout
            }
            mutated = true
          }
        }

        if ('visibility' in updates) {
          const nextVisibility = normalizeVisibility(updates.visibility)
          const currentVisibility = normalizeVisibility(sec.visibility)
          if (!visibilityEqual(nextVisibility, currentVisibility)) {
            ensureClone()
            if (nextVisibility) {
              result.visibility = nextVisibility
            } else {
              delete result.visibility
            }
            mutated = true
          }
        }

        return result
      })

      return mutated ? nextSections : prev
    })
  }

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      <header className="bg-white border-b">
        <div className="px-6 py-3 flex items-center gap-3 justify-between">
          <div className="font-semibold">
            课程编辑 · {doc?.title || doc?.id || normalizedLessonId || fallbackLessonId || '未命名课程'}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a
                href={`/activities/${(doc?.id ?? normalizedLessonId) || fallbackLessonId || 'demo'}/learn`}
                target="_blank"
                rel="noreferrer"
              >
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
              <Card
                key={section.id}
                className={`bg-muted/40 border-muted-foreground/20 shadow-sm ${
                  focusedSectionIndex === si ? 'border-clover-green ring-1 ring-clover-green/20' : ''
                }`}
              >
                <div className="flex items-start justify-between px-4 py-3">
                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      章节 {si + 1}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">{section.title ?? '未命名章节'}</div>
                    <Button
                      variant={focusedSectionIndex === si ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => {
                        setFocusedSectionIndex(si)
                        setSelected(null)
                      }}
                    >
                      编辑章节
                    </Button>
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
                        onClick={() => {
                          setFocusedSectionIndex(si)
                          setSelected({ sectionIndex: si, blockIndex: bi })
                        }}
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
          <div className="px-4 py-3 text-sm font-semibold text-muted-foreground">章节与内容设置</div>
          <Separator />
          <div className="p-4 space-y-6">
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">章节设置</div>
              {focusedSectionIndex !== null && sections[focusedSectionIndex] ? (
                <SectionInspector
                  key={sections[focusedSectionIndex].id}
                  section={sections[focusedSectionIndex]}
                  onChange={(updates) => updateSectionMeta(focusedSectionIndex, updates)}
                />
              ) : (
                <div className="text-sm text-muted-foreground">请选择或新增章节进行编辑。</div>
              )}
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">模块内容</div>
              {!selectedBlock && (
                <div className="text-sm text-muted-foreground">在左侧选择模块后，可在此调整其内容。</div>
              )}
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
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Editor

type SectionInspectorValues = {
  title: string
  layout: '' | 'single' | 'two-col' | 'full'
  roles: string
  locale: string
}

const normalizeVisibility = (
  visibility: Section['visibility'] | undefined
): Section['visibility'] | undefined => {
  if (!visibility) return undefined
  const roles = visibility.roles?.map((role) => role.trim()).filter(Boolean)
  const locale = visibility.locale?.map((loc) => loc.trim()).filter(Boolean)
  const hasRoles = Boolean(roles && roles.length)
  const hasLocale = Boolean(locale && locale.length)
  if (!hasRoles && !hasLocale) return undefined
  const result: Section['visibility'] = {}
  if (hasRoles && roles) {
    result.roles = roles
  }
  if (hasLocale && locale) {
    result.locale = locale
  }
  return result
}

const visibilityEqual = (
  a: Section['visibility'] | undefined,
  b: Section['visibility'] | undefined
): boolean => {
  const normA = normalizeVisibility(a)
  const normB = normalizeVisibility(b)
  if (!normA && !normB) return true
  if (!normA || !normB) return false
  const rolesEqual = arrayShallowEqual(normA.roles ?? [], normB.roles ?? [])
  const localesEqual = arrayShallowEqual(normA.locale ?? [], normB.locale ?? [])
  return rolesEqual && localesEqual
}

const arrayShallowEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false
  return a.every((item, index) => item === b[index])
}

const SectionInspector: React.FC<{ section: Section; onChange: (updates: Partial<Section>) => void }> = ({
  section,
  onChange,
}) => {
  const form = useForm<SectionInspectorValues>({
    defaultValues: {
      title: section.title ?? '',
      layout: section.layout ?? '',
      roles: section.visibility?.roles?.join(', ') ?? '',
      locale: section.visibility?.locale?.join(', ') ?? '',
    },
    mode: 'onChange',
  })

  useEffect(() => {
    form.reset({
      title: section.title ?? '',
      layout: section.layout ?? '',
      roles: section.visibility?.roles?.join(', ') ?? '',
      locale: section.visibility?.locale?.join(', ') ?? '',
    })
  }, [section, form])

  useEffect(() => {
    const subscription = form.watch((values) => {
      const title = values.title.trim()
      const layout = values.layout as Section['layout'] | ''
      const roles = values.roles
        .split(',')
        .map((role) => role.trim())
        .filter(Boolean)
      const locales = values.locale
        .split(',')
        .map((loc) => loc.trim())
        .filter(Boolean)
      const visibility = normalizeVisibility({
        roles: roles.length ? roles : undefined,
        locale: locales.length ? locales : undefined,
      })
      onChange({
        title: title ? title : undefined,
        layout: layout ? layout : undefined,
        visibility,
      })
    })
    return () => subscription.unsubscribe()
  }, [form, onChange])

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`section-title-${section.id}`}>章节标题</Label>
        <Input id={`section-title-${section.id}`} placeholder="例如：导入" {...form.register('title')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`section-layout-${section.id}`}>布局</Label>
        <select
          id={`section-layout-${section.id}`}
          className="w-full rounded-xl border border-muted-foreground/20 bg-white px-3 py-2 text-sm shadow-sm"
          {...form.register('layout')}
        >
          <option value="">自动（遵循默认）</option>
          <option value="full">整宽</option>
          <option value="single">单列（中间卡片）</option>
          <option value="two-col">双列布局</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`section-roles-${section.id}`}>可见角色（可选）</Label>
        <Textarea
          id={`section-roles-${section.id}`}
          rows={2}
          placeholder="以逗号分隔，例如：teacher, mentor"
          {...form.register('roles')}
        />
        <p className="text-[11px] text-muted-foreground">留空则对所有角色可见。</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`section-locale-${section.id}`}>适用语言（可选）</Label>
        <Textarea
          id={`section-locale-${section.id}`}
          rows={2}
          placeholder="以逗号分隔，例如：zh-CN, en-US"
          {...form.register('locale')}
        />
        <p className="text-[11px] text-muted-foreground">留空则使用所有语言版本。</p>
      </div>
    </form>
  )
}
