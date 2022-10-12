import { useCallback, useRef } from 'react'

export default function useIntersection<T extends HTMLElement>(
  callback: () => void,
  isLoading: boolean,
  hasMore: boolean,
) {
  const intObserver = useRef<IntersectionObserver>()
  const ref = useCallback(
    (node: T) => {
      if (isLoading) return

      if (intObserver.current) {
        intObserver.current.disconnect()
      }

      intObserver.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && hasMore) {
          callback()
        }
      })

      if (node) intObserver.current.observe(node)
    },
    [isLoading, callback, hasMore],
  )

  return ref
}
