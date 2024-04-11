import type { Tournament, CreateTouernament } from '@/Types'
import axios, { type AxiosResponse } from 'axios'

let OTH_API: string
// @ts-ignore
if (process.env.NODE_ENV === 'production') {
  OTH_API = 'https://oth-api.azurewebsites.net/api/v1/otm'
  // @ts-ignore
} else if (process.env.NODE_ENV === 'development') {
  OTH_API = 'http://localhost:5110/api/v1/otm'
}

export async function getDashboardData(sub: string): Promise<Tournament[]> {
  const id = subToId(sub)
  const resp = await axios.get<Tournament[]>(`${OTH_API}/host/${id}/tournaments`)
  return resp.data
}

export async function createTournament(
  tournament: CreateTouernament,
  token: string
): Promise<AxiosResponse> {
  const resp = await axios.post(`${OTH_API}/tournament`, tournament, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return resp
}

export async function getTournamentById(id: number): Promise<Tournament> {
  const resp = await axios.get<Tournament>(`${OTH_API}/tournament/${id}`)
  return resp.data
}

function subToId(sub: string): number {
  return parseInt(sub.split('|')[2], 10)
}
