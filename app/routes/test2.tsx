import { faker } from '@faker-js/faker'
import clsx from 'clsx'
import { useCallback, useEffect, useRef, useState } from 'react'

import useOnClickOutside from '~/hook/useOnClickOutside'

function useSelect<T>() {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<T | null>(null)
  const ref = useRef<any>(null)

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const itemClickHandler = useCallback((data: T) => {
    setSelected(data)
  }, [])

  const outsideClickHandler = useCallback((_: MouseEvent | TouchEvent) => {
    if(isOpen) {
      toggle()
    }
  }, [isOpen, toggle])

  useOnClickOutside(ref, outsideClickHandler)

  return {
    isOpen,
    selected,
    toggle,
    itemClickHandler,
    ref
  }
}

function Test2() {
  const [data, setData] = useState<{ id: number; name: string }[]>([])
  const { isOpen, toggle, selected, itemClickHandler, ref } =
    useSelect<typeof data[number]>()

  useEffect(() => {
    if (data.length === 0) {
      setData(
        Array.from({ length: 2000 }, (_, idx) => ({
          id: idx,
          name: faker.name.fullName(),
        })),
      )
    }
  }, [data])

  return (
    <div className="relative" ref={ref}>
      <input
        type="text"
        placeholder="select"
        onClick={() => toggle()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggle()
          }

          if (e.key === 'Escape' && isOpen) {
            toggle()
          }

          if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (!selected) {
              itemClickHandler(data[0])
            } else {
              const idx = data.findIndex((d) => d.id === selected.id)
              if (idx < data.length - 1) {
                itemClickHandler(data[idx + 1])
              } else {
                itemClickHandler(data[0])
              }
            }
          }

          if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (!selected) {
              itemClickHandler(data[data.length - 1])
            } else {
              const idx = data.findIndex((d) => d.id === selected.id)
              if (idx > 0) {
                itemClickHandler(data[idx - 1])
              } else {
                itemClickHandler(data[data.length - 1])
              }
            }
          }
        }}
        value={selected?.name ?? ''}
        readOnly
        className="w-full"
      />
      { isOpen && (
        <ul
          className="bg-gray-300 w-full absolute"
          onMouseDown={(e) => e.preventDefault()}
        >
          {data.map((item) => (
            <li
              key={item.id}
              className={clsx({ 'bg-gray-700': selected?.id === item.id })}
              onClick={(e) => {
                itemClickHandler(item)
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
