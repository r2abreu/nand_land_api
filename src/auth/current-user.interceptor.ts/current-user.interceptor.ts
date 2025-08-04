import {
  CallHandler,
  Injectable,
  NestInterceptor,
  type ExecutionContext,
} from "@nestjs/common";
import { Request } from "express";
import { UserService } from "src/user/user.service";
import type { Session } from "express-session";
import { User } from "src/user/entities/user.entity";

interface RequestWithCurrentUser extends Request {
  session: Session & {
    userId: number | null;
    currentUser: User | null;
  };
}

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest<RequestWithCurrentUser>();

    const { userId } = request.session;

    if (!userId) return next.handle();

    const user = await this.userService.findOne(userId);

    if (!user) return next.handle();

    request.session.currentUser = user;

    return next.handle();
  }
}
