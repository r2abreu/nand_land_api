import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { NodeCryptoModule } from "./node-crypto/node-crypto.module";

@Module({
  controllers: [AuthController],
  imports: [UserModule, NodeCryptoModule],
})
export class AuthModule {}
