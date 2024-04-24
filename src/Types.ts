export type Tournament = {
  id: number
  name: string
  formuPostLink?: string
  isTeamTourney: boolean
  format: '2v2' | '3v3' | '4v4'
  maxTeamSize: number
  rankRange: string

  rounds: Round[]
  players: Player[]
  teams: Team[]
  staff: Staff[]
}

export type Round = {
  id: number
  name: string
  mappool: Map[]
  mapSuggestions: Map[]
}

export type Map = {
  id: number
  orderNumber: string
  mod: string
  name: string
  artist: string
  version: string
  difficulty_rating: number
  bpm: number
  total_length: number
  cs: number
  ar: number
  accuracy: number
  mapper: string
  url: string
  image: string
  notes?: string
}

export type Player = {
  id: number
  username: string
  avatar_url: string
  global_rank?: number
  country_code: string
  discordUsername?: string
}

export type Team = {
  id: number
  teamName: string
  players: Player[]
}

export type Staff = {
  id: number
  username: string
  roles: string[]
}

export type CreateTouernament = {
  name: string
  formuPostLink?: string
  isTeamTourney: boolean
  format: '1v1' | '2v2' | '3v3' | '4v4'
  maxTeamSize: number
  rankRange: string
}

export type PlayerRegister = {
  osuUserId: string | number
  discordUsername?: string
}

export type TeamRegister = {
  tournamentId: number
  teamName: string
  players: PlayerRegister[]
}

export type ResponseError = {
  title: string
  status: number
  detail: string
}

export type RadioOption = {
  label: string
  value: string
}

export type PostMapSuggestion = {
  mapId: number
  mod: string
  notes?: string
}
