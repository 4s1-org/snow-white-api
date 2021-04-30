import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { CommonLocation, Prisma } from '@prisma/client'

@Injectable()
export class CommonLocationDbService {
  constructor(private prisma: PrismaService) {}

  public async readCommonLocation(CommonLocationWhereUniqueInput: Prisma.CommonLocationWhereUniqueInput): Promise<CommonLocation | null> {
    return this.prisma.commonLocation.findUnique({
      where: CommonLocationWhereUniqueInput,
    })
  }

  public async readCommonLocations(params: {
    skip?: number
    take?: number
    cursor?: Prisma.CommonLocationWhereUniqueInput
    where?: Prisma.CommonLocationWhereInput
    orderBy?: Prisma.CommonLocationOrderByInput
  }): Promise<CommonLocation[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.commonLocation.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  public async createCommonLocation(data: Prisma.CommonLocationCreateInput): Promise<CommonLocation> {
    return this.prisma.commonLocation.create({
      data,
    })
  }

  public async updateCommonLocation(params: {
    where: Prisma.CommonLocationWhereUniqueInput
    data: Prisma.CommonLocationUpdateInput
  }): Promise<CommonLocation> {
    const { data, where } = params
    return this.prisma.commonLocation.update({
      data,
      where,
    })
  }

  public async deleteCommonLocation(where: Prisma.CommonLocationWhereUniqueInput): Promise<CommonLocation> {
    return this.prisma.commonLocation.delete({
      where,
    })
  }
}
