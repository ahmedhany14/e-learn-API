import { Module } from '@nestjs/common';

// controllers
import { CoursesController } from './courses.controller';

// providers and services
import { CourseService } from './service/course.service';
import { CourseRepo } from './repository/course.repo';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { SectionsService } from './service/sections.service';
import { SectionsRepo } from './repository/sections.repo';
import { VideosService } from './service/videos.service';
import { VideosRepo } from './repository/videos.repo';
import { KeyGeneratorProvider } from './providers/key.generator.provider';
import { FactoryKeyGeneratorProvider } from './providers/factory.key.generator.provider';


// entities and orm
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Section } from './entities/sections.entity';
import { Videos } from './entities/videos.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Course, Section, Videos]),
        PaginationModule,
    ],
    controllers: [CoursesController],
    providers: [
        CourseService,
        CourseRepo,
        SectionsService,
        SectionsRepo,
        VideosService,
        VideosRepo,
        KeyGeneratorProvider,
        FactoryKeyGeneratorProvider,
    ],
    exports: [CourseService, SectionsService, VideosService, FactoryKeyGeneratorProvider],
})
export class CoursesModule { }
