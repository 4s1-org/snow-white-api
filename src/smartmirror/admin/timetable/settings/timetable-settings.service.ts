import { Injectable, Logger } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { ConstantsService } from '../../../../global/constants/constants.service'
import { TimetableSettingsEntity } from '../../../../entities/timetable-settings.entity'
import { TimetableSettingsDto } from '../../../../dataTransferObjects/timetable-settings.dto'
import { TimetableSettingDbService } from '../../../../database/timetable-setting-db.service'

@Injectable()
export class TimetableSettingsService {
  private readonly logger: Logger = new Logger(TimetableSettingsService.name)

  constructor(private readonly timetableSettingDb: TimetableSettingDbService, private readonly constants: ConstantsService) {}

  public async save(settings: TimetableSettingsDto): Promise<void> {
    const record: TimetableSettingsEntity = await this.getRecord()

    const dataToSave: QueryDeepPartialEntity<TimetableSettingsEntity> = {
      apiKey: settings.apiKey,
      isActive: settings.isActive,
      maxChanges: settings.maxChanges,
      showBus: settings.lines.showBus,
      showIC: settings.lines.showIC,
      showICE: settings.lines.showICE,
      showRB: settings.lines.showRB,
      showRE: settings.lines.showRE,
      showSBahn: settings.lines.showSBahn,
      showTram: settings.lines.showTram,
      showUBahn: settings.lines.showUBahn,
      timetableStationFrom: {
        id: settings.stationFromId,
      },
      timetableStationTo: {
        id: settings.stationToId,
      },
    }

    if (!settings.apiKey.endsWith(this.constants.hiddenValue)) {
      dataToSave.apiKey = settings.apiKey
    }

    await this.timetableSettingDb.update(record.id, dataToSave)
  }

  public async load(): Promise<TimetableSettingsDto> {
    const record: TimetableSettingsEntity = await this.getRecord()

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
      stationFromId: record.timetableStationFrom?.id || null,
      stationToId: record.timetableStationTo?.id || null,
    }
    return result
  }

  public async getRecord(): Promise<TimetableSettingsEntity> {
    let record = await this.timetableSettingDb.findOne({
      relations: ['timetableStationFrom', 'timetableStationTo'],
    })

    // If settings not present, create it
    if (!record) {
      this.logger.log('Settings not present, create a new record')

      record = {
        apiKey: '',
        id: uuid(),
        isActive: false,
        maxChanges: 3,
        showBus: false,
        showIC: false,
        showICE: false,
        showRB: true,
        showRE: true,
        showSBahn: true,
        showTram: true,
        showUBahn: true,
        timetableStationFrom: null,
        timetableStationTo: null,
      }
      await this.timetableSettingDb.insert(record)
    }

    return record
  }
}
