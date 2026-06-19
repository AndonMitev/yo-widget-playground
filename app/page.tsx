'use client'

import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit'
import { YoWidget, YoWidgetLauncher } from '@yo-protocol/widget-sdk'
import { createWagmiAdapter } from '@yo-protocol/widget-sdk/adapters/wagmi'
import { useMemo, useState } from 'react'
import { useConfig } from 'wagmi'
import { EventsPanel, useEventLog, useTick } from './events-panel'
import { YO_WIDGET_SKILL } from './yo-widget-skill'

const WIDGET_ORIGIN = process.env.NEXT_PUBLIC_WIDGET_ORIGIN ?? 'https://sdk-widget.vercel.app'

const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
const ANKR_KEY = process.env.NEXT_PUBLIC_ANKR_API_KEY

const RPC_URLS: Record<number, string[]> = {
  1: [
    ALCHEMY_KEY && `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    ANKR_KEY && `https://rpc.ankr.com/eth/${ANKR_KEY}`,
  ].filter((s): s is string => Boolean(s)),
  8453: [
    ALCHEMY_KEY && `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    ANKR_KEY && `https://rpc.ankr.com/base/${ANKR_KEY}`,
  ].filter((s): s is string => Boolean(s)),
  42161: [
    ALCHEMY_KEY && `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    ANKR_KEY && `https://rpc.ankr.com/arbitrum/${ANKR_KEY}`,
  ].filter((s): s is string => Boolean(s)),
}

type Mode = 'embedded' | 'launcher'

export default function Home() {
  const config = useConfig()
  const { openConnectModal } = useConnectModal()
  const { entries, push, clear } = useEventLog()
  useTick()
  const [mode, setMode] = useState<Mode>('embedded')

  const signer = useMemo(
    () => createWagmiAdapter({ config, onConnectRequest: openConnectModal }),
    [config, openConnectModal],
  )

  return (
    <div className="yo-grain yo-hero-glow min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="yo-header sticky top-0 z-40 w-full">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between gap-4">
          {/* Wordmark — YO logo from the dapp navbar */}
          <div className="flex items-center gap-3 shrink-0">
            <YoLogo />
            <div className="h-4 w-px bg-white/10" />
            <span className="yo-label">Widget Playground</span>
          </div>

          {/* Controls cluster */}
          <div className="flex items-center gap-3">
            <CopySkillButton />
            <ModeToggle mode={mode} onChange={setMode} />
            <ConnectButton showBalance={false} chainStatus="icon" />
          </div>
        </div>
      </header>

      {/* Page body */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-8 flex flex-col gap-6 relative z-10">
        {/* Hero descriptor */}
        <div className="flex flex-col gap-1">
          <h1
            className="text-xl font-bold text-white leading-tight"
            style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
          >
            Interactive SDK Playground
          </h1>
          <p className="text-sm text-white/45 max-w-lg">
            Embed the YO widget in your own app. Connect a wallet, trigger events, and inspect the
            real-time event stream — all in one place.
          </p>
        </div>

        {/* Main content grid */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 flex-1">
          {/* Widget preview frame */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="yo-label">Live Preview</span>
              <span className="yo-label">
                {mode === 'embedded' ? 'Embedded mode' : 'Launcher mode'}
              </span>
            </div>
            <div className="yo-panel rounded-3xl flex-1 min-h-[540px] flex flex-col overflow-hidden">
              {mode === 'embedded' ? (
                <div className="flex-1 flex">
                  <YoWidget
                    signer={signer}
                    widgetOrigin={WIDGET_ORIGIN}
                    rpcUrls={RPC_URLS}
                    onEvent={push}
                  />
                </div>
              ) : (
                <LauncherHint />
              )}
            </div>
          </div>

          {/* Events panel */}
          <EventsPanel entries={entries} onClear={clear} />
        </section>
      </main>

      {/* Launcher widget — outside grid so it floats freely */}
      {mode === 'launcher' && (
        <YoWidgetLauncher
          signer={signer}
          widgetOrigin={WIDGET_ORIGIN}
          rpcUrls={RPC_URLS}
          onEvent={push}
          position="bottom-right"
        />
      )}
    </div>
  )
}

function LauncherHint() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-black font-bold text-lg"
        style={{ background: '#ccff00' }}
      >
        YO
      </div>
      <div className="flex flex-col gap-1">
        <p
          className="text-sm font-semibold text-white/80"
          style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
        >
          Launcher mode active
        </p>
        <p className="text-xs text-white/40 max-w-xs">
          The floating YO bubble has appeared in the bottom-right corner of the screen. Click it to
          open the widget.
        </p>
      </div>
      <div
        className="mt-2 text-[10px] font-mono px-3 py-1.5 rounded-full"
        style={{
          background: 'rgba(204,255,0,0.07)',
          color: '#ccff00',
          border: '1px solid rgba(204,255,0,0.2)',
        }}
      >
        position: &quot;bottom-right&quot;
      </div>
    </div>
  )
}

function YoLogo({ height = 20 }: { height?: number }) {
  return (
    <svg
      width={Math.round((91 / 47) * height)}
      height={height}
      viewBox="0 0 91 47"
      fill="none"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>YO Protocol</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M66.8304 0C53.9333 0 43.4781 10.5213 43.4781 23.5C43.4781 36.4787 53.9333 47 66.8304 47C79.7275 47 90.1826 36.4787 90.1826 23.5C90.1826 10.5213 79.7275 0 66.8304 0ZM0.431524 4.65021C-0.277452 3.4094 0.612569 1.86124 2.03487 1.86123L16.8189 1.86121H30.9985L43.5235 1.86123C44.8427 1.86124 45.7378 3.2114 45.2312 4.43721L28.692 44.4532C28.4051 45.1474 27.7314 45.5997 26.9843 45.5997H10.6255C9.30626 45.5997 8.4112 44.2495 8.91785 43.0237L13.8587 31.0695C14.3002 30.0013 14.2231 28.7873 13.6501 27.7844L0.431524 4.65021ZM46.4111 1.4737C46.4111 1.45823 46.4268 1.44774 46.441 1.45368C46.4519 1.45828 46.4571 1.47096 46.4526 1.48202C46.4435 1.50391 46.4111 1.4974 46.4111 1.4737Z"
        fill="#ccff00"
      />
    </svg>
  )
}

function CopySkillButton() {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(YO_WIDGET_SKILL).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      }}
      title="Copy a paste-ready prompt that integrates this widget into any app"
      className={copied ? 'yo-btn-ghost' : 'yo-btn-primary'}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M4 2h5a1 1 0 011 1v5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <rect x="2" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          Copy AI prompt
        </>
      )}
    </button>
  )
}

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div
      className="flex rounded-full p-0.5"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.10)',
      }}
    >
      {(['embedded', 'launcher'] as Mode[]).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className="px-3 py-1.5 rounded-full transition-all"
          style={
            mode === m
              ? {
                  background: '#ccff00',
                  color: '#000',
                  fontFamily: 'var(--font-space-grotesk), sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }
              : {
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'var(--font-space-grotesk), sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }
          }
        >
          {m}
        </button>
      ))}
    </div>
  )
}
