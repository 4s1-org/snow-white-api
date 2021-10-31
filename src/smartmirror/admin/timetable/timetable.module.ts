import { Module } from '@nestjs/common'
import { TimetableController } from './timetable.controller.js'
import { TimetableSettingsService } from './settings/timetable-settings.service.js'
import { TimetableStationsService } from './stations/timetable-stations.service.js'
import { RemoteApiCallModule } from '../../../remote-api-call/remote-api-call.module.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TimetableStationEntity } from '../../../entities/timetable-station.entity.js'
import { ConstantsService } from '../../../global/constants/constants.service.js'
import { TimetableSettingsEntity } from '../../../entities/timetable-settings.entity.js'

@Module({
  controllers: [TimetableController],
  imports: [RemoteApiCallModule, TypeOrmModule.forFeature([TimetableStationEntity, TimetableSettingsEntity])],
  providers: [TimetableSettingsService, TimetableStationsService, ConstantsService],
})
export class TimetableModule {}
