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
