import { Injectable, Logger } from '@nestjs/common'
import { TrafficSettingsDto } from '../../../../dataTransferObjects/traffic-settings.dto'
import { v4 as uuid } from 'uuid'
import { ConstantsService } from '../../../../global/constants/constants.service'
import { TrafficSettingDbService } from '../../../../database/traffic-setting-db.service'
import { TrafficSetting } from '@prisma/client'

@Injectable()
export class TrafficSettingsService {
  private readonly logger: Logger = new Logger(TrafficSettingsService.name)

  constructor(private readonly trafficSettingDb: TrafficSettingDbService, private readonly constants: ConstantsService) {}

  public async save(settings: TrafficSettingsDto): Promise<void> {
    const record = await this.getRecord()

    const dataToSave: TrafficSetting = {
      apiKey: settings.apiKey,
      commonLocationFrom: {
        id: settings.locationFromId,
      },
      commonLocationTo: {
        id: settings.locationToId,
      },
      isActive: settings.isActive,
    }

    if (!settings.apiKey.endsWith(this.constants.hiddenValue)) {
      dataToSave.apiKey = settings.apiKey
    }

    await this.trafficSettingDb.update(record.id, dataToSave)
  }

  public async load(): Promise<TrafficSettingsDto> {
    const record: TrafficSettingsEntity = await this.getRecord()

    const result: TrafficSettingsDto = {
      apiKey: record.apiKey.length > 0 ? `${record.apiKey.substr(0, 4)}${this.constants.hiddenValue}` : '',
      isActive: record.isActive,
      locationFromId: record.commonLocationFrom?.id || null,
      locationToId: record.commonLocationTo?.id || null,
    }
    return result
  }

  public async getRecord(): Promise<TrafficSettingsEntity> {
    let record = await this.trafficSettingDb.findOne({
      relations: ['commonLocationFrom', 'commonLocationTo'],
    })

    // If settings not present, create it
    if (!record) {
      this.logger.log('Settings not present, create a new record')

      record = {
        apiKey: '',
        commonLocationFrom: null,
        commonLocationTo: null,
        id: uuid(),
        isActive: false,
      }
      await this.trafficSettingDb.insert(record)
    }

    return record
  }
}
