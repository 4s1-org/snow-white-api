import { Module } from '@nestjs/common'
import { DateSettingDbService } from '../../../database/date-setting-db.service'
import { DateController } from './date.controller'
import { DateSettingsService } from './settings/date-settings.service'

@Module({
  controllers: [DateController],
  imports: [],
  providers: [DateSettingsService, DateSettingDbService],
})
export class DateModule {}
