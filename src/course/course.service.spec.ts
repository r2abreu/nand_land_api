import { Test, TestingModule } from "@nestjs/testing";
import { CourseService } from "./course.service";
import { Repository } from "typeorm";
import { Course } from "./entities/course.entity";
import { Mock, beforeEach, describe, it, expect, vi } from "vitest"
import { getRepositoryToken } from "@nestjs/typeorm";

describe("CourseService", () => {
  let service: CourseService;
  let fakeUserRepo: Partial<Record<keyof Repository<Course>, Mock>>;

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
        CourseService,
        {
          provide: getRepositoryToken(Course),
          useValue: fakeUserRepo,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
  });


  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
