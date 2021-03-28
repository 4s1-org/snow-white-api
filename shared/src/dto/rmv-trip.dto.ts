export interface IRmvTripDto {
  tripId: string
  arrivalTimePlanned: number
  arrivalTimeReal: number
  startTimePlanned: number
  startTimeReal: number
  trackPlanned: string
  trackReal: string
  durationPlanned: number
  durationReal: number
  lines: Array<string>
}
