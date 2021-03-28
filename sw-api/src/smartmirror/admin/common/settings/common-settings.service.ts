import { Injectable, Logger } from '@nestjs/common'
import { CommonSettingsDto } from '../../../../dataTransferObjects/common-settings.dto'
import { CommonSettingsEntity } from '../../../../entities/common-settings.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'

@Injectable()
export class CommonSettingsService {
  private readonly logger: Logger = new Logger(CommonSettingsService.name)

  constructor(
    @InjectRepository(CommonSettingsEntity)
    private readonly commonSettingEntityRepository: Repository<CommonSettingsEntity>,
  ) {}

  public async save(settings: CommonSettingsDto): Promise<void> {
    const record: CommonSettingsEntity = await this.getRecord()

    await this.commonSettingEntityRepository.update(record.id, {
      morningEnd: settings.morningEnd,
      morningStart: settings.morningStart,
    })
  }

  public async load(): Promise<CommonSettingsDto> {
    const record: CommonSettingsEntity = await this.getRecord()

    const result: CommonSettingsDto = {
      morningEnd: record.morningEnd,
      morningStart: record.morningStart,
    }

    return result
  }

  public async getRecord(): Promise<CommonSettingsEntity> {
    let record = await this.commonSettingEntityRepository.findOne()

    // If settings not present, create it
    if (!record) {
      this.logger.log('Settings not present, create a new record')

      record = {
        id: uuid(),
        morningEnd: 12 * 3600,
        morningStart: 5 * 3600,
      }
      await this.commonSettingEntityRepository.insert(record)
    }

    return record
  }
}
