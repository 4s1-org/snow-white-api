import { Controller, Get, Put, Body } from '@nestjs/common'
import { DateSettingsDto } from '../../../dataTransferObjects/date-settings.dto'
import { DateSettingDbService } from '../../../database/date-setting-db.service'

@Controller('/v1/smartmirror/admin/date')
export class DateController {
  constructor(private readonly dateSettingDb: DateSettingDbService) {}

  // GET - /v1/smartmirror/admin/date/settings
  @Get('/settings')
  public async loadSettings(): Promise<DateSettingsDto> {
    const record = await this.dateSettingDb.readFirstRecord()
    return {
      fontSize: record.fontSize,
      isActive: record.isActive,
      pattern: record.pattern,
    }
  }

  // PUT - /v1/smartmirror/admin/date/settings
  @Put('/settings')
  public async saveSettings(@Body() body: DateSettingsDto): Promise<void> {
    await this.dateSettingDb.update({
      data: {
        fontSize: body.fontSize,
        isActive: body.isActive,
        pattern: body.pattern,
      },
    })
  }
}
