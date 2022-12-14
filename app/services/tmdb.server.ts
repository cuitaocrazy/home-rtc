import { getApiParams } from './imdb_endpoint'
import type {
  Movie,
  MovieCredits,
  MovieDetails,
  Multi,
  Person,
  PersonDetails,
  PersonMovieCredits,
  PersonTVCredits,
  SearchResults,
  TV,
  TVCredits,
  TVDetails,
  TVEpisodeDetails,
  TVSeasonDetails,
} from './tmdb_models'

export async function searchMulti(searchParams: URLSearchParams) {
  const query = searchParams.get('query')
  if (!query) return { page: 0, total_results: 0, total_pages: 0, results: [] }
  const aipParams = getApiParams('search', 'Multi', searchParams)

  return search<Multi>(aipParams)
}

export async function searchMovie(searchParams: URLSearchParams) {
  const query = searchParams.get('query')
  if (!query) return { page: 0, total_results: 0, total_pages: 0, results: [] }
  const aipParams = getApiParams('search', 'Movie', searchParams)

  return search<Movie>(aipParams)
}

export async function searchTv(searchParams: URLSearchParams) {
  const query = searchParams.get('query')
  if (!query) return { page: 0, total_results: 0, total_pages: 0, results: [] }
  const aipParams = getApiParams('search', 'Tv', searchParams)

  return search<TV>(aipParams)
}

export async function searchPerson(searchParams: URLSearchParams) {
  const query = searchParams.get('query')
  if (!query) return { page: 0, total_results: 0, total_pages: 0, results: [] }
  const aipParams = getApiParams('search', 'Person', searchParams)

  return search<Person>(aipParams)
}

async function search<T>(apiParams: {
  url: string
  method: string
}): Promise<SearchResults<T>> {
  const response = await fetch(apiParams.url, { method: apiParams.method })
  const data = await response.json()

  return data
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  const apiParams = getApiParams(
    'movie',
    'Info',
    new URLSearchParams({ id: movieId.toString(), language: 'zh-CN' }),
  )

  const response = await fetch(apiParams.url, { method: apiParams.method })
  const data = await response.json()

  return data
}

export async function getTvDetails(tvId: number): Promise<TVDetails> {
  const apiParams = getApiParams(
    'tv',
    'Info',
    new URLSearchParams({ id: tvId.toString(), language: 'zh-CN' }),
  )

  const response = await fetch(apiParams.url, { method: apiParams.method })
  const data = await response.json()

  return data
}

export async function getPersonDetails(
  personId: number,
): Promise<PersonDetails> {
  const apiParams = getApiParams(
    'person',
    'Info',
    new URLSearchParams({ person_id: personId.toString(), language: 'zh-CN' }),
  )

  const response = await fetch(apiParams.url, { method: apiParams.method })
  const data = await response.json()

  return data
}

export async function getMovieCreditsByPersonId(
  personId: number,
): Promise<PersonMovieCredits> {
  const apiParams = getApiParams(
    'person',
    'MovieCredits',
    new URLSearchParams({ person_id: personId.toString(), language: 'zh-CN' }),
  )

  const response = await fetch(apiParams.url, { method: apiParams.method })
  const data = await response.json()

  return data
}

export async function getTvCreditsByPersonId(
  personId: number,
): Promise<PersonTVCredits> {
  const apiParams = getApiParams(
    'person',
    'TvCredits',
    new URLSearchParams({ person_id: personId.toString(), language: 'zh-CN' }),
  )

  const response = await fetch(apiParams.url, { method: apiParams.method })
  const data = await response.json()

  return data
}

export async function getMovieCredits(movieId: number): Promise<MovieCredits> {
  const apiParams = getApiParams(
    'movie',
    'Credits',
    new URLSearchParams({ id: movieId.toString(), language: 'zh-CN' }),
  )

  const response = await fetch(apiParams.url, { method: apiParams.method })
  const data = await response.json()

  return data
}

export async function getTvCredits(tvId: number): Promise<TVCredits> {
  const apiParams = getApiParams(
    'tv',
    'Credits',
    new URLSearchParams({ id: tvId.toString(), language: 'zh-CN' }),
  )

  const response = await fetch(apiParams.url, { method: apiParams.method })
  const data = await response.json()

  return data
}

export async function getTvExtenalIds(tvId: number): Promise<any> {
  const apiParams = getApiParams(
    'tv',
    'ExternalIds',
    new URLSearchParams({ id: tvId.toString() }),
  )

  const response = await fetch(apiParams.url, { method: apiParams.method })
  const data = await response.json()

  return data
}

export async function discoverMovie(searchParams: URLSearchParams) {
  const aipParams = getApiParams('discover', 'Movie', searchParams)

  return search<Movie>(aipParams)
}

export async function discoverTv(searchParams: URLSearchParams) {
  const aipParams = getApiParams('discover', 'Tv', searchParams)

  return search<TV>(aipParams)
}

export async function getTVSeasonDetails(
  tvId: number,
  seasonNumber: number,
): Promise<TVSeasonDetails> {
  const apiParams = getApiParams(
    'tv',
    'SeasonInfo',
    new URLSearchParams({
      id: tvId.toString(),
      season_number: seasonNumber.toString(),
      language: 'zh-CN',
    }),
  )

  const response = await fetch(apiParams.url, { method: apiParams.method })
  const data = await response.json()

  return data
}

export async function getTVEpisodeDetails(
  tvId: number,
  seasonNumber: number,
  episodeNumber: number,
): Promise<TVEpisodeDetails> {
  const apiParams = getApiParams(
    'tv',
    'EpisodeInfo',
    new URLSearchParams({
      id: tvId.toString(),
      season_number: seasonNumber.toString(),
      episode_number: episodeNumber.toString(),
      language: 'zh-CN',
    }),
  )

  const response = await fetch(apiParams.url, { method: apiParams.method })
  const data = await response.json()

  return data
}
