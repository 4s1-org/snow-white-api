import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { RmvService } from '../../../remote-api-call/rmv/rmv.service.js'
import { RmvTripDto } from '../../../dataTransferObjects/rmv-trip.dto.js'
import { TimetableSettingsEntity } from '../../../entities/timetable-settings.entity.js'
import { RmvTripsDto } from '../../../dataTransferObjects/rmv-trips.dto.js'
import { TimetableSettingsService } from '../../admin/timetable/settings/timetable-settings.service.js'
import { TimetableLinesFilter } from '../../../dataTransferObjects/timetable-lines-filter.dto.js'
import { CommonSettingsService } from '../../admin/common/settings/common-settings.service.js'
import { CommonSettingsEntity } from '../../../entities/common-settings.entity.js'
import { ConstantsService } from '../../../global/constants/constants.service.js'

@Injectable()
export class UiTimetableService {
  private readonly logger: Logger = new Logger(UiTimetableService.name)

  constructor(
    private readonly constantsService: ConstantsService,
    private readonly commonSettings: CommonSettingsService,
    private readonly settings: TimetableSettingsService,
    private readonly rmv: RmvService,
  ) {}

  public async getTimetable(): Promise<RmvTripsDto> {
    const settingsEntity: TimetableSettingsEntity = await this.settings.getRecord()
    const apiKey = settingsEntity.apiKey || process.env.APIKEY_RMV || ''

    if (settingsEntity.isActive && apiKey && settingsEntity.timetableStationFrom && settingsEntity.timetableStationTo) {
      const commonSettingsEntity: CommonSettingsEntity = await this.commonSettings.getRecord()
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
