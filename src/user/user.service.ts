import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string) {
    let user = await this.repo.findOneBy({ email });

    if (user) return null;

    user = this.repo.create({ email, password });

    return await this.repo.save(user);
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) return null;

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async find(email: string) {
    return await this.repo.find({ where: { email } });
  }

  async findOne(id: number) {
    return await this.repo.findOneBy({ id });
  }

  async delete(id: number) {
    const user = await this.findOne(id);

    if (!user) return null;

    return this.repo.remove(user);
  }
}
