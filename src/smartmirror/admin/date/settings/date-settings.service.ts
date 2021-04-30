import { Injectable, Logger } from '@nestjs/common'
import { DateSetting } from '@prisma/client'
import { v4 as uuid } from 'uuid'
import { DateSettingDbService } from '../../../../database/date-setting-db.service'
import { DateSettingsDto } from '../../../../dataTransferObjects/date-settings.dto'

@Injectable()
export class DateSettingsService {
  private readonly logger: Logger = new Logger(DateSettingsService.name)

  constructor(private readonly dateSettingDb: DateSettingDbService) {}

  public async save(settings: DateSettingsDto): Promise<void> {
    const record = await this.getRecord()

    await this.dateSettingDb.updateDateSetting({
      where: { id: record.id },
      data: {
        fontSize: settings.fontSize,
        isActive: settings.isActive,
        pattern: settings.pattern,
      },
    })
  }

  public async load(): Promise<DateSettingsDto> {
    const record = await this.getRecord()

    const result: DateSettingsDto = {
      fontSize: record.fontSize,
      isActive: record.isActive,
      pattern: record.pattern,
    }
    return result
  }

  public async getRecord(): Promise<DateSetting> {
    let record = await this.dateSettingDb.readDateSetting({})

    // If settings not present, create it
    if (!record) {
      this.logger.log('Settings not present, create a new record')

      record = {
        fontSize: 12,
        id: uuid(),
        isActive: true,
        pattern: 'DD.MM.YYYY HH:mm:ss',
      }
      await this.dateSettingDb.createDateSetting(record)
    }

    return record
  }
}
