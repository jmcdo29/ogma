import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { OgmaCommand } from './ogma.command';
import { OgmaGetterService } from './ogma-getters.service';

@Module({
  providers: [OgmaCommand, FileService, OgmaGetterService],
})
export class AppModule {}
