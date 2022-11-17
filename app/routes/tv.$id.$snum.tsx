import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import Grid from '~/components/Grid'
import LinkCard from '~/components/LinkCard'
import { useMotionLoaderData } from '~/hook/useMotionLoaderData'
import { getTVSeasonDetails } from '~/services/tmdb.server'
import { getImageUrl } from '~/utils'

export async function loader({ params }: LoaderArgs) {
  const { id, snum } = params
  const data = await getTVSeasonDetails(Number(id), Number(snum))
  return json(data, { headers: { 'Cache-Control': 'max-age=3600' } })
}

export default function () {
  const data = useMotionLoaderData<typeof loader>()
  return (
    <Grid min={320}>
      {data.episodes.map((episode) => {
        return (
          <div key={episode.id}>
            <LinkCard
              cardWidth="w-80"
              imgHeight="h-40"
              key={episode.id}
              alt={episode.name}
              img={getImageUrl(episode.still_path, 342)}
              to={`/tv/${episode.show_id}/${episode.season_number}/${episode.episode_number}`}
            >
              <div className="m-2">
                <h5 className="text-sm text-gray-900">{episode.name}</h5>
                <p className="text-xs text-gray-600">{episode.air_date}</p>
                <p className="text-xs text-gray-600">
                  {/* {(season.season_number <
                  (data.tv.last_episode_to_air?.season_number || 0)
                    ? season.episode_count + '/'
                    : (data.tv.last_episode_to_air?.episode_number || 0) +
                      '/') + season.episode_count} */}
                  {`第 ${episode.episode_number} 集`}
                </p>
              </div>
            </LinkCard>
          </div>
        )
      })}
    </Grid>
  )
}
