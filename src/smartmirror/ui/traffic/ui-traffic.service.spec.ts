import { Test, TestingModule } from '@nestjs/testing'
import { UiTrafficService } from './ui-traffic.service.js'
import { TrafficSettingsService } from '../../admin/traffic/settings/traffic-settings.service.js'
import { HereService } from '../../../remote-api-call/here/here.service.js'
import { CarRouteDto } from '../../../dataTransferObjects/car-route.dto.js'
import { CommonLocationEntity } from '../../../entities/common-location.entity.js'
import { TrafficSettingsEntity } from '../../../entities/traffic-settings.entity.js'
import { CarRoutesDto } from '../../../dataTransferObjects/car-routes.dto.js'
import { CommonSettingsService } from '../../admin/common/settings/common-settings.service.js'
import { CommonSettingsEntity } from '../../../entities/common-settings.entity.js'
import { ConstantsService } from '../../../global/constants/constants.service.js'

describe('UiTrafficService', () => {
  let service: UiTrafficService
  let settingsService: TrafficSettingsService
  let hereService: HereService
  let commonSettingsService: CommonSettingsService
  let constantsService: ConstantsService

  const someLocationFrom: CommonLocationEntity = Object.freeze({
    id: 'abcd',
    latitude: 30,
    longitude: 10,
    name: 'Location FROM',
    nameOrigin: 'foobar',
    sortNo: 1,
  })
  const someLocationTo: CommonLocationEntity = Object.freeze({
    id: 'absdcd',
    latitude: 30,
    longitude: 10,
    name: 'Location TO',
    nameOrigin: 'foobar',
    sortNo: 2,
  })
  const someSettingEntity: TrafficSettingsEntity = Object.freeze({
    apiKey: 'apikey',
    commonLocationFrom: someLocationFrom,
    commonLocationTo: someLocationTo,
    id: 'foo',
    isActive: true,
  })
  const commonSettingEntity: CommonSettingsEntity = Object.freeze({
    id: 'foo',
    morningEnd: 12 * 3600,
    morningStart: 5 * 3600,
  })
  const hereData: Array<CarRouteDto> = [
    {
      distance: 99,
      expectedTime: 234,
      streetTypes: ['A5', 'B49'],
      text: 'Foo',
    },
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UiTrafficService,
        CommonSettingsService,
        {
          provide: TrafficSettingsService,
          useValue: {
            getRecord: jest.fn(),
          },
        },
        {
          provide: HereService,
          useValue: {
            getRoute: jest.fn(),
          },
        },
        {
          provide: CommonSettingsService,
          useValue: {
            getRecord: jest.fn(),
          },
        },
        {
          provide: ConstantsService,
          useValue: {
            getCurrentTimestamp: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<UiTrafficService>(UiTrafficService)
    settingsService = module.get<TrafficSettingsService>(TrafficSettingsService)
    hereService = module.get<HereService>(HereService)
    commonSettingsService = module.get<CommonSettingsService>(CommonSettingsService)
    constantsService = module.get<ConstantsService>(ConstantsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('getRoute', async () => {
    // Arrange
    jest.spyOn(commonSettingsService, 'getRecord').mockResolvedValueOnce(commonSettingEntity)
    jest.spyOn(settingsService, 'getRecord').mockResolvedValueOnce(someSettingEntity)
    jest.spyOn(hereService, 'getRoute').mockResolvedValueOnce(hereData)
    // Act
    const res: CarRoutesDto = await service.getRoute()
    // Assert
    expect(commonSettingsService.getRecord).toHaveBeenCalledTimes(1)
    expect(settingsService.getRecord).toHaveBeenCalledTimes(1)
    expect(hereService.getRoute).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.routes.length).toBe(1)
  })

  it('getRoute with no apikey', async () => {
    // Arrange
    const data: TrafficSettingsEntity = JSON.parse(JSON.stringify(someSettingEntity))
    data.apiKey = ''
    jest.spyOn(settingsService, 'getRecord').mockResolvedValueOnce(data)
    // Act + Assert
    await expect(service.getRoute()).rejects.toThrow(Error)
    expect(settingsService.getRecord).toHaveBeenCalledTimes(1)
  })

  it('getRoute with no disabled widget', async () => {
    // Arrange
    const data: TrafficSettingsEntity = JSON.parse(JSON.stringify(someSettingEntity))
    data.isActive = false
    jest.spyOn(settingsService, 'getRecord').mockResolvedValueOnce(data)
    // Act + Assert
    await expect(service.getRoute()).rejects.toThrow(Error)
    expect(settingsService.getRecord).toHaveBeenCalledTimes(1)
  })

  it('switch direction VM', async () => {
    // Arrange
    jest.spyOn(commonSettingsService, 'getRecord').mockResolvedValueOnce(commonSettingEntity)
    jest.spyOn(settingsService, 'getRecord').mockResolvedValueOnce(someSettingEntity)
    jest.spyOn(hereService, 'getRoute').mockResolvedValueOnce(hereData)
    jest.spyOn(constantsService, 'getCurrentTimestamp').mockReturnValueOnce(10 * 3600)
    // Act
    const res: CarRoutesDto = await service.getRoute()
    // Assert
    expect(res).toBeDefined()
    expect(res.text).toBe(`${someLocationFrom.name} nach ${someLocationTo.name}`)
  })

  it('switch direction NM', async () => {
    // Arrange
    jest.spyOn(commonSettingsService, 'getRecord').mockResolvedValueOnce(commonSettingEntity)
    jest.spyOn(settingsService, 'getRecord').mockResolvedValueOnce(someSettingEntity)
    jest.spyOn(hereService, 'getRoute').mockResolvedValueOnce(hereData)
    jest.spyOn(constantsService, 'getCurrentTimestamp').mockReturnValueOnce(20 * 3600)
    // Act
    const res: CarRoutesDto = await service.getRoute()
    // Assert
    expect(res).toBeDefined()
    expect(res.text).toBe(`${someLocationTo.name} nach ${someLocationFrom.name}`)
  })
})
