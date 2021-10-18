import { Module } from '@nestjs/common'
import { TrafficController } from './traffic.controller.js'
import { TrafficSettingsService } from './settings/traffic-settings.service.js'
import { ConstantsService } from '../../../global/constants/constants.service.js'
import { TrafficSettingDbService } from '../../../database/traffic-setting-db.service.js'
import { PrismaService } from '../../../database/prisma.service.js'

@Module({
  controllers: [TrafficController],
  imports: [],
  providers: [TrafficSettingsService, ConstantsService, TrafficSettingDbService, PrismaService],
})
export class TrafficModule {}
