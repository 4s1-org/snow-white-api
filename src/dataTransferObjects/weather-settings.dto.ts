import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IWeatherSettingsDto } from '@yellowgarbagebag/snow-white-dto'

export class WeatherSettingsDto implements IWeatherSettingsDto {
  @IsNotEmpty()
  @ApiProperty({ example: true })
  public isActive: boolean

  @ApiProperty({ example: 'Lorem Ipsum' })
  public apiKey: string

  @ApiProperty()
  public locationId: string | null
}
