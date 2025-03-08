import { Injectable, InternalServerErrorException } from '@nestjs/common';

// orm and entity
import { Tags, TagsDocument } from '../entity/tags.entity';

// dto and interfaces
import { CreateTagDto } from '../dtos/create.tag.dto';
import { GetByThree } from '../interfaces/tags.interfases';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateTagDto } from '../dtos/update.tag.dto';

@Injectable()
export class TagsRepository {
	constructor(
		@InjectModel(Tags.name)
		private readonly tagsModle: Model<TagsDocument>
	) { }

	async getTagById(id: string) {
		try {
			return await this.tagsModle.findOne(
				{ _id: id }
			);
		} catch (error) {
			console.log(error);
			throw new InternalServerErrorException({
				message: 'Error while fetching tag',
			});
		}
	}

	async deleteTagById(id: string) {
		try {
			await this.tagsModle.deleteOne({ id });
		} catch (error) {
			throw new InternalServerErrorException({
				message: 'Error while deleting tag',
			});
		}
	}

	async getOneTageByThree(getByThree: GetByThree) {
		try {
			return await this.tagsModle.findOne({
				...getByThree
			});
		} catch (error) {
			throw new InternalServerErrorException({
				message: 'Error while fetching tags',
			});
		}
	}

	async createNewTage(createTagDto: CreateTagDto, admin_id: number) {
		try {
			const tag = new this.tagsModle({
				...createTagDto,
				tag_creator: admin_id
			});

			await tag.save();
			return tag;
		} catch (error) {
			throw new InternalServerErrorException({
				message: 'Error while creating tag',
			});
		}
	}

	async getAllTags() {
		try {
			return await this.tagsModle.find();
		} catch (error) {
			throw new InternalServerErrorException({
				message: 'Error while fetching tags',
			});
		}
	}

	async updateTagById(tag: TagsDocument, updateTagDto: UpdateTagDto) {
		try {
			tag = Object.assign(tag, updateTagDto);
			return await tag.save();
		} catch (error) {
			throw new InternalServerErrorException({
				message: 'Error while updating tag',
			});
		}
	}
}
