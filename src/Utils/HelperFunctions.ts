import type { CreateTouernament, Map, TeamPlacement, UserPlacement } from '@/Types'

export const validateCreatTournament = (tourney: CreateTouernament): string[] => {
  const errors = []
  if (!tourney.name) errors.push('Name is required')
  if (tourney.name.length > 25) errors.push('Name must be less than 26 characters')
  if (tourney.formuPostLink) {
    if (!tourney.formuPostLink.startsWith('https://osu.ppy.sh/community/forums/topics/'))
      errors.push('Invalid forum post link')
  }

  return errors
}

export const validDate = (date: string): boolean => {
  if (!date) return false
  if (date.length !== 10) return false
  if (date.split('-').length !== 3) return false

  const today = new Date()
  const inputDate = new Date(date)
  return inputDate > today
}

export const validTime = (time: string): boolean => {
  if (!time) return false
  if (time.length !== 5) return false
  if (time.split(':').length !== 2) return false

  return true
}

export const mapStatsToUserPlacements = (maps: Map[], tourneyId: number): UserPlacement[] => {
  const up: UserPlacement[] = []
  for (const map of maps) {
    map.playerStats.sort((a, b) => b.score - a.score)
    for (const [i, ps] of map.playerStats.entries()) {
      const username = ps.player.username
      if (!up.some((u) => u.username === username)) {
        const pt = ps.player.tournaments.find((t) => t.tournamentId === tourneyId)
        const newUp = {
          playerId: ps.player.id,
          username: username,
          isKnockedOut: pt ? pt.isknockout : undefined,
          mapList: [
            {
              mapId: map.id,
              placement: i + 1,
              normalizedScore: parseFloat((ps.score / map.playerStats[0].score).toFixed(2)),
              score: ps.score
            }
          ],
          avgPlacement: 0,
          totalNormScore: 0,
          avgScore: 0
        }
        up.push(newUp)
        continue
      }
      const existingUp = up.find((u) => u.username === username)
      existingUp!.mapList.push({
        mapId: map.id,
        placement: i + 1,
        normalizedScore: parseFloat((ps.score / map.playerStats[0].score).toFixed(2)),
        score: ps.score
      })
    }
  }

  for (const userp of up) {
    const total = userp.mapList.reduce((sum, currentValue) => {
      if (!currentValue.placement) return sum
      return sum + currentValue.placement
    }, 0)
    const length = userp.mapList.filter((p) => p.placement).length
    userp.avgPlacement = parseFloat((total / length).toFixed(2))

    const totalNormScore = userp.mapList.reduce((sum, currentValue) => {
      if (!currentValue.normalizedScore) return sum
      return sum + currentValue.normalizedScore
    }, 0)
    userp.totalNormScore = parseFloat(totalNormScore.toFixed(2))

    const totalScore = userp.mapList.reduce((sum, currentValue) => {
      if (!currentValue.score) return sum
      return sum + currentValue.score
    }, 0)
    userp.avgScore = Math.round(totalScore / userp.mapList.length)
  }

  return up.sort((a, b) => b.totalNormScore - a.totalNormScore)
}

export const mapStatsToTeamPlacements = (maps: Map[]): TeamPlacement[] => {
  const tp: TeamPlacement[] = []
  for (const map of maps) {
    map.teamStats.sort((a, b) => b.totalScore - a.totalScore)
    for (const [i, ts] of map.teamStats.entries()) {
      const teamName = ts.team.teamName
      if (!tp.some((t) => t.teamName === teamName)) {
        const newTp = {
          teamId: ts.team.id,
          teamName: teamName,
          isKnockedOut: ts.team.isknockout,
          mapList: [
            {
              mapId: map.id,
              placement: i + 1,
              normalizedScore: parseFloat((ts.totalScore / map.teamStats[0].totalScore).toFixed(2)),
              score: ts.totalScore
            }
          ],
          avgPlacement: 0,
          totalNormScore: 0,
          avgScore: 0
        }
        tp.push(newTp)
        continue
      }
      const existingUp = tp.find((t) => t.teamName === teamName)
      existingUp!.mapList.push({
        mapId: map.id,
        placement: i + 1,
        normalizedScore: parseFloat((ts.totalScore / map.teamStats[0].totalScore).toFixed(2)),
        score: ts.totalScore
      })
    }
  }

  for (const teamp of tp) {
    const totalPlacement = teamp.mapList.reduce((sum, currentValue) => {
      if (!currentValue.placement) return sum
      return sum + currentValue.placement
    }, 0)
    const length = teamp.mapList.filter((t) => t.placement).length
    teamp.avgPlacement = parseFloat((totalPlacement / length).toFixed(2))

    const totalNormScore = teamp.mapList.reduce((sum, currentValue) => {
      if (!currentValue.normalizedScore) return sum
      return sum + currentValue.normalizedScore
    }, 0)
    teamp.totalNormScore = parseFloat(totalNormScore.toFixed(2))

    const totalScore = teamp.mapList.reduce((sum, currentValue) => {
      if (!currentValue.score) return sum
      return sum + currentValue.score
    }, 0)
    teamp.avgScore = Math.round(totalScore / teamp.mapList.length)
  }

  return tp.sort((a, b) => b.totalNormScore - a.totalNormScore)
}

export function sortPool(maps: Map[]): Map[] {
  const modSort = (modPrefix: string) => {
    return maps
      .filter((map) => map.mod.startsWith(modPrefix))
      .sort((a, b) => a.mod.localeCompare(b.mod))
  }

  const modPrefixes = ['NM', 'HD', 'HR', 'DT', 'FM', 'TB']
  const res: Map[] = []

  modPrefixes.forEach((prefix) => {
    const filteredMaps = modSort(prefix)
    res.push(...filteredMaps)
  })

  return res
}

export async function generateSeesAndKnockout(
  userPlacements: UserPlacement[],
  teamPlacements: TeamPlacement[],
  isTeamTourney: boolean,
  howManyQualsNum: number
) {
  const playerSeeds = isTeamTourney
    ? undefined
    : userPlacements.map((u, i) => {
        return {
          id: u.playerId,
          seed: i + 1
        }
      })

  const teamSeeds = isTeamTourney
    ? teamPlacements.map((t, i) => {
        return {
          id: t.teamId,
          seed: i + 1
        }
      })
    : undefined

  const playersToKnockout = isTeamTourney
    ? undefined
    : userPlacements.length - howManyQualsNum === 0
      ? []
      : userPlacements.slice(-(userPlacements.length - howManyQualsNum)).map((u) => u.playerId)

  const teamsToKnockout = !isTeamTourney
    ? undefined
    : teamPlacements.length - howManyQualsNum === 0
      ? []
      : teamPlacements.slice(-(teamPlacements.length - howManyQualsNum)).map((t) => t.teamId)

  return { playerSeeds, teamSeeds, playersToKnockout, teamsToKnockout }
}
