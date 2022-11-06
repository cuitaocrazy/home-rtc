import { useEffect, useRef } from 'react'

function useSelectEvent(
  // inputRef: React.RefObject<HTMLElement>,
  optionRef: React.RefObject<HTMLElement>,
) {
  useEffect(() => {
    if (optionRef.current) {
      const clickHandler = (e: MouseEvent) => {
        console.log('click3', e.eventPhase, performance.now())
      }
      const ele = optionRef.current
      ele.addEventListener('click', clickHandler)

      return () => {
        ele.removeEventListener('click', clickHandler)
      }
    }
  }, [optionRef])
}
function Test3() {
  const click1Ref = useRef<HTMLDivElement>(null)
  const click2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const clickHandler = (e: MouseEvent): void => {
      console.log('window click', e.eventPhase, performance.now())
    }
    window.addEventListener('click', clickHandler)

    return () => {
      window.removeEventListener('click', clickHandler)
    }
  }, [])

  useEffect(() => {
    const clickHandler = (e: MouseEvent): void => {
      console.log('document click', e.eventPhase, performance.now())
    }
    document.addEventListener('click', clickHandler)

    return () => {
      document.removeEventListener('click', clickHandler)
    }
  }, [])

  useEffect(() => {
    const clickHandler = (e: MouseEvent): void => {
      console.log(
        'document.documentElement click',
        e.eventPhase,
        performance.now(),
      )
    }
    document.documentElement.addEventListener('click', clickHandler)

    return () => {
      document.documentElement.removeEventListener('click', clickHandler)
    }
  }, [])

  useEffect(() => {
    if (click1Ref.current) {
      const clickHandler = (e: MouseEvent) => {
        console.log('click1', e.eventPhase, performance.now())
      }
      const ele = click1Ref.current
      ele.addEventListener('click', clickHandler)
      ele.addEventListener('click', clickHandler, true)

      return () => {
        ele.removeEventListener('click', clickHandler)
        ele.removeEventListener('click', clickHandler, true)
      }
    }
  }, [])

  useEffect(() => {
    if (click2Ref.current) {
      const clickHandler = (e: MouseEvent) => {
        console.log('click2', e.eventPhase, performance.now())
      }
      const ele = click2Ref.current
      ele.addEventListener('click', clickHandler)

      return () => {
        ele.removeEventListener('click', clickHandler)
      }
    }
  }, [])
  useSelectEvent(click1Ref)
  return (
    <div>
      <div
        ref={click1Ref}
        onClick={(e) =>
          console.log('zj click1', e.eventPhase, performance.now())
        }
      >
        click1
        <div
          ref={click2Ref}
          onClick={(e) =>
            console.log('zj click2', e.eventPhase, performance.now())
          }
        >
          click2
        </div>
      </div>
    </div>
  )
}

export default Test3
