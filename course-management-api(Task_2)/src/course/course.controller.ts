
import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CourseService } from './course.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  getAllCourses() {
    return this.courseService.getAllCourses();
  }

  @Get(':id')
  getCourseById(@Param('id') id: string) {
    return this.courseService.getCourseById(id);
  }

  @Post()
  createCourse(@Body() dto: CreateCourseDto) {
    return this.courseService.createCourse(dto);
  }

  @Put(':id')
  updateCourse(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.courseService.updateCourse(id, dto);
  }

  @Patch(':id')
  patchCourse(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.courseService.patchCourse(id, dto);
  }

  @Delete(':id')
  deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }

  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/uploads',
        filename: (_req, file, callback) => {
          callback(null, `${Date.now()}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
      fileFilter: (_req, file, callback) => {
        const allowedExtensions = /\.(jpg|jpeg|png|pdf)$/i;
        if (!allowedExtensions.test(extname(file.originalname))) {
          return callback(
            new BadRequestException(
              'Only .jpg, .jpeg, .png, and .pdf files are allowed',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  uploadCourseMaterial(
    @Param('id') id: string,
    @UploadedFile() file: { filename: string; path: string } | undefined,
  ) {
    if (!file) {
      throw new BadRequestException('A valid file is required');
    }
    return this.courseService.uploadCourseMaterial(id, file);
  }
}
