import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ICommonLocationDto } from '@yellowgarbagebag/snow-white-shared'

export class CommonLocationDto implements ICommonLocationDto {
  @IsNotEmpty()
  @ApiProperty()
  public id!: string

  @IsNotEmpty()
  @ApiProperty()
  public name!: string

  @IsNotEmpty()
  @ApiProperty()
  public nameOrigin!: string

  @IsNotEmpty()
  @ApiProperty()
  public latitude!: number

  @IsNotEmpty()
  @ApiProperty()
  public longitude!: number

  @IsNotEmpty()
  @ApiProperty()
  public sortNo!: number
}
