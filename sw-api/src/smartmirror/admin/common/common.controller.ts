import { Controller, Get, Post, Delete, Put, Param, Body } from '@nestjs/common'
import { CommonLocationsService } from './locations/common-locations.service'
import { OpenStreetMapLocationDto } from '../../../dataTransferObjects/open-street-map-location.dto'
import { CommonSettingsDto } from '../../../dataTransferObjects/common-settings.dto'
import { CommonLocationDto } from '../../../dataTransferObjects/common-location.dto'
import { SortOrderDto } from '../../../dataTransferObjects/sort-order.dto'
import { CommonLocationDbService } from '../../../database/common-location-db.service'
import { CommonSettingDbService } from '../../../database/common-setting-db.service'

@Controller('/v1/smartmirror/admin/common')
export class CommonController {
  constructor(
    private readonly location: CommonLocationsService,
    private readonly commonSettingDb: CommonSettingDbService,
    private readonly commonLocationDb: CommonLocationDbService,
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
    return this.location.search(text)
  }

  // POST - /v1/smartmirror/admin/common/locations
  @Post('/locations')
  public addLocation(@Body() body: OpenStreetMapLocationDto): Promise<void> {
    return this.location.add(body)
  }

  // GET - /v1/smartmirror/admin/common/locations
  @Get('/locations')
  public loadAllLocations(): Promise<Array<CommonLocationDto>> {
    return this.location.loadAll()
  }

  // PUT - /v1/smartmirror/admin/common/locations/reorder
  @Put('/locations/reorder')
  public reorderLocations(@Body() body: Array<SortOrderDto>): Promise<void> {
    return this.location.reorderLocations(body)
  }

  // GET - /v1/smartmirror/admin/common/locations/:id
  @Get('/locations/:id')
  public loadSingleLocation(@Param('id') id: string): Promise<CommonLocationDto | null> {
    return this.location.loadSingle(id)
  }

  // PUT - /v1/smartmirror/admin/common/locations/:id
  @Put('/locations/:id')
  public saveLocation(@Param('id') id: string, @Body() body: CommonLocationDto): Promise<void> {
    return this.location.save(id, body)
  }

  // DELETE - /v1/smartmirror/admin/common/locations/:id
  @Delete('/locations/:id')
  public deleteLocation(@Param('id') id: string): void {
    this.commonLocationDb.delete({ id })
  }
}
