import { Injectable, Logger } from '@nestjs/common'
import { CommonSettingsDto } from '../../../../dataTransferObjects/common-settings.dto'
import { v4 as uuid } from 'uuid'
import { CommonSettingDbService } from '../../../../database/common-setting-db.service'
import { CommonSetting } from '@prisma/client'

@Injectable()
export class CommonSettingsService {
  private readonly logger: Logger = new Logger(CommonSettingsService.name)

  constructor(private readonly commonSettingsDb: CommonSettingDbService) {}

  public async save(settings: CommonSettingsDto): Promise<void> {
    const record = await this.getRecord()

    await this.commonSettingsDb.updateCommonSetting({
      where: { id: record.id },
      data: {
        morningEnd: settings.morningEnd,
        morningStart: settings.morningStart,
      },
    })
  }

  public async load(): Promise<CommonSettingsDto> {
    const record = await this.getRecord()

    const result: CommonSettingsDto = {
      morningEnd: record.morningEnd,
      morningStart: record.morningStart,
    }

    return result
  }

  public async getRecord(): Promise<CommonSetting> {
    let record = await this.commonSettingsDb.readCommonSetting({})

    // If settings not present, create it
    if (!record) {
      this.logger.log('Settings not present, create a new record')

      record = {
        id: uuid(),
        morningEnd: 12 * 3600,
        morningStart: 5 * 3600,
      }
      await this.commonSettingsDb.createCommonSetting(record)
    }

    return record
  }
}
