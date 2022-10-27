import type { MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import clsx from 'clsx'

import Top from './components/Top'
import tailwindStylesheetUrl from './styles/tailwind.css'
import {
  NonFlashOfWrongThemeEls,
  ThemeProvider,
  useTheme,
} from './theme-provider'

export function links() {
  return [{ rel: 'stylesheet', href: tailwindStylesheetUrl }]
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})

function App() {
  const theme = useTheme()
  return (
    <html lang="en" className={clsx(theme || 'dark')}>
      <head>
        <Meta />
        <meta name="color-scheme" content="dark light" />
        <NonFlashOfWrongThemeEls />
        <Links />
      </head>
      <body>
        <Top />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function AppWithProviders() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  )
}
