import { Injectable, Logger } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { ConstantsService } from '../../../../global/constants/constants.service'
import { WeatherSettingsDto } from '../../../../dataTransferObjects/weather-settings.dto'
import { WeatherSettingDbService } from '../../../../database/weather-setting-db.service'
import { WeatherSetting } from '@prisma/client'

@Injectable()
export class WeatherSettingsService {
  private readonly logger: Logger = new Logger(WeatherSettingsService.name)

  constructor(private readonly trafficSettingDb: WeatherSettingDbService, private readonly constants: ConstantsService) {}

  public async save(settings: WeatherSettingsDto): Promise<void> {
    const record = await this.getRecord()

    const dataToSave: WeatherSetting = {
      id: uuid(),
      apiKey: settings.apiKey,
      commonLocationId: settings.locationId,
      isActive: settings.isActive,
    }

    if (!settings.apiKey.endsWith(this.constants.hiddenValue)) {
      dataToSave.apiKey = settings.apiKey
    }

    await this.trafficSettingDb.updateWeatherSetting({
      where: { id: record.id },
      data: dataToSave,
    })
  }

  public async load(): Promise<WeatherSettingsDto> {
    const record = await this.getRecord()

    const result: WeatherSettingsDto = {
      apiKey: record.apiKey.length > 0 ? `${record.apiKey.substr(0, 4)}${this.constants.hiddenValue}` : '',
      isActive: record.isActive,
      locationId: record.commonLocationId || null,
    }
    return result
  }

  public async getRecord(): Promise<WeatherSetting> {
    let record = await this.trafficSettingDb.readWeatherSetting({
      // ToDo
      //relations: ['commonLocation'],
    })

    // If settings not present, create it
    if (!record) {
      this.logger.log('Settings not present, create a new record')

      record = {
        id: uuid(),
        apiKey: '',
        commonLocationId: null,
        isActive: false,
      }
      await this.trafficSettingDb.createWeatherSetting(record)
    }

    return record
  }
}
