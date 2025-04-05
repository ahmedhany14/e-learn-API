import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

// Data base and ORM
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Account } from '../entity/account.entity';

// Abstract repository
import { AbstractRepoService } from '@app/abstract.db';

@Injectable()
export class AccountRepository extends AbstractRepoService<Account> {
    protected readonly logger: Logger = new Logger(AccountRepository.name);

    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
        entityManager: EntityManager,
    ) {
        super(accountRepository, entityManager);
    }
    async getTotalStudents(filter: any): Promise<number> {
        try {
            return await this.accountRepository.count({
                where: { ...filter, role: 'user' },
            });
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'An unexpected error occurred',
                details: error.message,
            });
        }
    }

    async getTotalInstructors(filter: any): Promise<number> {
        try {
            return await this.accountRepository
                .createQueryBuilder('account')
                .innerJoinAndSelect('account.instructor', 'instructor')
                .select('account.is_active' as string)
                .addSelect('account.has_been_banned' as string)
                .addSelect('account.role' as string)
                .where({ ...filter, role: 'instructor' })
                .getCount();
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'An unexpected error occurred',
                details: error.message,
            });
        }
    }
}
