import { faker } from '@faker-js/faker'
import clsx from 'clsx'
import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'
import { useEffect, useLayoutEffect, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

import { useSelect } from '../hook/useSelect'

export const useMyLayoutEffect: typeof useLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

const menuVariants: Variants = {
  open: {
    clipPath: 'inset(0 0 0% 0)',
    opacity: 1,
  },
  closed: {
    clipPath: 'inset(0 0 100% 0)',
    opacity: 0,
  },
}
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
          className="w-full py-2 pl-2 pr-6 focus:outline-none"
        />
        <motion.span
          animate={isOpen ? 'open' : 'closed'}
          className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
        >
          <motion.span
            variants={{ open: { rotate: 180 }, closed: { rotate: 0 } }}
            transition={{ bounce: 0 }}
          >
            <FiChevronDown />
          </motion.span>
        </motion.span>
      </div>
      <motion.ul
        animate={isOpen ? 'open' : 'closed'}
        variants={menuVariants}
        initial={false}
        transition={{ bounce: 0 }}
        className="absolute w-full max-h-32 overflow-y-auto mt-1 border cursor-default"
        ref={menuRefHandler}
      >
        {data.map((item) => (
          <motion.li
            ref={itemRefHandler(item.id, item)}
            key={item.id}
            className={clsx('pl-2 hover:bg-gray-600 transition-all', {
              'bg-gray-700': selected?.id === item.id,
            })}
          >
            {item.name}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}

export default Test2
