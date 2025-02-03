import { Inject, Injectable } from '@nestjs/common';

// providers
import { OrdersProvider } from '../providers/orders.provider';
import { BacklogOrdersProvider } from '../providers/backlog.orders.provider';

// dto
import { UpgradeToInstructorDto } from '../../account/dtos/upgrade.to.instructor.dto';
import { PaginationDto } from '../../common/pagination/pagination.dto';

// entity and orm
import { Account } from '../../account/entity/account.entity';
import { IUpgradeToInstructor } from '../../account/interfaces/accounts.interface';

@Injectable()
export class OrdersService {
  constructor(
    @Inject()
    private readonly ordersProvider: OrdersProvider,
    @Inject()
    private readonly backlogOrdersProvider: BacklogOrdersProvider,
  ) {}

  async getAllOrders({
    select,
    filter,
    relations,
    paginationDto,
  }: {
    select: string[];
    filter: any;
    relations: string[];
    paginationDto: PaginationDto;
  }) {
    return await this.ordersProvider.getAllOrders({
      select,
      filter,
      relations,
      paginationDto,
    });
  }

  async getAllBacklog({
    select,
    filter,
    relations,
    paginationDto,
  }: {
    select: string[];
    filter: any;
    relations: string[];
    paginationDto: PaginationDto;
  }) {
    return await this.backlogOrdersProvider.getAllBacklog({
      select,
      filter,
      relations,
      paginationDto,
    });
  }

  async getOneOrder(orderId: number) {
    return await this.ordersProvider.findOne(orderId);
  }

  async createOrder(
    order: UpgradeToInstructorDto,
    account: IUpgradeToInstructor,
  ) {
    return await this.ordersProvider.create(order, account);
  }
}
