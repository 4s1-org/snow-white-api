import { Test, TestingModule } from '@nestjs/testing'
import { TankerkoenigService } from './tankerkoenig.service'
import { ConfigModule } from '../../config/config.module'
import { RequestService } from '../request/request.service'
import { HttpModule } from '@nestjs/common'
import { TankerkoenigPrice } from './tankerkoenig-price'
import { ITankerkoenigErrorRemoteResponse } from './tankerkoenig-error.remote-response'
import { ITankerkoenigPricesRemoteResponse } from './tankerkoenig-prices.remote-response'
import { ITankerkoenigListRemoteResponse } from './tankerkoenig-list.remote-response'
import { TankerkoenigStationDto } from '../../dataTransferObjects/tankerkoenig-station.dto'

describe('TankerkoenigService', () => {
  let service: TankerkoenigService
  let requestService: RequestService

  const invalidResponse: ITankerkoenigErrorRemoteResponse = {
    message: 'foo',
    ok: false
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TankerkoenigService, {
        provide: RequestService,
        useValue: {
          get: jest.fn()
        }
      }]
    }).compile()

    service = module.get<TankerkoenigService>(TankerkoenigService)
    requestService = module.get<RequestService>(RequestService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('Search for stations', () => {
    it('valid search', async () => {
      // Arrange
      const stationsResponse: ITankerkoenigListRemoteResponse = {
        data: 'foo',
        license: 'foo',
        ok: true,
        stations: [{
          brand: 'foo',
          diesel: 1,
          dist: 1,
          e10: 1,
          e5: 1,
          houseNumber: 'foo',
          id: 'remoteId',
          isOpen: true,
          lat: 1,
          lng: 2,
          name: 'foo',
          place: 'foo',
          postCode: 1,
          street: 'foo'
        }],
        status: 'ok'
      }
      jest.spyOn(requestService, 'get').mockImplementation(() => Promise.resolve(stationsResponse))
      // Act
      const stations: Array<TankerkoenigStationDto> = await service.searchStations('apiKey', 1, 2)
      // Assert
      expect(requestService.get).toHaveBeenCalledTimes(1)
      expect(stations.length).toBe(1)
      const firstStation: TankerkoenigStationDto = stations[0]
      expect(firstStation.city).toBe('foo')
      expect(firstStation.latitude).toBe(1)
      expect(firstStation.longitude).toBe(2)
      expect(firstStation.remoteId).toBe('remoteId')
    })

    it('make invalid request', async () => {
      // Arrange
      jest.spyOn(requestService, 'get').mockImplementation(() => Promise.resolve(invalidResponse))
      // Act + Assert
      expect.assertions(1)
      try {
        await service.searchStations('apiKey', 1, 2)
      } catch (err) {
        expect(err).toBeInstanceOf(Error)
      }
    })
  })

  describe('Search for prices', () => {
    it('valid search', async () => {
      // Arrange
      const priceOpenStation: ITankerkoenigPricesRemoteResponse = {
        data: 'foo',
        license: 'foo',
        ok: true,
        prices: {
          remoteId: {
            diesel: 1.109,
            e10: 1.319,
            e5: 1.339,
            status: 'open'
          }
        }
      }
      jest.spyOn(requestService, 'get').mockImplementation(() => Promise.resolve(priceOpenStation))
      // Act
      const prices: Array<TankerkoenigPrice> = await service.getPrices('apiKey', ['remoteId'])
      // Assert
      expect(requestService.get).toHaveBeenCalledTimes(1)
      expect(prices.length).toBe(1)
      const firstPrice: TankerkoenigPrice = prices[0]
      expect(firstPrice.status).toBe('open')
      expect(firstPrice.remoteId).toBe('remoteId')
      expect(firstPrice.diesel).toBe(1.109)
    })

    it('with missing station id', async () => {
      // Arrange
      // Act
      try {
        await service.getPrices('apiKey', [])
      } catch (err) {
        expect(err).toBeInstanceOf(Error)
      }
      // Assert
      expect.hasAssertions()
      expect(requestService.get).toHaveBeenCalledTimes(0)
    })

    it('with to many station id', async () => {
      // Arrange
      // Act
      try {
        await service.getPrices('apiKey', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'])
      } catch (err) {
        expect(err).toBeInstanceOf(Error)
      }
      // Assert
      expect.hasAssertions()
      expect(requestService.get).toHaveBeenCalledTimes(0)
    })

    it('make invalid request', async () => {
      // Arrange
      jest.spyOn(requestService, 'get').mockImplementation(() => Promise.resolve(invalidResponse))
      // Act + Assert
      expect.assertions(1)
      try {
        await service.getPrices('apiKey', ['foo'])
      } catch (err) {
        expect(err).toBeInstanceOf(Error)
      }
    })
  })
})
