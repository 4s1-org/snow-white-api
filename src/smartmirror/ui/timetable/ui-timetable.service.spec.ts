import { Test, TestingModule } from '@nestjs/testing'
import { UiTimetableService } from './ui-timetable.service.js'
import { TimetableSettingsService } from '../../admin/timetable/settings/timetable-settings.service.js'
import { RmvService } from '../../../remote-api-call/rmv/rmv.service.js'
import { TimetableSettingsEntity } from '../../../entities/timetable-settings.entity.js'
import { RmvTripsDto } from '../../../dataTransferObjects/rmv-trips.dto.js'
import { RmvTripDto } from '../../../dataTransferObjects/rmv-trip.dto.js'
import { TimetableStationEntity } from '../../../entities/timetable-station.entity.js'
import { CommonSettingsService } from '../../admin/common/settings/common-settings.service.js'
import { CommonSettingsEntity } from '../../../entities/common-settings.entity.js'
import { ConstantsService } from '../../../global/constants/constants.service.js'

describe('UiTimetableService', () => {
  let service: UiTimetableService
  let settingsService: TimetableSettingsService
  let rmvService: RmvService
  let commonSettingsService: CommonSettingsService
  let constantsService: ConstantsService

  const someTimetableStationFrom: TimetableStationEntity = Object.freeze({
    id: 'bar1',
    name: 'Station FROM',
    nameOrigin: 'Station Hbf from',
    remoteId: 1234,
    sortNo: 1,
  })
  const someTimetableStationTo: TimetableStationEntity = Object.freeze({
    id: 'bar2',
    name: 'Station TO',
    nameOrigin: 'Station Hbf to',
    remoteId: 1233,
    sortNo: 2,
  })
  const someSettingEntity: TimetableSettingsEntity = Object.freeze({
    apiKey: 'apikey',
    id: 'Foobar',
    isActive: true,
    maxChanges: 3,
    showBus: false,
    showIC: false,
    showICE: false,
    showRB: true,
    showRE: true,
    showSBahn: true,
    showTram: true,
    showUBahn: true,
    timetableStationFrom: someTimetableStationFrom,
    timetableStationTo: someTimetableStationTo,
  })
  const commonSettingEntity: CommonSettingsEntity = Object.freeze({
    id: 'foo',
    morningEnd: 12 * 3600,
    morningStart: 5 * 3600,
  })
  const defaultTrip: Array<RmvTripDto> = [
    {
      arrivalTimePlanned: 1,
      arrivalTimeReal: 1,
      durationPlanned: 1,
      durationReal: 1,
      lines: ['RB'],
      startTimePlanned: 1,
      startTimeReal: 1,
      trackPlanned: '1',
      trackReal: '1',
      tripId: 'bar',
    },
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UiTimetableService,
        {
          provide: TimetableSettingsService,
          useValue: {
            getRecord: jest.fn(),
          },
        },
        {
          provide: RmvService,
          useValue: {
            getTrip: jest.fn(),
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

    service = module.get<UiTimetableService>(UiTimetableService)
    settingsService = module.get<TimetableSettingsService>(TimetableSettingsService)
    rmvService = module.get<RmvService>(RmvService)
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
    jest.spyOn(rmvService, 'getTrip').mockResolvedValueOnce(defaultTrip)
    // Act
    const res: RmvTripsDto = await service.getTimetable()
    // Assert
    expect(commonSettingsService.getRecord).toHaveBeenCalledTimes(1)
    expect(settingsService.getRecord).toHaveBeenCalledTimes(1)
    expect(rmvService.getTrip).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.trips.length).toBe(1)
  })

  it('getTrip with no apikey', async () => {
    // Arrange
    const data: TimetableSettingsEntity = JSON.parse(JSON.stringify(someSettingEntity))
    data.apiKey = ''
    jest.spyOn(settingsService, 'getRecord').mockResolvedValueOnce(data)
    // Act + Assert
    await expect(service.getTimetable()).rejects.toThrow(Error)
    expect(settingsService.getRecord).toHaveBeenCalledTimes(1)
  })

  it('getRoute with no disabled widget', async () => {
    // Arrange
    const data: TimetableSettingsEntity = JSON.parse(JSON.stringify(someSettingEntity))
    data.isActive = false
    jest.spyOn(settingsService, 'getRecord').mockResolvedValueOnce(data)
    // Act + Assert
    await expect(service.getTimetable()).rejects.toThrow(Error)
    expect(settingsService.getRecord).toHaveBeenCalledTimes(1)
  })

  it('switch direction VM', async () => {
    // Arrange
    jest.spyOn(commonSettingsService, 'getRecord').mockResolvedValueOnce(commonSettingEntity)
    jest.spyOn(settingsService, 'getRecord').mockResolvedValueOnce(someSettingEntity)
    jest.spyOn(rmvService, 'getTrip').mockResolvedValueOnce(defaultTrip)
    jest.spyOn(constantsService, 'getCurrentTimestamp').mockReturnValueOnce(10 * 3600)
    // Act
    const res: RmvTripsDto = await service.getTimetable()
    // Assert
    expect(res).toBeDefined()
    expect(res.text).toBe(`${someTimetableStationFrom.name} nach ${someTimetableStationTo.name}`)
  })

  it('switch direction NM', async () => {
    // Arrange
    jest.spyOn(commonSettingsService, 'getRecord').mockResolvedValueOnce(commonSettingEntity)
    jest.spyOn(settingsService, 'getRecord').mockResolvedValueOnce(someSettingEntity)
    jest.spyOn(rmvService, 'getTrip').mockResolvedValueOnce(defaultTrip)
    jest.spyOn(constantsService, 'getCurrentTimestamp').mockReturnValueOnce(20 * 3600)
    // Act
    const res: RmvTripsDto = await service.getTimetable()
    // Assert
    expect(res).toBeDefined()
    expect(res.text).toBe(`${someTimetableStationTo.name} nach ${someTimetableStationFrom.name}`)
  })
})
