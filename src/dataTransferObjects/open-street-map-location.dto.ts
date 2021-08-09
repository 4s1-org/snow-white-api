import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IOpenStreetMapLocationDto } from '@yellowgarbagebag/snow-white-shared'

export class OpenStreetMapLocationDto implements IOpenStreetMapLocationDto {
  @IsNotEmpty()
  @ApiProperty()
  public remoteId!: number

  @IsNotEmpty()
  @ApiProperty()
  public name!: string

  @IsNotEmpty()
  @ApiProperty()
  public latitude!: number

  @IsNotEmpty()
  @ApiProperty()
  public longitude!: number

  @ApiProperty()
  public importance!: number
}