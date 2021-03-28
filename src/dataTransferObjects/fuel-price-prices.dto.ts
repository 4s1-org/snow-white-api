import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IFuelPricePricesDto } from '@yellowgarbagebag/snow-white-dto'

export class FuelPricePricesDto implements IFuelPricePricesDto {
  @IsNotEmpty()
  @ApiProperty()
  public name: string

  @IsNotEmpty()
  @ApiProperty()
  public open: boolean

  @IsNotEmpty()
  @ApiProperty()
  public e5: number | false

  @IsNotEmpty()
  @ApiProperty()
  public e10: number | false

  @IsNotEmpty()
  @ApiProperty()
  public diesel: number | false

  @IsNotEmpty()
  @ApiProperty()
  public sortNo: number
}
