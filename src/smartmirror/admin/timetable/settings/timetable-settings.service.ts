import { Injectable, Logger } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { ConstantsService } from '../../../../global/constants/constants.service'
import { TimetableSettingsDto } from '../../../../dataTransferObjects/timetable-settings.dto'
import { TimetableSettingDbService } from '../../../../database/timetable-setting-db.service'
import { TimetableSetting } from '@prisma/client'

@Injectable()
export class TimetableSettingsService {
  private readonly logger: Logger = new Logger(TimetableSettingsService.name)

  constructor(private readonly timetableSettingDb: TimetableSettingDbService, private readonly constants: ConstantsService) {}

  public async save(settings: TimetableSettingsDto): Promise<void> {
    const record = await this.getRecord()

    const dataToSave: TimetableSetting = {
      id: uuid(),
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
      timetableStationFromId: settings.stationFromId,
      timetableStationToId: settings.stationToId,
    }

    if (!settings.apiKey.endsWith(this.constants.hiddenValue)) {
      dataToSave.apiKey = settings.apiKey
    }

    await this.timetableSettingDb.updateTimetableSetting({
      where: { id: record.id },
      data: dataToSave,
    })
  }

  public async load(): Promise<TimetableSettingsDto> {
    const record = await this.getRecord()

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

  public async getRecord(): Promise<TimetableSetting> {
    let record = await this.timetableSettingDb.read({
      // ToDo: Muss das mitgeladen werden?
      // include: {
      //   timetableStationFrom: true,
      //   timetableStationTo: true,
      // },
    })

    // If settings not present, create it
    if (!record) {
      this.logger.log('Settings not present, create a new record')

      record = {
        id: uuid(),
        apiKey: '',
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
        timetableStationFromId: null,
        timetableStationToId: null,
      }
      await this.timetableSettingDb.createTimetableSetting(record)
    }

    return record
  }
}
