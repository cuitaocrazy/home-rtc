import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { useEffect, useRef } from 'react'

import Grid from '~/components/Grid'
import SmallCard from '~/components/SmallCard'
import { useMotionLoaderData } from '~/hook/useMotionLoaderData'
import { getMovieCredits, getMovieDetails } from '~/services/tmdb.server'
import { aggObj, getImageUrl } from '~/utils'

import type { TPBQueryItem } from './magnet.search'

export async function loader({ params }: LoaderArgs) {
  const { id } = params
  const numberId = Number(id)

  if (isNaN(numberId)) {
    throw json({ error: 'id error' }, { status: 404 })
  }

  const [movie, credits] = await Promise.all([
    getMovieDetails(numberId),
    getMovieCredits(numberId),
  ])

  credits.cast = aggObj(credits.cast, 'character')
  credits.crew = credits.crew.filter((item) => item.job === 'Director')
  credits.crew = aggObj(credits.crew, 'job')

  return json(
    { movie, credits },
    { headers: { 'Cache-Control': 'max-age=3600' } },
  )
}

export default function Movie() {
  const data = useMotionLoaderData<typeof loader>()
  const magnetFetch = useFetcher<TPBQueryItem[]>()
  const downloadFetch = useFetcher()
  const downloadHandler = async (magnetLink: string) => {
    downloadFetch.submit(
      { magnet: magnetLink },
      { method: 'get', action: '/download' },
    )
  }
  return (
    <div>
      <img
        src={getImageUrl(data.movie.poster_path, 200)}
        alt={data.movie.title}
      ></img>
      <h1>{data.movie.title}</h1>
      {data.movie.genres &&
        data.movie.genres.map((genre) => (
          <span key={genre.id}>{genre.name}</span>
        ))}
      <p>{data.movie.overview}</p>
      <p>{data.movie.release_date}</p>
      <p>{data.movie.vote_average}</p>
      <div>
        <p>bt search</p>
        <magnetFetch.Form action="/magnet/search">
          <input
            type="text"
            name="query"
            defaultValue={data.movie.imdb_id || data.movie.original_title}
          />
          <button type="submit">search</button>
        </magnetFetch.Form>
        <table>
          <thead>
            <tr>
              <th>名称</th>
              <th>大小</th>
              <th>种子数</th>
              <th>文件个数</th>
              <th>Magnet</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {magnetFetch.data &&
              magnetFetch.data.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.size}</td>
                    <td>{item.seeders}</td>
                    <td>{item.num_files}</td>
                    <td>
                      <a href={item.magnet_link}>magnet</a>
                    </td>
                    <button onClick={() => downloadHandler(item.magnet_link)}>
                      download
                    </button>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
      <p>参演</p>
      <Grid min={96}>
        {data.credits.cast.map((cast) => {
          return (
            <SmallCard
              key={cast.id}
              alt={cast.name || ''}
              title={cast.name}
              description={cast.character || ''}
              image={getImageUrl(cast.profile_path, 92)}
              to={`/person/${cast.id}`}
            />
          )
        })}
      </Grid>
      <p>剧组</p>
      <Grid min={96}>
        {data.credits.crew.map((crew) => {
          return (
            <SmallCard
              key={crew.id}
              alt={crew.name || ''}
              title={crew.name}
              description={crew.job || ''}
              image={getImageUrl(crew.profile_path, 92)}
              to={`/person/${crew.id}`}
            />
          )
        })}
      </Grid>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  )
}
