import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  ConflictException,
  Inject,
  NotFoundException,
  UnauthorizedException,
  Session,
  Get,
  HttpCode,
} from "@nestjs/common";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { UserService } from "../user/user.service";
import { Cryptable } from "src/interfaces/cryptable.interface";
import { CRYPTABLE } from "./node-crypto/tokens";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { UserDto } from "src/user/dto/user.dto";
import { CurrentUser } from "./decorators/current-user.decorator";
import { User } from "src/user/entities/user.entity";
import { UseInterceptors } from "@nestjs/common";
import { CurrentUserInterceptor } from "./current-user.interceptor.ts/current-user.interceptor";
import type { Session as ExpressSession } from "express-session";

interface UserSession extends Partial<ExpressSession> {
  userId: number | null;
  currentUser: User | null;
}

@Controller("auth")
@Serialize(UserDto)
export class AuthController {
  constructor(
    private userService: UserService,
    @Inject(CRYPTABLE) private cryptoService: Cryptable,
  ) {}

  @Post("signup")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signup(@Body() body: CreateUserDto, @Session() session: UserSession) {
    const users = await this.userService.find(body.email);

    if (users.length) throw new ConflictException("User already exists");

    const salt = this.cryptoService.randomBytes(8).toString("hex");
    const hash = (
      await this.cryptoService.encrypt(body.password, salt, 32)
    ).toString("hex");
    const encryptedPassword = `${salt}.${hash}`;

    const user = await this.userService.create(body.email, encryptedPassword);

    session.userId = user.id;

    return user;
  }

  @Post("signin")
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signin(@Body() body: CreateUserDto, @Session() session: UserSession) {
    const [user] = await this.userService.find(body.email);

    if (!user) {
      throw new NotFoundException("An user with that email doesn't exist");
    }

    const [salt, storedHash] = user.password.split(".");

    const hash = (
      await this.cryptoService.encrypt(body.password, salt, 32)
    ).toString("hex");

    if (storedHash !== hash) throw new UnauthorizedException();

    session.userId = user.id;

    return user;
  }

  @Post("signout")
  @HttpCode(200)
  signout(@Session() session: UserSession) {
    session.userId = null;
    session.currentUser = null;
  }

  @UseInterceptors(CurrentUserInterceptor)
  @Get("whoami")
  whoAmI(@CurrentUser() user: User) {
    if (!user) throw new NotFoundException();

    return user;
  }
}
