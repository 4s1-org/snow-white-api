export interface IMain {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  sea_level: number
  grnd_level: number
  humidity: number
  temp_kf: number
}

export interface IWeather {
  id: number
  main: string
  description: string
  icon: string
}

export interface IClouds {
  all: number
}

export interface IWind {
  speed: number
  deg: number
}

export interface ISys {
  pod: string
}

export interface IRain {
  "3h": number
}

export interface ISnow {
  "3h": number
}

export interface IList {
  dt: number
  main: IMain
  weather: Array<IWeather>
  clouds: IClouds
  wind: IWind
  sys: ISys
  dt_txt: string
  rain: IRain
  snow: ISnow
}

export interface ICoord {
  lat: number
  lon: number
}

export interface ICity {
  id: number
  name: string
  coord: ICoord
  country: string
  timezone: number
  sunrise: number
  sunset: number
}

export interface IOpenWeatherForecast {
  cod: string
  message: number
  cnt: number
  list: Array<IList>
  city: ICity
}
