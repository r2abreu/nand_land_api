import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { UserService } from "../user/user.service";
import { CourseService } from "src/course/course.service";

@Controller("auth")
export class AuthController {
  constructor(
    private userService: UserService,
    private courseService: CourseService,
  ) {}

  @Post("signup")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signup(@Body() body: CreateUserDto) {
    const course = await this.courseService.findOne(1);

    if (!course) throw new NotFoundException("Course not found");

    const user = await this.userService.create(body.email, body.password);

    if (!user) throw new ConflictException("User already exists");

    user.course = course;
    // TODO: Serialize
    return user;
  }
}
