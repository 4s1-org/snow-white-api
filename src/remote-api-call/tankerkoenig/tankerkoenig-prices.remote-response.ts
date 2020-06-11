export interface ITankerkoenigPricesRemoteResponse {
  ok: true
  license: string
  data: string
  prices: ITankerkoenigIPriceMeta
}

export interface ITankerkoenigIPrice {
  status: "open" | "closed" | "no prices"
  e5?: number | false
  e10?: number | false
  diesel?: number | false
}

export interface ITankerkoenigIPriceMeta {
  [key: string]: ITankerkoenigIPrice
}
