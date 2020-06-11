import { Test, TestingModule } from "@nestjs/testing"
import { CommonLocationEntity } from "../../../entities/common-location.entity"
import { OpenWeatherService } from "../../../remote-api-call/open-weather/open-weather.service"
import { UiWeatherService } from "./ui-weather.service"
import { WeatherSettingsService } from "../../admin/weather/settings/weather-settings.service"
import { WeatherSettingsEntity } from "../../../entities/weather-settings.entity"
import { WeatherDatasDto } from "../../../dataTransferObjects/weather-datas.dto"

describe("UiWeatherService", () => {
  let service: UiWeatherService
  let settingsService: WeatherSettingsService
  let openWeatherService: OpenWeatherService

  const someLocation: CommonLocationEntity = Object.freeze({
    id: "abc",
    latitude: 30,
    longitude: 10,
    name: "foo",
    nameOrigin: "foobar",
    sortNo: 1,
  })
  const someSettingEntity: WeatherSettingsEntity = Object.freeze({
    apiKey: "apikey",
    commonLocation: someLocation,
    id: "foo",
    isActive: true,
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UiWeatherService,
        {
          provide: WeatherSettingsService,
          useValue: {
            getRecord: jest.fn(),
          },
        },
        {
          provide: OpenWeatherService,
          useValue: {
            getByCoordinates: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<UiWeatherService>(UiWeatherService)
    settingsService = module.get<WeatherSettingsService>(WeatherSettingsService)
    openWeatherService = module.get<OpenWeatherService>(OpenWeatherService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("getWeather", async () => {
    // Arrange
    const data: WeatherDatasDto = {
      infos: [
        {
          conditionText: "foo",
          icon: "foo",
          temperature: 12.3,
          temperatureFeelsLike: 24.3,
          timestamp: 1523254125,
        },
      ],
      name: "foo",
    }
    jest
      .spyOn(settingsService, "getRecord")
      .mockResolvedValueOnce(someSettingEntity)
    jest
      .spyOn(openWeatherService, "getByCoordinates")
      .mockResolvedValueOnce(data)
    // Act
    const res: WeatherDatasDto = await service.getWeather()
    // Assert
    expect(settingsService.getRecord).toHaveBeenCalledTimes(1)
    expect(openWeatherService.getByCoordinates).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.infos.length).toBe(1)
    expect(res.infos[0].temperature).toBe(12.3)
  })

  it("getWeather with no apikey", async () => {
    // Arrange
    const data: WeatherSettingsEntity = JSON.parse(
      JSON.stringify(someSettingEntity),
    )
    data.apiKey = ""
    jest.spyOn(settingsService, "getRecord").mockResolvedValueOnce(data)
    // Act + Assert
    await expect(service.getWeather()).rejects.toThrow(Error)
    expect(settingsService.getRecord).toHaveBeenCalledTimes(1)
  })

  it("getWeather with no disabled widget", async () => {
    // Arrange
    const data: WeatherSettingsEntity = JSON.parse(
      JSON.stringify(someSettingEntity),
    )
    data.isActive = false
    jest.spyOn(settingsService, "getRecord").mockResolvedValueOnce(data)
    // Act + Assert
    await expect(service.getWeather()).rejects.toThrow(Error)
    expect(settingsService.getRecord).toHaveBeenCalledTimes(1)
  })
})
