import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ITimetableLinesFilter } from '@4s1/snow-white-shared'

export class TimetableLinesFilter implements ITimetableLinesFilter {
  @IsNotEmpty()
  @ApiProperty({ example: false })
  public showICE!: boolean

  @IsNotEmpty()
  @ApiProperty({ example: false })
  public showIC!: boolean

  @IsNotEmpty()
  @ApiProperty({ example: false })
  public showBus!: boolean

  @IsNotEmpty()
  @ApiProperty({ example: true })
  public showTram!: boolean

  @IsNotEmpty()
  @ApiProperty({ example: true })
  public showSBahn!: boolean

  @IsNotEmpty()
  @ApiProperty({ example: true })
  public showRE!: boolean

  @IsNotEmpty()
  @ApiProperty({ example: true })
  public showRB!: boolean

  @IsNotEmpty()
  @ApiProperty({ example: true })
  public showUBahn!: boolean
}
