import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { OpenWeatherService } from '../../../remote-api-call/open-weather/open-weather.service.js'
import { WeatherSettingsService } from '../../admin/weather/settings/weather-settings.service.js'
import { WeatherSettingsEntity } from '../../../entities/weather-settings.entity.js'
import { WeatherDatasDto } from '../../../dataTransferObjects/weather-datas.dto.js'

@Injectable()
export class UiWeatherService {
  private readonly logger: Logger = new Logger(UiWeatherService.name)

  constructor(private readonly settings: WeatherSettingsService, private readonly openWeather: OpenWeatherService) {}

  public async getWeather(): Promise<WeatherDatasDto> {
    const settingsEntity: WeatherSettingsEntity = await this.settings.getRecord()
    const apiKey = settingsEntity.apiKey || process.env.APIKEY_OPENWEATHER

    if (settingsEntity.isActive && apiKey && settingsEntity.commonLocation) {
      const weather: WeatherDatasDto = await this.openWeather.getByCoordinates(
        apiKey,
        settingsEntity.commonLocation.latitude,
        settingsEntity.commonLocation.longitude,
      )
      // Send only next 3 values
      weather.infos = weather.infos.slice(0, 3)
      this.logger.log('Wetter wurde ermittelt.')
      return weather
    } else {
      throw new BadRequestException('Weatherinformation could not be loaded due to incomplete settings.')
    }
  }
}
