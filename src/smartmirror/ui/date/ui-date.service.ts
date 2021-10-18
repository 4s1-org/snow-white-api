import { Injectable, Logger } from '@nestjs/common'
import { DateSettingDbService } from '../../../database/date-setting-db.service.js'

@Injectable()
export class UiDateService {
  private readonly logger: Logger = new Logger(UiDateService.name)

  constructor(private readonly dateSettingDb: DateSettingDbService) {}

  public async getPattern(): Promise<string> {
    const settingsEntity = await this.dateSettingDb.readFirstRecord()
    if (settingsEntity.isActive && settingsEntity.pattern) {
      return settingsEntity.pattern
    } else {
      throw new Error('Date pattern could not be loaded due to incomplete settings.')
    }
  }
}
