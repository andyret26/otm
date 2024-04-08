export type DashboardTournament = {
  id: number
  name: string
  formuPostLink?: string

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
}

export type ResponseError = {
  title: string
  status: number
  detail: string
}
