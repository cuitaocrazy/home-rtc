import { useEffect, useRef, useState } from 'react'

export default function Test() {
  const [flag, setFlag] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      console.log('good!')
    }
  }, [ref])

  return (
    <div>
      <button onClick={() => setFlag((prev) => !prev)}>click</button>
      {flag && <div ref={ref}>test</div>}
    </div>
  )
}
