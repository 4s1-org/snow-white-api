import { Module } from '@nestjs/common'
import { DateSettingDbService } from '../../../database/date-setting-db.service'
import { PrismaService } from '../../../database/prisma.service'
import { DateController } from './date.controller'
import { DateSettingsService } from './settings/date-settings.service'

@Module({
  controllers: [DateController],
  imports: [],
  providers: [DateSettingsService, DateSettingDbService, PrismaService],
})
export class DateModule {}
