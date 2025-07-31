import { Test } from "@nestjs/testing";
import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { AuthController } from "./auth.controller";
import { UserService } from "src/user/user.service";
import { CRYPTABLE } from "./node-crypto/tokens";
import { Cryptable } from "src/interfaces/cryptable.interface";
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

describe("AuthController", () => {
  let controller: AuthController;
  const fakeCryptoService: Partial<Record<keyof Cryptable, Mock>> = {
    randomBytes: vi.fn(),
    encrypt: vi.fn(),
  };

  const fakeUserService: Partial<Record<keyof UserService, Mock>> = {
    create: vi.fn(),
    find: vi.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UserService,
          useValue: fakeUserService,
        },
        {
          provide: CRYPTABLE,
          useValue: fakeCryptoService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe("signup", () => {
    it("it should throw ConflictException if user already exists", async () => {
      fakeUserService.find?.mockResolvedValue([true]);

      await expect(
        controller.signup({ email: "foo", password: "123" }),
      ).rejects.toThrow(ConflictException);
      expect(fakeUserService.find).toHaveBeenCalled();
    });

    it("it should save create the user with an encrypted password", async () => {
      fakeUserService.find?.mockResolvedValue([]);
      const buffer = Buffer.from("foo");
      const hexedBuffer = buffer.toString("hex");
      fakeUserService.create?.mockResolvedValue({
        email: "foo",
        password: `${hexedBuffer}.${hexedBuffer}`,
      });

      fakeCryptoService.randomBytes?.mockReturnValue(buffer);
      fakeCryptoService.encrypt?.mockResolvedValue(buffer);

      const result = await controller.signup({ email: "foo", password: "123" });

      expect(fakeUserService.find).toHaveBeenCalled();
      expect(fakeCryptoService.randomBytes).toHaveBeenCalled();
      expect(fakeCryptoService.encrypt).toHaveBeenCalled();
      expect(fakeUserService.create).toHaveBeenCalledWith(
        "foo",
        `${hexedBuffer}.${hexedBuffer}`,
      );
      expect(result).toStrictEqual({
        email: "foo",
        password: `${hexedBuffer}.${hexedBuffer}`,
      });
    });
  });

  describe("signin", () => {
    it("should return authenticated user", async () => {
      const user = {
        email: "foo",
        password: "foo.foo",
      };

      fakeUserService.find?.mockResolvedValue([user]);
      fakeCryptoService.encrypt?.mockResolvedValue("foo");

      const result = await controller.signin(user);

      expect(result).toStrictEqual(user);
      expect(fakeUserService.find).toHaveBeenCalled();
      expect(fakeCryptoService.encrypt).toHaveBeenCalled();
    });

    it("should throw UnauthorizedException when passwords don't match", async () => {
      const user = {
        email: "foo",
        password: "foo.foo",
      };

      fakeUserService.find?.mockResolvedValue([user]);
      fakeCryptoService.encrypt?.mockResolvedValue("foox");

      await expect(controller.signin(user)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(fakeUserService.find).toHaveBeenCalled();
      expect(fakeCryptoService.encrypt).toHaveBeenCalled();
    });

    it("should throw NotFound if no user exists", async () => {
      fakeUserService.find?.mockResolvedValue([]);

      await expect(
        controller.signin({ email: "foo", password: "bar" }),
      ).rejects.toThrow(NotFoundException);

      expect(fakeUserService.find).toHaveBeenCalled();
    });
  });
});
