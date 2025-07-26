import { Course } from "src/course/entities/course.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { CreateDateColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Course, (course) => course.users)
  course: Course;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @CreateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
