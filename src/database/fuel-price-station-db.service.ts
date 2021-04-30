import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { FuelPriceStation, Prisma } from '@prisma/client'

@Injectable()
export class FuelPriceStationDbService {
  constructor(private prisma: PrismaService) {}

  public async readFuelPriceStation(
    FuelPriceStationWhereUniqueInput: Prisma.FuelPriceStationWhereUniqueInput,
  ): Promise<FuelPriceStation | null> {
    return this.prisma.fuelPriceStation.findUnique({
      where: FuelPriceStationWhereUniqueInput,
    })
  }

  public async readFuelPriceStations(params: {
    skip?: number
    take?: number
    cursor?: Prisma.FuelPriceStationWhereUniqueInput
    where?: Prisma.FuelPriceStationWhereInput
    orderBy?: Prisma.FuelPriceStationOrderByInput
  }): Promise<FuelPriceStation[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.fuelPriceStation.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  public async createFuelPriceStation(data: Prisma.FuelPriceStationCreateInput): Promise<FuelPriceStation> {
    return this.prisma.fuelPriceStation.create({
      data,
    })
  }

  public async updateFuelPriceStation(params: {
    where: Prisma.FuelPriceStationWhereUniqueInput
    data: Prisma.FuelPriceStationUpdateInput
  }): Promise<FuelPriceStation> {
    const { data, where } = params
    return this.prisma.fuelPriceStation.update({
      data,
      where,
    })
  }

  public async deleteFuelPriceStation(where: Prisma.FuelPriceStationWhereUniqueInput): Promise<FuelPriceStation> {
    return this.prisma.fuelPriceStation.delete({
      where,
    })
  }
}
