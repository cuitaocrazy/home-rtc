import type { MetaFunction } from '@remix-run/node'
import { useSearchParams } from '@remix-run/react'
import { Suspense, useMemo } from 'react'

import Grid from '~/components/Grid'
import SearchCard from '~/components/SearchCard'
import type { InfinityQueryOptions } from '~/hook/useInfinityQuery'
import useInfinityQuery from '~/hook/useInfinityQuery'
import type {
  Movie,
  Multi,
  Person,
  SearchResults,
  TV,
} from '~/services/tmdb_models'

export const meta: MetaFunction = () => {
  return {
    title: 'Search',
  }
}

function getScope(scope: string | null) {
  return (scope || 'multi') as 'multi' | 'movie' | 'tv' | 'person'
}

type Result = SearchResults<Multi | Movie | TV | Person>

export default function Search() {
  const infinityOptions = useMemo<InfinityQueryOptions<Result, Result>>(() => {
    return {
      reducer: (state, data) => {
        if (state) {
          const set = new Set(state.results.map((r) => r.id))

          return {
            ...data,
            results: state.results.concat(
              data.results.filter((r) => !set.has(r.id)),
            ),
          }
        }

        return data
      },
      getNextFetchUrl: (stata, location) => {
        if (stata && stata.page < stata.total_pages) {
          const params = new URLSearchParams(location.search)
          params.set('page', String(stata.page + 1))
          return '/api/search?' + params.toString()
        }

        return '/api/search' + location.search
      },
      hasMore: (state) => {
        return !!(state && state.page < state.total_pages)
      },
    }
  }, [])
  const [searchParams] = useSearchParams()
  const { results, ref } = useInfinityQuery(infinityOptions)
  const scope = getScope(searchParams.get('scope'))
  const cards = results?.results.map((result, idx) => {
    return (
      <SearchCard
        key={result.id}
        searchScope={scope}
        item={result}
        ref={idx === results.results.length - 1 ? ref : undefined}
      />
    )
  })
  return (
    <div className="m-8">
      <Suspense fallback={<div>loading...</div>}>{/* <Ct /> */}</Suspense>
      <Grid>{cards}</Grid>
    </div>
  )
}
