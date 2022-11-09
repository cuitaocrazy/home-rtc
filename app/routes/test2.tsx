import { faker } from '@faker-js/faker'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp'
import clsx from 'clsx'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import useOnClickOutside from '~/hook/useOnClickOutside'

const useMyLayoutEffect: typeof useLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

function useSelect<T>(
  getNext: (current: T | null, direction: number) => [string, T],
) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<[string, T] | null>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const rootRef = useRef<HTMLElement | null>(null)
  const inputRef = useRef<HTMLElement | null>(null)
  const itemRefs = useRef<{ [key: string]: HTMLElement }>({})
  const menuRef = useRef<HTMLElement | null>(null)

  const toggle = useCallback(() => {
    if (menuRef.current) {
      setScrollTop(menuRef.current.scrollTop)
    }
    setIsOpen((prev) => !prev)
  }, [])

  useMyLayoutEffect(() => {
    if (isOpen && menuRef.current) {
      menuRef.current.scrollTop = scrollTop
    }
  }, [isOpen])

  const itemRefHandler = useCallback((key: string, ref: HTMLElement | null) => {
    if (ref) {
      itemRefs.current[key] = ref
    } else {
      delete itemRefs.current[key]
    }
  }, [])

  const menuRefHandler = useCallback((ref: HTMLElement | null) => {
    menuRef.current = ref
  }, [])

  const rootRefHandler = useCallback((ref: HTMLElement | null) => {
    rootRef.current = ref
  }, [])

  const inputRefHandler = useCallback((ref: HTMLElement | null) => {
    inputRef.current = ref
  }, [])

  const outsideClickHandler = useCallback(
    (_: MouseEvent | TouchEvent) => {
      if (isOpen) {
        toggle()
      }
    },
    [isOpen, toggle],
  )

  useOnClickOutside(rootRef, outsideClickHandler)

  useEffect(() => {
    if (!inputRef.current) {
      return
    }

    const input = inputRef.current

    const clickHandler = (e: MouseEvent) => {
      toggle()
    }

    input.addEventListener('click', clickHandler)

    return () => {
      input.removeEventListener('click', clickHandler)
    }
  }, [toggle])

  useEffect(() => {
    if (!inputRef.current) {
      return
    }

    const input = inputRef.current

    const keydownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        toggle()
      }

      if (e.key === 'Escape' && isOpen) {
        toggle()
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelected(getNext(selected?.[1] || null, 0))
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelected(getNext(selected?.[1] || null, 1))
      }
    }

    input.addEventListener('keydown', keydownHandler)

    return () => {
      input.removeEventListener('keydown', keydownHandler)
    }
  })

  useMyLayoutEffect(() => {
    if (!selected?.[0] || !menuRef.current) return

    const menuEl = menuRef.current
    const targetEl = itemRefs.current[selected[0]]

    const { top: boundingTop, bottom: boundingBottom } =
      menuEl.getBoundingClientRect()
    const { top: targetTop, bottom: targetBottom } =
      targetEl.getBoundingClientRect()
    const styles = window.getComputedStyle(menuEl)
    const borderTop = parseInt(styles.borderTopWidth, 10)
    const borderBottom = parseInt(styles.borderBottomWidth, 10)

    if (targetTop < boundingTop + borderTop) {
      menuEl.scrollTop -= boundingTop - targetTop + borderTop
    } else if (targetBottom > boundingBottom - borderBottom) {
      menuEl.scrollTop += targetBottom - boundingBottom + borderBottom
    }
  }, [selected])

  return {
    isOpen,
    selected,
    toggle,
    setSelected,
    rootRefHandler,
    itemRefHandler,
    menuRefHandler,
    inputRefHandler,
  }
}

function Test2() {
  const [data, setData] = useState<{ id: number; name: string }[]>([])
  const {
    isOpen,
    toggle,
    selected,
    setSelected,
    rootRefHandler,
    itemRefHandler,
    menuRefHandler,
    inputRefHandler,
  } = useSelect<typeof data[number]>((current, direction) => {
    let next: typeof data[number] | undefined = undefined
    if (direction === 0) {
      if (!current) {
        next = data[0]
      } else {
        const idx = data.findIndex((d) => d.id === current.id)
        const nextIdx = idx + 1
        next = data[nextIdx] || data[0]
      }
    } else {
      if (!current) {
        next = data[data.length - 1]
      } else {
        const idx = data.findIndex((d) => d.id === current.id)
        const nextIdx = idx - 1
        next = data[nextIdx] || data[data.length - 1]
      }
    }

    return [next.id.toString(), next]
  })

  useEffect(() => {
    if (data.length === 0) {
      setData(
        Array.from({ length: 20 }, (_, idx) => ({
          id: idx,
          name: faker.name.fullName(),
        })),
      )
    }
  }, [data])

  return (
    <div className="relative m-1 w-56" ref={rootRefHandler}>
      <div className="relative">
        <input
          ref={inputRefHandler}
          type="text"
          placeholder="select"
          value={selected?.[1].name ?? ''}
          readOnly
          className="w-full border py-2 pl-2 pr-6 focus:outline-none"
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </span>
      </div>
      {isOpen && (
        <ul
          className="bg-gray-300 w-full max-h-32 overflow-y-auto pl-2"
          onMouseDown={(e) => e.preventDefault()}
          ref={menuRefHandler}
        >
          {data.map((item) => (
            <li
              ref={(el) => itemRefHandler(`${item.id}`, el)}
              key={item.id}
              className={clsx({ 'bg-gray-700': selected?.[1].id === item.id })}
              onClick={(e) => {
                setSelected([`${item.id}`, item])
                toggle()
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Test2
