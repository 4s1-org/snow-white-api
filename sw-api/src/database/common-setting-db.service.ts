/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class CommonSettingDbService {
  constructor(private prisma: PrismaService) {}

  public async readFirstRecord() {
    const record = await this.prisma.commonSetting.findFirst()

    if (record) {
      return record
    } else {
      return this.createDummyRecord()
    }
  }

  private createDummyRecord() {
    return this.prisma.commonSetting.create({
      data: {
        morningStart: 5 * 3600,
        morningEnd: 12 * 3600,
      },
    })
  }

  public async update(params: { data: Prisma.CommonSettingUpdateInput }) {
    const { data } = params
    const record = await this.readFirstRecord()
    return this.prisma.commonSetting.update({
      data,
      where: { id: record.id },
    })
  }
}
