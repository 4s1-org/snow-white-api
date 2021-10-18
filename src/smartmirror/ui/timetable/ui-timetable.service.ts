import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { RmvService } from '../../../remote-api-call/rmv/rmv.service.js'
import { RmvTripDto } from '../../../dataTransferObjects/rmv-trip.dto.js'
import { RmvTripsDto } from '../../../dataTransferObjects/rmv-trips.dto.js'
import { TimetableLinesFilter } from '../../../dataTransferObjects/timetable-lines-filter.dto.js'
import { ConstantsService } from '../../../global/constants/constants.service.js'
import { TimetableSettingDbService } from '../../../database/timetable-setting-db.service.js'
import { CommonSettingDbService } from '../../../database/common-setting-db.service.js'

@Injectable()
export class UiTimetableService {
  private readonly logger: Logger = new Logger(UiTimetableService.name)

  constructor(
    private readonly constantsService: ConstantsService,
    private readonly commonSettingDb: CommonSettingDbService,
    private readonly rmv: RmvService,
    private readonly timetableSettingDb: TimetableSettingDbService,
  ) {}

  public async getTimetable(): Promise<RmvTripsDto> {
    const settingsEntity = await this.timetableSettingDb.getUi()
    if (!settingsEntity) {
      throw new Error('null')
    }
    const apiKey = settingsEntity.apiKey || process.env.APIKEY_RMV || ''

    if (settingsEntity.isActive && apiKey && settingsEntity.timetableStationFrom && settingsEntity.timetableStationTo) {
      const commonSettingsEntity = await this.commonSettingDb.readFirstRecord()
      const timestamp: number = this.constantsService.getCurrentTimestamp()

      let stationFrom: number = settingsEntity.timetableStationFrom.remoteId
      let stationTo: number = settingsEntity.timetableStationTo.remoteId
      let text = `${settingsEntity.timetableStationFrom.name} nach ${settingsEntity.timetableStationTo.name}`

      // Switch directions
      if (timestamp < commonSettingsEntity.morningStart || timestamp > commonSettingsEntity.morningEnd) {
        stationFrom = settingsEntity.timetableStationTo.remoteId
        stationTo = settingsEntity.timetableStationFrom.remoteId
        text = `${settingsEntity.timetableStationTo.name} nach ${settingsEntity.timetableStationFrom.name}`
      }

      const filter: TimetableLinesFilter = {
        showBus: settingsEntity.showBus,
        showIC: settingsEntity.showIC,
        showICE: settingsEntity.showICE,
        showRB: settingsEntity.showRB,
        showRE: settingsEntity.showRE,
        showSBahn: settingsEntity.showSBahn,
        showTram: settingsEntity.showTram,
        showUBahn: settingsEntity.showUBahn,
      }

      const routes: Array<RmvTripDto> = await this.rmv.getTrip(apiKey, stationFrom, stationTo, filter)
      this.logger.log('Fahrplan wurde berechnet.')
      return {
        text,
        trips: routes,
      }
    } else {
      throw new BadRequestException('Timetable could not be loaded due to incomplete settings.')
    }
  }
}
