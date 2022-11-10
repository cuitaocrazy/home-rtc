import { motion } from 'framer-motion'

const Test3 = () => {
  return (
    <motion.div
      initial={{ opacity: 1, scale: 0.5 }}
      animate={{
        scale: [1, 2, 2, 1, 1],
        rotate: [0, 0, 270, 270, 0],
        borderRadius: ['20%', '20%', '50%', '50%', '20%'],
      }}
      // exit={{ opacity: 0 }}
      // transition={{ duration: 1 }}
    >
      <h1>Test3</h1>
    </motion.div>
  )
}

export default Test3
