import { IFuelPriceSettingsDto } from '@yellowgarbagegroup/snow-white-shared'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class FuelPriceSettingsDto implements IFuelPriceSettingsDto {
  @IsNotEmpty()
  @ApiProperty({ example: true })
  public isActive!: boolean

  @ApiProperty({ example: 'Lorem Ipsum' })
  public apiKey!: string

  @IsNotEmpty()
  @ApiProperty({ example: true })
  public showE5!: boolean

  @IsNotEmpty()
  @ApiProperty({ example: true })
  public showE10!: boolean

  @IsNotEmpty()
  @ApiProperty({ example: false })
  public showDiesel!: boolean

  @IsNotEmpty()
  @ApiProperty({ example: 15 * 3600 })
  public interval!: number
}
