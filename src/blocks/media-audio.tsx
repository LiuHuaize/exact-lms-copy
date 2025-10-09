import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import type { BlockPlugin } from '@/content/registry'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { List, Play, Pause, Volume2, ChevronDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const DEFAULT_PLAYBACK_RATES = [0.75, 1, 1.25, 1.5] as const

const formatTime = (input: number) => {
  if (!Number.isFinite(input) || input < 0) return '0:00'
  const totalSeconds = Math.floor(input)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const clampPercent = (input: number) => {
  if (!Number.isFinite(input)) return 0
  return Math.min(100, Math.max(0, input))
}

const normalizePlaybackRates = (input: number[] | undefined) => {
  const fallback = [...DEFAULT_PLAYBACK_RATES]
  if (!Array.isArray(input) || input.length === 0) return fallback
  const cleaned = input
    .map((rate) => (Number.isFinite(rate) ? Number(rate) : null))
    .filter((rate): rate is number => rate !== null && rate >= 0.5 && rate <= 3)
    .map((rate) => Math.round(rate * 100) / 100)

  if (cleaned.length === 0) return fallback

  const uniqueSorted = Array.from(new Set(cleaned)).sort((a, b) => a - b)
  return uniqueSorted
}

const formatPlaybackRateLabel = (rate: number) => {
  if (!Number.isFinite(rate)) return '1x'
  const trimmed = Math.round(rate * 100) / 100
  const formatted = trimmed % 1 === 0 ? trimmed.toFixed(0) : trimmed.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
  return `${formatted}x`
}

const deriveSpeedLabel = (input?: string | null) => {
  if (!input) return '倍速'
  const trimmed = input.trim()
  if (!trimmed) return '倍速'
  if (/^\d+(\.\d+)?x$/i.test(trimmed)) return '倍速'
  return trimmed
}

export const MediaAudioSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  progressPercent: z.number().min(0).max(100).default(0),
  durationLabel: z.string().optional(),
  speedLabel: z.string().optional(),
  listLabel: z.string().optional(),
  primaryActionLabel: z.string().optional(),
  playbackRates: z.array(z.number().min(0.5).max(3)).default([...DEFAULT_PLAYBACK_RATES]),
  audio: z.object({
    src: z.string().url(),
    type: z.string().default('audio/mpeg'),
  }),
})

export type MediaAudioData = z.infer<typeof MediaAudioSchema>

