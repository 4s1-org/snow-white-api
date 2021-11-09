import { Module } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import { TimetrackingController } from './timetracking.controller'
import { TimetrackingService } from './timetracking.service'

@Module({
  controllers: [TimetrackingController],
  providers: [TimetrackingService, ConfigService],
})
export class TimetrackingModule {}
