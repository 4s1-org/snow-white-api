import { Module } from '@nestjs/common'
import { CommonController } from './common.controller.js'
import { RemoteApiCallModule } from '../../../remote-api-call/remote-api-call.module.js'
import { CommonSettingDbService } from '../../../database/common-setting-db.service.js'
import { CommonLocationDbService } from '../../../database/common-location-db.service.js'
import { PrismaService } from '../../../database/prisma.service.js'

@Module({
  controllers: [CommonController],
  imports: [RemoteApiCallModule],
  providers: [CommonSettingDbService, CommonLocationDbService, PrismaService],
})
export class CommonModule {}
