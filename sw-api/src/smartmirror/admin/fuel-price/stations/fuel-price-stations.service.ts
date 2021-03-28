import { Injectable, Logger } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { FuelPriceStationEntity } from '../../../../entities/fuel-price-station.entity'
import { TankerkoenigService } from '../../../../remote-api-call/tankerkoenig/tankerkoenig.service'
import { TankerkoenigStationDto } from '../../../../dataTransferObjects/tankerkoenig-station.dto'
import { CoordinatesDto } from '../../../../dataTransferObjects/coordinates.dto'
import { v4 as uuid } from 'uuid'
import { FuelPriceStationDto } from '../../../../dataTransferObjects/fuel-price-station.dto'
import { SortOrderDto } from '../../../../dataTransferObjects/sort-order.dto'

@Injectable()
export class FuelPriceStationsService {
  private readonly logger: Logger = new Logger(FuelPriceStationsService.name)

  constructor(
    private readonly tankerkoenig: TankerkoenigService,
    @InjectRepository(FuelPriceStationEntity)
    private readonly fuelPriceStationEntityRepository: Repository<FuelPriceStationEntity>,
  ) {}

  public findAll(): Promise<Array<FuelPriceStationEntity>> {
    return this.fuelPriceStationEntityRepository.find()
  }

  public search(apikey: string, latlon: CoordinatesDto): Promise<Array<TankerkoenigStationDto>> {
    this.logger.log(`Search for Station ${latlon.latitude}, ${latlon.longitude}`)
    return this.tankerkoenig.searchStations(apikey, latlon.latitude, latlon.longitude)
  }

  public async add(station: TankerkoenigStationDto): Promise<void> {
    await this.fuelPriceStationEntityRepository.insert({
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
    await this.fuelPriceStationEntityRepository.update(id, {
      name: station.name,
      sortNo: station.sortNo,
    })
  }

  public async delete(id: string): Promise<void> {
    await this.fuelPriceStationEntityRepository.delete(id)
  }

  public async reorderGasStations(sortOrders: Array<SortOrderDto>): Promise<void> {
    this.logger.log(`Reorder ${sortOrders.length} gas stations`)
    for (const sortOrder of sortOrders) {
      await this.fuelPriceStationEntityRepository.update(sortOrder.id, {
        sortNo: sortOrder.sortNo,
      })
    }
  }

  public async loadAll(): Promise<Array<FuelPriceStationDto>> {
    const res: Array<FuelPriceStationEntity> = await this.fuelPriceStationEntityRepository.find()
    return res.map((x: FuelPriceStationEntity) => this.convertLocation(x))
  }

  public async loadSingle(id: string): Promise<FuelPriceStationDto | null> {
    const res = await this.fuelPriceStationEntityRepository.findOne(id)
    if (!res) {
      return null
    }

    return this.convertLocation(res)
  }

  private convertLocation(entity: FuelPriceStationEntity): FuelPriceStationDto {
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
