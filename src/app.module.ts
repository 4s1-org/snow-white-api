import { Module, HttpModule, Logger } from '@nestjs/common'
import { TimetrackingService } from './timetracking/timetracking.service.js'
import { TimetrackingController } from './timetracking/timetracking.controller.js'
import { TimetrackingModule } from './timetracking/timetracking.module.js'
import { RemoteApiCallModule } from './remote-api-call/remote-api-call.module.js'
import { SmartmirrorModule } from './smartmirror/smartmirror.module.js'
import { PrismaService } from './database/prisma.service.js'
import { ConfigService } from './config/config.service.js'
import { StockController } from './stock/stock.controller.js'

import * as dotenv from 'dotenv'
dotenv.config()

const logger = new Logger('App Module')
logger.log('Lets go')

@Module({
  controllers: [TimetrackingController, StockController],
  imports: [HttpModule, TimetrackingModule, RemoteApiCallModule, SmartmirrorModule],
  providers: [TimetrackingService, PrismaService, ConfigService],
})
export class AppModule {}
