import { Injectable, Logger } from '@nestjs/common'
import { OpenStreetMapService } from '../../../../remote-api-call/open-street-map/open-street-map.service'
import { OpenStreetMapLocationDto } from '../../../../dataTransferObjects/open-street-map-location.dto'
import { CommonLocationDto } from '../../../../dataTransferObjects/common-location.dto'
import { v4 as uuid } from 'uuid'
import { SortOrderDto } from '../../../../dataTransferObjects/sort-order.dto'
import { CommonLocationDbService } from '../../../../database/common-location-db.service'
import { CommonLocation } from '@prisma/client'

@Injectable()
export class CommonLocationsService {
  private readonly logger: Logger = new Logger(CommonLocationsService.name)

  constructor(private readonly openStreeMap: OpenStreetMapService, private readonly commonLocationDb: CommonLocationDbService) {}

  public async search(text: string): Promise<Array<OpenStreetMapLocationDto>> {
    return this.openStreeMap.searchByText(text)
  }

  public async add(location: OpenStreetMapLocationDto): Promise<void> {
    await this.commonLocationDb.createCommonLocation({
      id: uuid(),
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name,
      nameOrigin: location.name,
      sortNo: Math.floor(Date.now() / 1000),
    })
  }

  public async loadAll(): Promise<Array<CommonLocationDto>> {
    const res = await this.commonLocationDb.readCommonLocations({})
    return res.map((x) => this.convertLocation(x))
  }

  public async loadSingle(id: string): Promise<CommonLocationDto | null> {
    const res = await this.commonLocationDb.readCommonLocation({ id })
    if (!res) {
      return null
    }

    return this.convertLocation(res)
  }

  public async save(id: string, location: CommonLocationDto): Promise<void> {
    await this.commonLocationDb.updateCommonLocation({
      where: { id },
      data: {
        name: location.name,
        sortNo: location.sortNo,
      },
    })
  }

  public async reorderLocations(sortOrders: Array<SortOrderDto>): Promise<void> {
    this.logger.log(`Reorder ${sortOrders.length} locations`)
    for (const sortOrder of sortOrders) {
      await this.commonLocationDb.updateCommonLocation({
        where: { id: sortOrder.id },
        data: {
          sortNo: sortOrder.sortNo,
        },
      })
    }
  }

  private convertLocation(entity: CommonLocation): CommonLocationDto {
    return {
      id: entity.id || '',
      latitude: entity.latitude,
      longitude: entity.longitude,
      name: entity.name,
      nameOrigin: entity.nameOrigin,
      sortNo: entity.sortNo,
    }
  }
}
