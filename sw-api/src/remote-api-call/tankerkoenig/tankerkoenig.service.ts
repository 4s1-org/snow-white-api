import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '../../config/config.service'
import { RequestService } from '../request/request.service'
import { ITankerkoenigListRemoteResponse, ITankerkoenigStationRemote } from './tankerkoenig-list.remote-response'
import {
  ITankerkoenigIPriceMeta,
  ITankerkoenigPricesRemoteResponse,
  ITankerkoenigIPrice,
} from './tankerkoenig-prices.remote-response'
import { TankerkoenigPrice } from './tankerkoenig-price'
import { ITankerkoenigErrorRemoteResponse } from './tankerkoenig-error.remote-response'
import { TankerkoenigStationDto } from '../../dataTransferObjects/tankerkoenig-station.dto'

@Injectable()
export class TankerkoenigService {
  private readonly baseUrl: string = 'https://creativecommons.tankerkoenig.de/json'

  constructor(private readonly request: RequestService) {}

  public async searchStations(
    apiKey: string,
    latitude: number,
    longitude: number,
  ): Promise<Array<TankerkoenigStationDto>> {
    const url = `${this.baseUrl}/list.php`
    const urlParams: Array<string> = [
      `apikey=${apiKey}`,
      `lat=${latitude}`,
      `lng=${longitude}`,
      'rad=5.0',
      'sort=dist',
      'type=all',
    ]

    const res: ITankerkoenigListRemoteResponse | ITankerkoenigErrorRemoteResponse = await this.request.get<
      ITankerkoenigListRemoteResponse | ITankerkoenigErrorRemoteResponse
    >(url, urlParams)
    if (res.ok) {
      return this.convertStations(res.stations)
    } else {
      const errMsg: string = (res as ITankerkoenigErrorRemoteResponse).message
      throw new BadRequestException(`Request failed - ${errMsg}`)
    }
  }

  public async getPrices(apiKey: string, stationIds: Array<string>): Promise<Array<TankerkoenigPrice>> {
    if (stationIds.length === 0 || stationIds.length > 10) {
      throw new Error('Invalid amount of station ids.')
    }

    const url = `${this.baseUrl}/prices.php`
    const urlParams: Array<string> = [`apikey=${apiKey}`, `ids=${stationIds.join(',')}`]

    const res: ITankerkoenigPricesRemoteResponse | ITankerkoenigErrorRemoteResponse = await this.request.get<
      ITankerkoenigPricesRemoteResponse | ITankerkoenigErrorRemoteResponse
    >(url, urlParams)
    if (res.ok) {
      return this.convertPrices(res.prices)
    } else {
      const errMsg: string = (res as ITankerkoenigErrorRemoteResponse).message
      throw new BadRequestException(`Request failed - ${errMsg}`)
    }
  }

  private convertStations(stations: Array<ITankerkoenigStationRemote>): Array<TankerkoenigStationDto> {
    const result: Array<TankerkoenigStationDto> = []
    for (const station of stations) {
      result.push({
        brand: station.brand,
        city: station.place,
        houseNumber: station.houseNumber,
        latitude: station.lat,
        longitude: station.lng,
        name: station.name,
        postCode: station.postCode,
        remoteId: station.id,
        street: station.street,
      })
    }
    return result
  }

  private convertPrices(prices: ITankerkoenigIPriceMeta): Array<TankerkoenigPrice> {
    const result: Array<TankerkoenigPrice> = []
    for (const remoteId of Object.keys(prices)) {
      const priceEntry: ITankerkoenigIPrice = prices[remoteId]
      result.push(
        new TankerkoenigPrice(
          remoteId,
          priceEntry.status,
          priceEntry.e5 || false,
          priceEntry.e10 || false,
          priceEntry.diesel || false,
        ),
      )
    }
    return result
  }
}
