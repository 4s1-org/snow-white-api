import { Module } from '@nestjs/common'
import { DateController } from './date.controller'
import { DateSettingsService } from './settings/date-settings.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DateSettingsEntity } from '../../../entities/date-settings.entity'

@Module({
  controllers: [DateController],
  imports: [TypeOrmModule.forFeature([DateSettingsEntity])],
  providers: [DateSettingsService],
})
export class DateModule {}
