import { Module } from '@nestjs/common';
import { KeyGeneratorProvider } from './providers/key.generator.provider';
import { FactoryKeyGeneratorProvider } from './providers/factory.key.generator.provider';

@Module({
    providers: [
        KeyGeneratorProvider,
        FactoryKeyGeneratorProvider
    ],
    exports: [
        FactoryKeyGeneratorProvider
    ],
})
export class KeyGeneratorModule { }
