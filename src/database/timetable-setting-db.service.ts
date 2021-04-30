/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { TimetableSetting, Prisma } from '@prisma/client'

@Injectable()
export class TimetableSettingDbService {
  constructor(private prisma: PrismaService) {}

  public async getUi() {
    const res = this.prisma.timetableSetting.findFirst({
      include: {
        timetableStationFrom: true,
        timetableStationTo: true,
      },
    })
    return res
  }

  public async read(TimetableSettingWhereUniqueInput: Prisma.TimetableSettingWhereUniqueInput): Promise<TimetableSetting | null> {
    return this.prisma.timetableSetting.findUnique({
      where: TimetableSettingWhereUniqueInput,
    })
  }

  public async readTimetableSettings(params: {
    skip?: number
    take?: number
    cursor?: Prisma.TimetableSettingWhereUniqueInput
    where?: Prisma.TimetableSettingWhereInput
    orderBy?: Prisma.TimetableSettingOrderByInput
  }): Promise<TimetableSetting[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.timetableSetting.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  public async createTimetableSetting(data: Prisma.TimetableSettingCreateInput): Promise<TimetableSetting> {
    return this.prisma.timetableSetting.create({
      data,
    })
  }

  public async updateTimetableSetting(params: {
    where: Prisma.TimetableSettingWhereUniqueInput
    data: Prisma.TimetableSettingUpdateInput
  }): Promise<TimetableSetting> {
    const { data, where } = params
    return this.prisma.timetableSetting.update({
      data,
      where,
    })
  }

  public async deleteTimetableSetting(where: Prisma.TimetableSettingWhereUniqueInput): Promise<TimetableSetting> {
    return this.prisma.timetableSetting.delete({
      where,
    })
  }
}
