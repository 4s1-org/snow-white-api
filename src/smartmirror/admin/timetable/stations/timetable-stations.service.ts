import { Injectable, Logger } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SortOrderDto } from '../../../../dataTransferObjects/sort-order.dto'
import { RmvService } from '../../../../remote-api-call/rmv/rmv.service'
import { RmvStationDto } from '../../../../dataTransferObjects/rmv-station.dto'
import { TimetableStationEntity } from '../../../../entities/timetable-station.entity'
import { TimetableStationDto } from '../../../../dataTransferObjects/timetable-station.dto'

@Injectable()
export class TimetableStationsService {
  private readonly logger: Logger = new Logger(TimetableStationsService.name)

  constructor(
    private readonly rmv: RmvService,
    @InjectRepository(TimetableStationEntity)
    private readonly timetableStationEntityRepository: Repository<TimetableStationEntity>,
  ) {}

  public async search(apiKey: string, latitude: number, longitude: number): Promise<Array<RmvStationDto>> {
    return this.rmv.getStations(apiKey, latitude, longitude)
  }

  public async add(station: RmvStationDto): Promise<void> {
    this.logger.log(`Create Station "${station.name}"`)
    await this.timetableStationEntityRepository.insert({
      id: uuid(),
      name: station.name,
      nameOrigin: station.name,
      remoteId: station.remoteId,
      sortNo: Math.floor(Date.now() / 1000),
    })
  }

  public async loadAll(): Promise<Array<TimetableStationDto>> {
    const res: Array<TimetableStationEntity> = await this.timetableStationEntityRepository.find()
    return res.map((x: TimetableStationEntity) => this.convertStation(x))
  }

  public async loadSingle(id: string): Promise<TimetableStationDto | null> {
    const res: TimetableStationEntity = await this.timetableStationEntityRepository.findOne(id)
    if (!res) {
      return null
    }

    return this.convertStation(res)
  }

  public async delete(id: string): Promise<void> {
    await this.timetableStationEntityRepository.delete(id)
  }

  public async save(id: string, location: TimetableStationDto): Promise<void> {
    await this.timetableStationEntityRepository.update(id, {
      name: location.name,
      sortNo: location.sortNo,
    })
  }

  public async reorderStations(sortOrders: Array<SortOrderDto>): Promise<void> {
    this.logger.log(`Reorder ${sortOrders.length} stations`)
    for (const sortOrder of sortOrders) {
      await this.timetableStationEntityRepository.update(sortOrder.id, {
        sortNo: sortOrder.sortNo,
      })
    }
  }

  private convertStation(entity: TimetableStationEntity): TimetableStationDto {
    return {
      id: entity.id,
      name: entity.name,
      nameOrigin: entity.nameOrigin,
      remoteId: entity.remoteId,
      sortNo: entity.sortNo,
    }
  }
}
