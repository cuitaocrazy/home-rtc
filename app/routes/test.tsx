import { useEffect, useSyncExternalStore } from 'react'

export default function Test() {
  const state = useSyncExternalStore(
    () => () => {},
    () => 'cuitao',
    () => 'error',
  )

  useEffect(() => {
    console.log(state)
  })
  console.log(state)
  return <div>{state}</div>
}
