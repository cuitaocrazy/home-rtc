import { useLoaderData } from '@remix-run/react'
import type { LoaderArgs } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'

import Grid from '~/components/Grid'
import { StarIcon } from '~/components/icons'
import LinkCard from '~/components/LinkCard'
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

  return json({
    person,
    movieCredits,
    tvCredits,
  })
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
            <LinkCard
              id={movie.id}
              key={movie.id}
              alt={movie.title || ''}
              img={getImageUrl(movie.poster_path, 200)}
              adult={movie.adult || false}
              type="movie"
            >
              <div className="m-2">
                <h5 className="text-sm text-gray-900">{movie.title}</h5>
                <p className="text-xs text-gray-600">{movie.release_date}</p>
                <p className="flex items-center gap-1 text-xs text-gray-600">
                  <StarIcon className="h-4 w-4" />
                  {movie.vote_average}
                </p>
                <p className="text-xs text-gray-600">{movie.character}</p>
              </div>
            </LinkCard>
          )
        })}
      </Grid>
      <p>参与剧组</p>
      <Grid>
        {data.movieCredits.crew.map((movie) => {
          return (
            <LinkCard
              key={movie.id}
              alt={movie.title || ''}
              img={getImageUrl(movie.poster_path, 200)}
              adult={movie.adult || false}
              type="movie"
              id={movie.id}
            >
              <div className="m-2">
                <h5 className="text-sm text-gray-900">{movie.title}</h5>
                <p className="text-xs text-gray-600">{movie.release_date}</p>
                <p className="flex items-center gap-1 text-xs text-gray-600">
                  <StarIcon className="h-4 w-4" />
                  {movie.vote_average}
                </p>
                <p className="text-xs text-gray-600">{movie.job}</p>
              </div>
            </LinkCard>
          )
        })}
      </Grid>
      <p>电视剧</p>
      <p>出演作品</p>
      <Grid>
        {data.tvCredits.cast.map((tv) => {
          return (
            <LinkCard
              key={tv.id}
              alt={tv.name || ''}
              img={getImageUrl(tv.poster_path, 200)}
              adult={tv.adult || false}
              type="tv"
              id={tv.id}
            >
              <div className="m-2">
                <h5 className="text-sm text-gray-900">{tv.name}</h5>
                <p className="text-xs text-gray-600">{tv.first_air_date}</p>
                <p className="flex items-center gap-1 text-xs text-gray-600">
                  <StarIcon className="h-4 w-4" />
                  {tv.vote_average}
                </p>
                <p className="text-xs text-gray-600">{tv.character}</p>
              </div>
            </LinkCard>
          )
        })}
      </Grid>
      <p>参与剧组</p>
      <Grid>
        {data.tvCredits.crew.map((tv) => {
          return (
            <LinkCard
              key={tv.id}
              alt={tv.name || ''}
              img={getImageUrl(tv.poster_path, 200)}
              adult={tv.adult || false}
              type="tv"
              id={tv.id}
            >
              <div className="m-2">
                <h5 className="text-sm text-gray-900">{tv.name}</h5>
                <p className="text-xs text-gray-600">{tv.first_air_date}</p>
                <p className="flex items-center gap-1 text-xs text-gray-600">
                  <StarIcon className="h-4 w-4" />
                  {tv.vote_average}
                </p>
                <p className="text-xs text-gray-600">{tv.job}</p>
              </div>
            </LinkCard>
          )
        })}
      </Grid>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  )
}
