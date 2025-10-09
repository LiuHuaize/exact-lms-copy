import React from 'react'
import type { Section } from '@/content/types'
import { BlockRenderer } from '@/renderers/BlockRenderer'

export const LessonRenderer: React.FC<{ sections: Section[]; selectedId?: string; onSelectBlock?: (id: string) => void }>
  = ({ sections, selectedId, onSelectBlock }) => {
  return (
    <>
      {sections.map((section) => (
        <section key={section.id} className="px-10 py-12">
          <div className="max-w-6xl mx-auto flex flex-col gap-12">
            {section.blocks.map((b) => {
              const isSelected = selectedId === b.id
              return (
                <div
                  key={b.id}
                  className={isSelected ? 'ring-2 ring-clover-green rounded-2xl' : ''}
                  onClick={onSelectBlock ? () => onSelectBlock(b.id) : undefined}
                >
                  <BlockRenderer block={b} />
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </>
  )
}
