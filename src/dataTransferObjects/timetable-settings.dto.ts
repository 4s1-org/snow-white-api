import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ITimetableSettingsDto } from '@yellowgarbagegroup/snow-white-shared'
import { TimetableLinesFilter } from './timetable-lines-filter.dto'

export class TimetableSettingsDto implements ITimetableSettingsDto {
  @IsNotEmpty()
  @ApiProperty({ example: true })
  public isActive!: boolean

  @ApiProperty({ example: 'Lorem Ipsum' })
  public apiKey!: string

  @ApiProperty()
  public stationFromId!: string | null

  @ApiProperty()
  public stationToId!: string | null

  @IsNotEmpty()
  @ApiProperty({ example: 3 })
  public maxChanges!: number

  @IsNotEmpty()
  @ApiProperty()
  public lines!: TimetableLinesFilter
}
