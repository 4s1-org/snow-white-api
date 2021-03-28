import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IWeatherDataDto } from '@yellowgarbagebag/snow-white-shared'

export class WeatherDataDto implements IWeatherDataDto {
  @IsNotEmpty()
  @ApiProperty({ example: 1500000000 })
  public timestamp!: number

  @IsNotEmpty()
  @ApiProperty({ example: 21.1 })
  public temperature!: number

  @IsNotEmpty()
  @ApiProperty({ example: 19.2 })
  public temperatureFeelsLike!: number

  @IsNotEmpty()
  @ApiProperty({ example: 'Bevölkt | Regen' })
  public conditionText!: string

  @IsNotEmpty()
  @ApiProperty({ example: 'i3' })
  public icon!: string
}
