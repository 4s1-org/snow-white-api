import { Injectable } from '@nestjs/common'
import { RequestService } from '../request/request.service'
import { IOpenStreetMapSearchRemoteResponse } from './open-street-map-search.remote-response'
import { OpenStreetMapLocationDto } from '../../dataTransferObjects/open-street-map-location.dto'

@Injectable()
export class OpenStreetMapService {
  private readonly baseUrl: string = 'https://nominatim.openstreetmap.org/search'

  constructor (private readonly request: RequestService) { }

  public async searchByText (text: string): Promise<Array<OpenStreetMapLocationDto>> {
    return this.search(text, 'q')
  }

  public async searchByCity (city: string): Promise<Array<OpenStreetMapLocationDto>> {
    return this.search(city, 'city')
  }

  public async searchByPostalcode (postalcode: string): Promise<Array<OpenStreetMapLocationDto>> {
    return this.search(postalcode, 'postalcode')
  }

  private async search (searchValue: string, searchField: 'q' | 'city' | 'postalcode'): Promise<Array<OpenStreetMapLocationDto>> {
    const url: string = this.baseUrl
    const urlParams: Array<string> = [
      `format=json`,
      `${searchField}=${encodeURIComponent(searchValue)}`
    ]

    const res: Array<IOpenStreetMapSearchRemoteResponse> = await this.request.get<Array<IOpenStreetMapSearchRemoteResponse>>(url, urlParams)
    return this.convertResponse(res)
  }

  private convertResponse (locations: Array<IOpenStreetMapSearchRemoteResponse>): Array<OpenStreetMapLocationDto> {
    return locations.map((x: IOpenStreetMapSearchRemoteResponse) => {
      const foo: OpenStreetMapLocationDto = {
        importance: x.importance,
        latitude: +x.lat,
        longitude: +x.lon,
        name: x.display_name,
        remoteId: x.place_id
      }
      return foo
    })
  }
}
