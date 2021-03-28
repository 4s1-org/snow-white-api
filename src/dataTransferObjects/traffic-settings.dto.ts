import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ITrafficSettingsDto } from '@yellowgarbagebag/snow-white-dto'

export class TrafficSettingsDto implements ITrafficSettingsDto {
  @IsNotEmpty()
  @ApiProperty({ example: true })
  public isActive: boolean

  @ApiProperty({ example: 'Lorem Ipsum' })
  public apiKey: string

  @ApiProperty()
  public locationFromId: string | null

  @ApiProperty()
  public locationToId: string | null
}
