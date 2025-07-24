import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "./dtos/udpate-user.dto";
import { describe, beforeEach, it, expect, vi, Mock } from "vitest";

describe("UserController", () => {
  let controller: UserController;
  let fakeUserService: Partial<Record<keyof UserService, Mock>>;

  beforeEach(async () => {
    fakeUserService = {
      create: vi.fn(),
      find: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe("findOne", () => {
    it("should return an User if found", async () => {
      const mockUser: Partial<User> = { id: 1, email: "", password: "asd" };

      fakeUserService.findOne?.mockResolvedValue(mockUser);

      const user = await controller.findOne("1");
      expect(fakeUserService.findOne).toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });

    it("should throw a NotFound exception if user not found", async () => {
      fakeUserService.findOne?.mockResolvedValue(null);

      await expect(controller.findOne("1")).rejects.toThrow(NotFoundException);
    });
  });

  describe("find", () => {
    it("should return a list of users", async () => {
      const users = [{ id: 1, email: "test@example.com" }];
      fakeUserService.find?.mockResolvedValue(users);

      const result = await controller.find("foo@bar.com");
      expect(fakeUserService.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe("update", () => {
    it("should return the updated user if found", async () => {
      const updateUserDto = { email: "foo@bar.com" } as UpdateUserDto;
      const updatedUser = {
        email: "foo@foo.com",
      };

      fakeUserService.update?.mockResolvedValue(updatedUser);
      const result = await controller.update("1", updateUserDto);
      expect(fakeUserService.update).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    it("should throw a NotFound exception if user is not found", async () => {
      fakeUserService.findOne?.mockResolvedValue(null);

      await expect(
        controller.update("foo", { email: "asd", password: "123" }),
      ).rejects.toThrow(NotFoundException);
      expect(fakeUserService.update).toHaveBeenCalled();
    });
  });

  describe.only("remove", () => {
    it("should return the deleted user if found", async () => {
      const user: Partial<User> = { email: "foo@foo.com" };
      fakeUserService.delete?.mockResolvedValue(user);

      const result = await controller.remove("1");

      expect(result).toBe(user);
    });

    it("should throw NotFound if user not found", async () => {
      fakeUserService.delete?.mockResolvedValue(null);

      await expect(controller.remove("1")).rejects.toThrow(NotFoundException);
    });
  });
});
