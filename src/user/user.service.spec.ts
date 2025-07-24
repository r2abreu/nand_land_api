import { User } from "./user.entity";
import { Repository } from "typeorm";
import { UserService } from "./user.service";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { describe, beforeEach, it, expect, vi, Mock } from "vitest";

describe("UserService", () => {
  let service: UserService;
  let fakeUserRepo: Partial<Record<keyof Repository<User>, Mock>>;

  beforeEach(async () => {
    fakeUserRepo = {
      create: vi.fn(),
      save: vi.fn(),
      find: vi.fn(),
      findOneBy: vi.fn(),
      remove: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: fakeUserRepo,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe("create", () => {
    it("should return the created user", async () => {
      const user = {
        email: "foo",
        password: "bar",
      };

      fakeUserRepo.create?.mockResolvedValue(user);
      fakeUserRepo.save?.mockResolvedValue(user);

      const result = await service.create("foo", "asd");
      expect(fakeUserRepo.create).toHaveBeenCalled();
      expect(fakeUserRepo.save).toHaveBeenCalled();
      expect(result).toEqual(user);
    });
  });

  describe("update", () => {
    it("it updates a user and returns it", async () => {
      const user = {
        email: "foo",
        password: "123",
      };

      const updatedUser = {
        email: "bar",
        password: "123",
      };

      fakeUserRepo.findOneBy?.mockResolvedValue(user);
      fakeUserRepo.save?.mockImplementation((user) => {
        return user as User;
      });

      const result = await service.update(1, { email: "bar" });
      expect(fakeUserRepo.findOneBy).toHaveBeenCalled();
      expect(result).toStrictEqual(updatedUser);
    });

    it("it returns null if no user found", async () => {
      fakeUserRepo.findOneBy?.mockResolvedValue(null);

      expect(await service.update(1, { email: "asd" })).toBe(null);
      expect(fakeUserRepo.findOneBy).toHaveBeenCalled();
    });
  });

  describe("find", () => {
    it("should return a list of users", async () => {
      const users = [
        {
          email: "bar",
          password: "123",
        },
      ];

      fakeUserRepo.find?.mockResolvedValue(users);

      const result = await service.find("foo");

      expect(result).toStrictEqual(users);
    });
  });

  describe("findOne", () => {
    it("should return the found user", async () => {
      const user: Partial<User> = {
        email: "bar",
        password: "123",
      };

      fakeUserRepo.findOneBy?.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(result).toStrictEqual(user);
    });
  });

  describe("delete", () => {
    it("should return the deleted user", async () => {
      const user: Partial<User> = {
        email: "bar",
        password: "123",
      };

      fakeUserRepo.findOneBy?.mockResolvedValue(user);
      fakeUserRepo.remove?.mockResolvedValue(user);

      const result = await service.delete(1);
      expect(fakeUserRepo.findOneBy).toHaveBeenCalled();
      expect(fakeUserRepo.remove).toHaveBeenCalled();
      expect(result).toStrictEqual(user);
    });

    it("should return null if no user found", async () => {
      fakeUserRepo.findOneBy?.mockResolvedValue(null);

      const result = await service.delete(1);

      expect(fakeUserRepo.findOneBy).toHaveBeenCalled();
      expect(result).toBe(null);
    });
  });
});
