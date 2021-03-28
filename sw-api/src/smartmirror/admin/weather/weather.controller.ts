import { Controller, Get, Put, Logger, Body } from '@nestjs/common'
import { WeatherSettingsService } from './settings/weather-settings.service'
import { WeatherSettingsDto } from '../../../dataTransferObjects/weather-settings.dto'

@Controller('/v1/smartmirror/admin/weather')
export class WeatherController {
  private readonly logger: Logger = new Logger(WeatherController.name)

  constructor(private readonly settings: WeatherSettingsService) {}

  // GET - /v1/smartmirror/admin/weather/settings
  @Get('/settings')
  public loadSettings(): Promise<WeatherSettingsDto> {
    return this.settings.load()
  }

  // PUT - //v1/smartmirror/admin/weather/settings
  @Put('/settings')
  public saveSettings(@Body() settings: WeatherSettingsDto): Promise<void> {
    return this.settings.save(settings)
  }
}
