import type { FC } from 'react'

import LinkCard from './LinkCard'
type SmallCardProps = {
  title: string
  description: string
  image: string
  to: string
  alt: string
}

const SmallCard: FC<SmallCardProps> = ({
  title,
  description,
  image,
  to,
  alt,
}) => {
  return (
    <LinkCard alt={alt} img={image} to={to} cardWidth="w-24" imgHeight="h-32">
      <div className="m-1">
        <h5 className="text-xs text-gray-900">{title}</h5>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </LinkCard>
  )
}

export default SmallCard
