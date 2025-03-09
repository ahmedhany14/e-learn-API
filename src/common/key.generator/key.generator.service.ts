import { Inject, Injectable } from '@nestjs/common';
import { FactoryKeyGeneratorProvider } from './providers/factory.key.generator.provider';

import { KeyTypeEnum } from './key.type.enum';
import { Videos } from '../../videos/entity/videos.entity';
import { Section } from '../../sections/entity/sections.entity';
import * as console from 'node:console';

type WillBe = Videos | Section;

@Injectable()
export class KeyGeneratorService<T extends WillBe> {
    constructor(
        @Inject()
        private readonly factoryKeyGeneratorProvider: FactoryKeyGeneratorProvider<T>,
    ) {}

    determineKeyType(target_order: number, n: number): KeyTypeEnum {
        if (target_order === 1) return KeyTypeEnum.FIRST;
        if (target_order === n || target_order == n + 1) return KeyTypeEnum.LAST;
        return KeyTypeEnum.BETWEEN;
    }

    async generator(data: T[], id: number, target_order: number): Promise<string> {
        const n = data.length;
        const keyType = this.determineKeyType(target_order, n);

        console.log('keyType', keyType);

        switch (keyType) {
            case KeyTypeEnum.FIRST:
                return await this.insertFirstKey(data, data[0].order);
            case KeyTypeEnum.LAST:
                return await this.insertLastKey(data, data[n - 1].order);
            case KeyTypeEnum.BETWEEN:
                const { previous_order, next_order } = this.getPreviousAndNextOrder(
                    data,
                    target_order,
                    id,
                );
                return await this.insertBetweenKey(data, previous_order, next_order);
        }
    }

    async generateNewKey(data: T[]): Promise<string> {
        return await this.factoryKeyGeneratorProvider.generateNewKey(KeyTypeEnum.NEW, data);
    }

    private async insertFirstKey(data: T[], first_order: string): Promise<string> {
        return await this.factoryKeyGeneratorProvider.generateNewKey(
            KeyTypeEnum.FIRST,
            data,
            first_order,
        );
    }

    private async insertLastKey(data: T[], last_order: string): Promise<string> {
        return await this.factoryKeyGeneratorProvider.generateNewKey(
            KeyTypeEnum.LAST,
            data,
            last_order,
        );
    }

    private async insertBetweenKey(
        data: T[],
        previous_order: string,
        next_order: string,
    ): Promise<string> {
        return await this.factoryKeyGeneratorProvider.generateNewKey(
            KeyTypeEnum.BETWEEN,
            data,
            previous_order,
            next_order,
        );
    }

    private getPreviousAndNextOrder(
        data: T[],
        target_order: number,
        id: number,
    ): { previous_order: string; next_order: string } {
        let prev: string, next: string;
        let my_order = -1;

        for (let i = 0; i < data.length; i++) if (data[i].id === id) my_order = i + 1;

        console.log('my_order', my_order);
        if (target_order > my_order && ~my_order) {
            next = data[target_order].order;
            prev = data[target_order - 1].order;
        } else {
            // NOTE this case will be suitable moving video from section to section also.
            next = data[target_order - 1].order;
            prev = data[target_order - 2].order;
        }
        return { previous_order: prev, next_order: next };
    }
}
