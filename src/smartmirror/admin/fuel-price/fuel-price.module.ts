import { Module } from '@nestjs/common'
import { FuelPriceController } from './fuel-price.controller'
import { FuelPriceStationsService } from './stations/fuel-price-stations.service'
import { FuelPriceSettingsService } from './settings/fuel-price-settings.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FuelPriceStationEntity } from '../../../entities/fuel-price-station.entity'
import { RemoteApiCallModule } from '../../../remote-api-call/remote-api-call.module'
import { FuelPriceSettingsEntity } from '../../../entities/fuel-price-settings.entity'
import { ConstantsModule } from '../../../global/constants/constants.module'
import { ConstantsService } from '../../../global/constants/constants.service'

@Module({
  controllers: [FuelPriceController],
  // ToDo: ConstantsModule ist global, daher sollte es hier eigentlich eingebunden werden müssen.
  imports: [RemoteApiCallModule, TypeOrmModule.forFeature([FuelPriceSettingsEntity, FuelPriceStationEntity]), ConstantsModule],
  providers: [FuelPriceStationsService, FuelPriceSettingsService, ConstantsService],
})
export class FuelPriceModule {}
