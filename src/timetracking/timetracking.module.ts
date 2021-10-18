import { Module } from '@nestjs/common'
import { ConfigService } from '../config/config.service.js'
import { TimetrackingController } from './timetracking.controller.js'
import { TimetrackingService } from './timetracking.service.js'

@Module({
  controllers: [TimetrackingController],
  providers: [TimetrackingService, ConfigService],
})
export class TimetrackingModule {}
