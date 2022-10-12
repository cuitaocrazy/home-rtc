export function getImageUrl(path: string | undefined, width: number): string {
  if (!path) return '/1665px-No-Image-Placeholder.png'
  return `https://image.tmdb.org/t/p/w${width}${path}`
}

export const genres = {
  28: '动作',
  12: '冒险',
  16: '动画',
  35: '喜剧',
  80: '犯罪',
  99: '纪录片',
  18: '剧情',
  10751: '家庭',
  14: '奇幻',
  36: '历史',
  27: '恐怖',
  10402: '音乐',
  9648: '悬疑',
  10749: '爱情',
  878: '科幻',
  10770: '电视电影',
  53: '惊悚',
  10752: '战争',
  37: '西部',
}

export function aggObj<T extends { id: number }, K extends keyof T>(
  arr: T[],
  key: K,
) {
  return arr.reduce((acc, cur) => {
    const f = acc.find((item) => item.id === cur.id)
    if (f) {
      f[key] = (f[key] + ' / ' + cur[key]) as T[K]
    } else {
      acc.push(cur)
    }
    return acc
  }, [] as T[])
}

export function getSizeDisplay(size: number) {
  if (size < 1024) {
    return size + ' B'
  }
  if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  }
  if (size < 1024 * 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + ' MB'
  }
  return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
}

export function generateMagnetLink(
  hash: string,
  name: string,
  trackers: string[] = [],
) {
  const trackersStr = trackers.map((tracker) => `&tr=${tracker}`).join('')
  return `magnet:?xt=urn:btih:${hash}&dn=${name}${trackersStr}`
}
