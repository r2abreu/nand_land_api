import { Module } from "@nestjs/common";
import { CourseService } from "./course.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Course } from "./entities/course.entity";
import { CourseController } from "./course.controller";
import { Section } from "./entities/section.entity";
import { Lesson } from "./entities/lesson.entity";
import { User } from "src/user/entities/user.entity";
import { UserProgress } from "./entities/user-progress.entity";

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  imports: [
    TypeOrmModule.forFeature([Lesson, Section, Course, User, UserProgress]),
  ],
  exports: [CourseService],
})
export class CourseModule {}
