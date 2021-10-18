/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { Prisma } from '../generated/prisma.js'

@Injectable()
export class FuelPriceStationDbService {
  constructor(private prisma: PrismaService) {}

  public read(FuelPriceStationWhereUniqueInput: Prisma.FuelPriceStationWhereUniqueInput) {
    return this.prisma.fuelPriceStation.findUnique({
      where: FuelPriceStationWhereUniqueInput,
    })
  }

  public readAll() {
    return this.prisma.fuelPriceStation.findMany()
  }

  public create(data: Prisma.FuelPriceStationCreateInput) {
    return this.prisma.fuelPriceStation.create({
      data,
    })
  }

  public update(params: { where: Prisma.FuelPriceStationWhereUniqueInput; data: Prisma.FuelPriceStationUpdateInput }) {
    const { data, where } = params
    return this.prisma.fuelPriceStation.update({
      data,
      where,
    })
  }

  public async delete(where: Prisma.FuelPriceStationWhereUniqueInput) {
    return this.prisma.fuelPriceStation.delete({
      where,
    })
  }
}
