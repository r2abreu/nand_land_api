import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { CourseModule } from "./course/course.module";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      autoLoadEntities: true,
      synchronize: true,
    }),
    CourseModule,
  ],
})
export class AppModule {}
