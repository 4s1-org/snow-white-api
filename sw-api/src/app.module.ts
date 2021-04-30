import { Module, HttpModule, Logger } from '@nestjs/common'
import { TimetrackingService } from './timetracking/timetracking.service'
import { TimetrackingController } from './timetracking/timetracking.controller'
import { TimetrackingModule } from './timetracking/timetracking.module'
import { RemoteApiCallModule } from './remote-api-call/remote-api-call.module'
import { SmartmirrorModule } from './smartmirror/smartmirror.module'
import * as dotenv from 'dotenv'
dotenv.config()

const logger: Logger = new Logger('App Module')

@Module({
  controllers: [TimetrackingController],
  imports: [HttpModule, TimetrackingModule, RemoteApiCallModule, SmartmirrorModule],
  providers: [TimetrackingService],
})
export class AppModule {}
