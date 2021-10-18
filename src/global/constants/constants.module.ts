import { Module, Global } from '@nestjs/common'
import { ConstantsService } from './constants.service.js'

@Global()
@Module({
  exports: [ConstantsService],
  providers: [ConstantsService],
})
export class ConstantsModule {}
