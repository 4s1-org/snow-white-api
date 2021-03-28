import { IWeatherDataDto } from './weather-data.dto'

export interface IWeatherDatasDto {
  name: string
  infos: Array<IWeatherDataDto>
}
