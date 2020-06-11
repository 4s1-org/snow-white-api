export interface IStopLocation {
  id: string
  extId: string
  name: string
  lon: number
  lat: number
  weight: number
  dist: number
  products: number
}

export interface IStopLocationOrCoordLocation {
  StopLocation: IStopLocation
}

export interface IRmvSearchStationRemoteResponse {
  stopLocationOrCoordLocation: Array<IStopLocationOrCoordLocation>
  serverVersion: string
  dialectVersion: string
  requestId: string
}
