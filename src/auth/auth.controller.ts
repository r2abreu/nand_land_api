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

@Controller("auth")
@Serialize(UserDto)
export class AuthController {
  constructor(
    private userService: UserService,
    @Inject(CRYPTABLE) private cryptoService: Cryptable,
  ) {}

  @Post("signup")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signup(@Body() body: CreateUserDto, @Session() session: any) {
    const users = await this.userService.find(body.email);

    if (users.length) throw new ConflictException("User already exists");

    const salt = this.cryptoService.randomBytes(8).toString("hex");
    const hash = (
      await this.cryptoService.encrypt(body.password, salt, 32)
    ).toString("hex");
    const encryptedPassword = `${salt}.${hash}`;

    const user = await this.userService.create(body.email, encryptedPassword);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    session.userId = user.id;

    return user;
  }

  @Post("signin")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async signin(@Body() body: CreateUserDto) {
    const [user] = await this.userService.find(body.email);

    if (!user) {
      throw new NotFoundException("An user with that email doesn't exist");
    }

    const [salt, storedHash] = user.password.split(".");

    const hash = (
      await this.cryptoService.encrypt(body.password, salt, 32)
    ).toString("hex");

    if (storedHash !== hash) throw new UnauthorizedException();

    return user;
  }

  @UseInterceptors(CurrentUserInterceptor)
  @Get("whoami")
  whoAmI(@CurrentUser() user: User) {
    return user;
  }
}
