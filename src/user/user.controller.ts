import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  Patch,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
import { UpdateUserDto } from "./dtos/udpate-user.dto";

@Controller("user")
@Serialize(UserDto)
export class UserController {
  constructor(private userService: UserService) {}
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const user = await this.userService.findOne(parseInt(id));

    if (!user) throw new NotFoundException();

    return user;
  }

  @Get()
  async find(@Query("email") email: string) {
    const users = await this.userService.find(email);

    return users;
  }

  @Patch(":id")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param("id") id: string, @Body() body: UpdateUserDto) {
    const user = await this.userService.update(parseInt(id), body);

    if (!user) throw new NotFoundException();

    return user;
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const user = await this.userService.delete(parseInt(id));

    if (!user) throw new NotFoundException();

    return user;
  }
}
