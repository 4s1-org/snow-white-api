import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ICarRouteDto } from '@yellowgarbagebag/snow-white-dto'

export class CarRouteDto implements ICarRouteDto {
  @IsNotEmpty()
  @ApiProperty()
  public distance: number

  @IsNotEmpty()
  @ApiProperty()
  public expectedTime: number

  @IsNotEmpty()
  @ApiProperty()
  public text: string

  @IsNotEmpty()
  @ApiProperty()
  public streetTypes: Array<string>
}