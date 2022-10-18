type MergeIntersection<T> = {
  [K in keyof T]: T[K]
}

type Intersection<T extends any[]> = T extends [infer A, ...infer O]
  ? A & Intersection<O>
  : {}

type BaseField = {
  id: number
  poster_path: string | null
  adult: boolean
  overview: string
  release_date: string
  original_title: string
  genre_ids: number[]
  original_language: string
  title: string
  backdrop_path: string | null
  popularity: number
  vote_count: number
  video: boolean
  vote_average: number

  first_air_date: string
  origin_country: string[]
  name: string
  original_name: string

  profile_path: string | null
  known_for_department?: string

  iso_3166_1: string
  iso_639_1: string
  budget: number
  homepage: string
  imdb_id: string
  revenue: number
  runtime: number
  status: string
  tagline: string

  logo_path: string | null

  credit_id: string
  department: string
  job: string

  gender: number

  production_code: string
  episode_number: number
  air_date: string
  still_path: string | null
  season_number: number
  episode_count: number

  number_of_episodes: number
  number_of_seasons: number
  languages: string[]
  in_production: boolean
  last_air_date: string
  type: string
  episode_run_time: number[]

  birthday: string
  deathday: string
  also_known_as: string[]
  biography: string
  place_of_birth: string

  character: string

  order: number
}

type TmdbTypeCreator<
  RK extends keyof BaseField,
  OK extends Exclude<keyof BaseField, RK> = never,
  EXT extends any[] = [],
> = MergeIntersection<
  {
    [K in RK]: BaseField[K]
  } & {
    [K in OK]?: BaseField[K]
  } & Intersection<EXT>
>

type RTypeHolder<RK extends keyof BaseField> = RK
type OTypeHolder<
  RK extends keyof BaseField,
  OK extends Exclude<keyof BaseField, RK> = never,
> = OK

type RMovieProps = RTypeHolder<
  'id' | 'poster_path' | 'adult' | 'title' | 'backdrop_path'
>
type OMovieProps = OTypeHolder<
  RMovieProps,
  | 'overview'
  | 'release_date'
  | 'original_title'
  | 'genre_ids'
  | 'original_language'
  | 'popularity'
  | 'vote_count'
  | 'video'
  | 'vote_average'
>

export type Movie = TmdbTypeCreator<RMovieProps, OMovieProps>

type RTVProps = RTypeHolder<'id' | 'poster_path' | 'backdrop_path' | 'name'>
type OTVProps = OTypeHolder<
  RTVProps,
  | 'popularity'
  | 'overview'
  | 'vote_average'
  | 'first_air_date'
  | 'origin_country'
  | 'genre_ids'
  | 'original_language'
  | 'vote_count'
  | 'original_name'
>

export type TV = TmdbTypeCreator<RTVProps, OTVProps>

type RPersonProps = RTypeHolder<'id' | 'profile_path' | 'name' | 'adult'>
type OPersonProps = OTypeHolder<
  RPersonProps,
  'popularity' | 'known_for_department'
>

export type Person = TmdbTypeCreator<
  RPersonProps,
  OPersonProps,
  [
    {
      known_for: (
        | TmdbTypeCreator<RMovieProps, OMovieProps, [{ media_type: 'movie' }]>
        | TmdbTypeCreator<RTVProps, OTVProps, [{ media_type: 'tv' }]>
      )[]
    },
  ]
>

export type Multi =
  | TmdbTypeCreator<RMovieProps, OMovieProps, [{ media_type: 'movie' }]>
  | TmdbTypeCreator<RTVProps, OTVProps, [{ media_type: 'tv' }]>
  | TmdbTypeCreator<
      RPersonProps,
      OPersonProps,
      [
        {
          media_type: 'person'
          known_for: (
            | TmdbTypeCreator<
                RMovieProps,
                OMovieProps,
                [{ media_type: 'movie' }]
              >
            | TmdbTypeCreator<RTVProps, OTVProps, [{ media_type: 'tv' }]>
          )[]
        },
      ]
    >

export type SearchResults<T> = {
  page: number
  total_results: number
  total_pages: number
  results: T[]
}

export type SearchScope = 'multi' | 'movie' | 'tv' | 'person'

export function getMediaProp<T>(
  item: Movie | TV | Person | Multi,
  propName: keyof Movie | keyof TV | keyof Person | keyof Multi,
): T {
  return (item as any)[propName]
}

type RCompanyProps = RTypeHolder<'id' | 'logo_path' | 'name'>

type Company = TmdbTypeCreator<
  RCompanyProps,
  never,
  [
    {
      origin_country: string
    },
  ]
>

type RCountryProps = RTypeHolder<'iso_3166_1' | 'name'>

type Country = TmdbTypeCreator<RCountryProps>

type RLanguagesProps = RTypeHolder<'iso_639_1' | 'name'>

type Language = TmdbTypeCreator<RLanguagesProps>

type RGenreProps = RTypeHolder<'id' | 'name'>

type Genre = TmdbTypeCreator<RGenreProps>

type RMovieDetailsProps = RTypeHolder<RMovieProps>
type OMovieDetailsProps = OTypeHolder<
  RMovieDetailsProps,
  | Exclude<OMovieProps, 'genre_ids'>
  | 'budget'
  | 'homepage'
  | 'imdb_id'
  | 'revenue'
  | 'runtime'
  | 'status'
  | 'tagline'
>

export type MovieDetails = TmdbTypeCreator<
  RMovieDetailsProps,
  OMovieDetailsProps,
  [
    {
      genres: Genre[]
      production_companies: Company[]
      production_countries: Country[]
      spoken_languages: Language[]
    },
  ]
>

type RCreatorProps = RTypeHolder<
  'id' | 'name' | 'credit_id' | 'gender' | 'profile_path'
