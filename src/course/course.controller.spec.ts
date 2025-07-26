import { Test, TestingModule } from "@nestjs/testing";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";
import { describe, beforeEach, it, expect, Mock, vi } from "vitest";
import { Course } from "./entities/course.entity";
import { NotFoundException } from "@nestjs/common";

describe("CourseController", () => {
  let controller: CourseController;
  let fakeCourseService: Partial<Record<keyof CourseService, Mock>>;

  beforeEach(async () => {
    fakeCourseService = {
      create: vi.fn(),
      find: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CourseService,
          useValue: fakeCourseService,
        },
      ],
      controllers: [CourseController],
    }).compile();

    controller = module.get<CourseController>(CourseController);
  });

  describe("findOne", () => {
    it("should return a Course if found", async () => {
      const mockCourse: Partial<Course> = { name: "foo", description: "bar" };

      fakeCourseService.findOne?.mockResolvedValue(mockCourse);

      const result = await controller.findOne("1");

      expect(fakeCourseService.findOne).toHaveBeenCalled();
      expect(result).toStrictEqual(mockCourse);
    });

    it("should throw a NotFound exception if course not found", async () => {
      fakeCourseService.findOne?.mockResolvedValue(null);

      await expect(controller.findOne("1")).rejects.toThrow(NotFoundException);
    });
  });

  describe("find", () => {
    it("returns a list of courses", async () => {
      const courses = [{ id: 1, name: "foo", description: "bar" }];
      fakeCourseService.find?.mockResolvedValue(courses);

      const result = await controller.find("foo");

      expect(fakeCourseService.find).toHaveBeenCalled();
      expect(result).toStrictEqual(courses);
    });
  });

  describe("update", () => {
    it("should return the updated course if found", async () => {
      const updatedUser = {
        "name": "foo",
        "description": "bar"
      }

      fakeCourseService.update?.mockResolvedValue(updatedUser);
      const result = await controller.update("1", { "name": "bar" });
      expect(fakeCourseService.update).toHaveBeenCalled();
      expect(result).toStrictEqual(updatedUser)
    })

    it("should throw if course if not found", async () => {
      fakeCourseService.update?.mockResolvedValue(null);

      await expect(controller.update("1", { "name": "bar" })).rejects.toThrow(NotFoundException)
      expect(fakeCourseService.update).toHaveBeenCalled()
    });
  })

  describe("delete", () => {
    it("should return the deleted course if found", async () => {
      const deletedUser = {
        "name": "foo",
        "description": "bar"
      }

      fakeCourseService.delete?.mockResolvedValue(deletedUser);
      const result = await controller.remove("1");
      expect(fakeCourseService.delete).toHaveBeenCalled();
      expect(result).toStrictEqual(deletedUser)
    })

    it("should throw if course if not found", async () => {
      fakeCourseService.delete?.mockResolvedValue(null);

      await expect(controller.remove("1")).rejects.toThrow(NotFoundException)
      expect(fakeCourseService.delete).toHaveBeenCalled()
    });
  })
});
