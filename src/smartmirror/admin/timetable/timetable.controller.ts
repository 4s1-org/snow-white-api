import { Controller, Get, Put, Post, Delete, Logger, Body, Param } from '@nestjs/common'
import { TimetableSettingsService } from './settings/timetable-settings.service'
import { TimetableStationsService } from './stations/timetable-stations.service'
import { RmvStationDto } from '../../../dataTransferObjects/rmv-station.dto'
import { CoordinatesDto } from '../../../dataTransferObjects/coordinates.dto'
import { TimetableStationDto } from '../../../dataTransferObjects/timetable-station.dto'
import { SortOrderDto } from '../../../dataTransferObjects/sort-order.dto'
import { TimetableSettingsDto } from '../../../dataTransferObjects/timetable-settings.dto'

@Controller('/v1/smartmirror/admin/timetable')
export class TimetableController {
  private readonly logger: Logger = new Logger(TimetableController.name)

  constructor(
    private readonly settings: TimetableSettingsService,
    private readonly stations: TimetableStationsService,
  ) {}

  // GET - /v1/smartmirror/admin/timetable/settings
  @Get('/settings')
  public loadSettings(): Promise<TimetableSettingsDto> {
    return this.settings.load()
  }

  // PUT - /v1/smartmirror/admin/timetable/settings
  @Put('/settings')
  public saveSettings(@Body() settings: TimetableSettingsDto): Promise<void> {
    return this.settings.save(settings)
  }

  // PUT - /v1/smartmirror/admin/timetable/stations/reorder
  @Put('/stations/reorder')
  public reorderStations(@Body() body: Array<SortOrderDto>): Promise<void> {
    return this.stations.reorderStations(body)
  }

  // GET - /v1/smartmirror/admin/timetable/stations/search
  @Post('/stations/search')
  public async searchForStations(@Body() coordinates: CoordinatesDto): Promise<Array<RmvStationDto>> {
    const apiKey = (await this.settings.getRecord()).apiKey || process.env.APIKEY_RMV || ''
    return this.stations.search(apiKey, coordinates.latitude, coordinates.longitude)
  }

  // POST - /v1/smartmirror/admin/timetable/stations
  @Post('/stations')
  public createStation(@Body() station: RmvStationDto): Promise<void> {
    return this.stations.add(station)
  }

  // GET - /v1/smartmirror/admin/timetable/stations
  @Get('/stations')
  public loadAllStations(): Promise<Array<TimetableStationDto>> {
    return this.stations.loadAll()
  }

  // GET - /v1/smartmirror/admin/timetable/stations/:id
  @Get('/stations/:id')
  public loadSingleStation(@Param('id') id: string): Promise<TimetableStationDto | null> {
    return this.stations.loadSingle(id)
  }

  // GET - /v1/smartmirror/admin/timetable/stations/:id
  @Put('/stations/:id')
  public saveStation(@Param('id') id: string, @Body() station: TimetableStationDto): Promise<void> {
    return this.stations.save(id, station)
  }

  // DELETE - /v1/smartmirror/admin/timetable/stations/:id
  @Delete('/stations/:id')
  public deleteStation(@Param('id') id: string): Promise<void> {
    return this.stations.delete(id)
  }
}
