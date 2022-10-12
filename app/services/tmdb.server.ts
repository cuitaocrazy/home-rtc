import { getApiParams } from './imdb_endpoint'
import type {
  Movie,
  MovieCredits,
  MovieDetails,
  Person,
  PersonDetails,
  PersonMovieCredits,
  PersonTVCredits,
  SearchResults,
  TV,
  TVCredits,
  TVDetails,
} from './tmdb_models'

export async function searchMulti(searchParams: URLSearchParams) {
  const query = searchParams.get('query')
  if (!query) return { page: 0, total_results: 0, total_pages: 0, results: [] }
  const aipParams = getApiParams('search', 'Multi', searchParams)

  return search<Movie | TV | Person>(aipParams)
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

async function search<T>(apiParams: {
  url: string
  method: string
}): Promise<SearchResults<T>> {
  console.log(apiParams.url)
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
