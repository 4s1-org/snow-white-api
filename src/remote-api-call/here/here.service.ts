import { Injectable, Logger } from '@nestjs/common'
import { RequestService } from '../request/request.service'

import { IHereSearchRemoteResponse, IResponse } from './here-search.remote-response'
import { CarRouteDto } from '../../dataTransferObjects/car-route.dto'

@Injectable()
export class HereService {
  private readonly logger: Logger = new Logger(HereService.name)

  // Documentation: https://developer.here.com/documentation/routing/dev_guide/topics/resource-calculate-route.html
  private readonly baseUrl: string = 'https://route.ls.hereapi.com/routing/7.2/calculateroute.json'

  constructor(private readonly request: RequestService) {}

  public async getRoute(
    apiKey: string,
    startLatitude: number,
    startLongitude: number,
    endLatitude: number,
    endLongitude: number,
  ): Promise<Array<CarRouteDto>> {
    const url: string = this.baseUrl
    const urlParams: Array<string> = [
      `apiKey=${apiKey}`,
      `waypoint0=geo!${startLatitude},${startLongitude}`,
      `waypoint1=geo!${endLatitude},${endLongitude}`,
      'mode=fastest;car;traffic:enabled;',
      'alternatives=2',
      'language=de-de',
      'metricSystem=metric',
      'instructionFormat=text',
      'transportMode=car',
      'routeAttributes=la',
      'walkSpeed=1.4',
    ]

    const res: IHereSearchRemoteResponse = await this.request.get<IHereSearchRemoteResponse>(url, urlParams)
    return this.convertRoute(res.response)
  }

  private convertRoute(data: IResponse): Array<CarRouteDto> {
    const result: Array<CarRouteDto> = []
    for (const route of data.route) {
      result.push({
        distance: route.summary.distance,
        expectedTime: route.summary.travelTime,
        streetTypes: route.label,
        text: route.summary.text,
      })
    }
    return result
  }
}
