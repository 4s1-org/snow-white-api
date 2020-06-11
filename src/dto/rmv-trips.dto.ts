import { IRmvTripDto } from './rmv-trip.dto'

export interface IRmvTripsDto {
  text: string
  trips: Array<IRmvTripDto>
}
