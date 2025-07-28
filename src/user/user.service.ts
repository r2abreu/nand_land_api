import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UserOrchestratorService } from "./user-orchestrator.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private userOrchestratorService: UserOrchestratorService,
  ) {}

  async create(email: string, password: string) {
    // TODO: Handle case where user already exists
    const user = this.repo.create({ email, password });

    const subscribedUser =
      await this.userOrchestratorService.subscribeUserToCourse(user, 1);

    if (!subscribedUser) return null;

    return this.repo.save(subscribedUser);
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
