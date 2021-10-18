import { Test, TestingModule } from '@nestjs/testing'
import { HttpModule } from '@nestjs/common'
import { OpenStreetMapService } from './open-street-map.service.js'
import { IOpenStreetMapSearchRemoteResponse } from './open-street-map-search.remote-response.js'
import { RequestService } from '../request/request.service.js'
import { OpenStreetMapLocationDto } from '../../dataTransferObjects/open-street-map-location.dto.js'

describe('OpenStreetMapService', () => {
  let service: OpenStreetMapService
  let requestService: RequestService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenStreetMapService,
        {
          provide: RequestService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<OpenStreetMapService>(OpenStreetMapService)
    requestService = module.get<RequestService>(RequestService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('search by text', async () => {
    // Arrange
    const cities: Array<IOpenStreetMapSearchRemoteResponse> = [
      {
        boundingbox: [],
        class: '',
        display_name: 'Some City',
        icon: '',
        importance: 0.333,
        lat: '42',
        licence: '',
        lon: '33',
        osm_type: '',
        place_id: 1,
        type: '',
      },
    ]
    jest.spyOn(requestService, 'get').mockImplementation(() => Promise.resolve(cities))
    // Act
    const res: Array<OpenStreetMapLocationDto> = await service.searchByText('Hauptstrasse Frankfurt')
    // Assert
    expect(requestService.get).toHaveBeenCalledTimes(1)
    expect(res.length).toBe(1)
    const first: OpenStreetMapLocationDto = res[0]
    expect(first.name).toBe('Some City')
    expect(first.latitude).toBe(42)
    expect(first.longitude).toBe(33)
  })

  it('search by postalcode', async () => {
    // Arrange
    const cities: Array<IOpenStreetMapSearchRemoteResponse> = [
      {
        boundingbox: [],
        class: '',
        display_name: 'Some City',
        icon: '',
        importance: 0.333,
        lat: '42',
        licence: '',
        lon: '33',
        osm_type: '',
        place_id: 1,
        type: '',
      },
    ]
    jest.spyOn(requestService, 'get').mockImplementation(() => Promise.resolve(cities))
    // Act
    const res: Array<OpenStreetMapLocationDto> = await service.searchByPostalcode('12345')
    // Assert
    expect(requestService.get).toHaveBeenCalledTimes(1)
    expect(res.length).toBe(1)
    const first: OpenStreetMapLocationDto = res[0]
    expect(first.name).toBe('Some City')
    expect(first.latitude).toBe(42)
    expect(first.longitude).toBe(33)
  })

  it('search by text', async () => {
    // Arrange
    const cities: Array<IOpenStreetMapSearchRemoteResponse> = [
      {
        boundingbox: [],
        class: '',
        display_name: 'Some City',
        icon: '',
        importance: 0.333,
        lat: '42',
        licence: '',
        lon: '33',
        osm_type: '',
        place_id: 1,
        type: '',
      },
    ]
    jest.spyOn(requestService, 'get').mockImplementation(() => Promise.resolve(cities))
    // Act
    const res: Array<OpenStreetMapLocationDto> = await service.searchByCity('Frankfurt')
    // Assert
    expect(requestService.get).toHaveBeenCalledTimes(1)
    expect(res.length).toBe(1)
    const first: OpenStreetMapLocationDto = res[0]
    expect(first.name).toBe('Some City')
    expect(first.latitude).toBe(42)
    expect(first.longitude).toBe(33)
  })
})
