import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'

import { addMagnet } from '~/services/qbit.server'

export async function loader({ request }: LoaderArgs) {
  const magnet = new URL(request.url).searchParams.get('magnet')

  if (!magnet) {
    throw json({ error: 'Missing magnet' }, { status: 400 })
  }

  const ret = await addMagnet(magnet, 'movie', '/movies')

  return json(ret, { status: ret === 'Ok.' ? 200 : 400 })
}
