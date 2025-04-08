import { PipeTransform, Injectable, NotFoundException } from '@nestjs/common';
import { AccountService } from '../service/account.service';

@Injectable()
export class AccountIsExistingDecorator implements PipeTransform<number> {
    constructor(private readonly accountService: AccountService) {}

    async transform(id: number): Promise<number> {
        const account = await this.accountService.findById({ id });
        if (!account) {
            throw new NotFoundException(`Account with ID ${id} does not exist.`);
        }
        return id;
    }
}
