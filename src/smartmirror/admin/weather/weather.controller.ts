import { Controller, Get, Put, Logger, Body } from '@nestjs/common'
import { WeatherSettingsDto } from '../../../dataTransferObjects/weather-settings.dto'
import { WeatherSettingDbService } from '../../../database/weather-setting-db.service'
import { ConstantsService } from '../../../global/constants/constants.service'
import { Prisma } from '../../../generated/prisma.js'

@Controller('/v1/smartmirror/admin/weather')
export class WeatherController {
  private readonly logger: Logger = new Logger(WeatherController.name)

  constructor(private readonly constants: ConstantsService, private readonly weatherSettingDb: WeatherSettingDbService) {}

  // GET - /v1/smartmirror/admin/weather/settings
  @Get('/settings')
  public async loadSettings(): Promise<WeatherSettingsDto> {
    const record = await this.weatherSettingDb.readFirstRecord()
    return {
      apiKey: record.apiKey.length > 0 ? `${record.apiKey.substr(0, 4)}${this.constants.hiddenValue}` : '',
      isActive: record.isActive,
      locationId: record.commonLocationId || null,
    }
  }

  // PUT - //v1/smartmirror/admin/weather/settings
  @Put('/settings')
  public async saveSettings(@Body() body: WeatherSettingsDto): Promise<void> {
    const record = await this.weatherSettingDb.readFirstRecord()

    const data: Prisma.WeatherSettingUpdateInput = {
      apiKey: body.apiKey,
      //commonLocationId: body.locationId,
      isActive: body.isActive,
    }

    if (body.apiKey.endsWith(this.constants.hiddenValue)) {
      data.apiKey = record.apiKey
    }

    await this.weatherSettingDb.update({
      where: { id: record.id },
      data,
    })
  }
}
