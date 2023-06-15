import { CanActivate, Injectable } from '@nestjs/common';

@Injectable()
export class FailGuard implements CanActivate {
  canActivate() {
    return false;
  }
}
