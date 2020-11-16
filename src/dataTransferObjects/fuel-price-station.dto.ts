import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IFuelPriceStationDto } from '@yellowgarbagebag/snow-white-dto'

export class FuelPriceStationDto implements IFuelPriceStationDto {
  @IsNotEmpty()
  @ApiProperty()
  public id: string

  @IsNotEmpty()
  @ApiProperty()
  public remoteId: string

  @IsNotEmpty()
  @ApiProperty()
  public name: string

  @IsNotEmpty()
  @ApiProperty()
  public nameOrigin: string

  @IsNotEmpty()
  @ApiProperty()
  public latitude: number

  @IsNotEmpty()
  @ApiProperty()
  public longitude: number

  @ApiProperty()
  public sortNo: number
}
