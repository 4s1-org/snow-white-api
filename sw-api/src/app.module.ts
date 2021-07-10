import { Module, HttpModule, Logger } from '@nestjs/common'
import { TimetrackingService } from './timetracking/timetracking.service'
import { TimetrackingController } from './timetracking/timetracking.controller'
import { TimetrackingModule } from './timetracking/timetracking.module'
import { RemoteApiCallModule } from './remote-api-call/remote-api-call.module'
import { SmartmirrorModule } from './smartmirror/smartmirror.module'
import { PrismaService } from './database/prisma.service'
import { ConfigService } from './config/config.service'
import { StockController } from './stock/stock.controller'

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
