import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

// dto
import { PaginationDto } from '../../common/pagination/pagination.dto';

// entity and orm
import { Order } from '../entity/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// providers
import { PaginationService } from '../../common/pagination/pagination.service';
import { UpgradeToInstructorDto } from '../../account/dtos/upgrade.to.instructor.dto';
import { Account } from '../../account/entity/account.entity';

@Injectable()
export class OrdersProvider {
  private readonly logger = new Logger(OrdersProvider.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject()
    private readonly paginationService: PaginationService,
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
    try {
      return await this.paginationService.paginate<Order>(
        this.orderRepository,
        paginationDto.page,
        paginationDto.limit,
        relations,
        filter,
        select,
        'http://localhost:3000/admin/orders',
      );
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error while fetching orders',
      });
    }
  }

  async findOne(id: number): Promise<Order> {
    try {
      return await this.orderRepository.findOne({
        where: { id },
        relations: ['account'],
      });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error while fetching order',
      });
    }
  }

  async findOrderAssociatedWithAccount<T extends Partial<Account>>(account: T) {
    try {

      return await this.orderRepository.findOne({
        where: { account: { id: account.id } },
      });
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException({
        message: 'Error while fetching order',
      });
    }
  }

  async create<T extends Partial<Account>>(
    order: UpgradeToInstructorDto,
    account: T,
  ) {
    const existingOrder = await this.findOrderAssociatedWithAccount(account);

    if (existingOrder) {
      throw new ConflictException({
        message: 'Order already exists',
        details: 'This account already has an order',
      });
    }
    const newOrder = this.orderRepository.create({
      ...order,
      is_approved: false,
      state: 'pending',
      account: account,
    });

  console.log(newOrder);

    return await this.orderRepository.save(newOrder);
  }
}
