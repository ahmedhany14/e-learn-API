import { Module } from '@nestjs/common';
import { KeyGeneratorProvider } from './providers/key.generator.provider';
import { FactoryKeyGeneratorProvider } from './providers/factory.key.generator.provider';
import { KeyGeneratorService } from './key.generator.service';

@Module({
    providers: [KeyGeneratorProvider, FactoryKeyGeneratorProvider, KeyGeneratorService],
    exports: [FactoryKeyGeneratorProvider, KeyGeneratorService],
})
export class KeyGeneratorModule {}
