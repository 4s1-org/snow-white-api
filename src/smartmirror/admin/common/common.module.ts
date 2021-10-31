import { Module } from '@nestjs/common'
import { CommonController } from './common.controller.js'
import { CommonSettingsService } from './settings/common-settings.service.js'
import { CommonLocationsService } from './locations/common-locations.service.js'
import { RemoteApiCallModule } from '../../../remote-api-call/remote-api-call.module.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommonSettingsEntity } from '../../../entities/common-settings.entity.js'
import { CommonLocationEntity } from '../../../entities/common-location.entity.js'

@Module({
  controllers: [CommonController],
  imports: [RemoteApiCallModule, TypeOrmModule.forFeature([CommonSettingsEntity, CommonLocationEntity])],
  providers: [CommonSettingsService, CommonLocationsService],
})
export class CommonModule {}
