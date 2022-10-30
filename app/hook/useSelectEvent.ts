import { useEffect, useState } from 'react'

import useOnClickOutside from './useOnClickOutside'

function useSelectEvent(
  rootRef: React.RefObject<HTMLElement>,
  forceRef: React.RefObject<HTMLElement>,
  optionsRef: React.RefObject<HTMLElement>,
) {
  const [isOpen, setIsOpen] = useState(false)
  useOnClickOutside(rootRef, (e) => {
    setIsOpen(false)

    e.preventDefault()
  })

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      e.preventDefault()
      // setIsOpen((prev) => !prev)
    }

    const element = forceRef.current

    if (element) {
      element.addEventListener('click', listener)

      return () => {
        element.removeEventListener('click', listener)
      }
    }
  }, [forceRef])

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      // console.log('456')
      // console.log(e.cancelable)
      // setIsOpen(false)
      // e.preventDefault()
      // setIsOpen((prev) => !prev)
      console.log('123')
    }

    const element = rootRef.current

    if (element) {
      element.addEventListener('click', listener)

      return () => {
        element.removeEventListener('click', listener)
      }
    }
  }, [rootRef])

  useEffect(() => {
    console.log(optionsRef)
    const listener = (e: MouseEvent) => {
      console.log('aaa')
      console.log(e.cancelable)
      // setIsOpen((prev) => !prev)
    }

    const element = optionsRef.current
    console.log(element)

    if (element) {
      console.log('asdfasdf')
      element.addEventListener('click', listener)

      return () => {
        element.removeEventListener('click', listener)
      }
    }
  }, [optionsRef])

  useEffect(() => {
    if (forceRef.current) {
      const element = forceRef.current
      const clickListener = () => setIsOpen((prev) => !prev)
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
  }, [forceRef])

  return isOpen
}

export default useSelectEvent
