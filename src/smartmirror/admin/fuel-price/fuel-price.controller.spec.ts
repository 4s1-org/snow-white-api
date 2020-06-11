import { Test, TestingModule } from "@nestjs/testing"
import { FuelPriceController } from "./fuel-price.controller"
import { FuelPriceStationsService } from "./stations/fuel-price-stations.service"
import { FuelPriceSettingsService } from "./settings/fuel-price-settings.service"
import { FuelPriceSettingsDto } from "../../../dataTransferObjects/fuel-price-settings.dto"
import { TankerkoenigStationDto } from "../../../dataTransferObjects/tankerkoenig-station.dto"
import { FuelPriceStationDto } from "../../../dataTransferObjects/fuel-price-station.dto"
import { SortOrderDto } from "../../../dataTransferObjects/sort-order.dto"

describe("FuelPrice Controller", () => {
  let controller: FuelPriceController
  let stationsService: FuelPriceStationsService
  let settingsService: FuelPriceSettingsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuelPriceController],
      providers: [
        {
          provide: FuelPriceStationsService,
          useValue: {
            add: jest.fn(),
            delete: jest.fn(),
            loadAll: jest.fn(),
            loadSingle: jest.fn(),
            reorderGasStations: jest.fn(),
            save: jest.fn(),
            search: jest.fn(),
          },
        },
        {
          provide: FuelPriceSettingsService,
          useValue: {
            getRecord: jest.fn(),
            load: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<FuelPriceController>(FuelPriceController)
    stationsService = module.get<FuelPriceStationsService>(
      FuelPriceStationsService,
    )
    settingsService = module.get<FuelPriceSettingsService>(
      FuelPriceSettingsService,
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("Settings", () => {
    it("GET /settings", async () => {
      // Arrange
      const data: FuelPriceSettingsDto = {
        apiKey: "***",
        interval: 15 * 3600,
        isActive: true,
        showDiesel: true,
        showE10: true,
        showE5: true,
      }
      jest
        .spyOn(settingsService, "load")
        .mockImplementation(() => Promise.resolve(data))
      // Act
      const res: FuelPriceSettingsDto = await controller.loadSettings()
      // Assert
      expect(settingsService.load).toHaveBeenCalledTimes(1)
      expect(res).toBeDefined()
    })

    it("PUT /settings", async () => {
      // Arrange
      jest
        .spyOn(settingsService, "save")
        .mockImplementation(() => Promise.resolve())
      // Act
      await controller.saveSettings({
        apiKey: "***",
        interval: 15 * 3600,
        isActive: true,
        showDiesel: true,
        showE10: true,
        showE5: true,
      })
      // Assert
      expect(settingsService.save).toHaveBeenCalledTimes(1)
    })
  })

  describe("Stations", () => {
    it("POST /stations/search", async () => {
      // Arrange
      const resData: Array<TankerkoenigStationDto> = [
        {
          brand: "none",
          city: "Some City",
          houseNumber: "2a",
          latitude: 50,
          longitude: 10,
          name: "Tankhof",
          postCode: 34,
          remoteId: "foo",
          street: "Mainstreet",
        },
      ]
      jest
        .spyOn(stationsService, "search")
        .mockImplementation(() => Promise.resolve(resData))
      jest.spyOn(settingsService, "getRecord").mockImplementation(() =>
        Promise.resolve({
          apiKey: "apiKey",
          id: "",
          interval: 15 * 3600,
          isActive: true,
          showDiesel: true,
          showE10: true,
          showE5: true,
        }),
      )
      // Act
      const res: Array<TankerkoenigStationDto> = await controller.searchStations(
        { latitude: 50, longitude: 10 },
      )
      // Assert
      expect(stationsService.search).toHaveBeenCalledTimes(1)
      expect(res).toBeDefined()
      expect(res.length).toBe(1)
      const firstLocation: TankerkoenigStationDto = res[0]
      expect(firstLocation.name).toBe("Tankhof")
    })

    it("POST /stations", async () => {
      // Arrange
      const sendData: TankerkoenigStationDto = {
        brand: "none",
        city: "Some City",
        houseNumber: "2a",
        latitude: 50,
        longitude: 10,
        name: "Tankhof",
        postCode: 34,
        remoteId: "foo",
        street: "Mainstreet",
      }
      jest
        .spyOn(stationsService, "add")
        .mockImplementationOnce(() => Promise.resolve())
      // Act
      await controller.addGasStation(sendData)
      // Assert
      expect(stationsService.add).toHaveBeenCalledTimes(1)
    })

    it("GET /stations", async () => {
      // Arrange
      jest
        .spyOn(stationsService, "loadAll")
        .mockImplementationOnce(() => Promise.resolve([]))
      // Act
      const res: Array<FuelPriceStationDto> = await controller.loadAllGasStations()
      // Assert
      expect(stationsService.loadAll).toHaveBeenCalledTimes(1)
      expect(res.length).toBe(0)
    })

    it("GET /stations/:id", async () => {
      // Arrange
      jest
        .spyOn(stationsService, "loadSingle")
        .mockImplementationOnce(() => Promise.resolve(null))
      // Act
      const res: FuelPriceStationDto = await controller.loadSingleGasStation(
        "foo",
      )
      // Assert
      expect(stationsService.loadSingle).toHaveBeenCalledTimes(1)
      expect(res).toBeNull()
    })

    it("PUT /stations/:id", async () => {
      // Arrange
      const sendData: FuelPriceStationDto = {
        id: "bar",
        latitude: 50,
        longitude: 10,
        name: "Tankhof",
        nameOrigin: "Foobar",
        remoteId: "foo",
        sortNo: 34,
      }
      jest
        .spyOn(stationsService, "save")
        .mockImplementation(() => Promise.resolve())
      // Act
      await controller.saveGasStation("1", sendData)
      // Assert
      expect(stationsService.save).toHaveBeenCalledTimes(1)
    })

    it("DELETE /stations/:id", async () => {
      // Arrange
      jest
        .spyOn(stationsService, "delete")
        .mockImplementation(() => Promise.resolve())
      // Act
      await controller.deleteGasStation("foo")
      // Assert
      expect(stationsService.delete).toHaveBeenCalledTimes(1)
    })

    it("PUT /stations/reorder", async () => {
      // Arrange
      jest
        .spyOn(stationsService, "reorderGasStations")
        .mockImplementation(() => Promise.resolve())
      // Act
      await controller.reorderGasStations([new SortOrderDto()])
      // Assert
      expect(stationsService.reorderGasStations).toHaveBeenCalledTimes(1)
    })
  })
})
