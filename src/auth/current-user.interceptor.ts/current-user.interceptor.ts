import {
  CallHandler,
  Injectable,
  NestInterceptor,
  type ExecutionContext,
} from "@nestjs/common";
import { Request } from "express";
import { UserService } from "src/user/user.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest<Request>();
    //@ts-expect-error: Enhance typing
    const { userId } = request.session;

    if (!userId) return next.handle();

    const user = await this.userService.findOne(parseInt(userId as string));

    if (!user) return next.handle();

    //@ts-expect-error: Enhance typing
    request.session.currentUser = user;

    return next.handle();
  }
}
