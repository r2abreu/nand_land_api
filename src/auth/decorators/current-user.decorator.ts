import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { Session } from "express-session";
import { User } from "src/user/entities/user.entity";

interface RequestWithCurrentUser extends Request {
  session: Session & {
    currentUser: User;
  };
}

export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithCurrentUser>();

    return request.session.currentUser;
  },
);
