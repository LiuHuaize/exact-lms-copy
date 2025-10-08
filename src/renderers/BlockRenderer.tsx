import React from 'react'
import { getPluginFor } from '@/content/registry'
import type { BlockNode } from '@/content/types'

export const BlockRenderer: React.FC<{ block: BlockNode }> = ({ block }) => {
  const plugin = getPluginFor(block)
  if (!plugin) return null
  const nodeVersion = block.version ?? 1
  const pluginVersion = plugin.version

  const rawData =
    plugin.migrate && nodeVersion < pluginVersion
      ? plugin.migrate(block.data)
      : block.data

  const parsed = plugin.schema.safeParse(rawData)
  const data = parsed.success ? parsed.data : plugin.defaultData
  const Render = plugin.Render
  return <Render data={data} />
}
