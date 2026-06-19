'use client'

import type { WidgetEvent } from '@yo-protocol/widget-sdk'
import { useEffect, useState } from 'react'

interface Entry {
  id: number
  at: number
  event: WidgetEvent
}

const COLORS: Record<string, string> = {
  'session-ready': '#5de2ff',
  'deposit-started': '#ccff00',
  'deposit-submitted': '#ccff00',
  'deposit-confirmed': '#00ff8b',
  'redeem-started': '#ffaf4f',
  'redeem-submitted': '#ffaf4f',
  'redeem-confirmed': '#00ff8b',
  'approve-submitted': '#ffbf00',
  error: '#ff5a5a',
}

const ICONS: Record<string, string> = {
  'session-ready': '⬡',
  'deposit-started': '↑',
  'deposit-submitted': '⏳',
  'deposit-confirmed': '✓',
  'redeem-started': '↓',
  'redeem-submitted': '⏳',
  'redeem-confirmed': '✓',
  'approve-submitted': '◎',
  error: '✕',
}

export function useEventLog() {
  const [entries, setEntries] = useState<Entry[]>([])
  const push = (event: WidgetEvent) =>
    setEntries((prev) => [{ id: prev.length, at: Date.now(), event }, ...prev].slice(0, 50))
  const clear = () => setEntries([])
  return { entries, push, clear }
}

export function EventsPanel({ entries, onClear }: { entries: Entry[]; onClear: () => void }) {
  return (
    <aside
      className="rounded-3xl flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0d0d0d 0%, #060606 100%)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Console header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-2.5">
          {/* Terminal traffic lights */}
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
          </div>
          <span className="yo-label">Event Log</span>
          {entries.length > 0 && (
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{
                background: 'rgba(204,255,0,0.1)',
                color: '#ccff00',
              }}
            >
              {entries.length}
            </span>
          )}
        </div>
        {entries.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="yo-btn-ghost"
            style={{ padding: '3px 10px', fontSize: '10px' }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Subheading */}
      <p
        className="px-4 py-2 text-[11px] shrink-0"
        style={{
          color: 'rgba(255,255,255,0.30)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        Lifecycle events from{' '}
        <code className="font-mono" style={{ color: 'rgba(255,255,255,0.50)' }}>
          @yo-protocol/widget-sdk
        </code>
      </p>

      {/* Event list */}
      {entries.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-base"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px dashed rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.25)',
            }}
          >
            〜
          </div>
          <div className="text-center">
            <p className="text-xs text-white/40 font-medium">No events yet</p>
            <p className="text-[11px] text-white/25 mt-0.5">
              Interact with the widget to see events here
            </p>
          </div>
        </div>
      ) : (
        <ul className="flex flex-col gap-0 flex-1 overflow-auto max-h-[480px]">
          {entries.map((e, i) => (
            <EventRow key={e.id} entry={e} isFirst={i === 0} />
          ))}
        </ul>
      )}
    </aside>
  )
}

function EventRow({ entry, isFirst }: { entry: Entry; isFirst: boolean }) {
  const color = COLORS[entry.event.name] ?? '#888'
  const icon = ICONS[entry.event.name] ?? '·'
  const hasPayload = entry.event.data !== undefined && entry.event.data !== null

  return (
    <li
      className="px-4 py-3 flex flex-col gap-1.5 transition-colors"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: isFirst ? 'rgba(255,255,255,0.015)' : undefined,
        animation: isFirst ? 'yo-fade-in 200ms ease' : undefined,
      }}
    >
      {/* Event name row */}
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="shrink-0 w-5 h-5 inline-flex items-center justify-center rounded text-[11px] font-bold"
          style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
        >
          {icon}
        </span>
        <span className="text-[12px] font-semibold font-mono flex-1 truncate" style={{ color }}>
          {entry.event.name}
        </span>
        <span
          className="text-[10px] font-mono shrink-0"
          style={{ color: 'rgba(255,255,255,0.30)' }}
        >
          {timeAgo(entry.at)}
        </span>
      </div>

      {/* Payload */}
      {hasPayload && (
        <pre
          className="text-[10px] font-mono whitespace-pre-wrap break-all max-h-24 overflow-auto rounded-lg px-2.5 py-2"
          style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.6,
          }}
        >
          {prettyPayload(entry.event.data)}
        </pre>
      )}
    </li>
  )
}

function prettyPayload(data: unknown): string {
  try {
    return JSON.stringify(data, null, 2)
  } catch {
    return String(data)
  }
}

function timeAgo(at: number): string {
  const s = Math.max(0, Math.round((Date.now() - at) / 1000))
  if (s < 5) return 'just now'
  if (s < 60) return `${s}s ago`
  const m = Math.round(s / 60)
  if (m < 60) return `${m}m ago`
  return `${Math.round(m / 60)}h ago`
}

// Re-render every 10s so timeAgo() updates.
export function useTick(interval = 10_000) {
  const [, set] = useState(0)
  useEffect(() => {
    const t = setInterval(() => set((x) => x + 1), interval)
    return () => clearInterval(t)
  }, [interval])
}
