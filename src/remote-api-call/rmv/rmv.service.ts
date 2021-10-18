import { Injectable, Logger } from '@nestjs/common'
import { RequestService } from '../request/request.service.js'
import { IRmvSearchStationRemoteResponse, IStopLocationOrCoordLocation, IStopLocation } from './rmv-search-station.remote-response'
import { RmvStationDto } from '../../dataTransferObjects/rmv-station.dto.js'
import { RmvTripDto } from '../../dataTransferObjects/rmv-trip.dto.js'
import { IRmvSearchTripRemoteResponse, ITrip, ILocation, ILeg } from './rmv-search-trip.remote-response'
import moment from 'moment'
import 'moment-timezone'
import { TimetableLinesFilter } from '../../dataTransferObjects/timetable-lines-filter.dto.js'

@Injectable()
export class RmvService {
  private readonly logger: Logger = new Logger(RmvService.name)

  private readonly baseUrl: string = 'https://www.rmv.de/hapi'

  constructor(private readonly request: RequestService) {}

  public async getStations(apiKey: string, latitude: number, longitude: number): Promise<Array<RmvStationDto>> {
    const url: string = this.baseUrl + '/location.nearbystops'
    const urlParams: Array<string> = [`accessId=${apiKey}`, `originCoordLat=${latitude}`, `originCoordLong=${longitude}`, 'format=json']

    const res: IRmvSearchStationRemoteResponse = await this.request.get<IRmvSearchStationRemoteResponse>(url, urlParams)
    if (res.stopLocationOrCoordLocation) {
      this.logger.log(`RMV service found ${res.stopLocationOrCoordLocation.length} station(s)`)
      return this.convertStations(res.stopLocationOrCoordLocation)
    } else {
      this.logger.log('RMV service found 0 stations')
      return []
    }
  }

  public async getTrip(apiKey: string, originExtId: number, destExtId: number, filter: TimetableLinesFilter): Promise<Array<RmvTripDto>> {
    const url: string = this.baseUrl + '/trip'
    const urlParams: Array<string> = [`accessId=${apiKey}`, `originExtId=${originExtId}`, `destExtId=${destExtId}`, 'format=json']
    const res: IRmvSearchTripRemoteResponse = await this.request.get<IRmvSearchTripRemoteResponse>(url, urlParams)
    return this.convertTrip(res.Trip, filter)
  }

  private convertStations(data: Array<IStopLocationOrCoordLocation>): Array<RmvStationDto> {
    return data.map((x: IStopLocationOrCoordLocation) => {
      const y: IStopLocation = x.StopLocation
      return {
        distance: +y.dist,
        latitude: +y.lat,
        longitude: +y.lon,
        name: y.name,
        products: y.products,
        remoteId: +y.extId,
      }
    })
  }

  private convertTrip(data: Array<ITrip>, filter: TimetableLinesFilter): Array<RmvTripDto> {
    const result: Array<RmvTripDto> = []
    for (const trip of data) {
      const locationStart: ILocation = trip.LegList.Leg[0].Origin
      const locationEnd: ILocation = trip.LegList.Leg[trip.LegList.Leg.length - 1].Destination

      const arrivalTimePlanned: number = moment.utc(locationEnd.date + ' ' + locationEnd.time, 'YYYY-MM-DD hh:mm:ss').unix()
      const arrivalTimeReal: number = moment.utc(locationEnd.rtDate + ' ' + locationEnd.rtTime, 'YYYY-MM-DD hh:mm:ss').unix()
      const startTimePlanned: number = moment.utc(locationStart.date + ' ' + locationStart.time, 'YYYY-MM-DD hh:mm:ss').unix()
      const startTimeReal: number = moment.utc(locationStart.rtDate + ' ' + locationStart.rtTime, 'YYYY-MM-DD hh:mm:ss').unix()
      let showStopper = false

      const lines: Array<string> = trip.LegList.Leg.filter((x: ILeg) => {
        return x.type === 'JNY'
      }).map((x: ILeg) => {
        const catOut: string = x.Product.catOut.trim()

        if (!filter.showICE && catOut === 'ICE') {
          this.logger.log('ICE found, but it should not show')
          showStopper = true
        } else if (!filter.showIC && catOut === 'IC') {
          this.logger.log('IC found, but it should not show')
          showStopper = true
        } else if (!filter.showRE && catOut === 'RE') {
          this.logger.log('RE found, but it should not show')
          showStopper = true
        } else if (!filter.showRB && catOut === 'RB') {
          this.logger.log('RB found, but it should not show')
          showStopper = true
        } else if (!filter.showUBahn && catOut === 'U-Bahn') {
          this.logger.log('U-Bahn found, but it should not show')
          showStopper = true
        } else if (!filter.showSBahn && catOut === 'S') {
          this.logger.log('S-Bahn found, but it should not show')
          showStopper = true
        } else if (!filter.showTram && catOut === 'Tram') {
          this.logger.log('Tram found, but it should not show')
          showStopper = true
        } else if (!filter.showBus && catOut === 'Bus') {
          this.logger.log('Bus found, but it should not show')
          showStopper = true
        }

        // Bei diesen Linien auch die Liniennummer anzeigen.
        if (['S', 'RB', 'RE', 'U-Bahn', 'Tram'].includes(catOut)) {
          return x.Product.line
        } else {
          return catOut
        }
      })

      if (showStopper) {
        continue
      }

      result.push({
        arrivalTimePlanned,
        arrivalTimeReal,
        durationPlanned: arrivalTimePlanned - startTimePlanned,
        durationReal: arrivalTimeReal - startTimeReal,
        lines,
        startTimePlanned,
        startTimeReal,
        trackPlanned: locationStart.rtTrack,
        trackReal: locationStart.track,
        tripId: trip.tripId,
      })
    }
    return result
  }
}
