import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import Grid from '~/components/Grid'
import SearchCard from '~/components/SearchCard'
import { discoverMovie, discoverTv } from '~/services/tmdb.server'

export async function loader() {
  const [movies, tvs] = await Promise.all([
    discoverMovie(new URLSearchParams()),
    discoverTv(new URLSearchParams()),
  ])

  return json({ movies, tvs }, { headers: { 'Cache-Control': 'max-age=3600' } })
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  return (
    <div>
      <Grid>
        {data.movies.results.map((movie) => (
          <SearchCard key={movie.id} item={movie} searchScope="movie" />
        ))}
      </Grid>
      <Grid>
        {data.tvs.results.map((tv) => (
          <SearchCard key={tv.id} item={tv} searchScope="tv" />
        ))}
      </Grid>
    </div>
  )
}
