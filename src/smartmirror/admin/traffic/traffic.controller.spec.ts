import { Test, TestingModule } from "@nestjs/testing"
import { TrafficController } from "./traffic.controller"
import { TrafficSettingsService } from "./settings/traffic-settings.service"
import { TrafficSettingsDto } from "../../../dataTransferObjects/traffic-settings.dto"

describe("Traffic Controller", () => {
  let controller: TrafficController
  let settingsService: TrafficSettingsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrafficController],
      providers: [
        {
          provide: TrafficSettingsService,
          useValue: {
            load: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<TrafficController>(TrafficController)
    settingsService = module.get<TrafficSettingsService>(TrafficSettingsService)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("Settings", () => {
    it("GET /settings", async () => {
      // Arrange
      const data: TrafficSettingsDto = {
        apiKey: "foo",
        isActive: true,
        locationFromId: "abc",
        locationToId: "def",
      }
      jest
        .spyOn(settingsService, "load")
        .mockImplementation(() => Promise.resolve(data))
      // Act
      const res: TrafficSettingsDto = await controller.loadSettings()
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
        apiKey: "foo",
        isActive: true,
        locationFromId: "abc",
        locationToId: "def",
      })
      // Assert
      expect(settingsService.save).toHaveBeenCalledTimes(1)
    })
  })
})
