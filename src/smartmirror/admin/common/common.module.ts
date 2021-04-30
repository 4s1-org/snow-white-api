import { Module } from '@nestjs/common'
import { CommonController } from './common.controller'
import { CommonSettingsService } from './settings/common-settings.service'
import { CommonLocationsService } from './locations/common-locations.service'
import { RemoteApiCallModule } from '../../../remote-api-call/remote-api-call.module'
import { CommonSettingDbService } from '../../../database/common-setting-db.service'
import { CommonLocationDbService } from '../../../database/common-location-db.service'

@Module({
  controllers: [CommonController],
  imports: [RemoteApiCallModule],
  providers: [CommonSettingsService, CommonLocationsService, CommonSettingDbService, CommonLocationDbService],
})
export class CommonModule {}
