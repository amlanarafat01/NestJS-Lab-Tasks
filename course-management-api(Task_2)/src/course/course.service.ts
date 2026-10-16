
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';

export interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  credits: number;
  description?: string;
}

@Injectable()
export class CourseService {
  private courses: Course[] = [];
  private nextId = 1;

  getAllCourses() {
    return {
      message: 'All courses fetched successfully',
      data: this.courses,
    };
  }

  getCourseById(id: string) {
    const course = this.findCourse(id);

    return {
      message: 'Course fetched successfully',
      data: course,
    };
  }

  createCourse(dto: CreateCourseDto) {
    const course: Course = {
      id: String(this.nextId++),
      ...dto,
    };

    this.courses.push(course);

    return {
      message: 'Course created successfully',
      data: course,
    };
  }

  updateCourse(id: string, dto: UpdateCourseDto) {
    const index = this.courses.findIndex(
      (course) => course.id === id,
    );

    if (index === -1) {
      throw new NotFoundException('Course not found');
    }

    const updatedCourse: Course = {
      ...this.courses[index],
      ...dto,
      id,
    };

    this.courses[index] = updatedCourse;

    return {
      message: 'Course updated successfully',
      data: updatedCourse,
    };
  }

  patchCourse(id: string, dto: UpdateCourseDto) {
    const index = this.courses.findIndex(
      (course) => course.id === id,
    );

    if (index === -1) {
      throw new NotFoundException('Course not found');
    }

    const updatedCourse: Course = {
      ...this.courses[index],
      ...dto,
      id,
    };

    this.courses[index] = updatedCourse;

    return {
      message: 'Course patched successfully',
      data: updatedCourse,
    };
  }

  deleteCourse(id: string) {
    const index = this.courses.findIndex(
      (course) => course.id === id,
    );

    if (index === -1) {
      throw new NotFoundException('Course not found');
    }

    this.courses.splice(index, 1);

    return {
      message: 'Course deleted successfully',
      id,
    };
  }

  uploadCourseMaterial(
    id: string,
    file: { filename: string; path: string },
  ) {
    this.findCourse(id);

    return {
      message: 'Material uploaded successfully',
      courseId: id,
      filename: file.filename,
      path: file.path,
    };
  }

  private findCourse(id: string): Course {
    const course = this.courses.find(
      (item) => item.id === id,
    );

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }
}
