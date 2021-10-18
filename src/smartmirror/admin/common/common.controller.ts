import { Controller, Get, Post, Delete, Put, Param, Body } from '@nestjs/common'
import { OpenStreetMapLocationDto } from '../../../dataTransferObjects/open-street-map-location.dto.js'
import { CommonSettingsDto } from '../../../dataTransferObjects/common-settings.dto.js'
import { CommonLocationDto } from '../../../dataTransferObjects/common-location.dto.js'
import { SortOrderDto } from '../../../dataTransferObjects/sort-order.dto.js'
import { CommonLocationDbService } from '../../../database/common-location-db.service.js'
import { CommonSettingDbService } from '../../../database/common-setting-db.service.js'
import { OpenStreetMapService } from '../../../remote-api-call/open-street-map/open-street-map.service.js'

@Controller('/v1/smartmirror/admin/common')
export class CommonController {
  constructor(
    private readonly commonSettingDb: CommonSettingDbService,
    private readonly commonLocationDb: CommonLocationDbService,
    private readonly openStreeMap: OpenStreetMapService,
  ) {}

  // GET - /v1/smartmirror/admin/common/settings
  @Get('/settings')
  public async loadSettings(): Promise<CommonSettingsDto> {
    const record = await this.commonSettingDb.readFirstRecord()
    const result: CommonSettingsDto = {
      morningEnd: record.morningEnd,
      morningStart: record.morningStart,
    }
    return result
  }

  // PUT - /v1/smartmirror/admin/common/settings
  @Put('/settings')
  public async saveSettings(@Body() body: CommonSettingsDto): Promise<void> {
    await this.commonSettingDb.update({
      data: {
        morningEnd: body.morningEnd,
        morningStart: body.morningStart,
      },
    })
  }

  // GET - /v1/smartmirror/admin/common/locations/search/:text
  @Get('/locations/search/:text')
  public searchLocations(@Param('text') text: string): Promise<Array<OpenStreetMapLocationDto>> {
    return this.openStreeMap.searchByText(text)
  }

  // POST - /v1/smartmirror/admin/common/locations
  @Post('/locations')
  public async addLocation(@Body() body: OpenStreetMapLocationDto): Promise<void> {
    await this.commonLocationDb.createCommonLocation({
      latitude: body.latitude,
      longitude: body.longitude,
      name: body.name,
      nameOrigin: body.name,
      sortNo: Math.floor(Date.now() / 1000),
    })
  }

  // GET - /v1/smartmirror/admin/common/locations
  @Get('/locations')
  public async loadAllLocations(): Promise<Array<CommonLocationDto>> {
    const res = await this.commonLocationDb.readAll()
    return res.map((record) => {
      return {
        id: record.id,
        latitude: record.latitude,
        longitude: record.longitude,
        name: record.name,
        nameOrigin: record.nameOrigin,
        sortNo: record.sortNo,
      }
    })
  }

  // PUT - /v1/smartmirror/admin/common/locations/reorder
  @Put('/locations/reorder')
  public async reorderLocations(@Body() body: Array<SortOrderDto>): Promise<void> {
    for (const sortOrder of body) {
      await this.commonLocationDb.update({
        where: { id: sortOrder.id },
        data: {
          sortNo: sortOrder.sortNo,
        },
      })
    }
  }

  // GET - /v1/smartmirror/admin/common/locations/:id
  @Get('/locations/:id')
  public async loadSingleLocation(@Param('id') id: string): Promise<CommonLocationDto | null> {
    const record = await this.commonLocationDb.read({ id })
    if (!record) {
      return null
    }
    return {
      id: record.id,
      latitude: record.latitude,
      longitude: record.longitude,
      name: record.name,
      nameOrigin: record.nameOrigin,
      sortNo: record.sortNo,
    }
  }

  // PUT - /v1/smartmirror/admin/common/locations/:id
  @Put('/locations/:id')
  public async saveLocation(@Param('id') id: string, @Body() body: CommonLocationDto): Promise<void> {
    await this.commonLocationDb.update({
      where: { id },
      data: {
        name: body.name,
        sortNo: body.sortNo,
      },
    })
  }

  // DELETE - /v1/smartmirror/admin/common/locations/:id
  @Delete('/locations/:id')
  public deleteLocation(@Param('id') id: string): void {
    this.commonLocationDb.delete({ id })
  }
}
