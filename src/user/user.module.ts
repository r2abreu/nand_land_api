import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { Course } from "src/course/entities/course.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";

@Module({
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User, Course])],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
