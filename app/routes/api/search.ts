import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'

import { searchMovie, searchMulti, searchTv } from '~/services/tmdb.server'
import type {
  Movie,
  Multi,
  Person,
  SearchResults,
  TV,
} from '~/services/tmdb_models'

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
