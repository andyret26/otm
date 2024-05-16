export type Tournament = {
  id: number
  name: string
  formuPostLink?: string
  isTeamTourney: boolean
  format: '2v2' | '3v3' | '4v4'
  maxTeamSize: number
  rankRange: string

  rounds: Round[]
  players: TournamentPlayer[]
  teams: Team[]
  staff: Staff[]
}

export type Round = {
  id: number
  name: string
  isQualifier: boolean
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

export type TournamentPlayer = {
  playerId: number
  player: Player
  tournamentId: number
  tournament: Tournament
  isknockout: boolean
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
  isknockout: boolean
}

export type Staff = {
  id: number
  tournamentId: number
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
  tournamentId: number
  roundId: number
  mapId: number
  mod: string
  notes?: string
}

export type QualifierSchedule = {
  id: number
  roundId: number
  dateTime: string
  names: string[]
  referee?: string
  num: string
}

// Random Types

export type AddedReferee = {
  ref: Staff
  qualScheduleId: number
}

export type QsPut = {
  tourneyId: number
  scheduleId: number
  refId: number | null
  names: string[] | null
}
