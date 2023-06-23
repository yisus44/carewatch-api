import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';

interface AuthenticatedRequest extends Request {
  user?: any;
}
@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
        const user = await this.userService.findOne(decoded.id);
        req.user = user;
      } catch (ex) {
        // console.log(ex.message);
      }
    }
    next();
  }
}
