import { Module } from '@nestjs/common'
import { TimetableController } from './timetable.controller'
import { TimetableStationsService } from './stations/timetable-stations.service'
import { RemoteApiCallModule } from '../../../remote-api-call/remote-api-call.module'
import { ConstantsService } from '../../../global/constants/constants.service'
import { TimetableSettingDbService } from '../../../database/timetable-setting-db.service'
import { TimetableStationDbService } from '../../../database/timetable-station-db.service'
import { PrismaService } from '../../../database/prisma.service'

@Module({
  controllers: [TimetableController],
  imports: [RemoteApiCallModule],
  providers: [TimetableStationsService, ConstantsService, TimetableSettingDbService, TimetableStationDbService, PrismaService],
})
export class TimetableModule {}
