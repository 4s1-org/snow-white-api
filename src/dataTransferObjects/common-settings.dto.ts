import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ICommonSettingsDto } from '@4s1/snow-white-shared'

export class CommonSettingsDto implements ICommonSettingsDto {
  @IsNotEmpty()
  @ApiProperty()
  public morningStart!: number

  @IsNotEmpty()
  @ApiProperty()
  public morningEnd!: number
}
