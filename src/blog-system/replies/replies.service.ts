import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RepliesRepositoryService } from './replies.repository.service';
import { CreateReplyDto } from './dto/create.reply.dto';
import { UpdateReplyDto } from './dto/update.reply.dto';

@Injectable()
export class RepliesService {

    constructor(
        @Inject()
        private readonly repliesRepositoryService: RepliesRepositoryService
    ) { }


    async addReply(createReplyDto: CreateReplyDto, reply_by: number, reply_to: number, comment_id: string) {
        return this.repliesRepositoryService.addReply(createReplyDto, reply_by, reply_to, comment_id);
    }

    async getReplies(comment_id: string) {
        return this.repliesRepositoryService.getReplies(comment_id);
    }

    async getReply(reply_id: string) {
        return this.repliesRepositoryService.getReply(reply_id);
    }

    async deleteReply(reply_id: string, reply_by: number) {
        const reply = await this.repliesRepositoryService.getReply(reply_id);
        if (!reply) {
            throw new NotFoundException({
                message: "Reply Not Found"
            });
        }

        if (reply.reply_by !== reply_by) {
            throw new UnauthorizedException({
                message: "You are not allowed to delete this reply"
            });
        }

        this.repliesRepositoryService.deleteReply(reply_id);
    }


    async updateReply(reply_id: string, reply_by: number, updateReplyDto: UpdateReplyDto) {
        const reply = await this.repliesRepositoryService.getReply(reply_id);
        if (!reply) {
            throw new NotFoundException({
                message: "Reply Not Found"
            });
        }

        if (reply.reply_by !== reply_by) {
            throw new UnauthorizedException({
                message: "You are not allowed to update this reply"
            });
        }

        return this.repliesRepositoryService.updateReply(reply_id, updateReplyDto);
    }

    async likeReply(reply_id: string, inc: number) {
        return this.repliesRepositoryService.likeReply(reply_id, inc);
    }

    async dislikeReply(reply_id: string, inc: number) {
        return this.repliesRepositoryService.dislikeReply(reply_id, inc);
    }
}
