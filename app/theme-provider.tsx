import React from 'react'
import { useEffect } from 'react'

export type Theme = 'dark' | 'light'

type ThemeContextType = [
  Theme | null,
  Theme | null,
  React.Dispatch<React.SetStateAction<Theme | null>>,
]

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined,
)
ThemeContext.displayName = 'ThemeContext'
const prefersLightMQ = '(prefers-color-scheme: light)'
const getPreferredTheme = () =>
  window.matchMedia(prefersLightMQ).matches ? 'light' : 'dark'
const getLocalStorageTheme = () => {
  return localStorage.getItem('theme') as 'light' | 'dark' | null
}

// 排除react hydrate的警告
const themeScript = `
  (function() {
    function setTheme(theme) {
      document.documentElement.classList.remove('dark', 'light')
      if (theme) {
        document.documentElement.classList.add(theme)
      } else {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
        const colorScheme = mediaQuery.matches ? 'light' : 'dark'
        document.documentElement.classList.add(colorScheme)
      }
    }
    const theme = localStorage.getItem('theme')
    setTheme(theme)
  })()
`
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeSetting, setThemeSetting] = React.useState<Theme | null>(
    typeof window === 'undefined' ? null : getLocalStorageTheme(),
  )
  const [theme, setTheme] = React.useState(
    typeof window === 'undefined' ? null : themeSetting || getPreferredTheme(),
  )

  useEffect(() => {
    if (themeSetting) {
      setTheme(themeSetting)
      localStorage.setItem('theme', themeSetting)
    } else {
      setTheme(getPreferredTheme())
      localStorage.removeItem('theme')
    }
  }, [themeSetting])

  useEffect(() => {
    if (themeSetting === null) {
      const mediaQuery = window.matchMedia(prefersLightMQ)
      const listener = (e: MediaQueryListEvent) => {
        if (themeSetting === null) {
          setTheme(e.matches ? 'light' : 'dark')
        }
      }
      mediaQuery.addEventListener('change', listener)
      return () => mediaQuery.removeEventListener('change', listener)
    }
  }, [themeSetting])

  return (
    <ThemeContext.Provider value={[theme, themeSetting, setThemeSetting]}>
      {children}
    </ThemeContext.Provider>
  )
}

function NonFlashOfWrongThemeEls() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: themeScript,
      }}
    />
  )
}

function useTheme() {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context[0]
}

function useThemeSetting() {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return [context[1], context[2]!] as const
}

function handleDarkAndLightModeEls() {
  const themeSetting = getLocalStorageTheme() as Theme | null
  const theme = themeSetting || 'system'
  const darkEls = document.querySelectorAll('dark-mode')
  const lightEls = document.querySelectorAll('light-mode')
  const systemEls = document.querySelectorAll('system-mode')

  for (const darkEl of darkEls) {
    if (theme === 'dark') {
      for (const child of darkEl.childNodes) {
        darkEl.parentElement?.append(child)
      }
    }
    darkEl.remove()
  }
  for (const lightEl of lightEls) {
    if (theme === 'light') {
      for (const child of lightEl.childNodes) {
        lightEl.parentElement?.append(child)
      }
    }
    lightEl.remove()
  }
  for (const systemEl of systemEls) {
    if (theme === 'system') {
      for (const child of systemEl.childNodes) {
        systemEl.parentElement?.append(child)
      }
    }
    systemEl.remove()
  }
}

function Themed({
  dark,
  light,
  system,
}: {
  dark: React.ReactNode | string
  light: React.ReactNode | string
  system: React.ReactNode | string
}) {
  const theme = useTheme()
  const [themeSetting] = useThemeSetting()

  if (theme === null) {
    // stick them both in and our little script will update the DOM to match
    // what we'll render in the client during hydration.
    return (
      <>
        {React.createElement('dark-mode', null, dark)}
        {React.createElement('light-mode', null, light)}
        {React.createElement('system-mode', null, system)}
      </>
    )
  } else {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return (
      <>
        {themeSetting === null
          ? system
          : themeSetting === 'light'
          ? light
          : dark}
      </>
    )
  }
}

export {
  handleDarkAndLightModeEls,
  NonFlashOfWrongThemeEls,
  Themed,
  ThemeProvider,
  useTheme,
  useThemeSetting,
}
