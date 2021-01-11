import { Module } from '@nestjs/common';
import { CommandService } from './command.service';

@Module({
  providers: [CommandService],
})
export class AppModule {}
