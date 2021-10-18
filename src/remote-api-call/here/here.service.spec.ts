import { Test, TestingModule } from '@nestjs/testing'
import { HereService } from './here.service.js'
import { RequestService } from '../request/request.service.js'
import * as routeExample from './routeExample.json'
import { CarRouteDto } from '../../dataTransferObjects/car-route.dto.js'

describe('HereService', () => {
  let service: HereService
  let requestService: RequestService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HereService,
        {
          provide: RequestService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<HereService>(HereService)
    requestService = module.get<RequestService>(RequestService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('Get here trip', async () => {
    // Assert
    jest.spyOn(requestService, 'get').mockImplementation(() => Promise.resolve(routeExample))
    // Act
    const res: Array<CarRouteDto> = await service.getRoute('apiKey', 50, 10, 51, 11)
    // Assert
    expect(requestService.get).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.length).toBe(2)
  })
})
