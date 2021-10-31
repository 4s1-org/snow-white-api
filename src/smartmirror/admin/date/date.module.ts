import { Module } from '@nestjs/common'
import { DateController } from './date.controller.js'
import { DateSettingsService } from './settings/date-settings.service.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DateSettingsEntity } from '../../../entities/date-settings.entity.js'

@Module({
  controllers: [DateController],
  imports: [TypeOrmModule.forFeature([DateSettingsEntity])],
  providers: [DateSettingsService],
})
export class DateModule {}
