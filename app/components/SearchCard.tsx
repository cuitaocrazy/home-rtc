import React from 'react'

import type { Movie, Person, TV } from '~/services/tmdb_models'
import { getMediaProp } from '~/services/tmdb_models'
import { getImageUrl } from '~/utils'

import { StarIcon } from './icons'
import LinkCard from './LinkCard'

interface SearchCard {
  item: Movie | TV | Person
  ctg: 'movie' | 'tv' | 'multi'
}

export default React.forwardRef<HTMLElement, SearchCard>(
  function SimpleMovieInfoCard({ item, ctg }, ref) {
    const title: string =
      getMediaProp(item, 'title') || getMediaProp(item, 'name')
    const imagePath: string | undefined =
      getMediaProp(item, 'poster_path') || getMediaProp(item, 'profile_path')
    const itemType = ctg === 'multi' ? item.media_type : ctg
    const voteAverage: number = getMediaProp(item, 'vote_average') || 0
    const releaseDate: string | undefined =
      getMediaProp(item, 'release_date') || getMediaProp(item, 'first_air_date')
    const adult: boolean = getMediaProp(item, 'adult')

    return (
      <LinkCard
        ref={ref as React.RefObject<HTMLAnchorElement>}
        alt={title}
        adult={adult}
        type={itemType}
        img={getImageUrl(imagePath, 185)}
        id={item.id}
        prefetch
        // newTag={true}
      >
        <div className="m-2">
          <h5 className="text-sm text-gray-900">{title}</h5>
          <p className="text-xs text-gray-600">
            {releaseDate || getMediaProp(item, 'known_for_department')}
          </p>
          <p className="flex items-center gap-1 text-xs text-gray-600">
            <StarIcon className="h-4 w-4" />
            {voteAverage}
          </p>
        </div>
      </LinkCard>
    )
  },
)
