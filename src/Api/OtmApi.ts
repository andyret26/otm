import type {
  Tournament,
  CreateTouernament,
  TeamRegister,
  PlayerRegister,
  Player,
  Round
} from '@/Types'
import axios, { type AxiosResponse } from 'axios'

let otm_API: string
// @ts-ignore
if (process.env.NODE_ENV === 'production') {
  otm_API = 'https://osu-tm-api.azurewebsites.net/api/v1'
  // @ts-ignore
} else if (process.env.NODE_ENV === 'development') {
  otm_API = 'http://localhost:80/api/v1'
}

export async function addHost(sub: string, token: string): Promise<void> {
  const id = subToId(sub)
  await axios.post(
    `${otm_API}/host/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
  return
}

export async function getDashboardData(sub: string): Promise<Tournament[]> {
  const id = subToId(sub)
  const resp = await axios.get<Tournament[]>(`${otm_API}/host/${id}/tournaments`)
  return resp.data
}

export async function createTournament(
  tournament: CreateTouernament,
  token: string
): Promise<AxiosResponse> {
  const resp = await axios.post(`${otm_API}/tournament`, tournament, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return resp
}

export async function getTournamentById(id: number): Promise<Tournament> {
  const resp = await axios.get<Tournament>(`${otm_API}/tournament/${id}`)
  return resp.data
}

export async function registerTeam(team: TeamRegister): Promise<AxiosResponse<Tournament>> {
  const resp = await axios.post<Tournament>(
    `${otm_API}/tournament/${team.tournamentId}/register-team`,
    team
  )
  return resp
}

export async function registerPlayer(
  tournamentId: number,
  player: PlayerRegister
): Promise<AxiosResponse<Player>> {
  const resp = await axios.post<Player>(
    `${otm_API}/tournament/${tournamentId}/register-player`,
    player
  )
  return resp
}

export async function addRound(
  tournamentId: number,
  roundName: string,
  Token: string
): Promise<AxiosResponse<Round>> {
  const resp = await axios.post<Round>(
    `${otm_API}/tournament/${tournamentId}/add-round`,
    { name: roundName },
    {
      headers: { Authorization: `Bearer ${Token}` }
    }
  )
  return resp
}

function subToId(sub: string): number {
  return parseInt(sub.split('|')[2], 10)
}
