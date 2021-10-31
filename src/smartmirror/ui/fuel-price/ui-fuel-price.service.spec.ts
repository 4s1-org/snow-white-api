import { Test, TestingModule } from '@nestjs/testing'
import { TankerkoenigService } from '../../../remote-api-call/tankerkoenig/tankerkoenig.service.js'
import { RequestService } from '../../../remote-api-call/request/request.service.js'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { UiFuelPriceService } from './ui-fuel-price.service.js'
import { ITankerkoenigPricesRemoteResponse } from '../../../remote-api-call/tankerkoenig/tankerkoenig-prices.remote-response.js'
import { CommonLocationEntity } from '../../../entities/common-location.entity.js'
import { FuelPriceStationEntity } from '../../../entities/fuel-price-station.entity.js'
import { FuelPriceSettingsService } from '../../admin/fuel-price/settings/fuel-price-settings.service.js'
import { FuelPricePricesDto } from '../../../dataTransferObjects/fuel-price-prices.dto.js'

describe('UiFuelPriceService', () => {
  let service: UiFuelPriceService
  let settingsService: FuelPriceSettingsService
  let repoStation: Repository<FuelPriceStationEntity>
  let requestService: RequestService

  const commonLocation: CommonLocationEntity = {
    id: 'foo',
    latitude: 1,
    longitude: 1,
    name: 'foo',
    nameOrigin: 'foo',
    sortNo: 1,
  }

  const priceOpenStation: ITankerkoenigPricesRemoteResponse = {
    data: 'foo',
    license: 'foo',
    ok: true,
    prices: {
      remoteId: {
        diesel: 1.109,
        e10: 1.319,
        e5: 1.339,
        status: 'open',
      },
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UiFuelPriceService,
        TankerkoenigService,
        RequestService,
        {
          provide: getRepositoryToken(FuelPriceStationEntity),
          useClass: Repository,
        },
        {
          provide: FuelPriceSettingsService,
          useValue: {
            getRecord: jest.fn(),
          },
        },
        {
          provide: RequestService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<UiFuelPriceService>(UiFuelPriceService)
    repoStation = module.get<Repository<FuelPriceStationEntity>>(getRepositoryToken(FuelPriceStationEntity))
    settingsService = module.get<FuelPriceSettingsService>(FuelPriceSettingsService)
    requestService = module.get<RequestService>(RequestService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('get price of single open station', async () => {
    // Arrange
    const stations: Array<FuelPriceStationEntity> = [
      {
        id: 'someId1',
        latitude: 1,
        longitude: 1,
        name: 'Hello1',
        nameOrigin: '',
        remoteId: 'remoteId',
        sortNo: 1,
      },
    ]
    jest.spyOn(repoStation, 'find').mockResolvedValueOnce(stations)
    jest.spyOn(settingsService, 'getRecord').mockImplementationOnce(() =>
      Promise.resolve({
        apiKey: 'apiKey',
        id: '',
        interval: 15 * 3600,
        isActive: true,
        showDiesel: true,
        showE10: true,
        showE5: true,
      }),
    )
    jest.spyOn(requestService, 'get').mockImplementation(() => Promise.resolve(priceOpenStation))
    // Act
    const prices: Array<FuelPricePricesDto> = await service.getPrices()
    // Assert
    expect(requestService.get).toHaveBeenCalledTimes(1)
    expect(prices).toBeDefined()
    expect(prices.length).toBe(1)
    const stationOne: FuelPricePricesDto = prices[0]
    expect(stationOne.name).toBe('Hello1')
    expect(stationOne.diesel).toBe(1.109)
  })
})
