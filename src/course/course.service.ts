import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Course } from "./entities/course.entity";

@Injectable()
export class CourseService {
  constructor(@InjectRepository(Course) private repo: Repository<Course>) { }

  create(name: string, description: string) {
    const course = this.repo.create({ name, description });
    return this.repo.save(course);
  }

  async update(id: number, attrs: Partial<Course>) {
    const course = await this.findOne(id);
    if (!course) return null;

    Object.assign(course, attrs);

    return this.repo.save(course);
  }

  async find(name: string) {
    return await this.repo.find({ where: { name } });
  }

  async findOne(id: number) {
    return await this.repo.findOneBy({ id });
  }

  async delete(id: number) {
    const course = await this.findOne(id);

    if (!course) return null;

    return this.repo.remove(course);
  }
}
