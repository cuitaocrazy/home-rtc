import type { MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useLocation,
  useOutlet,
} from '@remix-run/react'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'

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
  const outlet = useOutlet()
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
        <AnimatePresence exitBeforeEnter initial={false}>
          <motion.main
            key={useLocation().pathname}
            initial={{ x: '-10%', opacity: 0 }}
            animate={{ x: '0', opacity: 1 }}
            exit={{ y: '-10%', opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {outlet}
          </motion.main>
        </AnimatePresence>
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
