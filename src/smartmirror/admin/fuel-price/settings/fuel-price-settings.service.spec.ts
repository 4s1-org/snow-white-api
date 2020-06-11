import { Test, TestingModule } from "@nestjs/testing"
import { FuelPriceSettingsService } from "./fuel-price-settings.service"
import { FuelPriceSettingsEntity } from "../../../../entities/fuel-price-settings.entity"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FuelPriceSettingsDto } from "../../../../dataTransferObjects/fuel-price-settings.dto"
import { ConstantsService } from "../../../../global/constants/constants.service"

describe("FuelPriceSettingsService", () => {
  let service: FuelPriceSettingsService
  let constants: ConstantsService
  let repo: Repository<FuelPriceSettingsEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConstantsService,
        FuelPriceSettingsService,
        {
          provide: getRepositoryToken(FuelPriceSettingsEntity),
          useClass: Repository,
        },
      ],
    }).compile()

    service = module.get<FuelPriceSettingsService>(FuelPriceSettingsService)
    constants = module.get<ConstantsService>(ConstantsService)
    repo = module.get<Repository<FuelPriceSettingsEntity>>(
      getRepositoryToken(FuelPriceSettingsEntity),
    )
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  it("save when no record is present should create a new record", async () => {
    // Arrange
    jest.spyOn(repo, "findOne").mockResolvedValueOnce(undefined)
    jest.spyOn(repo, "insert").mockResolvedValueOnce(undefined)
    jest.spyOn(repo, "update").mockResolvedValueOnce(undefined)

    const data: FuelPriceSettingsEntity = {
      apiKey: "abc",
      id: "foo",
      interval: 15 * 3600,
      isActive: true,
      showDiesel: true,
      showE10: true,
      showE5: true,
    }
    // Act
    await service.save(data)
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(repo.insert).toHaveBeenCalledTimes(1)
    expect(repo.update).toHaveBeenCalledTimes(1)
  })

  it("save when record is present should update existing record", async () => {
    // Arrange
    const existingData: FuelPriceSettingsEntity = {
      apiKey: "abcdefghi",
      id: "foo",
      interval: 15 * 3600,
      isActive: true,
      showDiesel: true,
      showE10: true,
      showE5: true,
    }
    jest.spyOn(repo, "findOne").mockResolvedValueOnce(existingData)
    jest.spyOn(repo, "update").mockResolvedValueOnce(undefined)

    const data: FuelPriceSettingsEntity = {
      apiKey: "abc",
      id: "foo",
      interval: 15 * 3600,
      isActive: true,
      showDiesel: true,
      showE10: true,
      showE5: true,
    }
    // Act
    await service.save(data)
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(repo.update).toHaveBeenCalledTimes(1)
  })

  it("load when no record is present should create a new record", async () => {
    // Arrange
    jest.spyOn(repo, "findOne").mockResolvedValueOnce(undefined)
    jest.spyOn(repo, "insert").mockResolvedValueOnce(undefined)
    // Act
    const res: FuelPriceSettingsDto = await service.load()
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(repo.insert).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.isActive).toBe(false)
  })

  it("load when record is present should return existing record", async () => {
    // Arrange
    const existingData: FuelPriceSettingsEntity = {
      apiKey: "abcdefghi",
      id: "foo",
      interval: 15 * 3600,
      isActive: true,
      showDiesel: true,
      showE10: true,
      showE5: true,
    }
    jest.spyOn(repo, "findOne").mockResolvedValueOnce(existingData)
    // Act
    const res: FuelPriceSettingsDto = await service.load()
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
  })

  it("apikey should be hidden", async () => {
    // Arrange
    const existingData: FuelPriceSettingsEntity = {
      apiKey: "abcdefghi",
      id: "foo",
      interval: 15 * 3600,
      isActive: true,
      showDiesel: true,
      showE10: true,
      showE5: true,
    }
    jest.spyOn(repo, "findOne").mockResolvedValueOnce(existingData)
    // Act
    const res: FuelPriceSettingsDto = await service.load()
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(res).toBeDefined()
    expect(res.apiKey).toBe("abcd" + constants.hiddenValue)
  })

  it("hidden apikey should not be saved", async () => {
    // Arrange
    const existingData: FuelPriceSettingsEntity = {
      apiKey: "abcdefghi",
      id: "foo",
      interval: 15 * 3600,
      isActive: true,
      showDiesel: true,
      showE10: true,
      showE5: true,
    }
    jest.spyOn(repo, "findOne").mockResolvedValueOnce(existingData)
    const mockedUpdate: any = jest
      .spyOn(repo, "update")
      .mockResolvedValueOnce(undefined)

    const data: FuelPriceSettingsEntity = {
      apiKey: "abcd" + constants.hiddenValue,
      id: "foo",
      interval: 15 * 3600,
      isActive: true,
      showDiesel: true,
      showE10: true,
      showE5: true,
    }
    // Act
    await service.save(data)
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(repo.update).toHaveBeenCalledTimes(1)
    expect(mockedUpdate.mock.calls[0][1]).not.toHaveProperty("apiKey")
  })

  it("changed apikey should be saved", async () => {
    // Arrange
    const existingData: FuelPriceSettingsEntity = {
      apiKey: "abcdefghi",
      id: "foo",
      interval: 15 * 3600,
      isActive: true,
      showDiesel: true,
      showE10: true,
      showE5: true,
    }
    jest.spyOn(repo, "findOne").mockResolvedValueOnce(existingData)
    const mockedUpdate: any = jest
      .spyOn(repo, "update")
      .mockResolvedValueOnce(undefined)

    const data: FuelPriceSettingsEntity = {
      apiKey: "xxxxxxx",
      id: "foo",
      interval: 15 * 3600,
      isActive: true,
      showDiesel: true,
      showE10: true,
      showE5: true,
    }
    // Act
    await service.save(data)
    // Assert
    expect(repo.findOne).toHaveBeenCalledTimes(1)
    expect(repo.update).toHaveBeenCalledTimes(1)
    expect(mockedUpdate.mock.calls[0][1]).toHaveProperty("apiKey")
    expect(mockedUpdate.mock.calls[0][1].apiKey).toBe("xxxxxxx")
  })
})
