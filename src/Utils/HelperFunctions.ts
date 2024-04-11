import type { CreateTouernament } from '@/Types'

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
