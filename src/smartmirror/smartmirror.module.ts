import { Module } from '@nestjs/common'
import { AdminModule } from './admin/admin.module.js'
import { UiModule } from './ui/ui.module.js'

@Module({
  imports: [AdminModule, UiModule],
})
export class SmartmirrorModule {}
