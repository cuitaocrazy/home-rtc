import { faker } from '@faker-js/faker'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp'
import clsx from 'clsx'
import { useEffect, useLayoutEffect, useState } from 'react'

import { useSelect } from '../hook/useSelect'

export const useMyLayoutEffect: typeof useLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

function Test2() {
  const [data, setData] = useState<{ id: number; name: string }[]>([])
  const {
    isOpen,
    selected,
    rootRefHandler,
    itemRefHandler,
    menuRefHandler,
    inputRefHandler,
  } = useSelect<typeof data[number]>()

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
    <div className="relative w-full" ref={rootRefHandler}>
      <div className="relative">
        <input
          ref={inputRefHandler}
          type="text"
          placeholder="select"
          value={selected?.name ?? ''}
          readOnly
          className="w-full py-2 pl-2 pr-6"
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </span>
      </div>
      {isOpen && (
        <ul
          className="bg-gray-300 absolute w-full max-h-32 overflow-y-auto"
          ref={menuRefHandler}
        >
          {data.map((item) => (
            <li
              ref={itemRefHandler(item.id, item)}
              key={item.id}
              className={clsx('pl-2', {
                'bg-gray-700': selected?.id === item.id,
              })}
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
