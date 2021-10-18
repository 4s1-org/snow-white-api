/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common'
import { Prisma } from '../generated/prisma/index.js'
import { PrismaService } from './prisma.service.js'

@Injectable()
export class FuelPriceSettingDbService {
  constructor(private prisma: PrismaService) {}

  public async readFirstRecord() {
    const record = await this.prisma.fuelPriceSetting.findFirst()

    if (record) {
      return record
    } else {
      return this.createDummyRecord()
    }
  }

  private createDummyRecord() {
    return this.prisma.fuelPriceSetting.create({
      data: {
        apiKey: '',
        interval: 15 * 3600,
        isActive: false,
        showDiesel: true,
        showE10: true,
        showE5: true,
      },
    })
  }

  public update(params: { where: Prisma.FuelPriceSettingWhereUniqueInput; data: Prisma.FuelPriceSettingUpdateInput }) {
    const { data, where } = params
    return this.prisma.fuelPriceSetting.update({
      data,
      where,
    })
  }
}
