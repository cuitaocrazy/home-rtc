import clsx from 'clsx'
import React, { useMemo } from 'react'

import { MovieIcon, PersonIcon, TVIcon } from './icons'

type CardProps = {
  alt: string
  img?: string
  cardWidth?: string
  children?: React.ReactNode
  adult: boolean
  type: 'movie' | 'tv' | 'person'
  imgHeight?: string
}

function Card(
  {
    adult,
    type,
    cardWidth = 'w-48',
    imgHeight = 'h-72',
    alt,
    img,
    children,
  }: CardProps,
  ref: React.Ref<HTMLElement>,
) {
  const icon = useMemo(() => {
    const cls = clsx(
      'h-8 w-8',
      'absolute right-2 top-2 rounded-full border-2 bg-gray-400 p-1 bg-opacity-50 text-gray-700',
      {
        'border-yellow-300': adult,
        'border-transparent': !adult,
      },
    )

    switch (type) {
      case 'movie':
        return <MovieIcon className={cls} />
      case 'tv':
        return <TVIcon className={cls} />
      case 'person':
        return <PersonIcon className={cls} />
      default:
        return <MovieIcon className={cls} />
    }
  }, [type, adult])

  const transitionCls = useMemo(() => clsx('transition-all'), [])

  return (
    <div
      className={clsx(
        'group relative h-full overflow-auto rounded-lg border focus-within:shadow-lg hover:shadow-lg',
        transitionCls,
        cardWidth,
      )}
    >
      <img
        className={clsx(
          'w-full object-cover group-hover:brightness-90',
          imgHeight,
          transitionCls,
        )}
        src={img}
        alt={alt}
      />
      {children}
      {icon}
    </div>
  )
}

export default Card
