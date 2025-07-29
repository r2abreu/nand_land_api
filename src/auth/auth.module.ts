import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { CourseModule } from "src/course/course.module";

@Module({
  controllers: [AuthController],
  imports: [PassportModule, UserModule, CourseModule],
})
export class AuthModule {}
