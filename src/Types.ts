export type DashboardTournament = {
  id: number
  name: string
  formuPostLink?: string
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
