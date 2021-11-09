import { Injectable, Logger } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { v4 as uuid } from 'uuid'
import { ConstantsService } from '../../../../global/constants/constants.service'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { WeatherSettingsEntity } from '../../../../entities/weather-settings.entity'
import { WeatherSettingsDto } from '../../../../dataTransferObjects/weather-settings.dto'

@Injectable()
export class WeatherSettingsService {
  private readonly logger: Logger = new Logger(WeatherSettingsService.name)

  constructor(
    @InjectRepository(WeatherSettingsEntity)
    private readonly trafficSettingEntityRepository: Repository<WeatherSettingsEntity>,
    private readonly constants: ConstantsService,
  ) {}

  public async save(settings: WeatherSettingsDto): Promise<void> {
    const record: WeatherSettingsEntity = await this.getRecord()

    const dataToSave: QueryDeepPartialEntity<WeatherSettingsEntity> = {
      apiKey: settings.apiKey,
      commonLocation: {
        id: settings.locationId,
      },
      isActive: settings.isActive,
    }

    if (!settings.apiKey.endsWith(this.constants.hiddenValue)) {
      dataToSave.apiKey = settings.apiKey
    }

    await this.trafficSettingEntityRepository.update(record.id, dataToSave)
  }

  public async load(): Promise<WeatherSettingsDto> {
    const record: WeatherSettingsEntity = await this.getRecord()

    const result: WeatherSettingsDto = {
      apiKey: record.apiKey.length > 0 ? `${record.apiKey.substr(0, 4)}${this.constants.hiddenValue}` : '',
      isActive: record.isActive,
      locationId: record.commonLocation?.id || null,
    }
    return result
  }

  public async getRecord(): Promise<WeatherSettingsEntity> {
    let record: WeatherSettingsEntity | undefined = await this.trafficSettingEntityRepository.findOne({
      relations: ['commonLocation'],
    })

    // If settings not present, create it
    if (!record) {
      this.logger.log('Settings not present, create a new record')

      record = {
        apiKey: '',
        commonLocation: null,
        id: uuid(),
        isActive: false,
      }
      await this.trafficSettingEntityRepository.insert(record)
    }

    return record
  }
}
