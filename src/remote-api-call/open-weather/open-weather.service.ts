import { Injectable, Logger } from '@nestjs/common'
import { RequestService } from '../request/request.service'
import { WeatherDataDto } from '../../dataTransferObjects/weather-data.dto'
import { IOpenWeatherForecast, IWeather } from './open-weather-geographic.remote-response'
import { WeatherDatasDto } from '../../dataTransferObjects/weather-datas.dto'

@Injectable()
export class OpenWeatherService {
  private readonly logger: Logger = new Logger(OpenWeatherService.name)

  private readonly baseUrl: string = 'https://api.openweathermap.org/data/2.5/forecast'

  constructor (private readonly request: RequestService) { }

  public async getByCoordinates (apiKey: string, latitude: number, longitude: number): Promise<WeatherDatasDto> {
    const url: string = this.baseUrl
    const urlParams: Array<string> = [
      `appid=${apiKey}`,
      `lat=${latitude}`,
      `lon=${longitude}`,
      'units=metric',
      'lang=de'
    ]

    const res: IOpenWeatherForecast = await this.request.get<IOpenWeatherForecast>(url, urlParams)
    return this.convert(res)
  }

  private convert (data: IOpenWeatherForecast): WeatherDatasDto {
    const res: WeatherDatasDto = {
      infos: [],
      name: data.city.name
    }

    for (const item of data.list) {
      res.infos.push({
        conditionText: item.weather.map((x: IWeather): string => x.description).join(' | '),
        icon: item.weather[0].icon.substr(0, 2),
        temperature: item.main.temp,
        temperatureFeelsLike: item.main.feels_like,
        timestamp: item.dt
      })
    }
    return res
  }
}
