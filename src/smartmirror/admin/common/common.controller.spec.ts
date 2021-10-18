import { Test, TestingModule } from '@nestjs/testing'
import { CommonController } from './common.controller.js'
import { CommonLocationsService } from './locations/common-locations.service.js'
import { RemoteApiCallModule } from '../../../remote-api-call/remote-api-call.module.js'
import { OpenStreetMapLocationDto } from '../../../dataTransferObjects/open-street-map-location.dto.js'
import { CommonSettingsDto } from '../../../dataTransferObjects/common-settings.dto.js'
import { Repository } from 'typeorm'
import { CommonSettingsEntity } from '../../../entities/common-settings.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { CommonSettingsService } from './settings/common-settings.service.js'
import { CommonLocationDto } from '../../../dataTransferObjects/common-location.dto.js'
import { CommonLocationEntity } from '../../../entities/common-location.entity'
import { SortOrderDto } from '../../../dataTransferObjects/sort-order.dto.js'

describe('Common Controller', () => {
  let controller: CommonController
  let locationsService: CommonLocationsService
  let settingsService: CommonSettingsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommonController],
      imports: [RemoteApiCallModule],
      providers: [
        CommonLocationsService,
        CommonSettingsService,
        {
          provide: getRepositoryToken(CommonSettingsEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CommonLocationEntity),
          useClass: Repository,
        },
      ],
    }).compile()

    controller = module.get<CommonController>(CommonController)
    locationsService = module.get<CommonLocationsService>(CommonLocationsService)
    settingsService = module.get<CommonSettingsService>(CommonSettingsService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('Settings', () => {
    it('GET /settings', async () => {
      // Arrange
      const data: CommonSettingsDto = {
        morningEnd: 5,
        morningStart: 3,
      }
      jest.spyOn(settingsService, 'load').mockImplementation(() => Promise.resolve(data))
      // Act
      const res: CommonSettingsDto = await controller.loadSettings()
      // Assert
      expect(settingsService.load).toHaveBeenCalledTimes(1)
      expect(res).toBeDefined()
    })

    it('PUT /settings', async () => {
      // Arrange
      jest.spyOn(settingsService, 'save').mockImplementation(() => Promise.resolve())
      // Act
      await controller.saveSettings({ morningStart: 3, morningEnd: 5 })
      // Assert
      expect(settingsService.save).toHaveBeenCalledTimes(1)
    })
  })

  describe('Locations', () => {
    it('GET /locations/search/:text', async () => {
      // Arrange
      const data: Array<OpenStreetMapLocationDto> = [
        {
          importance: 66.6,
          latitude: 50,
          longitude: 10,
          name: 'Some City',
          remoteId: 1,
        },
      ]
      jest.spyOn(locationsService, 'search').mockImplementation(() => Promise.resolve(data))
      // Act
      const res: Array<OpenStreetMapLocationDto> = await controller.searchLocations('foo')
      // Assert
      expect(locationsService.search).toHaveBeenCalledTimes(1)
      expect(res).toBeDefined()
      expect(res.length).toBe(1)
      const firstLocation: OpenStreetMapLocationDto = res[0]
      expect(firstLocation.name).toBe('Some City')
    })

    it('POST /locations', async () => {
      // Arrange
      const data: OpenStreetMapLocationDto = {
        importance: 66.6,
        latitude: 50,
        longitude: 10,
        name: 'Some City',
        remoteId: 1,
      }
      jest.spyOn(locationsService, 'add').mockImplementation(() => Promise.resolve())
      // Act
      await controller.addLocation(data)
      // Assert
      expect(locationsService.add).toHaveBeenCalledTimes(1)
    })

    it('GET /locations', async () => {
      // Arrange
      const data: Array<CommonLocationDto> = [
        {
          id: 'foo',
          latitude: 50,
          longitude: 10,
          name: 'Some City',
          nameOrigin: 'Some City Foo',
          sortNo: 1,
        },
      ]
      jest.spyOn(locationsService, 'loadAll').mockImplementation(() => Promise.resolve(data))
      // Act
      const res: Array<CommonLocationDto> = await controller.loadAllLocations()
      // Assert
      expect(locationsService.loadAll).toHaveBeenCalledTimes(1)
      expect(res).toBeDefined()
      expect(res.length).toBe(1)
      expect(res[0].id).toBe('foo')
    })

    it('POST /locations/:id', async () => {
      // Arrange
      const data: CommonLocationDto = {
        id: 'foo',
        latitude: 50,
        longitude: 10,
        name: 'Some City',
        nameOrigin: 'Some City Foo',
        sortNo: 1,
      }
      jest.spyOn(locationsService, 'loadSingle').mockImplementation(() => Promise.resolve(data))
      // Act
      const res: CommonLocationDto = await controller.loadSingleLocation('foo')
      // Assert
      expect(locationsService.loadSingle).toHaveBeenCalledTimes(1)
      expect(res).toBeDefined()
      expect(res.id).toBe('foo')
    })

    it('PUT /locations/:id', async () => {
      // Arrange
      const data: CommonLocationDto = {
        id: 'foo',
        latitude: 50,
        longitude: 10,
        name: 'Some City',
        nameOrigin: 'Some City Foo',
        sortNo: 1,
      }
      jest.spyOn(locationsService, 'save').mockImplementation(() => Promise.resolve())
      // Act
      await controller.saveLocation('foo', data)
      // Assert
      expect(locationsService.save).toHaveBeenCalledTimes(1)
    })

    it('DELETE /locations/:id', async () => {
      // Arrange
      jest.spyOn(locationsService, 'delete').mockImplementation(() => Promise.resolve())
      // Act
      await controller.deleteLocation('foo')
      // Assert
      expect(locationsService.delete).toHaveBeenCalledTimes(1)
    })

    it('PUT /locations/reorder', async () => {
      // Arrange
      jest.spyOn(locationsService, 'reorderLocations').mockImplementation(() => Promise.resolve())
      // Act
      await controller.reorderLocations([new SortOrderDto()])
      // Assert
      expect(locationsService.reorderLocations).toHaveBeenCalledTimes(1)
    })
  })
})
