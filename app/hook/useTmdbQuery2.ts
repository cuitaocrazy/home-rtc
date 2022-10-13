import {
  useFetcher,
  useLocation,
  useSearchParams,
  useTransition,
} from '@remix-run/react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'

import type {
  Movie,
  Multi,
  Person,
  SearchResults,
  TV,
} from '~/services/tmdb_models'

type Result = SearchResults<Multi | Movie | TV | Person>

const emptyResult: Result = {
  page: 0,
  total_results: 0,
  total_pages: 0,
  results: [],
}

const positions: { [key: string]: number } = {}

const cache: { [key: string]: Result | undefined } = {}

function useStoreScroll(results: Result | undefined) {
  const location = useLocation()
  const transition = useTransition()
  const isInit = useRef(true)

  useEffect(() => {
    if (transition.location) {
      positions[location.key] = window.scrollY
    }
  }, [transition.location, location.key])

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
      if (results !== undefined && isInit.current === true) {
        isInit.current = false
        const position = positions[location.key]

        if (position) {
          window.scrollTo(0, position)
        }
      }
    }, [results, location.key])
  }
}

type State = 'init' | 'loading' | 'loaded' | 'redirect'
function useTmdbQuery() {
  const location = useLocation()
  const transition = useTransition()
  const historyResult = useSyncExternalStore(
    () => () => {},
    () => cache[location.key],
    () => undefined,
  )
  const [results, setResults] = useState(historyResult || emptyResult)
  const { load, data, type } = useFetcher<Result>()
  const [state, setState] = useState('init' as State)
  const setRef = useRef(
    new Set<number>(results?.results.map((r) => r.id) ?? []),
  )
  //

  const updateData = useCallback(
    (data: Result | undefined) => {
      if (state === 'loaded') {
        if (data) {
          setResults((results) => ({
            ...data,
            results: [
              ...results.results,
              ...data.results.filter((r) => !setRef.current.has(r.id)),
            ],
          }))
        }
      }
    },
    [state],
  )

  useEffect(() => {
    results.results.forEach((r) => setRef.current.add(r.id))
  }, [results.results])

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
      setRef.current.clear()
      setState('init')
      setResults(emptyResult)
    }
  }, [location.pathname, transition.location])

  useEffect(() => {
    if (state === 'init') {
      if (results === emptyResult) {
        setState('loading')
        load('/api/search' + (transition.location?.search || location.search))
      }
    }
  }, [
    state,
    results,
    load,
    location.search,
    location,
    transition.location,
    transition,
  ])

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
      const searchParams = new URLSearchParams(location.search)
      searchParams.set('page', (results.page + 1).toString())
      setState('loading')
      console.log('fetchMore', state)
      console.log('/api/search' + searchParams.toString())
      load('/api/search?' + searchParams.toString())
    }
  }, [state, location.search, results.page, load])

  return {
    results: results,
    hasMore: results.page < results.total_pages,
    fetchMore,
    isLoading: state === 'loading',
  }
}

function useTmdbQuery2() {
  const [results, setResults] = useState<Result | undefined>(undefined)
  const [searchParams] = useSearchParams()
  const { load, data, type } = useFetcher<Result>()
  const pageRef = useRef(0)
  const setRef = useRef(new Set<number>())
  const hasMore = results ? results.page < results.total_pages : false
  const isLoading =
    type === 'normalLoad' ||
    (results !== undefined && results.page !== pageRef.current)
  const location = useLocation()
  const keyRef = useRef(location.key)

  console.log(location)

  // 避免开发模式调两次log
  const initLoadRef = useRef(false)
  useEffect(() => {
    if (location.key !== keyRef.current) {
      keyRef.current = location.key
      setResults(undefined)
      // initLoadRef.current = false
    }
  }, [location.key])

  useEffect(() => {
    if (results === undefined) {
      // const json = sessionStorage.getItem('searchResults')
      // if (json) {
      //   const res: Result = JSON.parse(json)
      //   res.results.forEach((r) => setRef.current.add(r.id))
      //   pageRef.current = res.page
      //   setResults(res)
      const res = cache[location.key]

      if (res) {
        res.results.forEach((r) => setRef.current.add(r.id))
        pageRef.current = res.page
        setResults(res)
      } else if (initLoadRef.current === false) {
        initLoadRef.current = true
      } else {
        console.log(searchParams.toString())
        load(`/api/search?` + searchParams.toString())
      }
    }
  }, [results, searchParams, load, location.key])
  useStoreScroll(results)

  useEffect(() => {
    if (results === undefined && type !== 'normalLoad' && data !== undefined) {
      pageRef.current = data.page
      setResults(data)
      console.log('init', data)
      cache[location.key] = data
    }

    if (
      results !== undefined &&
      data !== undefined &&
      results.page !== data.page
    ) {
      pageRef.current = data.page
      const newResults = {
        ...results,
        page: data.page,
        results: [
          ...results.results,
          ...data.results.filter((r) => !setRef.current.has(r.id)),
        ],
      }
      setResults(newResults)
      cache[location.key] = newResults
    }
  }, [data, location.key, results, type])

  const fetchMore = useCallback(() => {
    if (results !== undefined) {
      pageRef.current = results.page + 1
      searchParams.set('page', pageRef.current.toString())
      load(`/api/search?` + searchParams.toString())
    }
  }, [load, searchParams, results])

  return {
    results: results ?? emptyResult,
    hasMore,
    fetchMore,
    isLoading,
  }
}

export default useTmdbQuery
