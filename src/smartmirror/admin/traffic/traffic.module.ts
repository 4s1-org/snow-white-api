import { Module } from "@nestjs/common"
import { TrafficController } from "./traffic.controller"
import { TrafficSettingsService } from "./settings/traffic-settings.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TrafficSettingsEntity } from "../../../entities/traffic-settings.entity"
import { ConstantsService } from "../../../global/constants/constants.service"

@Module({
  controllers: [TrafficController],
  imports: [TypeOrmModule.forFeature([TrafficSettingsEntity])],
  providers: [TrafficSettingsService, ConstantsService],
})
export class TrafficModule {}
