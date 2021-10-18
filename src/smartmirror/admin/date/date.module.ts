import { Module } from '@nestjs/common'
import { DateSettingDbService } from '../../../database/date-setting-db.service.js'
import { PrismaService } from '../../../database/prisma.service.js'
import { DateController } from './date.controller.js'

@Module({
  controllers: [DateController],
  imports: [],
  providers: [DateSettingDbService, PrismaService],
})
export class DateModule {}
