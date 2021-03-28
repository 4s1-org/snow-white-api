import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IRmvStationDto } from '@yellowgarbagebag/snow-white-dto'

export class RmvStationDto implements IRmvStationDto {
  @IsNotEmpty()
  @ApiProperty({ example: 3000010 })
  public remoteId: number

  @IsNotEmpty()
  @ApiProperty({ example: 'Frankfurt (Main) Hauptbahnhof' })
  public name: string

  @IsNotEmpty()
  @ApiProperty({ example: 8.662653 })
  public longitude: number

  @IsNotEmpty()
  @ApiProperty({ example: 50.106808 })
  public latitude: number

  @IsNotEmpty()
  @ApiProperty({ example: 177 })
  public distance: number

  @IsNotEmpty()
  @ApiProperty({ example: 255 })
  public products: number
}
