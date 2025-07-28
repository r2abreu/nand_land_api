import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { Course } from "src/course/entities/course.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import { UserOrchestratorService } from "./user-orchestrator.service";
import { CourseModule } from "src/course/course.module";

@Module({
  providers: [UserService, UserOrchestratorService],
  imports: [TypeOrmModule.forFeature([User, Course]), CourseModule],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
