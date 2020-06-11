import { Module } from "@nestjs/common"
import { TimetableController } from "./timetable.controller"
import { TimetableSettingsService } from "./settings/timetable-settings.service"
import { TimetableStationsService } from "./stations/timetable-stations.service"
import { RemoteApiCallModule } from "../../../remote-api-call/remote-api-call.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TimetableStationEntity } from "../../../entities/timetable-station.entity"
import { ConstantsService } from "../../../global/constants/constants.service"
import { TimetableSettingsEntity } from "../../../entities/timetable-settings.entity"

@Module({
  controllers: [TimetableController],
  imports: [
    RemoteApiCallModule,
    TypeOrmModule.forFeature([TimetableStationEntity, TimetableSettingsEntity]),
  ],
  providers: [
    TimetableSettingsService,
    TimetableStationsService,
    ConstantsService,
  ],
})
export class TimetableModule {}
