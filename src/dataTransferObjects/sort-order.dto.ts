import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ISortOrderDto } from '@4s1/snow-white-shared'

export class SortOrderDto implements ISortOrderDto {
  @IsNotEmpty()
  @ApiProperty()
  public id!: string

  @IsNotEmpty()
  @ApiProperty()
  public sortNo!: number
}
