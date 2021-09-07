import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ITankerkoenigStationDto } from '@4s1/snow-white-shared'

export class TankerkoenigStationDto implements ITankerkoenigStationDto {
  @IsNotEmpty()
  @ApiProperty()
  public remoteId!: string

  @IsNotEmpty()
  @ApiProperty()
  public name!: string

  @ApiProperty()
  public brand!: string

  @ApiProperty()
  public street!: string

  @ApiProperty()
  public city!: string

  @IsNotEmpty()
  @ApiProperty()
  public latitude!: number

  @IsNotEmpty()
  @ApiProperty()
  public longitude!: number

  @ApiProperty()
  public houseNumber!: string

  @ApiProperty()
  public postCode!: number
}
