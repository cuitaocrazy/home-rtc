import { Link } from '@remix-run/react'
import React from 'react'

import Card from './Card'

type LinkCardProps = {
  alt: string
  img: string
  cardWidth?: string
  children?: React.ReactNode
  to: string
  imgHeight?: string
  newTag?: boolean
  prefetch?: boolean
}

function LinkCard(
  {
    alt,
    img,
    cardWidth,
    children,
    to,
    imgHeight,
    newTag = false,
    prefetch = false,
  }: LinkCardProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  return (
    <Link
      ref={ref as React.RefObject<HTMLAnchorElement>}
      to={to}
      target={newTag ? '_blank' : undefined}
      rel={newTag ? 'noopener noreferrer' : undefined}
      prefetch={prefetch ? 'intent' : 'none'}
    >
      <Card img={img} alt={alt} imgHeight={imgHeight} cardWidth={cardWidth}>
        {children}
      </Card>
    </Link>
  )
}

export default React.forwardRef(LinkCard)
