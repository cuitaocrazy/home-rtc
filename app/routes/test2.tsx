import { faker } from '@faker-js/faker'
import { useCallback, useEffect, useState } from 'react'

function useSelect<T>() {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<T | null>(null)

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const itemClickHandler = useCallback((data: T) => {
    setSelected(data)
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    selected,
    toggle,
    itemClickHandler,
  }
}

function Test2() {
  const [data, setData] = useState<{ id: number; name: string }[]>([])
  const { isOpen, toggle, selected, itemClickHandler } =
    useSelect<typeof data[number]>()

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
    <div className="relative">
      <input
        type="text"
        placeholder="select"
        onClick={() => toggle()}
        value={selected?.name ?? ''}
        readOnly
        className="w-full"
      />
      {isOpen && (
        <ul
          className="bg-gray-300 w-full absolute"
          onClick={() => console.log('click')}
        >
          {data.map((item) => (
            <li
              key={item.id}
              onClick={(e) => {
                itemClickHandler(item)
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
