import {
  Form,
  Link,
  useFetchers,
  useSearchParams,
  useTransition,
} from '@remix-run/react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { BsCircleHalf, BsMoonFill, BsSunFill } from 'react-icons/bs'

import useOnClickOutside from '~/hook/useOnClickOutside'
import type { Theme } from '~/theme-provider'
import { Themed, useThemeSetting } from '~/theme-provider'

function ThemeDisplay({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-1">{children}</div>
}

function ThemeSelect() {
  const { 0: theme, 1: setTheme } = useThemeSetting()
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const [options, setOptions] = useState<(Theme | null)[]>([])

  useEffect(() => {
    setOptions([null, 'light', 'dark'])
  }, [])
  useOnClickOutside(rootRef, () => setIsOpen(false))

  return (
    <div ref={rootRef} className="relative inline-block">
      <button onClick={() => setIsOpen((prev) => !prev)} className="mr-8 ml-3">
        <Themed
          dark={
            <ThemeDisplay>
              <BsMoonFill />
              Theme
            </ThemeDisplay>
          }
          light={
            <ThemeDisplay>
              <BsSunFill />
              Theme
            </ThemeDisplay>
          }
          system={
            <ThemeDisplay>
              <BsCircleHalf />
              Theme
            </ThemeDisplay>
          }
        />
      </button>
      <motion.ul
        initial={false}
        onClick={() => setIsOpen(false)}
        className="absolute bg-white border dark:bg-gray-900 cursor-pointer shadow rounded p-2"
        animate={isOpen ? 'open' : 'closed'}
        variants={{
          open: {
            clipPath: 'inset(-100% -100% -100% -100%)',
            opacity: 1,
          },
          closed: {
            clipPath: 'inset(0% 0% 100% 0%)',
            opacity: 0,
            transition: {
              duration: 0,
            },
          },
        }}
      >
        {options.map((option, idx) => (
          <motion.li
            key={idx}
            onClick={() => setTheme(option)}
            className={clsx(
              'border p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition',
              {
                'border-transparent': theme !== option,
                'bg-gray-100 dark:bg-gray-800': theme === option,
              },
            )}
          >
            <ThemeDisplay>
              {(option === null && <BsCircleHalf />) ||
                (option === 'light' && <BsSunFill />) ||
                (option === 'dark' && <BsMoonFill />)}
              {(option === null && 'System') ||
                (option === 'light' && 'Light') ||
                (option === 'dark' && 'Dark')}
            </ThemeDisplay>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}

export default function Top() {
  const [searchParams] = useSearchParams()
  const searchKeyWord = searchParams.get('query') || ''
  const scope = searchParams.get('scope') || undefined
  const language = searchParams.get('language') || undefined
  const includeAdult = searchParams.get('include_adult') === 'true'
  const { state } = useTransition()
  const fetchers = useFetchers()

  let isIdle = state === 'idle'
  if (isIdle) {
    for (const f of fetchers) {
      if (f.state !== 'idle') {
        isIdle = false
        break
      }
    }
  }

  return (
    <nav className="sticky top-0 z-40 flex flex-nowrap py-2 bg-white dark:bg-slate-900 shadow dark:shadow-gray-800">
      <div className="px-2 mx-auto container items-center flex">
        <Link
          to="/"
          className="block whitespace-nowrap text-2xl font-medium mr-auto"
        >
          RTC
        </Link>
        <div className="relative">
          <span className="mx-2">EN</span>
          <ul className="absolute bg-white dark:bg-gray-900">
            <li className="mx-2">EN</li>
            <li className="mx-2">CN</li>
          </ul>
        </div>
        <Form action="/search">
          <select name="language" defaultValue={language}>
            <option value="zh-CN">zh-CN</option>
            <option value="en-US">en-US</option>
            <option value="ja-JP">ja-JP</option>
          </select>
          <select name="scope" defaultValue={scope}>
            <option value="multi">Multi</option>
            <option value="movie">Movie</option>
            <option value="tv">TV</option>
            <option value="person">Person</option>
          </select>
          <input
            type="checkbox"
            name="include_adult"
            defaultChecked={includeAdult}
            value="true"
          />
          <input
            type="text"
            name="query"
            placeholder="input search word"
            defaultValue={searchKeyWord}
          />
          <button type="submit">Search</button>
        </Form>
        <ThemeSelect />
      </div>
      <div className="w-screen fixed top-0">
        <div
          className={clsx('h-[2px] w-0 bg-red-700', {
            'load-req-at': !isIdle,
            'load-res-at': isIdle,
          })}
        ></div>
      </div>
    </nav>
  )
}
