import { Module } from '@nestjs/common'
import { CommonController } from './common.controller'
import { RemoteApiCallModule } from '../../../remote-api-call/remote-api-call.module'
import { CommonSettingDbService } from '../../../database/common-setting-db.service'
import { CommonLocationDbService } from '../../../database/common-location-db.service'
import { PrismaService } from '../../../database/prisma.service'

@Module({
  controllers: [CommonController],
  imports: [RemoteApiCallModule],
  providers: [CommonSettingDbService, CommonLocationDbService, PrismaService],
})
export class CommonModule {}
