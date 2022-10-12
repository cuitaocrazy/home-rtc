import type { LoaderArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData, useSearchParams } from '@remix-run/react'
import React, { Suspense } from 'react'

import Grid from '~/components/Grid'
import SearchCard from '~/components/SearchCard'
import useIntersection from '~/hook/useIntersection'
import useTmdbQuery from '~/hook/useTmdbQuery'
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

function getScope(scope: string | null) {
  return (scope || 'multi') as 'multi' | 'movie' | 'tv'
}

export async function loader(args: LoaderArgs) {
  const searchParams = new URL(args.request.url).searchParams
  const scope = getScope(searchParams.get('scope'))
  searchParams.delete('scope')
  searchParams.delete('_data')

  let results: SearchResults<TV | Movie | Person | Multi>

  if (scope === 'tv') {
    results = await searchTv(searchParams)
  } else if (scope === 'movie') {
    results = await searchMovie(searchParams)
  } else {
    results = await searchMulti(searchParams)
  }

  return json(results, { headers: { 'Cache-Control': 'max-age=3600' } })
}

export const meta: MetaFunction = () => {
  return {
    title: 'Search',
  }
}

export default function Search() {
  const [searchParams] = useSearchParams()

  const { results, hasMore, isLoading, fetchMore } = useTmdbQuery()
  const ref = useIntersection(fetchMore, isLoading, hasMore)
  const scope = getScope(searchParams.get('scope'))

  const Ct = React.lazy(() => import('~/components/Ct'))
  const cards = results.map((result, idx) => {
    return (
      <SearchCard
        key={result.id}
        searchScope={scope}
        item={result}
        ref={idx === results.length - 1 ? ref : undefined}
      />
    )
  })

  return (
    <div className="m-8">
      <Suspense fallback={<div>loading...</div>}>
        <Ct />
      </Suspense>
      <Grid>{cards}</Grid>
    </div>
  )
}
