import { Module, HttpModule, Logger } from '@nestjs/common'
import { TimetrackingService } from './timetracking/timetracking.service'
import { TimetrackingController } from './timetracking/timetracking.controller'
import { TimetrackingModule } from './timetracking/timetracking.module'
import { RemoteApiCallModule } from './remote-api-call/remote-api-call.module'
import { SmartmirrorModule } from './smartmirror/smartmirror.module'
import { ConfigService } from './config/config.service'
import { StockController } from './stock/stock.controller'
import * as entities from './entities/index'
import * as dotenv from 'dotenv'
import { TypeOrmModule } from '@nestjs/typeorm'
dotenv.config()

const logger = new Logger('App Module')
logger.log('Lets go')

@Module({
  controllers: [TimetrackingController, StockController],
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/db.sqlite',
      entities: [...Object.values(entities)],
      synchronize: true,
    }),
    HttpModule,
    TimetrackingModule,
    RemoteApiCallModule,
    SmartmirrorModule,
  ],
  providers: [TimetrackingService, ConfigService],
})
export class AppModule {}
