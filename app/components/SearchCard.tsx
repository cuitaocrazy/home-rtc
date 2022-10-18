import clsx from 'clsx'
import React, { useMemo } from 'react'

import type {
  Movie,
  Multi,
  Person,
  SearchScope,
  TV,
} from '~/services/tmdb_models'
import { getMediaProp } from '~/services/tmdb_models'
import { getImageUrl } from '~/utils'

import { MovieIcon, PersonIcon, StarIcon, TVIcon } from './icons'
import LinkCard from './LinkCard'

type SearchCard = {
  item: Multi | Movie | TV | Person
  searchScope: SearchScope
}

export default React.forwardRef<HTMLElement, SearchCard>(
  function SimpleMovieInfoCard({ item, searchScope }, ref) {
    const title: string =
      getMediaProp(item, 'title') || getMediaProp(item, 'name')
    const imagePath: string | undefined =
      getMediaProp(item, 'poster_path') || getMediaProp(item, 'profile_path')
    const itemType =
      searchScope === 'multi' ? (item as Multi).media_type : searchScope
    const voteAverage: number = getMediaProp(item, 'vote_average') || 0
    const releaseDate: string | undefined =
      getMediaProp(item, 'release_date') || getMediaProp(item, 'first_air_date')
    const adult: boolean = getMediaProp(item, 'adult')

    const icon = useMemo(() => {
      const cls = clsx(
        'h-8 w-8',
        'absolute right-2 top-2 rounded-full border-2 bg-gray-400 p-1 bg-opacity-50 text-gray-700',
        {
          'border-yellow-300': adult,
          'border-transparent': !adult,
        },
      )

      switch (itemType) {
        case 'movie':
          return <MovieIcon className={cls} />
        case 'tv':
          return <TVIcon className={cls} />
        case 'person':
          return <PersonIcon className={cls} />
        default:
          return null
      }
    }, [adult, itemType])

    return (
      <LinkCard
        ref={ref as React.RefObject<HTMLAnchorElement>}
        alt={title}
        to={`/${itemType}/${item.id}`}
        img={getImageUrl(imagePath, 185)}
        // prefetch
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
        {icon}
      </LinkCard>
    )
  },
)
