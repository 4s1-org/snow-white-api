import { Module, HttpModule, Logger } from '@nestjs/common'
import { TimetrackingService } from './timetracking/timetracking.service'
import { TimetrackingController } from './timetracking/timetracking.controller'
import { TimetrackingModule } from './timetracking/timetracking.module'
import { RemoteApiCallModule } from './remote-api-call/remote-api-call.module'
import { SmartmirrorModule } from './smartmirror/smartmirror.module'
import { PrismaService } from './database/prisma.service'
import * as dotenv from 'dotenv'
dotenv.config()

const logger = new Logger('App Module')
logger.log('Lets go')

@Module({
  controllers: [TimetrackingController],
  imports: [HttpModule, TimetrackingModule, RemoteApiCallModule, SmartmirrorModule],
  providers: [TimetrackingService, PrismaService],
})
export class AppModule {}
