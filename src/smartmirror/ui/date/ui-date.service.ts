import { Injectable, Logger } from '@nestjs/common'
import { DateSettingsService } from '../../admin/date/settings/date-settings.service'

@Injectable()
export class UiDateService {
  private readonly logger: Logger = new Logger(UiDateService.name)

  constructor(private readonly settings: DateSettingsService) {}

  public async getPattern(): Promise<string> {
    const settingsEntity = await this.settings.getRecord()
    if (settingsEntity.isActive && settingsEntity.pattern) {
      return settingsEntity.pattern
    } else {
      throw new Error('Date pattern could not be loaded due to incomplete settings.')
    }
  }
}
