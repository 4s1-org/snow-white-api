/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { FuelPriceSetting, Prisma } from '@prisma/client'

@Injectable()
export class FuelPriceSettingDbService {
  constructor(private prisma: PrismaService) {}

  public async readFuelPriceSetting(
    FuelPriceSettingWhereUniqueInput: Prisma.FuelPriceSettingWhereUniqueInput,
  ): Promise<FuelPriceSetting | null> {
    return this.prisma.fuelPriceSetting.findUnique({
      where: FuelPriceSettingWhereUniqueInput,
    })
  }

  public async readFuelPriceSettings(params: {
    skip?: number
    take?: number
    cursor?: Prisma.FuelPriceSettingWhereUniqueInput
    where?: Prisma.FuelPriceSettingWhereInput
    orderBy?: Prisma.FuelPriceSettingOrderByInput
  }): Promise<FuelPriceSetting[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.fuelPriceSetting.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  public async createFuelPriceSetting(data: Prisma.FuelPriceSettingCreateInput): Promise<FuelPriceSetting> {
    return this.prisma.fuelPriceSetting.create({
      data,
    })
  }

  public async updateFuelPriceSetting(params: {
    where: Prisma.FuelPriceSettingWhereUniqueInput
    data: Prisma.FuelPriceSettingUpdateInput
  }): Promise<FuelPriceSetting> {
    const { data, where } = params
    return this.prisma.fuelPriceSetting.update({
      data,
      where,
    })
  }

  public async deleteFuelPriceSetting(where: Prisma.FuelPriceSettingWhereUniqueInput): Promise<FuelPriceSetting> {
    return this.prisma.fuelPriceSetting.delete({
      where,
    })
  }
}
