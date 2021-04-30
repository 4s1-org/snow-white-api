import { Injectable, Logger } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { FuelPriceSettingsEntity } from '../../../../entities/fuel-price-settings.entity'
import { FuelPriceSettingsDto } from '../../../../dataTransferObjects/fuel-price-settings.dto'
import { ConstantsService } from '../../../../global/constants/constants.service'
import { FuelPriceStationDbService } from '../../../../database/fuel-price-station-db.service'
import { FuelPriceSetting } from '@prisma/client'

@Injectable()
export class FuelPriceSettingsService {
  private readonly logger: Logger = new Logger(FuelPriceSettingsService.name)

  constructor(private readonly fuelPriceSettingDb: FuelPriceStationDbService, private readonly constants: ConstantsService) {}

  public async save(settings: FuelPriceSettingsDto): Promise<void> {
    const record: FuelPriceSettingsEntity = await this.getRecord()

    const dataToSave: FuelPriceSetting = {
      isActive: settings.isActive,
      interval: settings.interval,
      showDiesel: settings.showDiesel,
      showE10: settings.showE10,
      showE5: settings.showE5,
    }

    if (!settings.apiKey.endsWith(this.constants.hiddenValue)) {
      dataToSave.apiKey = settings.apiKey
    }

    await this.fuelPriceSettingDb.update(record.id, dataToSave)
  }

  public async load(): Promise<FuelPriceSettingsDto> {
    const record: FuelPriceSettingsEntity = await this.getRecord()

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

  public async getRecord(): Promise<FuelPriceSettingsEntity> {
    let record = await this.fuelPriceSettingDb.findOne()

    // If settings not present, create it
    if (!record) {
      this.logger.log('Settings not present, create a new record')

      record = {
        apiKey: '',
        id: uuid(),
        interval: 15 * 3600,
        isActive: false,
        showDiesel: true,
        showE10: true,
        showE5: true,
      }
      await this.fuelPriceSettingDb.insert(record)
    }

    return record
  }
}
