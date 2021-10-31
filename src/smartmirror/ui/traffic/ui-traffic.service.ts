import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { TrafficSettingsService } from '../../admin/traffic/settings/traffic-settings.service.js'
import { HereService } from '../../../remote-api-call/here/here.service.js'
import { CarRouteDto } from '../../../dataTransferObjects/car-route.dto.js'
import { TrafficSettingsEntity } from '../../../entities/traffic-settings.entity.js'
import { CarRoutesDto } from '../../../dataTransferObjects/car-routes.dto.js'
import { CommonSettingsService } from '../../admin/common/settings/common-settings.service.js'
import { CommonSettingsEntity } from '../../../entities/common-settings.entity.js'
import { ConstantsService } from '../../../global/constants/constants.service.js'

@Injectable()
export class UiTrafficService {
  private readonly logger: Logger = new Logger(UiTrafficService.name)

  constructor(
    private readonly constantsService: ConstantsService,
    private readonly commonSettings: CommonSettingsService,
    private readonly trafficSettings: TrafficSettingsService,
    private readonly here: HereService,
  ) {}

  public async getRoute(): Promise<CarRoutesDto> {
    const trafficSettingsEntity: TrafficSettingsEntity = await this.trafficSettings.getRecord()
    const apiKey = trafficSettingsEntity.apiKey || process.env.APIKEY_HERE

    if (
      trafficSettingsEntity.isActive &&
      apiKey &&
      trafficSettingsEntity.commonLocationFrom &&
      trafficSettingsEntity.commonLocationTo
    ) {
      const commonSettingsEntity: CommonSettingsEntity = await this.commonSettings.getRecord()
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
