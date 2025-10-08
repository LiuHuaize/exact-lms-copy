import type { ComponentType } from 'react'
import type { ZodSchema } from 'zod'
import type { BlockNode } from '@/content/types'
import { BannerPlugin } from '@/blocks/banner'
import { SectionCardPlugin } from '@/blocks/section-card'
import { MediaAudioPlugin } from '@/blocks/media-audio'
import { ImageWithTextPlugin } from '@/blocks/image-with-text'
import { MediaVideoPlugin } from '@/blocks/media-video'
import { ImageWithListPlugin } from '@/blocks/image-with-list'
import { FlipCardsPlugin } from '@/blocks/flip-cards'
import { DragMatchPlugin } from '@/blocks/drag-match'
import { AccordionTipsPlugin } from '@/blocks/accordion-tips'
import { RichTextPlugin } from '@/blocks/rich-text'

export type BlockPlugin<T> = {
  type: string
  label: string
  icon?: ComponentType
  version: number
  schema: ZodSchema<T>
  defaultData: T
  Render: React.FC<{ data: T }>
  Inspector?: React.FC<{ value: T; onChange: (next: T) => void }>
  migrate?: (old: unknown) => T
}

export const BlockRegistry: Record<string, BlockPlugin<unknown>> = {
  [BannerPlugin.type]: BannerPlugin,
  [SectionCardPlugin.type]: SectionCardPlugin,
  [MediaAudioPlugin.type]: MediaAudioPlugin,
  [ImageWithTextPlugin.type]: ImageWithTextPlugin,
  [MediaVideoPlugin.type]: MediaVideoPlugin,
  [ImageWithListPlugin.type]: ImageWithListPlugin,
  [FlipCardsPlugin.type]: FlipCardsPlugin,
  [DragMatchPlugin.type]: DragMatchPlugin,
  [AccordionTipsPlugin.type]: AccordionTipsPlugin,
  [RichTextPlugin.type]: RichTextPlugin,
}

export function getPluginFor(node: BlockNode): BlockPlugin<unknown> | undefined {
  return BlockRegistry[node.type]
}
