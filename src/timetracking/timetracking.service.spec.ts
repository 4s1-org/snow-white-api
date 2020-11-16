import { Test, TestingModule } from '@nestjs/testing'
import { TimetrackingService } from './timetracking.service'
import { ConfigModule } from '../config/config.module'

describe('TimetrackingService', () => {
  let service: TimetrackingService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [TimetrackingService],
    }).compile()

    service = module.get<TimetrackingService>(TimetrackingService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('sendMail', () => {
    // Arrange
    // Act
    const res: string = service.sendEmail()
    // Assert
    expect(res.length).toBe(25)
  })
})