const MediaAudioRender: React.FC<{ data: MediaAudioData }> = ({ data }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [previewTime, setPreviewTime] = useState<number | null>(null)
  const playbackRates = useMemo(() => normalizePlaybackRates(data.playbackRates), [data.playbackRates])
  const [playbackRate, setPlaybackRate] = useState(() => (playbackRates.includes(1) ? 1 : playbackRates[0]))
  const playbackRateRef = useRef(playbackRate)
  const scrubbingRef = useRef(false)
  const lastReportedTimeRef = useRef(0)
  const initialProgressAppliedRef = useRef(false)

  useEffect(() => {
    playbackRateRef.current = playbackRate
    const audioEl = audioRef.current
    if (audioEl) {
      audioEl.playbackRate = playbackRate
    }
  }, [playbackRate])

  useEffect(() => {
    setPlaybackRate((prev) => {
      if (playbackRates.includes(prev)) return prev
      return playbackRates.includes(1) ? 1 : playbackRates[0]
    })
  }, [playbackRates])

  useEffect(() => {
    const audioEl = audioRef.current
    if (!audioEl) return

    initialProgressAppliedRef.current = false

    const applyInitialProgress = () => {
      if (initialProgressAppliedRef.current) return
      if (!audioEl.duration || Number.isNaN(audioEl.duration)) return
      const percent = clampPercent(data.progressPercent ?? 0)
      if (percent <= 0) {
        initialProgressAppliedRef.current = true
        return
      }
      const startTime = (percent / 100) * audioEl.duration
      audioEl.currentTime = startTime
      lastReportedTimeRef.current = startTime
      setCurrentTime(startTime)
      initialProgressAppliedRef.current = true
    }

    const handleLoadedMetadata = () => {
      if (!Number.isNaN(audioEl.duration)) {
        setDuration(audioEl.duration)
        audioEl.playbackRate = playbackRateRef.current
        if (!initialProgressAppliedRef.current) {
          applyInitialProgress()
        }
      }
    }

    const handleTimeUpdate = () => {
      if (scrubbingRef.current) return
      const time = audioEl.currentTime
      if (Math.abs(time - lastReportedTimeRef.current) < 0.05) return
      lastReportedTimeRef.current = time
      setCurrentTime(time)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      lastReportedTimeRef.current = 0
    }

    audioEl.addEventListener('loadedmetadata', handleLoadedMetadata)
    audioEl.addEventListener('durationchange', handleLoadedMetadata)
    audioEl.addEventListener('timeupdate', handleTimeUpdate)
    audioEl.addEventListener('play', handlePlay)
    audioEl.addEventListener('pause', handlePause)
    audioEl.addEventListener('ended', handleEnded)

    audioEl.pause()
    audioEl.currentTime = 0
    setIsPlaying(false)
    setCurrentTime(0)
    lastReportedTimeRef.current = 0
    setDuration(null)
    audioEl.load()

    return () => {
      audioEl.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audioEl.removeEventListener('durationchange', handleLoadedMetadata)
      audioEl.removeEventListener('timeupdate', handleTimeUpdate)
      audioEl.removeEventListener('play', handlePlay)
      audioEl.removeEventListener('pause', handlePause)
      audioEl.removeEventListener('ended', handleEnded)
    }
  }, [data.audio.src, data.progressPercent])

  const togglePlayback = useCallback(async () => {
    const audioEl = audioRef.current
    if (!audioEl) return
    try {
      if (audioEl.paused) {
        audioEl.playbackRate = playbackRateRef.current
        await audioEl.play()
      } else {
        audioEl.pause()
      }
    } catch {
      // ignore autoplay restrictions
    }
  }, [])

  const formattedCurrentTime = useMemo(() => formatTime(currentTime), [currentTime])
  const formattedDuration = useMemo(() => {
    if (data.durationLabel) return data.durationLabel
    if (duration) return formatTime(duration)
    return undefined
  }, [data.durationLabel, duration])
  const buttonLabel = isPlaying ? '暂停音频' : (data.primaryActionLabel ?? '播放音频')
  const sliderMax = duration && Number.isFinite(duration) && duration > 0 ? duration : 1
  const effectiveTime = isScrubbing && previewTime !== null ? previewTime : currentTime
  const safeSliderValue = Math.min(sliderMax, Math.max(0, effectiveTime))
  const percentComplete = sliderMax > 0 ? Math.round((safeSliderValue / sliderMax) * 100) : 0
  const displayCurrentTime = formatTime(isScrubbing && previewTime !== null ? previewTime : currentTime)
  const speedLabelPrefix = useMemo(() => deriveSpeedLabel(data.speedLabel), [data.speedLabel])

  const handleSliderChange = useCallback(
    (value: number[]) => {
      if (!scrubbingRef.current) {
        scrubbingRef.current = true
        setIsScrubbing(true)
      }
      const nextValue = Math.min(sliderMax, Math.max(0, value[0] ?? 0))
      setPreviewTime(nextValue)
    },
    [sliderMax],
  )

  const handleSliderCommit = useCallback(
    (value: number[]) => {
      const audioEl = audioRef.current
      const nextValue = Math.min(sliderMax, Math.max(0, value[0] ?? 0))
      scrubbingRef.current = false
      setIsScrubbing(false)
      setPreviewTime(null)
      lastReportedTimeRef.current = nextValue
      setCurrentTime(nextValue)
      if (audioEl) {
        try {
          audioEl.currentTime = nextValue
        } catch {
          // ignore seek issues
        }
      }
    },
    [sliderMax],
  )

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-muted-foreground/10 bg-white px-8 py-9 shadow-xl">
      <div className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full bg-clover-green/20 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 h-56 w-56 rounded-full bg-clover-green/10 blur-[160px]" />
      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-3">
            {data.eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-clover-green">
                {data.eyebrow}
              </span>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold text-foreground">{data.title}</h2>
              {Number.isFinite(percentComplete) && duration && (
                <span className="rounded-full bg-clover-green/10 px-3 py-1 text-xs font-semibold text-clover-green">
                  {percentComplete}%
                </span>
              )}
            </div>
          </div>
          {data.description && <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{data.description}</p>}
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="h-16 w-16 rounded-full bg-[#0f6a60] text-white shadow-lg transition-transform hover:scale-[1.02] hover:bg-[#0c564d]"
              aria-label={buttonLabel}
              aria-pressed={isPlaying}
              onClick={togglePlayback}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 pl-0.5" />}
            </Button>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                <span>播放进度</span>
                {formattedDuration && <span>{formattedDuration}</span>}
              </div>
              <Slider
                min={0}
                max={sliderMax}
                step={0.1}
                value={[safeSliderValue]}
                onValueChange={handleSliderChange}
                onValueCommit={handleSliderCommit}
                aria-label="音频播放进度"
                aria-valuetext={displayCurrentTime}
                disabled={!duration}
              />
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>{displayCurrentTime}</span>
                <span>{formattedDuration ?? '--:--'}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              <Volume2 className="h-4 w-4 text-clover-green" />
              <span>{data.primaryActionLabel ?? '播放音频'}</span>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full border-clover-green/40 bg-white text-sm font-semibold text-clover-green hover:bg-clover-green/10"
                  >
                    {`${speedLabelPrefix} · ${formatPlaybackRateLabel(playbackRate)}`}
                    <ChevronDown className="ml-1.5 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuLabel>播放速度</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={String(playbackRate)}
                    onValueChange={(value) => setPlaybackRate(Number(value))}
                  >
                    {playbackRates.map((rate) => (
                      <DropdownMenuRadioItem key={rate} value={String(rate)}>
                        {formatPlaybackRateLabel(rate)}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              {data.listLabel && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-full bg-clover-green/10 text-sm font-semibold text-clover-green hover:bg-clover-green/20"
                >
                  <List className="h-4 w-4" />
                  <span className="ml-1">{data.listLabel}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        preload="metadata"
        className="sr-only"
        aria-hidden={true}
        tabIndex={-1}
      >
        <source src={data.audio.src} type={data.audio.type ?? 'audio/mpeg'} />
        您的浏览器暂不支持音频播放。
      </audio>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const MediaAudioPlugin: BlockPlugin<MediaAudioData> = {
  type: 'media-audio',
  label: '音频卡片',
  version: 1,
  schema: MediaAudioSchema,
  defaultData: {
    eyebrow: '音频课程',
    title: '音频模块标题',
    description: '描述',
    progressPercent: 0,
    durationLabel: '0:06',
    speedLabel: '倍速',
    listLabel: '播放列表',
    primaryActionLabel: '播放音频',
    playbackRates: [...DEFAULT_PLAYBACK_RATES],
    audio: {
      src: 'https://samplelib.com/lib/preview/mp3/sample-6s.mp3',
      type: 'audio/mpeg',
    },
  },
  Render: MediaAudioRender,
  Inspector: ({ value, onChange }) => {
    const form = useForm<MediaAudioData>({
      resolver: zodResolver(MediaAudioSchema),
      defaultValues: value,
      mode: 'onChange',
    })

    useEffect(() => {
      const sub = form.watch((vals) => onChange(vals as MediaAudioData))
      return () => sub.unsubscribe()
    }, [form, onChange])

    return (
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="eyebrow">顶部提示文字</Label>
          <Input id="eyebrow" placeholder="例如：音频课程" {...form.register('eyebrow')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">标题</Label>
          <Input id="title" placeholder="请输入音频标题" {...form.register('title', { required: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">简介</Label>
          <Textarea id="description" rows={3} placeholder="用一句话告诉老师这里要做什么" {...form.register('description')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="audio.src">音频 URL</Label>
          <Input
            id="audio.src"
            placeholder="请输入音频链接"
            {...form.register('audio.src', { required: true })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="audio.type">文件类型（可选）</Label>
          <Input id="audio.type" placeholder="例如：audio/mpeg" {...form.register('audio.type')} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="durationLabel">时长显示</Label>
            <Input id="durationLabel" placeholder="例如：0:47" {...form.register('durationLabel')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="speedLabel">倍速按钮前缀</Label>
            <Input id="speedLabel" placeholder="例如：倍速" {...form.register('speedLabel')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="listLabel">播放列表按钮</Label>
            <Input id="listLabel" placeholder="例如：播放列表" {...form.register('listLabel')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="primaryActionLabel">播放按钮标签</Label>
            <Input id="primaryActionLabel" placeholder="例如：播放音频" {...form.register('primaryActionLabel')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="progressPercent">初始进度（0-100，可选）</Label>
            <Input
              id="progressPercent"
              type="number"
              min={0}
              max={100}
              {...form.register('progressPercent', { valueAsNumber: true })}
            />
          </div>
        </div>
      </form>
    )
  },
}
