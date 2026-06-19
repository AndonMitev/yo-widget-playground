'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { darkTheme, getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { fallback, http } from 'viem'
import { WagmiProvider } from 'wagmi'
import { arbitrum, base, mainnet } from 'wagmi/chains'

const ALCHEMY_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
const ANKR_KEY = process.env.NEXT_PUBLIC_ANKR_API_KEY

/**
 * Build a fallback transport per chain. Prefers Alchemy, then Ankr, then
 * viem's default public RPC — matching the dapp's wagmi setup so local dev
 * doesn't hit CORS-blocked / rate-limited public endpoints.
 */
function transportFor(alchemySlug: string, ankrSlug: string) {
  const urls: string[] = []
  if (ALCHEMY_KEY) urls.push(`https://${alchemySlug}.g.alchemy.com/v2/${ALCHEMY_KEY}`)
  if (ANKR_KEY) urls.push(`https://rpc.ankr.com/${ankrSlug}/${ANKR_KEY}`)
  if (urls.length === 0) return http()
  return fallback([...urls.map((u) => http(u)), http()])
}

const config = getDefaultConfig({
  appName: 'YO Widget Host Example',
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? 'demo',
  chains: [base, mainnet, arbitrum],
  transports: {
    [base.id]: transportFor('base-mainnet', 'base'),
    [mainnet.id]: transportFor('eth-mainnet', 'eth'),
    [arbitrum.id]: transportFor('arb-mainnet', 'arbitrum'),
  },
  ssr: true,
})

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({ accentColor: '#ccff00', accentColorForeground: 'black' })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
