import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'
import { useState } from 'react'

const menuVariants: Variants = {
  open: {
    clipPath: 'inset(0% 0% 0% 0% round 5px)',
    opacity: 1,
    transition: {
      type: 'spring',
      bounce: 0,
    },
  },
  closed: {
    clipPath: 'inset(1% 0% 99% 0% round 5px)',
    opacity: 0,
    transition: {
      type: 'spring',
      bounce: 0,
    },
  },
}

const testItems = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

const Test3 = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setIsOpen((prev) => !prev)}>toggle</button>
      <motion.ul
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={menuVariants}
        className="bg-red-300"
      >
        {testItems.map((item) => (
          <motion.li key={item}>{item}</motion.li>
        ))}
      </motion.ul>
    </div>
  )
}

export default Test3
