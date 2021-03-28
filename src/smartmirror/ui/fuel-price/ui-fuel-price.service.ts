import { Injectable, BadRequestException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { TankerkoenigService } from '../../../remote-api-call/tankerkoenig/tankerkoenig.service'
import { TankerkoenigPrice } from '../../../remote-api-call/tankerkoenig/tankerkoenig-price'
import { FuelPriceStationEntity } from '../../../entities/fuel-price-station.entity'
import { FuelPriceSettingsEntity } from '../../../entities/fuel-price-settings.entity'
import { FuelPriceSettingsService } from '../../admin/fuel-price/settings/fuel-price-settings.service'
import { FuelPricePricesDto } from '../../../dataTransferObjects/fuel-price-prices.dto'

@Injectable()
export class UiFuelPriceService {
  constructor(
    private readonly settings: FuelPriceSettingsService,
    private readonly tankerkoenig: TankerkoenigService,
    @InjectRepository(FuelPriceStationEntity)
    private readonly stationRepository: Repository<FuelPriceStationEntity>,
  ) {}

  public async getPrices(): Promise<Array<FuelPricePricesDto>> {
    const settingsEntity: FuelPriceSettingsEntity = await this.settings.getRecord()
    const apiKey = settingsEntity.apiKey || process.env.APIKEY_TANKERKOENIG

    if (settingsEntity.isActive && apiKey) {
      const stations: Array<FuelPriceStationEntity> = await this.stationRepository.find()
      const stationIds: Array<string> = stations.map((station: FuelPriceStationEntity) => station.remoteId)
      const prices: Array<TankerkoenigPrice> = await this.tankerkoenig.getPrices(apiKey, stationIds)

      const result: Array<FuelPricePricesDto> = []

      for (const station of stations) {
        const price: TankerkoenigPrice = prices.find((x: TankerkoenigPrice) => x.remoteId === station.remoteId)
        result.push({
          diesel: price.diesel,
          e10: price.e10,
          e5: price.e5,
          name: station.name,
          open: price.status === 'open',
          sortNo: station.sortNo,
        })
      }
      return result
    } else {
      throw new BadRequestException('Fuelprice could not be loaded due to incomplete settings.')
    }
  }
}
