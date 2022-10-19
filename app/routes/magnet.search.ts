import { json } from '@remix-run/node'
import type { LoaderArgs } from '@remix-run/server-runtime'

import { generateMagnetLink, getSizeDisplay } from '~/utils'

function getCategoryName(category: string) {
  if (category === '0') {
    return ''
  }

  let main = category

  if (category[0] === '1') {
    main = 'Audio'
  }
  if (category[0] === '2') {
    main = 'Video'
  }
  if (category[0] === '3') {
    main = 'Application'
  }
  if (category[0] === '4') {
    main = 'Games'
  }
  if (category[0] === '5') {
    main = 'Porn'
  }
  if (category[0] === '6') {
    main = 'Other'
  }

  let sub = ''
  if (category === '101') {
    sub = 'Music'
  }
  if (category === '102') {
    sub = 'Audio Books'
  }
  if (category === '103') {
    sub = 'Sound Clips'
  }
  if (category === '104') {
    sub = 'FLAC'
  }
  if (category === '199') {
    sub = 'Other'
  }
  if (category === '201') {
    sub = 'Movies'
  }
  if (category === '202') {
    sub = 'Movies DVDR'
  }
  if (category === '203') {
    sub = 'Music Videos'
  }
  if (category === '204') {
    sub = 'Movie Clips'
  }
  if (category === '205') {
    sub = 'TV Shows'
  }
  if (category === '206') {
    sub = 'Handheld'
  }
  if (category === '207') {
    sub = 'HD - Movies'
  }
  if (category === '208') {
    sub = 'HD - TV Shows'
  }
  if (category === '209') {
    sub = '3D'
  }
  if (category === '299') {
    sub = 'Other'
  }
  if (category === '301') {
    sub = 'Windows'
  }
  if (category === '302') {
    sub = 'Mac'
  }
  if (category === '303') {
    sub = 'UNIX'
  }
  if (category === '304') {
    sub = 'Handheld'
  }
  if (category === '305') {
    sub = 'IOS (iPad/iPhone)'
  }
  if (category === '306') {
    sub = 'Android'
  }
  if (category === '399') {
    sub = 'Other OS'
  }
  if (category === '401') {
    sub = 'PC'
  }
  if (category === '402') {
    sub = 'Mac'
  }
  if (category === '403') {
    sub = 'PSx'
  }
  if (category === '404') {
    sub = 'XBOX360'
  }
  if (category === '405') {
    sub = 'Wii'
  }
  if (category === '406') {
    sub = 'Handheld'
  }
  if (category === '407') {
    sub = 'IOS (iPad/iPhone)'
  }
  if (category === '408') {
    sub = 'Android'
  }
  if (category === '499') {
    sub = 'Other'
  }
  if (category === '501') {
    sub = 'Movies'
  }
  if (category === '502') {
    sub = 'Movies DVDR'
  }
  if (category === '503') {
    sub = 'Pictures'
  }
  if (category === '504') {
    sub = 'Games'
  }
  if (category === '505') {
    sub = 'HD - Movies'
  }
  if (category === '506') {
    sub = 'Movie Clips'
  }
  if (category === '599') {
    sub = 'Other'
  }
  if (category === '601') {
    sub = 'E-books'
  }
  if (category === '602') {
    sub = 'Comics'
  }
  if (category === '603') {
    sub = 'Pictures'
  }
  if (category === '604') {
    sub = 'Covers'
  }
  if (category === '605') {
    sub = 'Physibles'
  }
  if (category === '699') {
    sub = 'Other'
  }

  return main + ' > ' + sub
}

export type TPBQueryItem = {
  id: string
  name: string
  info_hash: string
  leechers: string
  seeders: string
  num_files: string
  size: string
  username: string
  added: string
  status: string
  category: string
  imdb: string
  magnet_link: string
}

export async function loader({ request }: LoaderArgs) {
  const query = new URL(request.url).searchParams.get('query')

  if (query) {
    const results: TPBQueryItem[] = await fetch(
      `https://apibay.org/q.php?q=${query}&cat=0`,
    ).then((res) => {
      if (res.status >= 300 || res.status < 200) {
        throw json(
          { error: 'Error fetching data from TPB' },
          { status: res.status },
        )
      }
      return res.json()
    })

    return json(
      results.map((res) => ({
        id: res.id,
        name: res.name,
        info_hash: res.info_hash,
        leechers: res.leechers,
        seeders: res.seeders,
        num_files: res.num_files,
        imdb: res.imdb,
        category: getCategoryName(res.category),
        added: new Date(+res.added * 1000).toLocaleString(),
        size: getSizeDisplay(+res.size),
        magnet_link: generateMagnetLink(res.info_hash, res.name),
      })),
      { headers: { 'Cache-Control': 'max-age=3600' } },
    )
  }

  throw json({ error: 'No query provided' }, { status: 400 })
}
