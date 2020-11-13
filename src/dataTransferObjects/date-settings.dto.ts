import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IDateSettingsDto } from '@yellowgarbagebag/snow-white-dto'

export class DateSettingsDto implements IDateSettingsDto {
  @IsNotEmpty()
  @ApiProperty()
  public isActive: boolean

  @IsNotEmpty()
  @ApiProperty()
  public pattern: string

  @IsNotEmpty()
  @ApiProperty({ example: 12 })
  public fontSize: number
}
