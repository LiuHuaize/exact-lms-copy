import { z } from 'zod'
import type { Section, BlockNode } from '@/content/types'
import { BlockRegistry } from '@/content/registry'

// Base shapes for lesson JSON used in the app during development
export const VisibilitySchema = z
  .object({ roles: z.array(z.string()).optional(), locale: z.array(z.string()).optional() })
  .partial()

export const BlockNodeBaseSchema = z.object({
  id: z.string(),
  type: z.string(),
  version: z.number().optional(),
  visibility: VisibilitySchema.optional(),
  data: z.unknown(),
})

export const SectionSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  layout: z.enum(['single', 'two-col', 'full']).optional(),
  visibility: VisibilitySchema.optional(),
  blocks: z.array(BlockNodeBaseSchema),
})

export const LessonDocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  sections: z.array(SectionSchema),
})

export type LessonDocument = z.infer<typeof LessonDocumentSchema>

export type ValidationIssue = {
  level: 'error' | 'warn'
  message: string
  path?: string
}

export type LessonValidationResult = {
  success: boolean
  data?: LessonDocument
  issues: ValidationIssue[]
}

export function validateLessonDocument(input: unknown): LessonValidationResult {
  const issues: ValidationIssue[] = []
  const parsed = LessonDocumentSchema.safeParse(input)
  if (!parsed.success) {
    issues.push({ level: 'error', message: 'Lesson document shape invalid', path: 'root' })
    parsed.error.issues.forEach((iss) => {
      issues.push({ level: 'error', message: iss.message, path: iss.path.join('.') })
    })
    return { success: false, issues }
  }

  const doc = parsed.data

  for (const [sidx, section] of doc.sections.entries()) {
    for (const [bidx, block] of section.blocks.entries()) {
      const pathPrefix = `sections[${sidx}].blocks[${bidx}]`
      const plugin = BlockRegistry[block.type]
      if (!plugin) {
        issues.push({ level: 'error', message: `Unknown block type: ${block.type}`, path: `${pathPrefix}.type` })
        continue
      }
      // Version/migration awareness (no mutation to source data here)
      const nodeVersion = block.version ?? 1
      const rawData = plugin.migrate && nodeVersion < plugin.version ? plugin.migrate(block.data) : block.data
      const dataParsed = plugin.schema.safeParse(rawData)
      if (!dataParsed.success) {
        issues.push({ level: 'error', message: `Block data invalid for type ${block.type}`, path: `${pathPrefix}.data` })
        dataParsed.error.issues.forEach((iss) => {
          issues.push({ level: 'error', message: iss.message, path: `${pathPrefix}.data.${iss.path.join('.')}` })
        })
      }
    }
  }

  return { success: issues.every((i) => i.level !== 'error'), data: doc, issues }
}

// Convenience helper to validate only sections (when the outer container is not available)
export function validateSections(sections: unknown): { success: boolean; sections?: Section[]; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = []
  const parsed = z.array(SectionSchema).safeParse(sections)
  if (!parsed.success) {
    issues.push({ level: 'error', message: 'Sections array invalid', path: 'sections' })
    parsed.error.issues.forEach((iss) => issues.push({ level: 'error', message: iss.message, path: `sections.${iss.path.join('.')}` }))
    return { success: false, issues }
  }
  // Reuse full-document block validations
  const doc: LessonDocument = { id: 'temp', title: 'temp', sections: parsed.data }
  const res = validateLessonDocument(doc)
  return { success: res.success, sections: res.data?.sections as Section[], issues: res.issues }
}
