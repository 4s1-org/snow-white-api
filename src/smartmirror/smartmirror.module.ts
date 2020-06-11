import { Module } from "@nestjs/common"
import { AdminModule } from "./admin/admin.module"
import { UiModule } from "./ui/ui.module"

@Module({
  imports: [AdminModule, UiModule],
})
export class SmartmirrorModule {}
