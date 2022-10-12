import { useFetcher, useLoaderData } from '@remix-run/react'
import type { LoaderArgs } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'

import Card from '~/components/Card'
import Grid from '~/components/Grid'
import LinkCard from '~/components/LinkCard'
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

  return json({ tv, credits, extenalIds })
}

export default function TV() {
  const data = useLoaderData<typeof loader>()
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
            <Card
              key={season.id}
              adult={false}
              type="tv"
              alt={season.name}
              img={getImageUrl(season.poster_path, 200)}
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
            </Card>
          )
        })}
      </Grid>
      <p>参演</p>
      <Grid min={96}>
        {data.credits.cast.map((cast) => {
          return (
            <LinkCard
              id={cast.id}
              key={cast.id}
              alt={cast.name || ''}
              img={getImageUrl(cast.profile_path, 92)}
              adult={cast.adult || false}
              type="person"
              cardWidth="w-24"
              imgHeight="h-32"
            >
              <div className="m-1">
                <h5 className="text-xs text-gray-900">{cast.name}</h5>
                <p className="text-xs text-gray-600">{cast.character}</p>
              </div>
            </LinkCard>
          )
        })}
      </Grid>
      <p>剧组</p>
      <Grid min={96}>
        {data.credits.crew.map((crew) => {
          return (
            <LinkCard
              id={crew.id}
              key={crew.id}
              alt={crew.name || ''}
              img={getImageUrl(crew.profile_path, 92)}
              adult={crew.adult || false}
              type="person"
              cardWidth="w-24"
              imgHeight="h-32"
            >
              <div className="m-2">
                <h5 className="text-sm text-gray-900">{crew.name}</h5>
                <p className="text-xs text-gray-600">{crew.job}</p>
              </div>
            </LinkCard>
          )
        })}
      </Grid>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  )
}
