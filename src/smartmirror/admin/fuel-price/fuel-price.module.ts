import { Module } from '@nestjs/common'
import { FuelPriceController } from './fuel-price.controller'
import { RemoteApiCallModule } from '../../../remote-api-call/remote-api-call.module'
import { ConstantsModule } from '../../../global/constants/constants.module'
import { ConstantsService } from '../../../global/constants/constants.service'
import { FuelPriceSettingDbService } from '../../../database/fuel-price-setting-db.service'
import { FuelPriceStationDbService } from '../../../database/fuel-price-station-db.service'
import { PrismaService } from '../../../database/prisma.service'

@Module({
  controllers: [FuelPriceController],
  // ToDo: ConstantsModule ist global, daher sollte es hier eigentlich nicht eingebunden werden müssen.
  imports: [RemoteApiCallModule, ConstantsModule],
  providers: [ConstantsService, FuelPriceSettingDbService, FuelPriceStationDbService, PrismaService],
})
export class FuelPriceModule {}