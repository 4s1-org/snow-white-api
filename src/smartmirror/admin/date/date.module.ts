import { Module } from '@nestjs/common'
import { DateSettingDbService } from '../../../database/date-setting-db.service'
import { PrismaService } from '../../../database/prisma.service'
import { DateController } from './date.controller'

@Module({
  controllers: [DateController],
  imports: [],
  providers: [DateSettingDbService, PrismaService],
})
export class DateModule {}
