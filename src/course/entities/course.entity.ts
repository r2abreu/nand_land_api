import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  Entity,
} from "typeorm";
import { User } from "src/user/entities/user.entity";

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.course)
  users: User[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @CreateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
