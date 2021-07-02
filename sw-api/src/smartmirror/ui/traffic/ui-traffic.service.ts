import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { TrafficSettingsService } from '../../admin/traffic/settings/traffic-settings.service'
import { HereService } from '../../../remote-api-call/here/here.service'
import { CarRouteDto } from '../../../dataTransferObjects/car-route.dto'
import { CarRoutesDto } from '../../../dataTransferObjects/car-routes.dto'
import { ConstantsService } from '../../../global/constants/constants.service'
import { TrafficSettingDbService } from '../../../database/traffic-setting-db.service'
import { CommonSettingDbService } from '../../../database/common-setting-db.service'

@Injectable()
export class UiTrafficService {
  private readonly logger: Logger = new Logger(UiTrafficService.name)

  constructor(
    private readonly constantsService: ConstantsService,
    private readonly commonSettingsDb: CommonSettingDbService,
    private readonly trafficSettings: TrafficSettingsService,
    private readonly here: HereService,
    private readonly trafficSettingDb: TrafficSettingDbService,
  ) {}

  public async getRoute(): Promise<CarRoutesDto> {
    const trafficSettingsEntity = await this.trafficSettingDb.getUi()
    if (!trafficSettingsEntity) {
      throw new Error('null')
    }
    const apiKey = trafficSettingsEntity.apiKey || process.env.APIKEY_HERE

    if (trafficSettingsEntity.isActive && apiKey && trafficSettingsEntity.commonLocationFrom && trafficSettingsEntity.commonLocationTo) {
      const commonSettingsEntity = await this.commonSettingsDb.readFirstRecord()
      const timestamp: number = this.constantsService.getCurrentTimestamp()

      let fromLat: number = trafficSettingsEntity.commonLocationFrom.latitude
      let fromLon: number = trafficSettingsEntity.commonLocationFrom.longitude
      let toLat: number = trafficSettingsEntity.commonLocationTo.latitude
      let toLon: number = trafficSettingsEntity.commonLocationTo.longitude
      let text = `${trafficSettingsEntity.commonLocationFrom.name} nach ${trafficSettingsEntity.commonLocationTo.name}`

      // Switch directions
      if (timestamp < commonSettingsEntity.morningStart || timestamp > commonSettingsEntity.morningEnd) {
        toLat = trafficSettingsEntity.commonLocationFrom.latitude
        toLon = trafficSettingsEntity.commonLocationFrom.longitude
        fromLat = trafficSettingsEntity.commonLocationTo.latitude
        fromLon = trafficSettingsEntity.commonLocationTo.longitude
        text = `${trafficSettingsEntity.commonLocationTo.name} nach ${trafficSettingsEntity.commonLocationFrom.name}`
      }

      const routes: Array<CarRouteDto> = await this.here.getRoute(apiKey, fromLat, fromLon, toLat, toLon)
      this.logger.log('Route wurde berechnet.')
      return {
        routes,
        text,
      }
    } else {
      throw new BadRequestException('Route could not be calculated due to incomplete settings.')
    }
  }
}
