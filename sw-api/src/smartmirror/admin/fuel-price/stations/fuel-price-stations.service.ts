import { Injectable, Logger } from '@nestjs/common'
import { TankerkoenigService } from '../../../../remote-api-call/tankerkoenig/tankerkoenig.service'
import { TankerkoenigStationDto } from '../../../../dataTransferObjects/tankerkoenig-station.dto'
import { CoordinatesDto } from '../../../../dataTransferObjects/coordinates.dto'
import { v4 as uuid } from 'uuid'
import { FuelPriceStationDto } from '../../../../dataTransferObjects/fuel-price-station.dto'
import { SortOrderDto } from '../../../../dataTransferObjects/sort-order.dto'
import { FuelPriceStationDbService } from '../../../../database/fuel-price-station-db.service'
import { FuelPriceStation } from '@prisma/client'

@Injectable()
export class FuelPriceStationsService {
  private readonly logger: Logger = new Logger(FuelPriceStationsService.name)

  constructor(private readonly tankerkoenig: TankerkoenigService, private readonly fuelPriceStationDb: FuelPriceStationDbService) {}

  public findAll(): Promise<Array<FuelPriceStation>> {
    return this.fuelPriceStationDb.readFuelPriceStations({})
  }

  public search(apikey: string, latlon: CoordinatesDto): Promise<Array<TankerkoenigStationDto>> {
    this.logger.log(`Search for Station ${latlon.latitude}, ${latlon.longitude}`)
    return this.tankerkoenig.searchStations(apikey, latlon.latitude, latlon.longitude)
  }

  public async add(station: TankerkoenigStationDto): Promise<void> {
    await this.fuelPriceStationDb.createFuelPriceStation({
      id: uuid(),
      latitude: station.latitude,
      longitude: station.longitude,
      name: station.name,
      nameOrigin: station.name,
      remoteId: station.remoteId,
      sortNo: Math.floor(Date.now() / 1000),
    })
  }

  public async save(id: string, station: FuelPriceStationDto): Promise<void> {
    await this.fuelPriceStationDb.updateFuelPriceStation({
      where: { id },
      data: {
        name: station.name,
        sortNo: station.sortNo,
      },
    })
  }

  public async delete(id: string): Promise<void> {
    await this.fuelPriceStationDb.deleteFuelPriceStation({ id })
  }

  public async reorderGasStations(sortOrders: Array<SortOrderDto>): Promise<void> {
    this.logger.log(`Reorder ${sortOrders.length} gas stations`)
    for (const sortOrder of sortOrders) {
      // ToDo: Umstellung
      // await this.fuelPriceStationDb.updateFuelPriceStation(sortOrder.id, {
      //   sortNo: sortOrder.sortNo,
      // })
    }
  }

  public async loadAll(): Promise<Array<FuelPriceStationDto>> {
    const res = await this.fuelPriceStationDb.readFuelPriceStations({})
    return res.map((x) => this.convertLocation(x))
  }

  public async loadSingle(id: string): Promise<FuelPriceStationDto | null> {
    const res = await this.fuelPriceStationDb.readFuelPriceStation({ id })
    if (!res) {
      return null
    }

    return this.convertLocation(res)
  }

  private convertLocation(entity: FuelPriceStation): FuelPriceStationDto {
    return {
      id: entity.id,
      latitude: entity.latitude,
      longitude: entity.longitude,
      name: entity.name,
      nameOrigin: entity.nameOrigin,
      remoteId: entity.remoteId,
      sortNo: entity.sortNo,
    }
  }
}
