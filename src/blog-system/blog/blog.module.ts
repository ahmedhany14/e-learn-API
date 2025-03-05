import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './entity/blog.entity';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogRepositoryService } from './blog.repository.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Blog.name,
                schema: BlogSchema,
            },
        ]),
        RedisModule
    ],
    controllers: [BlogController],
    providers: [BlogService, BlogRepositoryService],
})
export class BlogModule { }