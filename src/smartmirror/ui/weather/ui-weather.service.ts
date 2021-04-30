import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { OpenWeatherService } from '../../../remote-api-call/open-weather/open-weather.service'
import { WeatherSettingsService } from '../../admin/weather/settings/weather-settings.service'
import { WeatherDatasDto } from '../../../dataTransferObjects/weather-datas.dto'
import { WeatherSettingDbService } from '../../../database/weather-setting-db.service'

@Injectable()
export class UiWeatherService {
  private readonly logger: Logger = new Logger(UiWeatherService.name)

  constructor(
    private readonly settings: WeatherSettingsService,
    private readonly openWeather: OpenWeatherService,
    private readonly weatherSettingDb: WeatherSettingDbService,
  ) {}

  public async getWeather(): Promise<WeatherDatasDto> {
    const settingsEntity = await this.weatherSettingDb.getUi()
    if (!settingsEntity) {
      throw new Error('null')
    }
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
