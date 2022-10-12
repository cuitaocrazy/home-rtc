import {
  useBeforeUnload,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react'
import { useCallback, useRef, useState } from 'react'
import { useEffect } from 'react'

import type { SearchResults } from '~/services/tmdb_models'

// 不是最佳实践，放弃使用
function useTmdbQuery<T extends { id: number }>() {
  const initResults = useLoaderData() as SearchResults<T>
  const [searchParams] = useSearchParams()
  const [results, setResults] = useState(initResults)
  const { load, data, type } = useFetcher<SearchResults<T>>()
  const resultRef = useRef(results)
  const setRef = useRef(new Set(initResults.results.map((r) => r.id)))
  const hasMore = results.page < results.total_pages
  const isLoading =
    type === 'normalLoad' ||
    (resultRef.current !== initResults && resultRef.current.page !== data?.page)

  useBeforeUnload(() => {
    console.log('unloading')
  })
  useEffect(() => {
    resultRef.current = initResults
    setRef.current = new Set(initResults.results.map((r) => r.id))
    setResults(initResults)
  }, [initResults])

  useEffect(() => {
    if (data) {
      resultRef.current = {
        ...resultRef.current,
        page: data.page,
        results: [
          ...resultRef.current.results,
          ...data.results.filter((r) => !setRef.current.has(r.id)),
        ],
      }
      data.results.forEach((r) => setRef.current.add(r.id))
      setResults(resultRef.current)
    }
  }, [data])

  const fetchMore = useCallback(() => {
    searchParams.set('page', (resultRef.current.page + 1).toString())
    load(`/search?` + searchParams.toString())
  }, [load, searchParams])

  return {
    results: results.results,
    hasMore,
    fetchMore,
    isLoading,
  }
}

export default useTmdbQuery
