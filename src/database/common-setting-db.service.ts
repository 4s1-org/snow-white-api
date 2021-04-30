import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { CommonSetting, Prisma } from '@prisma/client'

@Injectable()
export class CommonSettingDbService {
  constructor(private prisma: PrismaService) {}

  public async readCommonSetting(CommonSettingWhereUniqueInput: Prisma.CommonSettingWhereUniqueInput): Promise<CommonSetting | null> {
    return this.prisma.commonSetting.findUnique({
      where: CommonSettingWhereUniqueInput,
    })
  }

  public async readCommonSettings(params: {
    skip?: number
    take?: number
    cursor?: Prisma.CommonSettingWhereUniqueInput
    where?: Prisma.CommonSettingWhereInput
    orderBy?: Prisma.CommonSettingOrderByInput
  }): Promise<CommonSetting[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.commonSetting.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  public async createCommonSetting(data: Prisma.CommonSettingCreateInput): Promise<CommonSetting> {
    return this.prisma.commonSetting.create({
      data,
    })
  }

  public async updateCommonSetting(params: {
    where: Prisma.CommonSettingWhereUniqueInput
    data: Prisma.CommonSettingUpdateInput
  }): Promise<CommonSetting> {
    const { data, where } = params
    return this.prisma.commonSetting.update({
      data,
      where,
    })
  }

  public async deleteCommonSetting(where: Prisma.CommonSettingWhereUniqueInput): Promise<CommonSetting> {
    return this.prisma.commonSetting.delete({
      where,
    })
  }
}
