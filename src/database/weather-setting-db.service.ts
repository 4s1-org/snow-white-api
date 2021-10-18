/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service.js'
import { Prisma } from '../generated/prisma/index.js'

@Injectable()
export class WeatherSettingDbService {
  constructor(private prisma: PrismaService) {}

  public async getUi() {
    const res = this.prisma.weatherSetting.findFirst({
      include: {
        commonLocation: true,
      },
    })
    return res
  }

  public async readFirstRecord() {
    const record = await this.prisma.weatherSetting.findFirst()

    if (record) {
      return record
    } else {
      return this.createDummyRecord()
    }
  }

  private createDummyRecord() {
    return this.prisma.weatherSetting.create({
      data: {
        apiKey: '',
        commonLocationId: null,
        isActive: false,
      },
    })
  }

  public update(params: { where: Prisma.WeatherSettingWhereUniqueInput; data: Prisma.WeatherSettingUpdateInput }) {
    const { data, where } = params
    return this.prisma.weatherSetting.update({
      data,
      where,
    })
  }
}
