import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Controller("course")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() body: CreateCourseDto) {
    return this.courseService.create(body.name, body.description);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const course = await this.courseService.findOne(parseInt(id));

    if (!course) throw new NotFoundException();

    return course;
  }

  @Get()
  async find(@Query("name") name: string) {
    const courses = await this.courseService.find(name);

    return courses;
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: UpdateCourseDto) {
    const course = await this.courseService.update(parseInt(id), body);

    if (!course) throw new NotFoundException();

    return course;
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const course = await this.courseService.delete(parseInt(id));

    if (!course) throw new NotFoundException();

    return course;
  }
}
