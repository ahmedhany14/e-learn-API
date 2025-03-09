import { Injectable, Logger } from '@nestjs/common';

import { generateKeyBetween, generateJitteredKeyBetween } from 'fractional-indexing-jittered';
import { IndexGenerator } from 'fractional-indexing-jittered';
import * as console from 'node:console';
import { Section } from '../../../sections/entity/sections.entity';
import { Videos } from '../../../videos/entity/videos.entity';

type WillBe = Section | Videos;

@Injectable()
export class KeyGeneratorProvider<T extends WillBe> {
    private readonly indexGenerator = new IndexGenerator([]);
    private readonly logger = new Logger(KeyGeneratorProvider.name);

    async generateNewKey(data: T[]) {
        this.logger.log('Generating new key');

        this.UpDateGenerator(data);
        return data.length === 0 ? this.indexGenerator.keyStart() : this.indexGenerator.keyEnd();
    }

    async generateKeyToInsertFirst(data: T[], first_order: string) {
        this.logger.log('Generating key to insert first');
        this.UpDateGenerator(data);
        return generateKeyBetween('a0', first_order);
    }

    async generateKeyToInsertLast(data: T[], last_order: string) {
        this.logger.log('Generating key to insert last');

        this.UpDateGenerator(data);
        return generateKeyBetween(last_order, null);
    }

    getKeyBetween(previous: string, next: string): string {
        const prevNum = parseInt(previous, 36);
        const nextNum = parseInt(next, 36);
        const middleNum = Math.floor((prevNum + nextNum) / 2);
        return middleNum.toString(36).padStart(previous.length, '0');
    }

    async generateKeyToInsertBetween(data: T[], previous_order: string, next_order: string) {
        this.logger.log(`Generating key to insert between ${previous_order} and ${next_order}`);

        // has to be fixed.
        // there is a bit error in generating key between two keys.
        /*
            this.UpDateGenerator(data);
            return generateKeyBetween(previous_order, next_order);
        */
        const newKey = this.getKeyBetween(previous_order, next_order);
        if (!this.is_in_between(newKey, previous_order, next_order)) {
            this.logger.error(
                `Error: ${newKey} is not between ${previous_order} and ${next_order}`,
            );
        }
        return this.getKeyBetween(previous_order, next_order);
    }

    private is_in_between(ch: string, previous_order: string, next_order: string) {
        return ch > previous_order && ch < next_order;
    }

    private UpDateGenerator(data: T[]) {
        const orders = data.map((ele) => ele.order);
        this.indexGenerator.updateList(orders);
    }
}
