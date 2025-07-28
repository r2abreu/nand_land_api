import { Module } from "@nestjs/common";
import { CourseService } from "./course.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Course } from "./entities/course.entity";
import { CourseController } from "./course.controller";

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  imports: [TypeOrmModule.forFeature([Course])],
  exports: [CourseService],
})
export class CourseModule {}
