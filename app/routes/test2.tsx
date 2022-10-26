import { useSyncExternalStore } from 'react'

export default function Test2() {
  const state = useSyncExternalStore(
    () => {
      console.log('add')
      return () => {
        console.log('remove')
      }
    },
    () => {
      console.log('client getSnapshot')
      return 'client'
    },
    () => {
      console.log('server getSnapshot')
      return 'server'
    },
  )
  console.log(state)
  return <div>{state}</div>
}
