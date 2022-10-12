import { Link } from '@remix-run/react'
import React from 'react'

import Card from './Card'

type LinkCardProps = {
  alt: string
  img: string
  cardWidth?: string
  children?: React.ReactNode
  adult: boolean
  type: 'movie' | 'tv' | 'person'
  imgHeight?: string
  newTag?: boolean
  id: number
  prefetch?: boolean
}

function LinkCard(
  {
    alt,
    img,
    cardWidth,
    children,
    adult,
    type,
    imgHeight,
    newTag = false,
    id,
    prefetch = false,
  }: LinkCardProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  return (
    <Link
      ref={ref as React.RefObject<HTMLAnchorElement>}
      to={`/${type}/${id}`}
      target={newTag ? '_blank' : undefined}
      rel={newTag ? 'noopener noreferrer' : undefined}
      prefetch={prefetch ? 'intent' : 'none'}
    >
      <Card
        img={img}
        alt={alt}
        adult={adult}
        type={type}
        imgHeight={imgHeight}
        cardWidth={cardWidth}
      >
        {children}
      </Card>
    </Link>
  )
}

export default React.forwardRef(LinkCard)
