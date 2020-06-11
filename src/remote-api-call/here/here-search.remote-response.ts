export interface IMetaInfo {
  timestamp: Date
  mapVersion: string
  moduleVersion: string
  interfaceVersion: string
  availableMapVersion: Array<string>
}

export interface ICoordinates {
  latitude: number
  longitude: number
}

export interface IWaypoint {
  linkId: string
  mappedPosition: ICoordinates
  originalPosition: ICoordinates
  type: string
  spot: number
  sideOfStreet: string
  mappedRoadName: string
  label: string
  shapeIndex: number
  source: string
}

export interface IMode {
  type: string
  transportModes: Array<string>
  trafficMode: string
  feature: Array<any>
}

export interface IRoadShield {
  region: string
  category: string
  label: string
}

export interface IManeuver {
  position: Position
  instruction: string
  travelTime: number
  length: number
  roadShield?: IRoadShield
  roadNumber?: string
  id: string
  _type: string
}

export interface ILeg {
  start: IWaypoint
  end: IWaypoint
  length: number
  travelTime: number
  maneuver: Array<IManeuver>
}

export interface ISummary {
  distance: number
  trafficTime: number
  baseTime: number
  flags: Array<string>
  text: string
  travelTime: number
  _type: string
}

export interface IRoute {
  waypoint: Array<IWaypoint>
  mode: IMode
  leg: Array<ILeg>
  summary: ISummary
  label: Array<string>
}

export interface IResponse {
  metaInfo: IMetaInfo
  route: Array<IRoute>
  language: string
}

export interface IHereSearchRemoteResponse {
  response: IResponse
}
