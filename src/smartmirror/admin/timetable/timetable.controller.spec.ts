import { Test, TestingModule } from '@nestjs/testing'
import { TimetableController } from './timetable.controller'
import { TimetableSettingsService } from './settings/timetable-settings.service'
import { TimetableStationsService } from './stations/timetable-stations.service'
import { RmvStationDto } from '../../../dataTransferObjects/rmv-station.dto'
import { TimetableStationDto } from '../../../dataTransferObjects/timetable-station.dto'
import { SortOrderDto } from '../../../dataTransferObjects/sort-order.dto'
import { TimetableSettingsDto } from '../../../dataTransferObjects/timetable-settings.dto'

describe('Timetable Controller', () => {
  let controller: TimetableController
  let settingsService: TimetableSettingsService
  let stationsService: TimetableStationsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimetableController],
      providers: [
        {
          provide: TimetableStationsService,
          useValue: {
            add: jest.fn(),
            delete: jest.fn(),
            loadAll: jest.fn(),
            loadSingle: jest.fn(),
            reorderStations: jest.fn(),
            save: jest.fn(),
            search: jest.fn(),
          },
        },
        {
          provide: TimetableSettingsService,
          useValue: {
            getRecord: jest.fn(),
            load: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<TimetableController>(TimetableController)
    stationsService = module.get<TimetableStationsService>(TimetableStationsService)
    settingsService = module.get<TimetableSettingsService>(TimetableSettingsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('Settings', () => {
    it('GET /settings', async () => {
      // Arrange
      const data: TimetableSettingsDto = {
        apiKey: 'apikey',
        isActive: true,
        lines: {
          showBus: false,
          showIC: false,
          showICE: false,
          showRB: true,
          showRE: true,
          showSBahn: true,
          showTram: true,
          showUBahn: true,
        },
        maxChanges: 3,
        stationFromId: 'abc',
        stationToId: 'def',
      }
      jest.spyOn(settingsService, 'load').mockImplementation(() => Promise.resolve(data))
      // Act
      const res: TimetableSettingsDto = await controller.loadSettings()
      // Assert
      expect(settingsService.load).toHaveBeenCalledTimes(1)
      expect(res).toBeDefined()
    })

    it('PUT /settings', async () => {
      // Arrange
      jest.spyOn(settingsService, 'save').mockImplementation(() => Promise.resolve())
      // Act
      await controller.saveSettings({
        apiKey: 'apikey',
        isActive: true,
        lines: {
          showBus: false,
          showIC: false,
          showICE: false,
          showRB: true,
          showRE: true,
          showSBahn: true,
          showTram: true,
          showUBahn: true,
        },
        maxChanges: 3,
        stationFromId: 'abc',
        stationToId: 'def',
      })
      // Assert
      expect(settingsService.save).toHaveBeenCalledTimes(1)
    })
  })

  describe('Stations', () => {
    it('POST /stations/search', async () => {
      // Arrange
      const resData: Array<RmvStationDto> = [
        {
          distance: 34,
          latitude: 50,
          longitude: 10,
          name: 'Frankfurt Hbf',
          products: 255,
          remoteId: 34343,
        },
      ]
      jest.spyOn(stationsService, 'search').mockImplementationOnce(() => Promise.resolve(resData))
      jest.spyOn(settingsService, 'getRecord').mockImplementationOnce(() =>
        Promise.resolve({
          apiKey: '',
          id: '',
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
          timetableStationFrom: null,
          timetableStationTo: null,
        }),
      )
      // Act
      const res: Array<RmvStationDto> = await controller.searchForStations({
        latitude: 50,
        longitude: 10,
      })
      // Assert
      expect(stationsService.search).toHaveBeenCalledTimes(1)
      expect(res).toBeDefined()
      expect(res.length).toBe(1)
      const firstLocation: RmvStationDto = res[0]
      expect(firstLocation.name).toBe('Frankfurt Hbf')
    })

    it('POST /stations', async () => {
      // Arrange
      const sendData: RmvStationDto = {
        distance: 34,
        latitude: 50,
        longitude: 10,
        name: 'Foo',
        products: 255,
        remoteId: 34343,
      }
      jest.spyOn(stationsService, 'add').mockImplementationOnce(() => Promise.resolve())
      // Act
      await controller.createStation(sendData)
      // Assert
      expect(stationsService.add).toHaveBeenCalledTimes(1)
    })

    it('GET /stations', async () => {
      // Arrange
      jest.spyOn(stationsService, 'loadAll').mockImplementationOnce(() => Promise.resolve([]))
      // Act
      const res: Array<TimetableStationDto> = await controller.loadAllStations()
      // Assert
      expect(stationsService.loadAll).toHaveBeenCalledTimes(1)
      expect(res.length).toBe(0)
    })

    it('GET /stations/:id', async () => {
      // Arrange
      jest.spyOn(stationsService, 'loadSingle').mockImplementationOnce(() => Promise.resolve(null))
      // Act
      const res: TimetableStationDto = await controller.loadSingleStation('foo')
      // Assert
      expect(stationsService.loadSingle).toHaveBeenCalledTimes(1)
      expect(res).toBeNull()
    })

    it('PUT /stations/:id', async () => {
      // Arrange
      const sendData: TimetableStationDto = {
        id: 'foo',
        name: 'Some City',
        nameOrigin: 'Some City Foo',
        remoteId: 42,
        sortNo: 99,
      }
      jest.spyOn(stationsService, 'save').mockImplementation(() => Promise.resolve())
      // Act
      await controller.saveStation('1', sendData)
      // Assert
      expect(stationsService.save).toHaveBeenCalledTimes(1)
    })

    it('DELETE /stations/:id', async () => {
      // Arrange
      jest.spyOn(stationsService, 'delete').mockImplementation(() => Promise.resolve())
      // Act
      await controller.deleteStation('foo')
      // Assert
      expect(stationsService.delete).toHaveBeenCalledTimes(1)
    })

    it('PUT /stations/reorder', async () => {
      // Arrange
      jest.spyOn(stationsService, 'reorderStations').mockImplementation(() => Promise.resolve())
      // Act
      await controller.reorderStations([new SortOrderDto()])
      // Assert
      expect(stationsService.reorderStations).toHaveBeenCalledTimes(1)
    })
  })
})
