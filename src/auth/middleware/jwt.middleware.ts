import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

interface AuthenticatedRequest extends Request {
  user?: any;
}
@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
        const userCached: User = await this.cacheManager.get(decoded.id);
        if (userCached) return userCached;
        const user = await this.userService.findOne(decoded.id);
        await this.cacheManager.set(
          decoded.id,
          user,
          +process.env.USER_CACHE_DEFAULT,
        );
        req.user = user;
      } catch (ex) {
        // console.log(ex.message);
      }
    }
    next();
  }
}
