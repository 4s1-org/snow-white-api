import { Injectable, Logger } from '@nestjs/common'
import { OpenStreetMapService } from '../../../../remote-api-call/open-street-map/open-street-map.service.js'
import { OpenStreetMapLocationDto } from '../../../../dataTransferObjects/open-street-map-location.dto.js'
import { CommonLocationDto } from '../../../../dataTransferObjects/common-location.dto.js'
import { CommonLocationEntity } from '../../../../entities/common-location.entity.js'
import { v4 as uuid } from 'uuid'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SortOrderDto } from '../../../../dataTransferObjects/sort-order.dto.js'

@Injectable()
export class CommonLocationsService {
  private readonly logger: Logger = new Logger(CommonLocationsService.name)

  constructor(
    private readonly openStreeMap: OpenStreetMapService,
    @InjectRepository(CommonLocationEntity)
    private readonly commonLocationEntityRepository: Repository<CommonLocationEntity>,
  ) {}

  public async search(text: string): Promise<Array<OpenStreetMapLocationDto>> {
    return this.openStreeMap.searchByText(text)
  }

  public async add(location: OpenStreetMapLocationDto): Promise<void> {
    await this.commonLocationEntityRepository.insert({
      id: uuid(),
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name,
      nameOrigin: location.name,
      sortNo: Math.floor(Date.now() / 1000),
    })
  }

  public async loadAll(): Promise<Array<CommonLocationDto>> {
    const res: Array<CommonLocationEntity> = await this.commonLocationEntityRepository.find()
    return res.map((x: CommonLocationEntity) => this.convertLocation(x))
  }

  public async loadSingle(id: string): Promise<CommonLocationDto | null> {
    const res = await this.commonLocationEntityRepository.findOne(id)
    if (!res) {
      return null
    }

    return this.convertLocation(res)
  }

  public async delete(id: string): Promise<void> {
    await this.commonLocationEntityRepository.delete(id)
  }

  public async save(id: string, location: CommonLocationDto): Promise<void> {
    await this.commonLocationEntityRepository.update(id, {
      name: location.name,
      sortNo: location.sortNo,
    })
  }

  public async reorderLocations(sortOrders: Array<SortOrderDto>): Promise<void> {
    this.logger.log(`Reorder ${sortOrders.length} locations`)
    for (const sortOrder of sortOrders) {
      await this.commonLocationEntityRepository.update(sortOrder.id, {
        sortNo: sortOrder.sortNo,
      })
    }
  }

  private convertLocation(entity: CommonLocationEntity): CommonLocationDto {
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
