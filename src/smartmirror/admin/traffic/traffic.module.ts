import { Module } from '@nestjs/common'
import { TrafficController } from './traffic.controller.js'
import { TrafficSettingsService } from './settings/traffic-settings.service.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TrafficSettingsEntity } from '../../../entities/traffic-settings.entity.js'
import { ConstantsService } from '../../../global/constants/constants.service.js'

@Module({
  controllers: [TrafficController],
  imports: [TypeOrmModule.forFeature([TrafficSettingsEntity])],
  providers: [TrafficSettingsService, ConstantsService],
})
export class TrafficModule {}
