import { Controller, Get, Put, Post, Delete, Logger, Body, Param } from '@nestjs/common'
import { TimetableStationsService } from './stations/timetable-stations.service.js'
import { RmvStationDto } from '../../../dataTransferObjects/rmv-station.dto.js'
import { CoordinatesDto } from '../../../dataTransferObjects/coordinates.dto.js'
import { TimetableStationDto } from '../../../dataTransferObjects/timetable-station.dto.js'
import { SortOrderDto } from '../../../dataTransferObjects/sort-order.dto.js'
import { TimetableSettingsDto } from '../../../dataTransferObjects/timetable-settings.dto.js'
import { TimetableSettingDbService } from '../../../database/timetable-setting-db.service.js'
import { ConstantsService } from '../../../global/constants/constants.service.js'
import { Prisma } from '../../../generated/prisma/index.js'

@Controller('/v1/smartmirror/admin/timetable')
export class TimetableController {
  private readonly logger: Logger = new Logger(TimetableController.name)

  constructor(
    private readonly stations: TimetableStationsService,
    private readonly timetableSettingDb: TimetableSettingDbService,
    private readonly constants: ConstantsService,
  ) {}

  // GET - /v1/smartmirror/admin/timetable/settings
  @Get('/settings')
  public async loadSettings(): Promise<TimetableSettingsDto> {
    const record = await this.timetableSettingDb.readFirstRecord()

    const result: TimetableSettingsDto = {
      apiKey: record.apiKey.length > 0 ? `${record.apiKey.substr(0, 4)}${this.constants.hiddenValue}` : '',
      isActive: record.isActive,
      lines: {
        showBus: record.showBus,
        showIC: record.showIC,
        showICE: record.showICE,
        showRB: record.showRB,
        showRE: record.showRE,
        showSBahn: record.showSBahn,
        showTram: record.showTram,
        showUBahn: record.showUBahn,
      },
      maxChanges: 3,
      stationFromId: record.timetableStationFromId || null,
      stationToId: record.timetableStationToId || null,
    }
    return result
  }

  // PUT - /v1/smartmirror/admin/timetable/settings
  @Put('/settings')
  public async saveSettings(@Body() body: TimetableSettingsDto): Promise<void> {
    const record = await this.timetableSettingDb.readFirstRecord()

    const data: Prisma.TimetableSettingUpdateInput = {
      apiKey: body.apiKey,
      isActive: body.isActive,
      maxChanges: body.maxChanges,
      showBus: body.lines.showBus,
      showIC: body.lines.showIC,
      showICE: body.lines.showICE,
      showRB: body.lines.showRB,
      showRE: body.lines.showRE,
      showSBahn: body.lines.showSBahn,
      showTram: body.lines.showTram,
      showUBahn: body.lines.showUBahn,
      // ToDo
      //timetableStationFromId: body.stationFromId,
      //timetableStationToId: body.stationToId,
    }

    if (body.apiKey.endsWith(this.constants.hiddenValue)) {
      data.apiKey = record.apiKey
    }

    await this.timetableSettingDb.update({
      where: { id: record.id },
      data: data,
    })
  }

  // PUT - /v1/smartmirror/admin/timetable/stations/reorder
  @Put('/stations/reorder')
  public reorderStations(@Body() body: Array<SortOrderDto>): Promise<void> {
    return this.stations.reorderStations(body)
  }

  // GET - /v1/smartmirror/admin/timetable/stations/search
  @Post('/stations/search')
  public async searchForStations(@Body() coordinates: CoordinatesDto): Promise<Array<RmvStationDto>> {
    const apiKey = (await this.timetableSettingDb.readFirstRecord()).apiKey || process.env.APIKEY_RMV || ''
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
