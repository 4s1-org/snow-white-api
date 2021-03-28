export interface IServiceDay {
  planningPeriodBegin: string
  planningPeriodEnd: string
  sDaysR: string
  sDaysI: string
  sDaysB: string
}

export interface ILocation {
  name: string
  type: string
  id: string
  extId: string
  lon: number
  lat: number
  routeIdx: number
  prognosisType: string
  time: string
  date: string
  track: string
  rtTime: string
  rtDate: string
  rtTrack: string
}

export interface INote {
  value: string
  key: string
  type: string
  priority: number
  routeIdxFrom: number
  routeIdxTo: number
}

export interface INotes {
  Note: Array<INote>
}

export interface IProduct {
  name: string
  num: string
  line: string
  catOut: string
  catIn: string
  catCode: string
  catOutS: string
  catOutL: string
  operatorCode: string
  operator: string
  admin: string
}

export interface ILeg {
  Origin: ILocation
  Destination: ILocation
  Notes: INotes
  JourneyStatus: string
  Product: IProduct
  idx: string
  name: string
  number: string
  category: string
  type: string
  reachable: boolean
  direction: string
  duration: string
  dist?: number
}

export interface ILegList {
  Leg: Array<ILeg>
}

export interface ITrip {
  ServiceDays: Array<IServiceDay>
  LegList: ILegList
  idx: number
  tripId: string
  duration: string
}

export interface IRmvSearchTripRemoteResponse {
  Trip: Array<ITrip>
  serverVersion: string
  dialectVersion: string
  requestId: string
}
