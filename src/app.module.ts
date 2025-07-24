import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { User } from "./user/user.entity";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      entities: [User],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
