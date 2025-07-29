import { Course } from "src/course/entities/course.entity";
import {
  Column,
  Entity,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { Lesson } from "./lesson.entity";

@Entity()
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Course, (course) => course.sections)
  course: Relation<Course>;

  @OneToMany(() => Lesson, (lesson) => lesson.section)
  lessons: Relation<Lesson[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
