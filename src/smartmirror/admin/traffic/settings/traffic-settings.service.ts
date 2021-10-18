import { Injectable, Logger } from '@nestjs/common'
import { TrafficSettingsDto } from '../../../../dataTransferObjects/traffic-settings.dto'
import { v4 as uuid } from 'uuid'
import { ConstantsService } from '../../../../global/constants/constants.service'
import { TrafficSettingDbService } from '../../../../database/traffic-setting-db.service'
import { TrafficSetting } from '../../../../generated/prisma/index.js'

@Injectable()
export class TrafficSettingsService {
  private readonly logger: Logger = new Logger(TrafficSettingsService.name)

  constructor(private readonly trafficSettingDb: TrafficSettingDbService, private readonly constants: ConstantsService) {}

  public async save(settings: TrafficSettingsDto): Promise<void> {
    const record = await this.getRecord()

    const dataToSave: TrafficSetting = {
      id: uuid(),
      apiKey: settings.apiKey,
      commonLocationFromId: settings.locationFromId,
      commonLocationToId: settings.locationToId,
      isActive: settings.isActive,
    }

    if (!settings.apiKey.endsWith(this.constants.hiddenValue)) {
      dataToSave.apiKey = settings.apiKey
    }

    await this.trafficSettingDb.updateTrafficSetting({
      where: { id: record.id },
      data: dataToSave,
    })
  }

  public async load(): Promise<TrafficSettingsDto> {
    const record = await this.getRecord()

    const result: TrafficSettingsDto = {
      apiKey: record.apiKey.length > 0 ? `${record.apiKey.substr(0, 4)}${this.constants.hiddenValue}` : '',
      isActive: record.isActive,
      locationFromId: record.commonLocationFromId,
      locationToId: record.commonLocationToId,
    }
    return result
  }

  public async getRecord(): Promise<TrafficSetting> {
    let record = await this.trafficSettingDb.readTrafficSetting({
      // ToDo
      //relations: ['commonLocationFrom', 'commonLocationTo'],
    })

    // If settings not present, create it
    if (!record) {
      this.logger.log('Settings not present, create a new record')

      record = {
        id: uuid(),
        apiKey: '',
        commonLocationFromId: null,
        commonLocationToId: null,
        isActive: false,
      }
      await this.trafficSettingDb.createTrafficSetting(record)
    }

    return record
  }
}
