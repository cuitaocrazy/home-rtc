import { useFetcher, useLoaderData } from '@remix-run/react'
import type { LoaderArgs } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'

import Grid from '~/components/Grid'
import LinkCard from '~/components/LinkCard'
import SmallCard from '~/components/SmallCard'
import { useMotionLoaderData } from '~/hook/useMotionLoaderData'
import {
  getTvCredits,
  getTvDetails,
  getTvExtenalIds,
} from '~/services/tmdb.server'
import { aggObj, getImageUrl } from '~/utils'

import type { TPBQueryItem } from './magnet.search'

export async function loader({ params }: LoaderArgs) {
  const { id } = params
  const numberId = Number(id)

  if (isNaN(numberId)) {
    throw json({ error: 'id error' }, { status: 404 })
  }

  const [tv, credits, extenalIds] = await Promise.all([
    getTvDetails(numberId),
    getTvCredits(numberId),
    getTvExtenalIds(numberId),
  ])

  credits.cast = aggObj(credits.cast, 'character')
  credits.crew = credits.crew.filter((item) => item.job === 'Director')
  credits.crew = aggObj(credits.crew, 'job')

  return json(
    { tv, credits, extenalIds },
    { headers: { 'Cache-Control': 'max-age=3600' } },
  )
}

export default function TV() {
  const data = useMotionLoaderData<typeof loader>()
  const magnetFetch = useFetcher<TPBQueryItem[]>()
  return (
    <div>
      <img src={getImageUrl(data.tv.poster_path, 200)} alt={data.tv.name}></img>
      <h1>{data.tv.name}</h1>
      {data.tv.genres &&
        data.tv.genres.map((genre) => <span key={genre.id}>{genre.name}</span>)}
      <p>{data.tv.overview}</p>
      <p>{data.tv.first_air_date}</p>
      <p>{data.tv.vote_average}</p>
      <div>
        <p>bt search</p>
        <magnetFetch.Form action="/magnet/search">
          <input
            type="text"
            name="query"
            defaultValue={data.extenalIds.imdb_id || data.tv.original_name}
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
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
      <Grid>
        {data.tv.seasons?.map((season) => {
          return (
            <LinkCard
              key={season.id}
              alt={season.name}
              img={getImageUrl(season.poster_path, 200)}
              to={`/tv/${data.tv.id}/${season.season_number}`}
            >
              <div className="m-2">
                <h5 className="text-sm text-gray-900">{season.name}</h5>
                <p className="text-xs text-gray-600">{season.air_date}</p>
                <p className="text-xs text-gray-600">
                  {(season.season_number <
                  (data.tv.last_episode_to_air?.season_number || 0)
                    ? season.episode_count + '/'
                    : (data.tv.last_episode_to_air?.episode_number || 0) +
                      '/') + season.episode_count}
                </p>
              </div>
            </LinkCard>
          )
        })}
      </Grid>
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
