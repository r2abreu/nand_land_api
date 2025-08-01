import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();

    // @ts-expect-error halo
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return request.session.currentUser;
  },
);
