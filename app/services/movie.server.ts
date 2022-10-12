import fs from 'fs'
import path from 'path'

export interface Film {
  title: string
  year: string
  path: string
  resolution: string
  mediaFormat: string
  encoding: string
}

export interface TVSeries {
  title: string
  season: number
  episode: number
  path: string
  resolution: string
  mediaFormat: string
  encoding: string
}

// video extensions
const videoExtensions = ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm']

// video file name regex
const videoRegex = /(.*?)\.(S\d+E\d+|\d+)\.(\d+\w)\.([^.]+?)\.(x\d+)/

async function* readAllVideo(dir: string): AsyncGenerator<string> {
  const files = await fs.promises.readdir(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = await fs.promises.stat(filePath)
    if (stat && stat.isDirectory()) {
      yield* await readAllVideo(filePath)
    } else if (videoExtensions.includes(file.split('.').pop() || '')) {
      yield filePath
    }
  }
}
export const getVideoInfo = async (
  filePath: string,
): Promise<(Film | TVSeries)[]> => {
  const videos: (Film | TVSeries)[] = []
  for await (const file of readAllVideo(filePath)) {
    const match = path.basename(file).match(videoRegex)

    if (!match) continue

    const [, title, seasonEpisode, resolution, mediaFormat, encoding] = match
    if (seasonEpisode.startsWith('S')) {
      const [, season, episode] = seasonEpisode.match(/S(\d+)E(\d+)/) || []
      videos.push({
        title,
        season: parseInt(season),
        episode: parseInt(episode),
        path: file,
        resolution,
        mediaFormat,
        encoding,
      })
    } else {
      videos.push({
        title,
        year: seasonEpisode,
        path: file,
        resolution,
        mediaFormat,
        encoding,
      })
    }
  }
  return videos
}
