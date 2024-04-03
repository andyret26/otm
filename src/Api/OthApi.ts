import type { DashboardTournament } from '@/Types'
import axios from 'axios'

const OTH_API = 'https://oth-api.azurewebsites.net/api/v1/otm'

export async function getDashboardData(sub: string): Promise<DashboardTournament[]> {
  const id = subToId(sub)
  const resp = await axios.get<DashboardTournament[]>(`${OTH_API}/host/${id}/tournaments`)
  return resp.data
}

function subToId(sub: string): number {
  return parseInt(sub.split('|')[2], 10)
}
