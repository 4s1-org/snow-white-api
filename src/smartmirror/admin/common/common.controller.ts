import { Controller, Get, Post, Delete, Put, Param, Body } from '@nestjs/common'
import { CommonLocationsService } from './locations/common-locations.service'
import { OpenStreetMapLocationDto } from '../../../dataTransferObjects/open-street-map-location.dto'
import { CommonSettingsService } from './settings/common-settings.service'
import { CommonSettingsDto } from '../../../dataTransferObjects/common-settings.dto'
import { CommonLocationDto } from '../../../dataTransferObjects/common-location.dto'
import { SortOrderDto } from '../../../dataTransferObjects/sort-order.dto'

@Controller('/v1/smartmirror/admin/common')
export class CommonController {
  constructor(private readonly location: CommonLocationsService, private readonly settings: CommonSettingsService) {}

  // GET - /v1/smartmirror/admin/common/settings
  @Get('/settings')
  public loadSettings(): Promise<CommonSettingsDto> {
    return this.settings.load()
  }

  // PUT - /v1/smartmirror/admin/common/settings
  @Put('/settings')
  public saveSettings(@Body() body: CommonSettingsDto): Promise<void> {
    return this.settings.save(body)
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
  public loadSingleLocation(@Param('id') id: string): Promise<CommonLocationDto> {
    return this.location.loadSingle(id)
  }

  // PUT - /v1/smartmirror/admin/common/locations/:id
  @Put('/locations/:id')
  public saveLocation(@Param('id') id: string, @Body() body: CommonLocationDto): Promise<void> {
    return this.location.save(id, body)
  }

  // DELETE - /v1/smartmirror/admin/common/locations/:id
  @Delete('/locations/:id')
  public deleteLocation(@Param('id') id: string): Promise<void> {
    return this.location.delete(id)
  }
}
