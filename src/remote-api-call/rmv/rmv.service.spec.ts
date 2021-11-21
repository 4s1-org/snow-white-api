import { Test, TestingModule } from '@nestjs/testing'
import { RmvService } from './rmv.service'
import { RequestService } from '../request/request.service'
import { IRmvSearchStationRemoteResponse } from './rmv-search-station.remote-response'
import { RmvStationDto } from '../../dataTransferObjects/rmv-station.dto'
import { RmvTripDto } from '../../dataTransferObjects/rmv-trip.dto'
import { TimetableLinesFilter } from '../../dataTransferObjects/timetable-lines-filter.dto'

describe('RmvService', () => {
  let service: RmvService
  let requestService: RequestService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RmvService,
        {
          provide: RequestService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<RmvService>(RmvService)
    requestService = module.get<RequestService>(RequestService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('Search RMV station', async () => {
    // Arrange
    const resData: IRmvSearchStationRemoteResponse = {
      dialectVersion: '1.23',
      requestId: '1580919703367',
      serverVersion: '1.9',
      stopLocationOrCoordLocation: [
        {
          StopLocation: {
            dist: 155,
            extId: '3000201',
            id: 'A=1@O=Frankfurt (Main) Alte Oper@X=8670932@Y=50115375@u=0@U=80@L=3000201@',
            lat: 50.115375,
            lon: 8.670932,
            name: 'Frankfurt (Main) Alte Oper',
            products: 80,
            weight: 3071,
          },
        },
        {
          StopLocation: {
            dist: 652,
            extId: '3000004',
            id: 'A=1@O=Frankfurt (Main) Willy-Brandt-Platz@X=8674932@Y=50109208@u=0@U=80@L=3000004@',
            lat: 50.109208,
            lon: 8.674932,
            name: 'Frankfurt (Main) Willy-Brandt-Platz',
            products: 112,
            weight: 11242,
          },
        },
      ],
    }
    jest.spyOn(requestService, 'get').mockImplementation(() => Promise.resolve(resData))
    // Act
    const res: Array<RmvStationDto> = await service.getStations('apiKey', 50, 10)
    // Assert
    expect(requestService.get).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.length).toBe(2)
    const firstStation: RmvStationDto = res[0]
    expect(firstStation.remoteId).toBe(3000201)
  })
})
