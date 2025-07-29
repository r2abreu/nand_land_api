import { Course } from "src/course/entities/course.entity";
import { UserProgress } from "src/course/entities/user-progress.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
  OneToMany,
  Relation,
} from "typeorm";
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

  @OneToMany(() => UserProgress, (progress) => progress.user)
  progress: Relation<UserProgress[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
