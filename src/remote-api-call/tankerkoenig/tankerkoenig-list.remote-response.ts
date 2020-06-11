export interface ITankerkoenigListRemoteResponse {
  ok: true
  license: string
  data: string
  status: "ok"
  stations: Array<ITankerkoenigStationRemote>
}

export interface ITankerkoenigStationRemote {
  id: string
  name: string
  brand: string
  street: string
  place: string
  lat: number
  lng: number
  dist: number
  diesel: number
  e5: number
  e10: number
  isOpen: boolean
  houseNumber: string
  postCode: number
}
