import { Module, HttpModule, Logger } from '@nestjs/common'
import { TimetrackingService } from './timetracking/timetracking.service.js'
import { TimetrackingController } from './timetracking/timetracking.controller.js'
import { TimetrackingModule } from './timetracking/timetracking.module.js'
import { RemoteApiCallModule } from './remote-api-call/remote-api-call.module.js'
import { SmartmirrorModule } from './smartmirror/smartmirror.module.js'
import { ConfigService } from './config/config.service.js'
import { StockController } from './stock/stock.controller.js'

import * as dotenv from 'dotenv'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigModule } from './config/config.module.js'
dotenv.config()

const logger = new Logger('App Module')
logger.log('Lets go')

@Module({
  controllers: [TimetrackingController, StockController],
  imports: [
    // ToDo: Database access
    //   TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     const host: string = config.get('MYSQL_HOST')
    //     const port: number = config.get('MYSQL_PORT')
    //     const database: string = config.get('MYSQL_DATABASE')
    //     const username: string = config.get('MYSQL_USER')
    //     const password: string = config.get('MYSQL_PASSWORD')
    //     const ssl: boolean = config.get('MYSQL_SSL') !== 'false'
    //     const logging: boolean = config.get('MYSQL_LOGGING') === 'true'

    //     logger.log('MYSQL_HOST: ' + host)
    //     logger.log('MYSQL_PORT: ' + port)
    //     logger.log('MYSQL_DATABASE: ' + database)
    //     logger.log('MYSQL_USER: ' + username)
    //     logger.log('MYSQL_SSL: ' + ssl)
    //     logger.log('MYSQL_LOGGING: ' + logging)

    //     return {
    //       database,
    //       entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //       host,
    //       logging,
    //       password,
    //       port,
    //       ssl,
    //       synchronize: true,
    //       type: 'mysql',
    //       username,
    //     } as TypeOrmModuleOptions
    //   },
    // }),
    HttpModule,
    TimetrackingModule,
    RemoteApiCallModule,
    SmartmirrorModule,
  ],
  providers: [TimetrackingService, ConfigService],
})
export class AppModule {}
