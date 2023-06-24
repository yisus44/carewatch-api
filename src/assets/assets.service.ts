import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class AssetsService {
  convertFileToString(path: string) {
    return fs.readFileSync(path).toString();
  }
  getEmailTemplatePath(fileName: string, prefix = 'html') {
    return `${__dirname}/emails/${fileName}.${prefix}`;
  }
}
