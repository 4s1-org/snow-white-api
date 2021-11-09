import { Controller, Get, Post, Put, Delete, Logger, Body, Param } from '@nestjs/common'
import { FuelPriceStationsService } from './stations/fuel-price-stations.service'
import { FuelPriceSettingsService } from './settings/fuel-price-settings.service'
import { FuelPriceSettingsDto } from '../../../dataTransferObjects/fuel-price-settings.dto'
import { TankerkoenigStationDto } from '../../../dataTransferObjects/tankerkoenig-station.dto'
import { CoordinatesDto } from '../../../dataTransferObjects/coordinates.dto'
import { FuelPriceStationDto } from '../../../dataTransferObjects/fuel-price-station.dto'
import { SortOrderDto } from '../../../dataTransferObjects/sort-order.dto'

@Controller('/v1/smartmirror/admin/fuelprice')
export class FuelPriceController {
  private readonly logger: Logger = new Logger(FuelPriceController.name)

  constructor(private readonly stations: FuelPriceStationsService, private readonly settings: FuelPriceSettingsService) {}

  // GET - /v1/smartmirror/admin/fuelprice/settings
  @Get('/settings')
  public loadSettings(): Promise<FuelPriceSettingsDto> {
    return this.settings.load()
  }

  // PUT - /v1/smartmirror/admin/fuelprice/settings
  @Put('/settings')
  public saveSettings(@Body() body: FuelPriceSettingsDto): Promise<void> {
    return this.settings.save(body)
  }

  // POST - /v1/smartmirror/admin/fuelprice/stations/search
  @Post('/stations/search')
  public async searchStations(@Body() latlon: CoordinatesDto): Promise<Array<TankerkoenigStationDto>> {
    const apiKey = (await this.settings.getRecord()).apiKey || process.env.APIKEY_TANKERKOENIG || ''
    return this.stations.search(apiKey, latlon)
  }

  // PUT - /v1/smartmirror/admin/fuelprice/stations/reorder
  @Put('/stations/reorder')
  public async reorderGasStations(@Body() body: Array<SortOrderDto>): Promise<void> {
    return this.stations.reorderGasStations(body)
  }

  // POST - /v1/smartmirror/admin/fuelprice/stations
  @Post('/stations')
  public addGasStation(@Body() station: TankerkoenigStationDto): Promise<void> {
    return this.stations.add(station)
  }

  // GET - /v1/smartmirror/admin/fuelprice/stations
  @Get('/stations')
  public async loadAllGasStations(): Promise<Array<FuelPriceStationDto>> {
    return this.stations.loadAll()
  }

  // GET - /v1/smartmirror/admin/fuelprice/stations/:id
  @Get('/stations/:id')
  public async loadSingleGasStation(@Param('id') id: string): Promise<FuelPriceStationDto | null> {
    return this.stations.loadSingle(id)
  }

  // PUT - /v1/smartmirror/admin/fuelprice/stations/:id
  // ToDo: body Typ festlegen
  @Put('/stations/:id')
  public saveGasStation(@Param('id') id: string, @Body() body: FuelPriceStationDto): Promise<void> {
    return this.stations.save(id, body)
  }

  // DELETE - /v1/smartmirror/admin/fuelprice/stations/:id
  @Delete('/stations/:id')
  public deleteGasStation(@Param('id') id: string): Promise<void> {
    return this.stations.delete(id)
  }
}
