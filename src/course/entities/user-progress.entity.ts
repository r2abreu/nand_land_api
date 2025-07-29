import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  Relation,
} from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Lesson } from "./lesson.entity";

@Entity()
export class UserProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", enum: ["not started", "in progress", "completed"] })
  status: string;

  @Column({ type: "datetime", nullable: true })
  completedAt: Date | null;

  @ManyToOne(() => User, (user) => user.progress)
  user: Relation<User>;

  @ManyToOne(() => Lesson, (lesson) => lesson.progress)
  lesson: Relation<Lesson>;

  @UpdateDateColumn()
  updatedAt: Date;
}
