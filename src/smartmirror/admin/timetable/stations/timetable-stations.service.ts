import { Injectable, Logger } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { SortOrderDto } from '../../../../dataTransferObjects/sort-order.dto'
import { RmvService } from '../../../../remote-api-call/rmv/rmv.service'
import { RmvStationDto } from '../../../../dataTransferObjects/rmv-station.dto'
import { TimetableStationDto } from '../../../../dataTransferObjects/timetable-station.dto'
import { TimetableStationDbService } from '../../../../database/timetable-station-db.service'
import { TimetableStation } from '../../../../generated/prisma.js'

@Injectable()
export class TimetableStationsService {
  private readonly logger: Logger = new Logger(TimetableStationsService.name)

  constructor(private readonly rmv: RmvService, private readonly timetableStationDb: TimetableStationDbService) {}

  public async search(apiKey: string, latitude: number, longitude: number): Promise<Array<RmvStationDto>> {
    return this.rmv.getStations(apiKey, latitude, longitude)
  }

  public async add(station: RmvStationDto): Promise<void> {
    this.logger.log(`Create Station "${station.name}"`)
    await this.timetableStationDb.createTimetableStation({
      id: uuid(),
      name: station.name,
      nameOrigin: station.name,
      remoteId: station.remoteId,
      sortNo: Math.floor(Date.now() / 1000),
    })
  }

  public async loadAll(): Promise<Array<TimetableStationDto>> {
    const res = await this.timetableStationDb.readTimetableStations({})
    return res.map((x) => this.convertStation(x))
  }

  public async loadSingle(id: string): Promise<TimetableStationDto | null> {
    const res = await this.timetableStationDb.readTimetableStation({ id })
    if (!res) {
      return null
    }

    return this.convertStation(res)
  }

  public async delete(id: string): Promise<void> {
    await this.timetableStationDb.deleteTimetableStation({ id })
  }

  public async save(id: string, location: TimetableStationDto): Promise<void> {
    await this.timetableStationDb.updateTimetableStation({
      where: { id },
      data: {
        name: location.name,
        sortNo: location.sortNo,
      },
    })
  }

  public async reorderStations(sortOrders: Array<SortOrderDto>): Promise<void> {
    this.logger.log(`Reorder ${sortOrders.length} stations`)
    for (const sortOrder of sortOrders) {
      await this.timetableStationDb.updateTimetableStation({
        where: { id: sortOrder.id },
        data: {
          sortNo: sortOrder.sortNo,
        },
      })
    }
  }

  private convertStation(entity: TimetableStation): TimetableStationDto {
    return {
      id: entity.id || '',
      name: entity.name,
      nameOrigin: entity.nameOrigin,
      remoteId: entity.remoteId,
      sortNo: entity.sortNo,
    }
  }
}