>

type Creator = TmdbTypeCreator<RCreatorProps>

type REpisodeProps = RTypeHolder<
  | 'id'
  | 'name'
  | 'air_date'
  | 'episode_number'
  | 'overview'
  | 'production_code'
  | 'season_number'
  | 'still_path'
  | 'vote_average'
  | 'vote_count'
>

type Episode = TmdbTypeCreator<REpisodeProps>

type RNetworkProps = RTypeHolder<'id' | 'name' | 'logo_path'>

type Network = TmdbTypeCreator<
  RNetworkProps,
  never,
  [
    {
      origin_country: string
    },
  ]
>

type RSeasonProps = RTypeHolder<
  | 'id'
  | 'name'
  | 'air_date'
  | 'episode_count'
  | 'overview'
  | 'poster_path'
  | 'season_number'
>

type Season = TmdbTypeCreator<RSeasonProps>

type RTVDetailsProps = RTypeHolder<RTVProps>
type OTVDetailsProps = OTypeHolder<
  RTVDetailsProps,
  | Exclude<OTVProps, 'genre_ids'>
  | 'episode_run_time'
  | 'homepage'
  | 'in_production'
  | 'languages'
  | 'last_air_date'
  | 'number_of_episodes'
  | 'number_of_seasons'
  | 'status'
  | 'tagline'
  | 'type'
>

export type TVDetails = TmdbTypeCreator<
  RTVDetailsProps,
  OTVDetailsProps,
  [
    {
      created_by: Creator[]
      genres: Genre[]
      last_episode_to_air: Episode
      next_episode_to_air: Episode
      networks: Network[]
      production_companies: Company[]
      seasons: Season[]
      spoken_languages: Language[]
    },
  ]
>

type RPersonDetailsProps = RTypeHolder<RPersonProps>
type OPersonDetailsProps = OTypeHolder<
  RPersonDetailsProps,
  | OPersonProps
  | 'birthday'
  | 'deathday'
  | 'also_known_as'
  | 'gender'
  | 'biography'
  | 'place_of_birth'
  | 'imdb_id'
  | 'homepage'
>

export type PersonDetails = TmdbTypeCreator<
  RPersonDetailsProps,
  OPersonDetailsProps
>

type RPersonMovieCastProps = RTypeHolder<RMovieProps | 'credit_id'>
type OPersonMovieCastProps = OTypeHolder<
  RPersonMovieCastProps,
  OMovieProps | 'character'
>

export type PersonMovieCast = TmdbTypeCreator<
  RPersonMovieCastProps,
  OPersonMovieCastProps
>

type RPersonMovieCrewProps = RTypeHolder<RMovieProps | 'credit_id'>
type OPersonMovieCrewProps = OTypeHolder<
  RPersonMovieCrewProps,
  OMovieProps | 'department' | 'job'
>

export type PersonMovieCrew = TmdbTypeCreator<
  RPersonMovieCrewProps,
  OPersonMovieCrewProps
>

export type PersonMovieCredits = TmdbTypeCreator<
  'id',
  never,
  [
    {
      cast: PersonMovieCast[]
      crew: PersonMovieCrew[]
    },
  ]
>

type RPersonTVCastProps = RTypeHolder<RTVProps | 'credit_id'>
type OPersonTVCastProps = OTypeHolder<
  RPersonTVCastProps,
  OTVProps | 'character' | 'episode_count' | 'adult'
>

export type PersonTVCast = TmdbTypeCreator<
  RPersonTVCastProps,
  OPersonTVCastProps
>

type RPersonTVCrewProps = RTypeHolder<RTVProps | 'credit_id'>
type OPersonTVCrewProps = OTypeHolder<
  RPersonTVCrewProps,
  | Exclude<OTVProps, 'origin_country' | 'original_name'>
  | 'department'
  | 'job'
  | 'episode_count'
  | 'adult'
>

export type PersonTVCrew = TmdbTypeCreator<
  RPersonTVCrewProps,
  OPersonTVCrewProps
>

export type PersonTVCredits = TmdbTypeCreator<
  'id',
  never,
  [
    {
      cast: PersonTVCast[]
      crew: PersonTVCrew[]
    },
  ]
>

type RMovieCastProps = RTypeHolder<RPersonProps | 'credit_id'>
type OMovieCastProps = OTypeHolder<
  RMovieCastProps,
  OPersonProps | 'character' | 'order' | 'gender' | 'original_name'
>

type MovieCast = TmdbTypeCreator<RMovieCastProps, OMovieCastProps>

type RMovieCrewProps = RTypeHolder<RPersonProps | 'credit_id'>
type OMovieCrewProps = OTypeHolder<
  RMovieCrewProps,
  OPersonProps | 'department' | 'job' | 'original_name' | 'gender'
>

type MovieCrew = TmdbTypeCreator<RMovieCrewProps, OMovieCrewProps>

export type MovieCredits = TmdbTypeCreator<
  'id',
  never,
  [
    {
      cast: MovieCast[]
      crew: MovieCrew[]
    },
  ]
>

type RTVCastProps = RTypeHolder<RMovieCastProps>
type OTVCastProps = OTypeHolder<RTVCastProps, OMovieCastProps>

type TVCast = TmdbTypeCreator<RTVCastProps, OTVCastProps>

type RTVCrewProps = RTypeHolder<RMovieCrewProps>
type OTVCrewProps = OTypeHolder<RTVCrewProps, OMovieCrewProps>

type TVCrew = TmdbTypeCreator<RTVCrewProps, OTVCrewProps>

export type TVCredits = TmdbTypeCreator<
  'id',
  never,
  [
    {
      cast: TVCast[]
      crew: TVCrew[]
    },
  ]
>

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
