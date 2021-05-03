import { Injectable, BadRequestException } from '@nestjs/common'
import { TankerkoenigService } from '../../../remote-api-call/tankerkoenig/tankerkoenig.service'
import { TankerkoenigPrice } from '../../../remote-api-call/tankerkoenig/tankerkoenig-price'
import { FuelPriceSettingsService } from '../../admin/fuel-price/settings/fuel-price-settings.service'
import { FuelPricePricesDto } from '../../../dataTransferObjects/fuel-price-prices.dto'
import { FuelPriceStation } from '@prisma/client'
import { FuelPriceStationDbService } from '../../../database/fuel-price-station-db.service'

@Injectable()
export class UiFuelPriceService {
  constructor(
    private readonly settings: FuelPriceSettingsService,
    private readonly tankerkoenig: TankerkoenigService,
    private readonly fuelStatationDb: FuelPriceStationDbService,
  ) {}

  public async getPrices(): Promise<Array<FuelPricePricesDto>> {
    const settingsEntity = await this.settings.getRecord()
    const apiKey = settingsEntity.apiKey || process.env.APIKEY_TANKERKOENIG

    if (settingsEntity.isActive && apiKey) {
      const stations = await this.fuelStatationDb.readAll()
      const stationIds: Array<string> = stations.map((station) => station.remoteId)
      const prices: Array<TankerkoenigPrice> = await this.tankerkoenig.getPrices(apiKey, stationIds)

      const result: Array<FuelPricePricesDto> = []

      for (const station of stations) {
        const price = prices.find((x: TankerkoenigPrice) => x.remoteId === station.remoteId)
        result.push({
          diesel: price?.diesel || 0,
          e10: price?.e10 || 0,
          e5: price?.e5 || 0,
          name: station.name,
          open: price?.status === 'open',
          sortNo: station.sortNo,
        })
      }
      return result
    } else {
      throw new BadRequestException('Fuelprice could not be loaded due to incomplete settings.')
    }
  }
}
