import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  Relation,
  UpdateDateColumn,
} from "typeorm";
import { Section } from "./section.entity";
import { UserProgress } from "./user-progress.entity";

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Section, (section) => section.lessons)
  section: Relation<Section>;

  @OneToMany(() => UserProgress, (progress) => progress.lesson)
  progress: Relation<UserProgress[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
