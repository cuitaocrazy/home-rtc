import type { LoaderArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData, useSearchParams } from '@remix-run/react'
import React, { Suspense } from 'react'

import Grid from '~/components/Grid'
import SearchCard from '~/components/SearchCard'
import useIntersection from '~/hook/useIntersection'
import useTmdbQuery from '~/hook/useTmdbQuery2'
import { searchMovie, searchMulti } from '~/services/tmdb.server'
import { searchTv } from '~/services/tmdb.server'
import type {
  Movie,
  Multi,
  Person,
  SearchResults,
  TV,
} from '~/services/tmdb_models'

export const handle = {
  unneededScrollRestoration: true,
}

export const meta: MetaFunction = () => {
  return {
    title: 'Search',
  }
}

function getScope(scope: string | null) {
  return (scope || 'multi') as 'multi' | 'movie' | 'tv'
}

export default function Search() {
  const [searchParams] = useSearchParams()
  const { results, hasMore, isLoading, fetchMore } = useTmdbQuery()
  const ref = useIntersection(fetchMore, isLoading, hasMore)
  const scope = getScope(searchParams.get('scope'))
  // const Ct = React.lazy(() => import('~/components/Ct'))
  const cards = results.results.map((result, idx) => {
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
      <button onClick={() => fetchMore()}>fetchMore</button>
      <Suspense fallback={<div>loading...</div>}>{/* <Ct /> */}</Suspense>
      <Grid>{cards}</Grid>
    </div>
  )
}
