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
  Teams: Team[]
  Staff: Staff[]
}

export type Round = {
  id: number
  name: string
}

export type Player = {
  id: number
  username: string
  avatar_url: string
  global_rank?: number
  country_code: string
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

export type ResponseError = {
  title: string
  status: number
  detail: string
}

export type RadioOption = {
  label: string
  value: string
}
