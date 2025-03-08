import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { KeyGeneratorProvider } from './key.generator.provider';

@Injectable()
export class FactoryKeyGeneratorProvider<T> {
    private readonly types = new Map<string, (data: T[], ...args: string[]) => Promise<string>>();

    private readonly logger = new Logger(FactoryKeyGeneratorProvider.name);
    constructor(
        @Inject()
        private readonly keyGeneratorProvider: KeyGeneratorProvider<T>,
    ) {
        this.types.set('new_key', this.keyGeneratorProvider.generateNewKey.bind(this.keyGeneratorProvider));
        this.types.set('first_key', this.keyGeneratorProvider.generateKeyToInserFirst.bind(this.keyGeneratorProvider));
        this.types.set('last_key', this.keyGeneratorProvider.generateKeyToInserLast.bind(this.keyGeneratorProvider));
        this.types.set('between_key', this.keyGeneratorProvider.generateKeyToInsertBetween.bind(this.keyGeneratorProvider));
    }

    async generateNewKey(type: string, data: T[], ...keys: any[]): Promise<string> {
        this.logger.log(type);
        this.logger.log(keys);

        const func = this.types.get(type);
        if (!func) {
            throw new NotFoundException({
                message: `Key type "${type}" not found`
            });
        }
        return func(data, ...keys);
    }
}

