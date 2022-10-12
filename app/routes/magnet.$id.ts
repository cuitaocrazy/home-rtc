import type { LoaderArgs } from '@remix-run/server-runtime'

export type TPBFile = {
  name: [string]
  size: [string]
}

export async function loader({ params }: LoaderArgs) {
  const { id } = params
  const res = await fetch(`https://apibay.org/f.php?id=${id}`)
  const data: TPBFile[] = await res.json()
  return data
}
