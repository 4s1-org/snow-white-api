import { Module } from '@nestjs/common'
import { FuelPriceController } from './fuel-price.controller.js'
import { RemoteApiCallModule } from '../../../remote-api-call/remote-api-call.module.js'
import { ConstantsModule } from '../../../global/constants/constants.module.js'
import { ConstantsService } from '../../../global/constants/constants.service.js'
import { FuelPriceSettingDbService } from '../../../database/fuel-price-setting-db.service.js'
import { FuelPriceStationDbService } from '../../../database/fuel-price-station-db.service.js'
import { PrismaService } from '../../../database/prisma.service.js'

@Module({
  controllers: [FuelPriceController],
  // ToDo: ConstantsModule ist global, daher sollte es hier eigentlich nicht eingebunden werden müssen.
  imports: [RemoteApiCallModule, ConstantsModule],
  providers: [ConstantsService, FuelPriceSettingDbService, FuelPriceStationDbService, PrismaService],
})
export class FuelPriceModule {}
