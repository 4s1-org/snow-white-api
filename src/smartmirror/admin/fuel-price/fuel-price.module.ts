import { Module } from '@nestjs/common'
import { FuelPriceController } from './fuel-price.controller.js'
import { FuelPriceStationsService } from './stations/fuel-price-stations.service.js'
import { FuelPriceSettingsService } from './settings/fuel-price-settings.service.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FuelPriceStationEntity } from '../../../entities/fuel-price-station.entity.js'
import { RemoteApiCallModule } from '../../../remote-api-call/remote-api-call.module.js'
import { FuelPriceSettingsEntity } from '../../../entities/fuel-price-settings.entity.js'
import { ConstantsModule } from '../../../global/constants/constants.module.js'
import { ConstantsService } from '../../../global/constants/constants.service.js'

@Module({
  controllers: [FuelPriceController],
  // ToDo: ConstantsModule ist global, daher sollte es hier eigentlich eingebunden werden müssen.
  imports: [
    RemoteApiCallModule,
    TypeOrmModule.forFeature([FuelPriceSettingsEntity, FuelPriceStationEntity]),
    ConstantsModule,
  ],
  providers: [FuelPriceStationsService, FuelPriceSettingsService, ConstantsService],
})
export class FuelPriceModule {}
