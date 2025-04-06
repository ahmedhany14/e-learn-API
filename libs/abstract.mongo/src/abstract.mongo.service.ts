import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";

export abstract class AbstractRerpositort<TDocument extends AbstractDocument> {

    protected readonly logger: Logger;

    protected constructor(
        protected readonly model: Model<TDocument>
    ) { }

    async create(data: Omit<TDocument, '_id'>): Promise<TDocument> {
        try {
            const document = new this.model({
                ...data,
                _id: new Types.ObjectId()
            })
            return (await document.save()).toJSON() as unknown as TDocument;
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error creating entity',
                error: error.message,
            });
        }

    }

    async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
        try {
            return this.model.find(filterQuery).lean<TDocument[]>(true);
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error finding entity',
                error: error.message,
            });
        }
    }


    async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {

        try {
            const document = await this.model.
                findOne(filterQuery).
                lean<TDocument>(true);

            if (!document) this.logger.warn(`Document not found with filter: ${JSON.stringify(filterQuery)}`);
            return document;
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error finding entity',
                error: error.message,
            });
        }
    }

    async findOneAndUpdate(
        filterQuery: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>
    ): Promise<TDocument> {
        try {
            const document = await this.model.
                findOneAndUpdate(
                    filterQuery,
                    update,
                    { new: true }
                ).lean<TDocument>(true);

            if (!document)
                this.logger.warn(`Document not found with filter: ${JSON.stringify(filterQuery)}`);
            return document;
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error finding and updating entity',
                error: error.message,
            });
        }
    }

    async findOneAndDelete(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
        try {
            return await this.model.findOneAndDelete
                (filterQuery).lean<TDocument>(true);
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error finding and deleting entity',
                error: error.message,
            });
        }
    }

    async paginate(
        filterQuery: FilterQuery<TDocument>,
        options: {
            page: number;
            limit: number;
            sort?: Record<string, any>;
        },
        baseUrl = '',
    ) {

        this.logger.log('Paginating entities');

        try {
            const { page = 1, limit = 10, sort } = options;
            const skip = (page - 1) * limit;

            const documents = await this.model
                .find(filterQuery)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean<TDocument[]>(true);

            const total = await this.model.countDocuments(filterQuery);

            const totalPages = Math.ceil(total / limit),
                hasMore = page < totalPages;

            return {
                response: documents,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages,
                    hasMore,
                    firstPage: `${baseUrl}?page=1&limit=${limit}`,
                    lastPage: `${baseUrl}?page=${totalPages}&limit=${limit}`,
                    previous: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
                    next: hasMore ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
                    current: `${baseUrl}?page=${page}&limit=${limit}`,
                }
            }
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Error paginating entities',
                error: error.message,
            });

        }
    }
}