import { useLoaderData } from '@remix-run/react'
import type { LoaderArgs } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'

import Grid from '~/components/Grid'
import SearchCard from '~/components/SearchCard'
import {
  getMovieCreditsByPersonId,
  getPersonDetails,
  getTvCreditsByPersonId,
} from '~/services/tmdb.server'
import { aggObj, getImageUrl } from '~/utils'

export async function loader({ params }: LoaderArgs) {
  const { id } = params
  const numberId = Number(id)

  if (isNaN(numberId)) {
    throw json({ error: 'id error' }, { status: 404 })
  }

  const [person, movieCredits, tvCredits] = await Promise.all([
    getPersonDetails(numberId),
    getMovieCreditsByPersonId(numberId),
    getTvCreditsByPersonId(numberId),
  ])

  movieCredits.cast = aggObj(movieCredits.cast, 'character')
  movieCredits.crew = aggObj(movieCredits.crew, 'job')
  tvCredits.cast = aggObj(tvCredits.cast, 'character')
  tvCredits.crew = aggObj(tvCredits.crew, 'job')

  return json(
    {
      person,
      movieCredits,
      tvCredits,
    },
    { headers: { 'Cache-Control': 'max-age=3600' } },
  )
}

export default function Person() {
  const data = useLoaderData<typeof loader>()

  return (
    <div>
      <img
        src={
          data.person.profile_path
            ? getImageUrl(data.person.profile_path, 200)
            : '/1665px-No-Image-Placeholder.png'
        }
        alt={data.person.name}
      />
      <p>{data.person.name}</p>
      <p>{data.person.biography}</p>
      <p>电影</p>
      <p>出演作品</p>
      <Grid>
        {data.movieCredits.cast.map((movie) => {
          return (
            <SearchCard key={movie.id} item={movie} searchScope={'movie'} />
          )
        })}
      </Grid>
      <p>参与剧组</p>
      <Grid>
        {data.movieCredits.crew.map((movie) => {
          return (
            <SearchCard key={movie.id} item={movie} searchScope={'movie'} />
          )
        })}
      </Grid>
      <p>电视剧</p>
      <p>出演作品</p>
      <Grid>
        {data.tvCredits.cast.map((tv) => {
          return <SearchCard key={tv.id} item={tv} searchScope={'tv'} />
        })}
      </Grid>
      <p>参与剧组</p>
      <Grid>
        {data.tvCredits.crew.map((tv) => {
          return <SearchCard key={tv.id} item={tv} searchScope={'tv'} />
        })}
      </Grid>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  )
}
