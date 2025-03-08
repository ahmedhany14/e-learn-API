import { Injectable, Logger } from '@nestjs/common';

import {
    generateJitteredKeyBetween,
    generateKeyBetween
} from 'fractional-indexing-jittered';
import { IndexGenerator } from 'fractional-indexing-jittered';

@Injectable()
export class KeyGeneratorProvider<T> {
    private readonly indexGenerator = new IndexGenerator([]);
    private readonly logger = new Logger(KeyGeneratorProvider.name);

    private UpDateGenerator(data) {
        const orders = data.map((ele) => ele.order);
        this.indexGenerator.updateList(orders);
    }

    async generateNewKey(data: T[]) {
        this.logger.log('Generating new key');

        this.UpDateGenerator(data);
        return data.length === 0 ? this.indexGenerator.keyStart() : this.indexGenerator.keyEnd();
    }

    async generateKeyToInserFirst(
        data: T[],
        first_order: string,
    ) {
        this.UpDateGenerator(data);
        return generateKeyBetween('a0', first_order);
    }

    async generateKeyToInserLast(
        data: T[],
        last_order: string) {
        this.UpDateGenerator(data);
        return generateKeyBetween(last_order, null);
    }

    async generateKeyToInsertBetween(
        data: T[],
        previous_order: string, next_order: string,) {
        this.UpDateGenerator(data);
        return generateJitteredKeyBetween(previous_order, next_order);
    }
}
