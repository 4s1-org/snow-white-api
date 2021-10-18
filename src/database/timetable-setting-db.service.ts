/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { TimetableSetting, Prisma } from '../generated/prisma/index.js'

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

  public async readFirstRecord() {
    const record = await this.prisma.timetableSetting.findFirst()

    if (record) {
      return record
    } else {
      return this.createDummyRecord()
    }
  }

  private createDummyRecord() {
    return this.prisma.timetableSetting.create({
      data: {
        apiKey: '',
        isActive: false,
        maxChanges: 3,
        showBus: false,
        showIC: false,
        showICE: false,
        showRB: true,
        showRE: true,
        showSBahn: true,
        showTram: true,
        showUBahn: true,
        timetableStationFromId: null,
        timetableStationToId: null,
      },
    })
  }

  public async update(params: {
    where: Prisma.TimetableSettingWhereUniqueInput
    data: Prisma.TimetableSettingUpdateInput
  }): Promise<TimetableSetting> {
    const { data, where } = params
    return this.prisma.timetableSetting.update({
      data,
      where,
    })
  }
}
