import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ITimetableStationDto } from '@yellowgarbagegroup/snow-white-shared'

export class TimetableStationDto implements ITimetableStationDto {
  @IsNotEmpty()
  @ApiProperty()
  public id!: string

  @IsNotEmpty()
  @ApiProperty({ example: 3000010 })
  public remoteId!: number

  @IsNotEmpty()
  @ApiProperty({ example: 'Frankfurt (Main) Hauptbahnhof' })
  public name!: string

  @IsNotEmpty()
  @ApiProperty({ example: 'Hbf Frankfurt' })
  public nameOrigin!: string

  @IsNotEmpty()
  @ApiProperty({ example: 99 })
  public sortNo!: number
}
