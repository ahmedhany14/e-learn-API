import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { KeyGeneratorProvider } from './key.generator.provider';
import { Section } from '../../../sections/entity/sections.entity';
import { Videos } from '../../../videos/entity/videos.entity';

type WillBe = Section | Videos;
@Injectable()
export class FactoryKeyGeneratorProvider<T extends WillBe> {
    private readonly types = new Map<string, (data: T[], ...args: string[]) => Promise<string>>();

    private readonly logger = new Logger(FactoryKeyGeneratorProvider.name);
    constructor(
        @Inject()
        private readonly keyGeneratorProvider: KeyGeneratorProvider<T>,
    ) {
        this.types.set(
            'new_key',
            this.keyGeneratorProvider.generateNewKey.bind(this.keyGeneratorProvider),
        );
        this.types.set(
            'first_key',
            this.keyGeneratorProvider.generateKeyToInsertFirst.bind(this.keyGeneratorProvider),
        );
        this.types.set(
            'last_key',
            this.keyGeneratorProvider.generateKeyToInsertLast.bind(this.keyGeneratorProvider),
        );
        this.types.set(
            'between_key',
            this.keyGeneratorProvider.generateKeyToInsertBetween.bind(this.keyGeneratorProvider),
        );
    }

    async generateNewKey(type: string, data: T[], ...keys: any[]): Promise<string> {
        this.logger.log(type);
        this.logger.log(keys);

        const func = this.types.get(type);
        if (!func) {
            throw new NotFoundException({
                message: `Key type "${type}" not found`,
            });
        }
        return func(data, ...keys);
    }
}
