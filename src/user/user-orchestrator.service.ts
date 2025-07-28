import { Injectable } from "@nestjs/common";
import { CourseService } from "src/course/course.service";
import { User } from "./entities/user.entity";

@Injectable()
export class UserOrchestratorService {
  constructor(private courseService: CourseService) {}

  async subscribeUserToCourse(user: User, courseId: number) {
    const course = await this.courseService.findOne(courseId);

    if (!course) return null;

    user.course = course;

    return user;
  }
}
