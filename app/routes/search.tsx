import type { LoaderArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData, useSearchParams } from '@remix-run/react'

import Grid from '~/components/Grid'
import SearchCard from '~/components/SearchCard'
import { searchMovie, searchMulti } from '~/services/tmdb.server'
import { searchTv } from '~/services/tmdb.server'
import type { Movie, Person, SearchResults, TV } from '~/services/tmdb_models'

function getCtg(ctg: string | null) {
  return (ctg || 'multi') as 'multi' | 'movie' | 'tv'
}

export async function loader(args: LoaderArgs) {
  const searchParams = new URL(args.request.url).searchParams
  const ctg = getCtg(searchParams.get('ctg'))
  searchParams.delete('ctg')
  searchParams.delete('_data')

  let results: SearchResults<TV | Movie | Person>

  if (ctg === 'tv') {
    results = await searchTv(searchParams)
  } else if (ctg === 'movie') {
    results = await searchMovie(searchParams)
  } else {
    results = await searchMulti(searchParams)
  }

  return json(results)
}

export const meta: MetaFunction = () => {
  return {
    title: 'Search',
  }
}

// 不是最佳实践，当使用infinity scroll时，回退不是很好，需要设计好多东西
// 如果想恢复到infinity scroll，可以参考这个commit 5c5a143820c373115b03332ca60b2e47b4c99c6e
export default function Search() {
  const [searchParams] = useSearchParams()
  const ctg = getCtg(searchParams.get('ctg'))
  const page = Number(searchParams.get('page') || 1)
  const data = useLoaderData<typeof loader>()
  const results = data.results
  const cards = results.map((result) => {
    return <SearchCard key={result.id} ctg={ctg} item={result} />
  })
  searchParams.set('page', (page - 1).toString())
  const prevUrl = '/search?' + searchParams.toString()
  searchParams.set('page', (page + 1).toString())
  const nextUrl = '/search?' + searchParams.toString()
  const btnClass =
    'bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center'

  return (
    <div className="m-8">
      <Grid>{cards}</Grid>
      <div className="flex justify-center gap-8 pb-36 pt-8">
        {page !== 1 && (
          <Link prefetch="intent" replace to={prevUrl} className={btnClass}>
            prev
          </Link>
        )}
        {page !== data.total_pages && (
          <Link prefetch="intent" replace to={nextUrl} className={btnClass}>
            next
          </Link>
        )}
      </div>
    </div>
  )
}
