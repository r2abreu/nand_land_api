import {
  NestInterceptor,
  type ExecutionContext,
  CallHandler,
  UseInterceptors,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToInstance } from "class-transformer";

type ClassType<T> = new (...args: any[]) => T;

export function Serialize<T>(dto: ClassType<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassType<T>) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<T> | Promise<Observable<T>> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance<T, any>(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
