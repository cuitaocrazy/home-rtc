import clsx from 'clsx'
import React, { useMemo } from 'react'

type CardProps = {
  alt: string
  img?: string
  cardWidth?: string
  children?: React.ReactNode
  imgHeight?: string
}

function Card(
  { cardWidth = 'w-48', imgHeight = 'h-72', alt, img, children }: CardProps,
  ref: React.Ref<HTMLElement>,
) {
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
    </div>
  )
}

export default Card
