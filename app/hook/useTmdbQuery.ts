import {
  useBeforeUnload,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react'
import { useCallback, useRef, useState } from 'react'
import { useEffect } from 'react'

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

let flag = false
let initData: Result = emptyResult
function getInitData() {
  if (typeof sessionStorage !== 'undefined' && !flag) {
    flag = true

    const data = sessionStorage.getItem('searchResults')
    if (data) {
      initData = JSON.parse(data)
    }
  }

  return initData
}
function useTmdbQuery() {
  const initResults = emptyResult
  const [searchParams] = useSearchParams()
  const [results, setResults] = useState(initResults)
  const { load, data, type } = useFetcher<Result>()
  const resultRef = useRef(results)
  const setRef = useRef(new Set(initResults.results.map((r) => r.id)))
  const hasMore = results.page < results.total_pages
  const isLoading =
    type === 'normalLoad' ||
    (resultRef.current !== initResults && resultRef.current.page !== data?.page)

  console.log(results)
  useEffect(() => {
    resultRef.current = getInitData()
    setRef.current = new Set(resultRef.current.results.map((r) => r.id))
    setResults(getInitData())
  }, [])

  // useBeforeUnload(() => {
  //   console.log('unloading')
  // })
  // useEffect(() => {
  //   resultRef.current = initResults
  //   setRef.current = new Set(initResults.results.map((r) => r.id))
  //   setResults(initResults)
  // }, [initResults])

  // useEffect(() => {
  //   if (data) {
  //     resultRef.current = {
  //       ...resultRef.current,
  //       page: data.page,
  //       results: [
  //         ...resultRef.current.results,
  //         ...data.results.filter((r) => !setRef.current.has(r.id)),
  //       ],
  //     }
  //     data.results.forEach((r) => setRef.current.add(r.id))
  //     setResults(resultRef.current)
  //   }
  // }, [data])

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
