/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { WeatherSetting, Prisma } from '@prisma/client'

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

  public async readWeatherSetting(WeatherSettingWhereUniqueInput: Prisma.WeatherSettingWhereUniqueInput): Promise<WeatherSetting | null> {
    return this.prisma.weatherSetting.findUnique({
      where: WeatherSettingWhereUniqueInput,
    })
  }

  public async readWeatherSettings(params: {
    skip?: number
    take?: number
    cursor?: Prisma.WeatherSettingWhereUniqueInput
    where?: Prisma.WeatherSettingWhereInput
    orderBy?: Prisma.WeatherSettingOrderByInput
  }): Promise<WeatherSetting[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.weatherSetting.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  public async createWeatherSetting(data: Prisma.WeatherSettingCreateInput): Promise<WeatherSetting> {
    return this.prisma.weatherSetting.create({
      data,
    })
  }

  public async updateWeatherSetting(params: {
    where: Prisma.WeatherSettingWhereUniqueInput
    data: Prisma.WeatherSettingUpdateInput
  }): Promise<WeatherSetting> {
    const { data, where } = params
    return this.prisma.weatherSetting.update({
      data,
      where,
    })
  }

  public async deleteWeatherSetting(where: Prisma.WeatherSettingWhereUniqueInput): Promise<WeatherSetting> {
    return this.prisma.weatherSetting.delete({
      where,
    })
  }
}
