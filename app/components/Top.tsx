import {
  Form,
  useFetchers,
  useSearchParams,
  useTransition,
} from '@remix-run/react'
import clsx from 'clsx'

import type { Theme } from '~/theme-provider'
import { Themed, useTheme } from '~/theme-provider'
export default function Top() {
  const [searchParams] = useSearchParams()
  const searchKeyWord = searchParams.get('query') || ''
  const scope = searchParams.get('scope') || undefined
  const language = searchParams.get('language') || undefined
  const includeAdult = searchParams.get('include_adult') === 'true'
  const { state } = useTransition()
  const fetchers = useFetchers()
  const [theme, setTheme] = useTheme()
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
    <div className="sticky top-0 z-40">
      <div className="bg-cyan-600">
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
        <Themed dark="dark" light="light" />
      </div>
      <div className="w-screen fixed top-0">
        <div
          className={clsx('h-[2px] w-0 bg-red-700', {
            'load-req-at': !isIdle,
            'load-res-at': isIdle,
          })}
        ></div>
      </div>
    </div>
  )
}
