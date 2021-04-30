import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { DateSetting, Prisma } from '@prisma/client'

@Injectable()
export class DateSettingDbService {
  constructor(private prisma: PrismaService) {}

  public async readDateSetting(DateSettingWhereUniqueInput: Prisma.DateSettingWhereUniqueInput): Promise<DateSetting | null> {
    return this.prisma.dateSetting.findUnique({
      where: DateSettingWhereUniqueInput,
    })
  }

  public async readDateSettings(params: {
    skip?: number
    take?: number
    cursor?: Prisma.DateSettingWhereUniqueInput
    where?: Prisma.DateSettingWhereInput
    orderBy?: Prisma.DateSettingOrderByInput
  }): Promise<DateSetting[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.dateSetting.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  public async createDateSetting(data: Prisma.DateSettingCreateInput): Promise<DateSetting> {
    return this.prisma.dateSetting.create({
      data,
    })
  }

  public async updateDateSetting(params: {
    where: Prisma.DateSettingWhereUniqueInput
    data: Prisma.DateSettingUpdateInput
  }): Promise<DateSetting> {
    const { data, where } = params
    return this.prisma.dateSetting.update({
      data,
      where,
    })
  }

  public async deleteDateSetting(where: Prisma.DateSettingWhereUniqueInput): Promise<DateSetting> {
    return this.prisma.dateSetting.delete({
      where,
    })
  }
}
