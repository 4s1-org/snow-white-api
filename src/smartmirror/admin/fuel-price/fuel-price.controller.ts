import { Controller, Get, Post, Put, Delete, Logger, Body, Param } from '@nestjs/common'
import { FuelPriceSettingsDto } from '../../../dataTransferObjects/fuel-price-settings.dto'
import { TankerkoenigStationDto } from '../../../dataTransferObjects/tankerkoenig-station.dto'
import { CoordinatesDto } from '../../../dataTransferObjects/coordinates.dto'
import { FuelPriceStationDto } from '../../../dataTransferObjects/fuel-price-station.dto'
import { SortOrderDto } from '../../../dataTransferObjects/sort-order.dto'
import { FuelPriceSettingDbService } from '../../../database/fuel-price-setting-db.service'
import { ConstantsService } from '../../../global/constants/constants.service'
import { Prisma } from '../../../generated/prisma'
import { TankerkoenigService } from '../../../remote-api-call/tankerkoenig/tankerkoenig.service'
import { FuelPriceStationDbService } from '../../../database/fuel-price-station-db.service'

@Controller('/v1/smartmirror/admin/fuelprice')
export class FuelPriceController {
  private readonly logger: Logger = new Logger(FuelPriceController.name)

  constructor(
    private readonly tankerkoenig: TankerkoenigService,
    private readonly fuelPriceStationDb: FuelPriceStationDbService,
    private readonly fuelPriceSettingDb: FuelPriceSettingDbService,
    private readonly constants: ConstantsService,
  ) {}

  // GET - /v1/smartmirror/admin/fuelprice/settings
  @Get('/settings')
  public async loadSettings(): Promise<FuelPriceSettingsDto> {
    const record = await this.fuelPriceSettingDb.readFirstRecord()

    const result: FuelPriceSettingsDto = {
      apiKey: record.apiKey.length > 0 ? `${record.apiKey.substr(0, 4)}${this.constants.hiddenValue}` : '',
      interval: record.interval,
      isActive: record.isActive,
      showDiesel: record.showDiesel,
      showE10: record.showE10,
      showE5: record.showE5,
    }

    return result
  }

  // PUT - /v1/smartmirror/admin/fuelprice/settings
  @Put('/settings')
  public async saveSettings(@Body() body: FuelPriceSettingsDto): Promise<void> {
    const record = await this.fuelPriceSettingDb.readFirstRecord()

    const data: Prisma.FuelPriceSettingUpdateInput = {
      apiKey: body.apiKey,
      isActive: body.isActive,
      interval: body.interval,
      showDiesel: body.showDiesel,
      showE10: body.showE10,
      showE5: body.showE5,
    }

    if (body.apiKey.endsWith(this.constants.hiddenValue)) {
      data.apiKey = record.apiKey
    }

    await this.fuelPriceSettingDb.update({
      where: { id: record.id },
      data,
    })
  }

  // POST - /v1/smartmirror/admin/fuelprice/stations/search
  @Post('/stations/search')
  public async searchStations(@Body() latlon: CoordinatesDto): Promise<Array<TankerkoenigStationDto>> {
    const apiKey = (await this.fuelPriceSettingDb.readFirstRecord()).apiKey || process.env.APIKEY_TANKERKOENIG || ''
    this.logger.log(`Search for Station ${latlon.latitude}, ${latlon.longitude}`)
    return this.tankerkoenig.searchStations(apiKey, latlon.latitude, latlon.longitude)
  }

  // PUT - /v1/smartmirror/admin/fuelprice/stations/reorder
  @Put('/stations/reorder')
  public async reorderGasStations(@Body() body: Array<SortOrderDto>): Promise<void> {
    // ToDo
    // this.logger.log(`Reorder ${sortOrders.length} gas stations`)
    // for (const sortOrder of sortOrders) {
    //   // ToDo: Umstellung
    //   // await this.fuelPriceStationDb.updateFuelPriceStation(sortOrder.id, {
    //   //   sortNo: sortOrder.sortNo,
    //   // })
    // }
  }

  // POST - /v1/smartmirror/admin/fuelprice/stations
  @Post('/stations')
  public async addGasStation(@Body() body: TankerkoenigStationDto): Promise<void> {
    await this.fuelPriceStationDb.create({
      latitude: body.latitude,
      longitude: body.longitude,
      name: body.name,
      nameOrigin: body.name,
      remoteId: body.remoteId,
      sortNo: Math.floor(Date.now() / 1000),
    })
  }

  // GET - /v1/smartmirror/admin/fuelprice/stations
  @Get('/stations')
  public async loadAllGasStations(): Promise<Array<FuelPriceStationDto>> {
    const res = await this.fuelPriceStationDb.readAll()
    return res.map((x) => {
      return {
        id: x.id,
        latitude: x.latitude,
        longitude: x.longitude,
        name: x.name,
        nameOrigin: x.nameOrigin,
        remoteId: x.remoteId,
        sortNo: x.sortNo,
      }
    })
  }

  // GET - /v1/smartmirror/admin/fuelprice/stations/:id
  @Get('/stations/:id')
  public async loadSingleGasStation(@Param('id') id: string): Promise<FuelPriceStationDto | null> {
    const record = await this.fuelPriceStationDb.read({ id })
    if (!record) {
      return null
    }
    return {
      id: record.id,
      latitude: record.latitude,
      longitude: record.longitude,
      name: record.name,
      nameOrigin: record.nameOrigin,
      remoteId: record.remoteId,
      sortNo: record.sortNo,
    }
  }

  // PUT - /v1/smartmirror/admin/fuelprice/stations/:id
  // ToDo: body Typ festlegen
  @Put('/stations/:id')
  public async saveGasStation(@Param('id') id: string, @Body() body: FuelPriceStationDto): Promise<void> {
    await this.fuelPriceStationDb.update({
      where: { id },
      data: {
        name: body.name,
        sortNo: body.sortNo,
      },
    })
  }

  // DELETE - /v1/smartmirror/admin/fuelprice/stations/:id
  @Delete('/stations/:id')
  public async deleteGasStation(@Param('id') id: string): Promise<void> {
    await this.fuelPriceStationDb.delete({ id })
  }
}
