import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument, Blog } from './entity/blog.entity';
import { CreateBlogDto } from './dtos/create.blog.dto';
import { UpdateBlogDto } from './dtos/update.blog.dto';

@Injectable()
export class BlogRepositoryService {
    constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) { }

    async createBlog(createBlogDto: CreateBlogDto, author_id: number) {
        const blog = new this.blogModel({
            ...createBlogDto,
            author_id: author_id
        });
        return await blog.save();
    }

    async getOneBlog(id: string) {
        try {
            return await this.blogModel.findById(id);
        } catch (err) {
            throw new InternalServerErrorException('Error fetching blog');
        }
    }

    async incrementViews(blog: Blog) {
        try {
            blog.views += 1;
            return await blog.save();
        } catch (err) {

        }
    }


    async updateBlog(blog: Blog, updateBlogDto: UpdateBlogDto) {
        try {
            return await this.blogModel.findByIdAndUpdate(blog._id, updateBlogDto, { new: true });
        } catch (err) {
            throw new InternalServerErrorException('Error updating blog');
        }
    }

    async deleteBlog(blog: Blog) {
        try {
            await this.blogModel.findByIdAndDelete(blog._id);
        } catch (err) {
            throw new InternalServerErrorException('Error deleting blog');
        }

    }


    async upvoteBlog(id: string, inc: number) {
        try {
            await this.blogModel.findByIdAndUpdate(id, { $inc: { upvotes: inc } });
        } catch (err) {
            throw new InternalServerErrorException('Error upvoting blog');
        }
    }

    async downvoteBlog(id: string, inc: number) {
        try {
            await this.blogModel.findByIdAndUpdate(id, { $inc: { downvotes: inc } });
        }
        catch (err) {
            throw new InternalServerErrorException('Error downvoting blog');
        }
    }

    async getBlogs(author_id: number, page = 1) {
        try {
            return await this.blogModel.find().where('author_id').equals(author_id).skip((page - 1) * 10).limit(10);
        } catch (err) {
            throw new InternalServerErrorException('Error fetching blogs');
        }
    }

}
