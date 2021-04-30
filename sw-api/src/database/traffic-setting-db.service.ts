import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { TrafficSetting, Prisma } from '@prisma/client'

@Injectable()
export class TrafficSettingDbService {
  constructor(private prisma: PrismaService) {}

  public async readTrafficSetting(TrafficSettingWhereUniqueInput: Prisma.TrafficSettingWhereUniqueInput): Promise<TrafficSetting | null> {
    return this.prisma.trafficSetting.findUnique({
      where: TrafficSettingWhereUniqueInput,
    })
  }

  public async readTrafficSettings(params: {
    skip?: number
    take?: number
    cursor?: Prisma.TrafficSettingWhereUniqueInput
    where?: Prisma.TrafficSettingWhereInput
    orderBy?: Prisma.TrafficSettingOrderByInput
  }): Promise<TrafficSetting[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.trafficSetting.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  public async createTrafficSetting(data: Prisma.TrafficSettingCreateInput): Promise<TrafficSetting> {
    return this.prisma.trafficSetting.create({
      data,
    })
  }

  public async updateTrafficSetting(params: {
    where: Prisma.TrafficSettingWhereUniqueInput
    data: Prisma.TrafficSettingUpdateInput
  }): Promise<TrafficSetting> {
    const { data, where } = params
    return this.prisma.trafficSetting.update({
      data,
      where,
    })
  }

  public async deleteTrafficSetting(where: Prisma.TrafficSettingWhereUniqueInput): Promise<TrafficSetting> {
    return this.prisma.trafficSetting.delete({
      where,
    })
  }
}
