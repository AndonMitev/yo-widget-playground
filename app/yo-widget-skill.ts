// Copyable one-shot integration prompt shown in the playground. Paste into
// Claude Code / Cursor / any LLM to scaffold a working YO widget embed.
// ponytail: single source for the copy button; mirrors @yo-protocol/widget-sdk README.
export const YO_WIDGET_SKILL = `# Integrate the YO Protocol widget

Embed the YO yield-vault widget (\`@yo-protocol/widget-sdk\`) into my app. The
widget renders inside an iframe from \`https://sdk-widget.vercel.app\`; **my page
owns the wallet** and signs the transactions the widget prepares, over a
versioned postMessage bridge.

## Install
\`\`\`sh
npm install @yo-protocol/widget-sdk
\`\`\`
Peers (install what matches my stack): \`react@>=18\`, \`react-dom@>=18\`,
\`wagmi@>=2\` + \`@wagmi/core@>=2.14\`, \`viem@>=2\`. None required for vanilla \`mount()\`.

## React (wagmi + RainbowKit) — inline embed
\`\`\`tsx
'use client'
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit'
import { YoWidget } from '@yo-protocol/widget-sdk'
import { createWagmiAdapter } from '@yo-protocol/widget-sdk/adapters/wagmi'
import { useMemo } from 'react'
import { useConfig } from 'wagmi'

export default function Page() {
  const config = useConfig()
  const { openConnectModal } = useConnectModal()
  const signer = useMemo(
    () => createWagmiAdapter({ config, onConnectRequest: openConnectModal }),
    [config, openConnectModal],
  )
  return (
    <>
      <ConnectButton />
      <YoWidget signer={signer} />
    </>
  )
}
\`\`\`

Floating bubble instead of inline: swap \`<YoWidget … />\` for
\`<YoWidgetLauncher signer={signer} position="bottom-right" />\`.

## Vanilla JS (any framework)
\`\`\`html
<div id="yo-widget"></div>
<script type="module">
  import { mount } from 'https://esm.sh/@yo-protocol/widget-sdk'
  import { createViemAdapter } from 'https://esm.sh/@yo-protocol/widget-sdk/adapters/viem'
  const signer = createViemAdapter({
    getWalletClient: () => window.yourViemWalletClient,
    subscribe: (notify) => yourWallet.on('change', (s) =>
      notify({ address: s.address, chainId: s.chainId })),
    onConnectRequest: () => yourWallet.openModal(),
  })
  mount(document.getElementById('yo-widget'), { signer })
</script>
\`\`\`

## Key props (\`<YoWidget />\` / \`<YoWidgetLauncher />\`)
- \`signer\` (required) — wallet bridge from \`createWagmiAdapter\` / \`createViemAdapter\`.
- \`partnerId?: number\` — attribution id from the YO team (default 9999).
- \`chains?: number[]\` — restrict vaults to these chains. Default \`[1, 8453, 42161]\`
  (Ethereum, Base, Arbitrum) — the chains where the YO Gateway is deployed and
  deposits/withdraws are supported. Don't add unsupported chains.
- \`rpcUrls?: Record<number, string | string[]>\` — optional host RPCs (Alchemy/Infura);
  tried first, SDK public fallbacks cover gaps.
- \`theme?: { primary?, background?, card?, radius? }\` — hex colour overrides.
- \`widgetOrigin?: string\` — iframe source; override only for staging/local.

The widget picks up the connected address from my wallet, renders vaults and
positions, and prompts my wallet for deposits/withdraws via the adapter. No
\`onEvent\` needed unless I want analytics.

Use my existing wagmi/RainbowKit (or viem) setup — don't add a new wallet stack.`
