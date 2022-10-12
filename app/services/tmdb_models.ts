export type Movie = {
  id: number
  poster_path?: string
  adult?: boolean
  overview?: string
  release_date?: string
  original_title?: string
  genre_ids?: number[]
  media_type: 'movie'
  original_language?: string
  title?: string
  backdrop_path?: string
  popularity?: number
  vote_count?: number
  video?: boolean
  vote_average?: number
}

export type TV = {
  id: number
  poster_path?: string
  popularity?: number
  overview?: string
  backdrop_path?: string
  vote_average?: number
  media_type: 'tv'
  first_air_date?: string
  origin_country?: string[]
  genre_ids?: number[]
  original_language?: string
  vote_count?: number
  name?: string
  original_name?: string
}

export type Person = {
  id: number
  profile_path?: string
  adult?: boolean
  media_type: 'person'
  known_for?: (Movie | TV)[]
  name?: string
  popularity?: number
  known_for_department?: string
}

export type SearchResults<T> = {
  page: number
  total_results: number
  total_pages: number
  results: T[]
}

export function getMediaProp<T>(
  item: Movie | TV | Person,
  propName: keyof Movie | keyof TV | keyof Person,
): T {
  return (item as any)[propName]
}

export type MovieDetails = {
  adult?: boolean
  backdrop_path?: string
  belongs_to_collection?: {
    id: number
    name: string
    poster_path: string
    backdrop_path: string
  }
  budget?: number
  genres?: {
    id: number
    name: string
  }[]
  homepage?: string
  id: number
  imdb_id?: string
  original_language?: string
  original_title?: string
  overview?: string
  popularity?: number
  poster_path?: string
  production_companies?: {
    id: number
    logo_path?: string
    name: string
    origin_country: string
  }[]
  production_countries?: {
    iso_3166_1: string
    name: string
  }[]
  release_date?: string
  revenue?: number
  runtime?: number
  spoken_languages?: {
    iso_639_1: string
    name: string
  }[]
  status?: string
  tagline?: string
  title?: string
  video?: boolean
  vote_average?: number
  vote_count?: number
}

export type TVDetails = {
  backdrop_path?: string
  created_by?: {
    id: number
    credit_id: string
    name: string
    gender: number
    profile_path?: string
  }[]
  episode_run_time?: number[]
  first_air_date?: string
  genres?: {
    id: number
    name: string
  }[]
  homepage?: string
  id: number
  in_production?: boolean
  languages?: string[]
  last_air_date?: string
  last_episode_to_air?: {
    air_date?: string
    episode_number: number
    id: number
    name: string
    overview?: string
    production_code?: string
    season_number: number
    still_path?: string
    vote_average?: number
    vote_count?: number
  }
  name?: string
  next_episode_to_air?: {
    air_date?: string
    episode_number: number
    id: number
    name: string
    overview?: string
    production_code?: string
    season_number: number
    still_path?: string
    vote_average?: number
    vote_count?: number
  }
  networks?: {
    name: string
    id: number
    logo_path?: string
    origin_country: string
  }[]
  number_of_episodes?: number
  number_of_seasons?: number
  origin_country?: string[]
  original_language?: string
  original_name?: string
  overview?: string
  popularity?: number
  poster_path?: string
  production_companies?: {
    id: number
    logo_path?: string
    name: string
    origin_country: string
  }[]
  seasons?: {
    air_date?: string
    episode_count: number
    id: number
    name: string
    overview?: string
    poster_path?: string
    season_number: number
  }[]
  spoken_languages?: {
    english_name: string
    iso_639_1: string
    name: string
  }[]
  status?: string
  tagline?: string
  type?: string
  vote_average?: number
  vote_count?: number
}

export type PersonDetails = {
  birthday?: string
  known_for_department?: string
  deathday?: string
  id: number
  name?: string
  also_known_as?: string[]
  gender?: number
  biography?: string
  popularity?: number
  place_of_birth?: string
  profile_path?: string
  adult?: boolean
  imdb_id?: string
  homepage?: string
}

export type PersonMovieCredits = {
  cast: {
    character?: string
    credit_id?: string
    release_date?: string
    vote_count?: number
    video?: boolean
    adult?: boolean
    vote_average?: number
    title?: string
    genre_ids?: number[]
    original_language?: string
    original_title?: string
    popularity?: number
    id: number
    backdrop_path?: string
    overview?: string
    poster_path?: string
  }[]
  crew: {
    id: number
    department?: string
    original_language?: string
    original_title?: string
    job?: string
    overview?: string
    video?: boolean
    poster_path?: string
    backdrop_path?: string
    title?: string
    popularity?: number
    genre_ids?: number[]
    vote_average?: number
    adult?: boolean
    release_date?: string
    credit_id?: string
  }[]
  id: number
}

export type PersonTVCredits = {
  cast: {
    credit_id?: string
    original_name?: string
    id: number
    genre_ids?: number[]
    character?: string
    name?: string
    poster_path?: string
    vote_count?: number
    vote_average?: number
    popularity?: number
    episode_count?: number
    original_language?: string
    first_air_date?: string
    backdrop_path?: string
    overview?: string
    origin_country?: string[]
    adult?: boolean
  }[]
  crew: {
    id: number
    department?: string
    original_language?: string
    episode_count?: number
    job?: string
    overview?: string
    genre_ids?: number[]
    name?: string
    first_air_date?: string
    backdrop_path?: string
    popularity?: number
    vote_count?: number
    vote_average?: number
    poster_path?: string
    credit_id?: string
    adult?: boolean
  }[]
  id: number
}

export type MovieCredits = {
  cast: {
    adult?: boolean
    gender?: number
    id: number
    known_for_department?: string
    name?: string
    original_name?: string
    popularity?: number
    profile_path?: string
    cast_id?: number
    character?: string
    credit_id?: string
    order?: number
  }[]
  crew: {
    adult?: boolean
    gender?: number
    id: number
    known_for_department?: string
    name?: string
    original_name?: string
    popularity?: number
    profile_path?: string
    credit_id?: string
    department?: string
    job?: string
  }[]
  id: number
}

export type TVCredits = {
  cast: {
    adult?: boolean
    gender?: number
    id: number
    known_for_department?: string
    name?: string
    original_name?: string
    popularity?: number
    profile_path?: string
    character?: string
    credit_id?: string
    order?: number
  }[]
  crew: {
    adult?: boolean
    gender?: number
    id: number
    known_for_department?: string
    name?: string
    original_name?: string
    popularity?: number
    profile_path?: string
    credit_id?: string
    department?: string
    job?: string
  }[]
  id: number
}

export type ExtennalIds = {
  imdb_id?: string
  freebase_mid?: string
  freebase_id?: string
  tvdb_id?: number
  tvrage_id?: number
  facebook_id?: string
  instagram_id?: string
  twitter_id?: string
  id: number
}
