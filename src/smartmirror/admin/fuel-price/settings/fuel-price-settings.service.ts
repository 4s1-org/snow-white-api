import { Injectable, Logger } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { FuelPriceSettingsDto } from '../../../../dataTransferObjects/fuel-price-settings.dto'
import { ConstantsService } from '../../../../global/constants/constants.service'
import { FuelPriceSetting } from '@prisma/client'
import { FuelPriceSettingDbService } from '../../../../database/fuel-price-setting-db.service'

@Injectable()
export class FuelPriceSettingsService {
  private readonly logger: Logger = new Logger(FuelPriceSettingsService.name)

  constructor(private readonly fuelPriceSettingDb: FuelPriceSettingDbService, private readonly constants: ConstantsService) {}

  public async save(settings: FuelPriceSettingsDto): Promise<void> {
    const record = await this.getRecord()

    const dataToSave: FuelPriceSetting = {
      id: uuid(),
      apiKey: '',
      isActive: settings.isActive,
      interval: settings.interval,
      showDiesel: settings.showDiesel,
      showE10: settings.showE10,
      showE5: settings.showE5,
    }

    if (!settings.apiKey.endsWith(this.constants.hiddenValue)) {
      dataToSave.apiKey = settings.apiKey
    }

    await this.fuelPriceSettingDb.updateFuelPriceSetting({
      where: { id: record.id },
      data: dataToSave,
    })
  }

  public async load(): Promise<FuelPriceSettingsDto> {
    const record = await this.getRecord()

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

  public async getRecord(): Promise<FuelPriceSetting> {
    let record = await this.fuelPriceSettingDb.readFuelPriceSetting({})

    // If settings not present, create it
    if (!record) {
      this.logger.log('Settings not present, create a new record')

      record = {
        id: uuid(),
        apiKey: '',
        interval: 15 * 3600,
        isActive: false,
        showDiesel: true,
        showE10: true,
        showE5: true,
      }
      await this.fuelPriceSettingDb.createFuelPriceSetting(record)
    }

    return record
  }
}
