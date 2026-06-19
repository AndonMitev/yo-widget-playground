# YO Widget Playground

Interactive playground for the [YO Protocol](https://yo.xyz) widget. Embeds the
widget via [`@yo-protocol/widget-sdk`](https://www.npmjs.com/package/@yo-protocol/widget-sdk),
with a wallet (RainbowKit + wagmi), an embedded/launcher mode toggle, a live
event stream, and a one-click "Copy AI integration prompt".

The widget UI itself renders from `sdk-widget.vercel.app` (an iframe) — this app
owns the wallet and signs the transactions the widget prepares.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional — add RPC keys
npm run dev                  # http://localhost:3000
```

## Deploy (Vercel)

Import the repo, framework auto-detected (Next.js). No special root directory.
Optional env vars (see `.env.example`): `NEXT_PUBLIC_WIDGET_ORIGIN`,
`NEXT_PUBLIC_ALCHEMY_API_KEY`, `NEXT_PUBLIC_ANKR_API_KEY`, `NEXT_PUBLIC_WC_PROJECT_ID`.

## Integrate the widget in your own app

Click **Copy AI integration prompt** in the playground and paste it into your
AI coding tool, or see the [widget-sdk README](https://www.npmjs.com/package/@yo-protocol/widget-sdk).
