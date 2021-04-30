import { Module } from '@nestjs/common'
import { TrafficController } from './traffic.controller'
import { TrafficSettingsService } from './settings/traffic-settings.service'
import { ConstantsService } from '../../../global/constants/constants.service'
import { TrafficSettingDbService } from '../../../database/traffic-setting-db.service'

@Module({
  controllers: [TrafficController],
  imports: [],
  providers: [TrafficSettingsService, ConstantsService, TrafficSettingDbService],
})
export class TrafficModule {}
