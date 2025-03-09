import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Replies, RepliesDocument } from './entity/replies.entity';
import { Model } from 'mongoose';
import { CreateReplyDto } from './dto/create.reply.dto';
import { UpdateReplyDto } from './dto/update.reply.dto';

@Injectable()
export class RepliesRepositoryService {

    constructor(
        @InjectModel(Replies.name)
        private readonly repliesModel: Model<RepliesDocument>
    ) { }

    async getReply(reply_id: string) {
        try {
            return await this.repliesModel.findById(reply_id);
        }
        catch (err) {
            throw new InternalServerErrorException({
                message: 'Error fetching reply',
                details: err.message
            })
        }
    }

    async addReply(createReplyDto: CreateReplyDto, reply_by: number, reply_to: number, comment_id: string) {
        try {
            const reply = new this.repliesModel({
                ...createReplyDto,
                reply_by,
                reply_to,
                comment_id
            });
            return await reply.save();
        }
        catch (err) {
            throw new InternalServerErrorException({
                message: 'Error adding reply',
                details: err.message
            })
        }
    }

    async getReplies(comment_id: string) {
        try {
            return await this.repliesModel.find({
                comment_id
            }).populate('reply_to')
                .populate('reply_by')
                .sort({ createdAt: 1 });
        }
        catch (err) {
            throw new InternalServerErrorException({
                message: 'Error fetching replies',
                details: err.message
            })
        }
    }

    async updateReply(reply_id: string, updateReplyDto: UpdateReplyDto) {
        try {
            return await this.repliesModel.findByIdAndUpdate
                (reply_id, updateReplyDto, { new: true });
        }
        catch (err) {
            throw new InternalServerErrorException({
                message: 'Error updating reply',
                details: err.message
            })
        }
    }

    async deleteReply(reply_id: string) {
        try {
            await this.repliesModel.findByIdAndDelete(reply_id);
        }
        catch (err) {
            throw new InternalServerErrorException({
                message: 'Error deleting reply',
                details: err.message
            })
        }
    }

    async likeReply(reply_id: string, inc: number) {
        try {
            return await this.repliesModel.findByIdAndUpdate(
                reply_id,
                { $inc: { likes: inc } },
                { new: true }
            );
        }
        catch (err) {
            throw new InternalServerErrorException({
                message: 'Error liking reply',
                details: err.message
            })
        }
    }

    async dislikeReply(reply_id: string, inc: number) {
        try {
            return await this.repliesModel.findByIdAndUpdate(
                reply_id,
                { $inc: { dislikes: inc } },
                { new: true }
            );
        }
        catch (err) {
            throw new InternalServerErrorException({
                message: 'Error disliking reply',
                details: err.message
            })
        }
    }
}
