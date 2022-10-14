import type { Location } from '@remix-run/react'
import { useFetcher, useLocation, useTransition } from '@remix-run/react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
} from 'react'

import useIntersection from './useIntersection'

const positions: { [key: string]: number } = {}

const cache: { [key: string]: unknown } = {}

type State = 'init' | 'loading' | 'loaded' | 'redirect'

export interface InfinityQueryOptions<S, R> {
  reducer: (stete: S | undefined, fetchResult: R) => S
  getNextFetchUrl: (state: S | undefined, location: Location) => string | null
  hasMore: (state: S | undefined) => boolean
}

function useInfinityQuery<S, R>({
  reducer,
  getNextFetchUrl,
  hasMore,
}: InfinityQueryOptions<S, R>) {
  const location = useLocation()
  const transition = useTransition()
  const historyResult = useSyncExternalStore<S | undefined>(
    () => () => {},
    () => cache[location.key] as S | undefined,
    () => undefined,
  )

  const [results, setResults] = useState(historyResult)
  const { load, data, type } = useFetcher<R>()
  const [state, setState] = useState<State>('init')

  const updateData = useCallback(
    (data: R | undefined) => {
      if (state === 'loaded') {
        if (data) {
          setResults((results) => reducer(results, data))
        }
      }
    },
    [reducer, state],
  )

  useEffect(() => {
    if (type === 'done') {
      setState('loaded')
    }
  }, [type])

  useEffect(() => {
    if (
      transition.location &&
      transition.location.pathname !== location.pathname
    ) {
      setState('redirect')
    }

    if (
      transition.location &&
      transition.location.pathname === location.pathname
    ) {
      setState('init')
      setResults(undefined)
    }
  }, [location.pathname, transition.location])

  useEffect(() => {
    if (state === 'init') {
      const url = getNextFetchUrl(results, transition.location ?? location)
      if (url) {
        setState('loading')
        load(url)
      }
    }
  }, [state, results, load, location, transition.location, getNextFetchUrl])

  useEffect(() => {
    if (state === 'loaded') {
      updateData(data)
    }
  }, [data, state, updateData])

  useEffect(() => {
    if (state === 'redirect') {
      cache[location.key] = results
      positions[location.key] = window.scrollY
    }
  }, [location.key, results, state])

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
      if (state === 'init') {
        const position = positions[location.key]

        if (position) {
          window.scrollTo(0, position)
        }
      }
    }, [results, location.key, state])
  }

  const fetchMore = useCallback(() => {
    if (state !== 'loading') {
      const url = getNextFetchUrl(results, transition.location ?? location)
      if (url) {
        setState('loading')
        load(url)
      }
    }
  }, [state, getNextFetchUrl, results, transition.location, location, load])

  const ref = useIntersection(fetchMore, state === 'loading', hasMore(results))

  return {
    results: results,
    isLoading: state === 'loading',
    ref,
  }
}

export default useInfinityQuery
