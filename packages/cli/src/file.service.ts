import { Injectable } from '@nestjs/common';
import { promises } from 'fs';

@Injectable()
export class FileService {
  async read(fileName: string): Promise<string> {
    return (await promises.readFile(fileName)).toString();
  }
}
