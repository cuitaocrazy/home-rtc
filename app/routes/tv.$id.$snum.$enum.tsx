import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import Grid from '~/components/Grid'
import SmallCard from '~/components/SmallCard'
import { useMotionLoaderData } from '~/hook/useMotionLoaderData'
import { getTVEpisodeDetails } from '~/services/tmdb.server'
import { aggObj, getImageUrl } from '~/utils'

export async function loader({ params }: LoaderArgs) {
  const { id, snum, enum: enum_ } = params
  const data = await getTVEpisodeDetails(
    Number(id),
    Number(snum),
    Number(enum_),
  )

  data.guest_stars = aggObj(data.guest_stars, 'character')
  data.crew = aggObj(data.crew, 'job')
  return json(data) //, { headers: { 'Cache-Control': 'max-age=3600' } })
}
export default function () {
  const data = useMotionLoaderData<typeof loader>()
  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.overview}</p>
      <p>{data.air_date}</p>
      <p>{`第 ${data.season_number} 季 第 ${data.episode_number} 集`}</p>
      <p>{data.still_path}</p>
      <p>演员</p>
      <Grid min={96}>
        {data.guest_stars.map((actor) => {
          return (
            <SmallCard
              key={actor.id}
              alt={actor.name || ''}
              title={actor.name}
              description={actor.character || ''}
              image={getImageUrl(actor.profile_path, 92)}
              to={`/person/${actor.id}`}
            />
          )
        })}
      </Grid>
      <p>剧组</p>
      <Grid min={96}>
        {data.crew.map((crew) => {
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
    </div>
  )
}
