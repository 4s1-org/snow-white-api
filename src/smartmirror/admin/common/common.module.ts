import { Module } from "@nestjs/common"
import { CommonController } from "./common.controller"
import { CommonSettingsService } from "./settings/common-settings.service"
import { CommonLocationsService } from "./locations/common-locations.service"
import { RemoteApiCallModule } from "../../../remote-api-call/remote-api-call.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CommonSettingsEntity } from "../../../entities/common-settings.entity"
import { CommonLocationEntity } from "../../../entities/common-location.entity"

@Module({
  controllers: [CommonController],
  imports: [
    RemoteApiCallModule,
    TypeOrmModule.forFeature([CommonSettingsEntity, CommonLocationEntity]),
  ],
  providers: [CommonSettingsService, CommonLocationsService],
})
export class CommonModule {}
