import React from 'react'
import { z } from 'zod'
import type { BlockPlugin } from '@/content/registry'

export const ImageWithListSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  items: z.array(z.string()).min(1),
  image: z.object({
    url: z.string().url(),
    alt: z.string().optional(),
  }),
  caption: z.string().optional(),
})

export type ImageWithListData = z.infer<typeof ImageWithListSchema>

const ImageWithListRender: React.FC<{ data: ImageWithListData }> = ({ data }) => {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-10 grid lg:grid-cols-[1fr_minmax(280px,320px)] gap-12 items-center">
      <div>
        {data.eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-clover-green">
            {data.eyebrow}
          </span>
        )}
        <h2 className="text-2xl font-semibold text-foreground mb-6">{data.title}</h2>
        {data.description && <p className="text-base text-muted-foreground mb-6">{data.description}</p>}
        <ul className="space-y-4 text-base text-muted-foreground">
          {data.items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-clover-green" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <figure className="space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-lg">
          <div className="aspect-square">
            <img src={data.image.url} alt={data.image.alt ?? ''} className="h-full w-full object-cover" />
          </div>
        </div>
        {data.caption && (
          <figcaption className="text-base leading-relaxed text-muted-foreground border-l-2 border-clover-green/70 pl-5">
            {data.caption}
          </figcaption>
        )}
      </figure>
    </div>
  )
}

export const ImageWithListPlugin: BlockPlugin<ImageWithListData> = {
  type: 'image-with-list',
  label: 'Image with List',
  version: 1,
  schema: ImageWithListSchema,
  defaultData: {
    eyebrow: '模块分类',
    title: '标题',
    description: '',
    items: ['要点 A', '要点 B', '要点 C'],
    image: {
      url: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=900&q=80',
      alt: '',
    },
    caption: '',
  },
  Render: ImageWithListRender,
}
