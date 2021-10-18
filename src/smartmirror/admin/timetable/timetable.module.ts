import { Module } from '@nestjs/common'
import { TimetableController } from './timetable.controller.js'
import { TimetableStationsService } from './stations/timetable-stations.service.js'
import { RemoteApiCallModule } from '../../../remote-api-call/remote-api-call.module.js'
import { ConstantsService } from '../../../global/constants/constants.service.js'
import { TimetableSettingDbService } from '../../../database/timetable-setting-db.service.js'
import { TimetableStationDbService } from '../../../database/timetable-station-db.service.js'
import { PrismaService } from '../../../database/prisma.service.js'

@Module({
  controllers: [TimetableController],
  imports: [RemoteApiCallModule],
  providers: [TimetableStationsService, ConstantsService, TimetableSettingDbService, TimetableStationDbService, PrismaService],
})
export class TimetableModule {}
