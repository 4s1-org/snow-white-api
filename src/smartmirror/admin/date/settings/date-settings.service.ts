import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { DateSettingsEntity } from '../../../../entities/date-settings.entity.js'
import { DateSettingsDto } from '../../../../dataTransferObjects/date-settings.dto.js'

@Injectable()
export class DateSettingsService {
  private readonly logger: Logger = new Logger(DateSettingsService.name)

  constructor(
    @InjectRepository(DateSettingsEntity)
    private readonly dateSettingEntityRepository: Repository<DateSettingsEntity>,
  ) {}

  public async save(settings: DateSettingsDto): Promise<void> {
    const record: DateSettingsEntity = await this.getRecord()

    await this.dateSettingEntityRepository.update(record.id, {
      fontSize: settings.fontSize,
      isActive: settings.isActive,
      pattern: settings.pattern,
    })
  }

  public async load(): Promise<DateSettingsDto> {
    const record: DateSettingsEntity = await this.getRecord()

    const result: DateSettingsDto = {
      fontSize: record.fontSize,
      isActive: record.isActive,
      pattern: record.pattern,
    }
    return result
  }

  public async getRecord(): Promise<DateSettingsEntity> {
    let record = await this.dateSettingEntityRepository.findOne()

    // If settings not present, create it
    if (!record) {
      this.logger.log('Settings not present, create a new record')

      record = {
        fontSize: 12,
        id: uuid(),
        isActive: true,
        pattern: 'DD.MM.YYYY HH:mm:ss',
      }
      await this.dateSettingEntityRepository.insert(record)
    }

    return record
  }
}
