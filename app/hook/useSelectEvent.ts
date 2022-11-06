import { useCallback, useEffect, useState } from 'react'

import useOnClickOutside from './useOnClickOutside'

function useSelectEvent(
  inputRef: React.RefObject<HTMLElement>,
  optionsRef: React.RefObject<HTMLElement>,
) {
  const [isOpen, setIsOpen] = useState(false)

  const onClickOutsideHandler = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (isOpen) {
        if (
          optionsRef.current &&
          optionsRef.current.contains(e.target as Node)
        ) {
          return
        }
        setIsOpen(false)
        e.preventDefault()
      }
    },
    [isOpen, optionsRef],
  )
  useOnClickOutside(inputRef, onClickOutsideHandler)

  // useEffect(() => {
  //   const listener = (e: MouseEvent) => {
  //     e.preventDefault()
  //   }

  //   const element = forceRef.current

  //   if (element) {
  //     element.addEventListener('click', listener)

  //     return () => {
  //       element.removeEventListener('click', listener)
  //     }
  //   }
  // }, [forceRef])

  // useEffect(() => {
  //   const listener = (e: MouseEvent) => {}

  //   const element = rootRef.current

  //   if (element) {
  //     element.addEventListener('click', listener)

  //     return () => {
  //       element.removeEventListener('click', listener)
  //     }
  //   }
  // }, [rootRef])

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      console.log('outside click')
    }

    const element = optionsRef.current

    if (element) {
      element.addEventListener('click', listener)

      return () => {
        element.removeEventListener('click', listener)
      }
    }
  }, [optionsRef, isOpen])

  useEffect(() => {
    if (inputRef.current) {
      const element = inputRef.current
      const clickListener = () => {
        setIsOpen((prev) => !prev)
      }
      const keyListener = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          setIsOpen((prev) => !prev)
        }
      }
      element.addEventListener('click', clickListener)
      element.addEventListener('keydown', keyListener)

      return () => {
        element.removeEventListener('click', clickListener)
        element.removeEventListener('keydown', keyListener)
      }
    }
  }, [inputRef])

  return isOpen
}

export default useSelectEvent
