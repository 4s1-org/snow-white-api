import { ITimetableLinesFilter } from './timetable-lines-filter.dto'

export interface ITimetableSettingsDto {
  isActive: boolean
  apiKey: string
  stationFromId: string | null
  stationToId: string | null
  maxChanges: number
  lines: ITimetableLinesFilter
}
