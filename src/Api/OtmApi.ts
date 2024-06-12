import type {
  Tournament,
  CreateTouernament,
  TeamRegister,
  PlayerRegister,
  Player,
  Round,
  PostMapSuggestion,
  Map,
  QualifierSchedule,
  Staff,
  Team,
  QsPut,
  QsPost,
  DeleteSuggestionFromRound,
  SetSeedReq,
  KnockoutReq,
  Schedule
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

export async function isAuthorized(
  token: string,
  tournamentId: number,
  roles: string[]
): Promise<AxiosResponse<boolean>> {
  const resp = await axios<boolean>({
    url: `${otm_API}/tournament/${tournamentId}/is-authorized`,
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    data: {
      tournamentId,
      roles
    }
  })
  return resp
}

export async function getAllTournaments(): Promise<Tournament[]> {
  const resp = await axios.get<Tournament[]>(`${otm_API}/tournament`)
  return resp.data
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

export async function deleteTournament(id: number, token: string): Promise<AxiosResponse> {
  const resp = await axios.delete(`${otm_API}/tournament/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return resp
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
  isQualifier: boolean,
  Token: string
): Promise<AxiosResponse<Round>> {
  const resp = await axios.post<Round>(
    `${otm_API}/tournament/${tournamentId}/add-round`,
    { name: roundName, isQualifier: isQualifier },
    {
      headers: { Authorization: `Bearer ${Token}` }
    }
  )
  return resp
}

export async function getRound(roundId: number): Promise<AxiosResponse<Round>> {
  const resp = await axios.get<Round>(`${otm_API}/round/${roundId}`)
  return resp
}

export async function addMapSuggestion(
  roundId: number,
  suggestion: PostMapSuggestion,
  token: string
): Promise<AxiosResponse<Map>> {
  const resp = await axios.post<Map>(`${otm_API}/round/${roundId}/suggestion`, suggestion, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return resp
}

export async function addSuggestionToPool(
  request: PostMapSuggestion,
  token: string
): Promise<AxiosResponse<Map>> {
  const resp = await axios.post<Map>(`${otm_API}/round/${request.roundId}/mappool`, request, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return resp
}
export async function removeSuggestionFromPool(
  request: PostMapSuggestion,
  token: string
): Promise<AxiosResponse<Map>> {
  const resp = await axios.post<Map>(
    `${otm_API}/round/${request.roundId}/mappool/remove-suggestion`,
    request,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
  return resp
}

export async function deleteSuggestionFromRound(obj: DeleteSuggestionFromRound): Promise<void> {
  await axios({
    url: `${otm_API}/round/${obj.roundId}/delete-suggestion`,
    method: 'DELETE',
    data: obj,
    headers: { Authorization: `Bearer ${obj.token}` }
  })
  return
}

export async function generateQualsSchedule(
  tournamentId: number,
  roundId: number,
  startDate: Date,
  endDate: Date,
  token: string
): Promise<AxiosResponse<QualifierSchedule[]>> {
  const resp = await axios.post<QualifierSchedule[]>(
    `${otm_API}/schedule/generate-qualifier`,
    { tournamentId, roundId, startDate, endDate },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return resp
}

export async function getQualifierSchedule(
  roundId: number,
  tournamentId: number,
  token: string
): Promise<AxiosResponse<QualifierSchedule[]>> {
  const resp = await axios<QualifierSchedule[]>({
    url: `${otm_API}/schedule/tournament/${tournamentId}/qualifier/${roundId}`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
  return resp
}

export async function addQualsRef(
  tourneyId: number,
  scheduleId: number,
  token: string
): Promise<AxiosResponse<Staff>> {
  const resp = await axios.post<Staff>(
    `${otm_API}/schedule/tournament/${tourneyId}/qualifier/${scheduleId}/referee`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return resp
}

export async function getTournamentPlayerMin(tourneyId: number): Promise<AxiosResponse<Player[]>> {
  const resp = await axios.get<Player[]>(`${otm_API}/tournament/${tourneyId}/player-min`)
  return resp
}

export async function getTournementTeamsMin(tourneyId: number): Promise<AxiosResponse<Team[]>> {
  const resp = await axios.get<Team[]>(`${otm_API}/tournament/${tourneyId}/team-min`)
  return resp
}
export async function getTournamentStaff(tourneyId: number): Promise<AxiosResponse<Staff[]>> {
  const resp = await axios.get<Staff[]>(`${otm_API}/tournament/${tourneyId}/staff`)
  return resp
}

export async function updateQualsSchedule(
  qs: QsPut,
  token: string
): Promise<AxiosResponse<QualifierSchedule>> {
  const resp = await axios.put<QualifierSchedule>(
    `${otm_API}/schedule/quals-schedule/${qs.scheduleId}`,
    qs,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return resp
}

export async function addQualsSchedule(
  qualsSchedule: QsPost,
  token: string
): Promise<AxiosResponse<QualifierSchedule>> {
  const resp = axios.post<QualifierSchedule>(
    `${otm_API}/schedule/quals-schedule/add-extra`,
    qualsSchedule,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return resp
}

export async function changeMpVisability(
  tourneyId: number,
  roundId: number,
  token: string
): Promise<AxiosResponse> {
  const resp = await axios.put(
    `${otm_API}/schedule/tournament/${tourneyId}/round/${roundId}/mp-visibility`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return resp
}
export async function changeStatsVisibility(
  tourneyId: number,
  roundId: number,
  token: string
): Promise<AxiosResponse> {
  const resp = await axios.put(
    `${otm_API}/round/${roundId}/tournament/${tourneyId}/stats-visibility`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return resp
}

export async function getStats(roundId: number): Promise<AxiosResponse<Map[]>> {
  const resp = await axios.get<Map[]>(`${otm_API}/round/${roundId}/stats`)
  return resp
}

export async function setSeeds(req: SetSeedReq, token: string): Promise<AxiosResponse> {
  const resp = await axios.post(`${otm_API}/tournament/${req.tournamentId}/set-seed`, req, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return resp
}

export async function knockout(req: KnockoutReq, token: string): Promise<AxiosResponse> {
  const resp = await axios.post(`${otm_API}/tournament/${req.tournamentId}/knockout`, req, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return resp
}

export async function generateSchedule(
  tournamentId: number,
  roundId: number,
  startDate: Date,
  endDate: Date,
  token: string
): Promise<AxiosResponse<Schedule[]>> {
  const resp = await axios.post<Schedule[]>(
    `${otm_API}/schedule/tournament/${tournamentId}/round/${roundId}/generate-schedule`,
    { tournamentId, roundId, startDate, endDate },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return resp
}

function subToId(sub: string): number {
  return parseInt(sub.split('|')[2], 10)
}
