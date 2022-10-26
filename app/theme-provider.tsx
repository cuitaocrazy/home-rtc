import React from 'react'
import { useEffect } from 'react'

export type Theme = 'dark' | 'light'

type ThemeContextType = [
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
  const [theme, setTheme] = React.useState(
    typeof window === 'undefined'
      ? null
      : getLocalStorageTheme() || getPreferredTheme(),
  )

  useEffect(() => {
    theme
      ? localStorage.setItem('theme', theme)
      : localStorage.removeItem('theme')
  }, [theme])

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
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
  return context
}

function handleDarkAndLightModeEls() {
  const theme = getPreferredTheme()
  const darkEls = document.querySelectorAll('dark-mode')
  const lightEls = document.querySelectorAll('light-mode')
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
}

function Themed({
  dark,
  light,
}: {
  dark: React.ReactNode | string
  light: React.ReactNode | string
  initialOnly?: boolean
}) {
  const [theme] = useTheme()
  console.log(theme)
  if (theme === null) {
    // stick them both in and our little script will update the DOM to match
    // what we'll render in the client during hydration.
    return (
      <>
        {React.createElement('dark-mode', null, dark)}
        {React.createElement('light-mode', null, light)}
      </>
    )
  } else {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{theme === 'light' ? light : dark}</>
  }
}

export {
  handleDarkAndLightModeEls,
  NonFlashOfWrongThemeEls,
  Themed,
  ThemeProvider,
  useTheme,
}
