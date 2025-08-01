import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { NodeCryptoModule } from "./node-crypto/node-crypto.module";
import { CurrentUserInterceptor } from "./current-user.interceptor.ts/current-user.interceptor";

@Module({
  providers: [CurrentUserInterceptor],
  controllers: [AuthController],
  imports: [UserModule, NodeCryptoModule],
})
export class AuthModule {}
