export type ActivityDocument = {
  id: string
  title: string
  cover?: string
  meta?: { grade?: string; durationMin?: number; tags?: string[] }
  lessons: Lesson[]
}

export type Lesson = {
  id: string
  title: string
  outline?: string
  sections: Section[]
}

export type Section = {
  id: string
  title?: string
  layout?: 'single' | 'two-col' | 'full'
  blocks: BlockNode[]
}

export type BlockNode = {
  id: string
  type: string // e.g., 'banner' | 'section-card' | 'image-with-text'
  version?: number
  visibility?: Visibility
  data: unknown // constrained by specific Block zod schema
}

export type Visibility = {
  roles?: string[]
  locale?: string[]
}
