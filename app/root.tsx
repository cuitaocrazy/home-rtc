import type { MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
} from '@remix-run/react'

import Top from './components/Top'
import tailwindStylesheetUrl from './styles/tailwind.css'

export function links() {
  return [{ rel: 'stylesheet', href: tailwindStylesheetUrl }]
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})

export default function App() {
  const matches = useMatches()
  const unneededScrollRestoration = matches.some(
    (match) => match.handle?.unneededScrollRestoration,
  )

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Top />
        <Outlet />
        {unneededScrollRestoration || <ScrollRestoration />}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
