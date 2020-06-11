import { Test, TestingModule } from "@nestjs/testing"
import { TimetrackingController } from "./timetracking.controller"
import { TimetrackingService } from "./timetracking.service"
import { ConfigModule } from "../config/config.module"

describe("Timetracking Controller", () => {
  let controller: TimetrackingController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimetrackingController],
      imports: [ConfigModule],
      providers: [TimetrackingService],
    }).compile()

    controller = module.get<TimetrackingController>(TimetrackingController)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  it("book time", () => {
    // Arrange
    // Act
    const res: string = controller.bookTime()
    // Assert
    expect(res.length).toBe(25)
  })
})
