import { Module } from '@nestjs/common'
import { FuelPriceController } from './fuel-price.controller'
import { FuelPriceStationsService } from './stations/fuel-price-stations.service'
import { FuelPriceSettingsService } from './settings/fuel-price-settings.service'
import { RemoteApiCallModule } from '../../../remote-api-call/remote-api-call.module'
import { ConstantsModule } from '../../../global/constants/constants.module'
import { ConstantsService } from '../../../global/constants/constants.service'
import { FuelPriceSettingDbService } from '../../../database/fuel-price-setting-db.service'
import { FuelPriceStationDbService } from '../../../database/fuel-price-station-db.service'

@Module({
  controllers: [FuelPriceController],
  // ToDo: ConstantsModule ist global, daher sollte es hier eigentlich nicht eingebunden werden müssen.
  imports: [RemoteApiCallModule, ConstantsModule],
  providers: [FuelPriceStationsService, FuelPriceSettingsService, ConstantsService, FuelPriceSettingDbService, FuelPriceStationDbService],
})
export class FuelPriceModule {}
