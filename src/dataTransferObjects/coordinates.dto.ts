import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ICoordinatesDto } from '@4s1/snow-white-shared'

export class CoordinatesDto implements ICoordinatesDto {
  @IsNotEmpty()
  @ApiProperty({ example: 50.1069748 })
  public latitude!: number

  @IsNotEmpty()
  @ApiProperty({ example: 8.6651277 })
  public longitude!: number
}
