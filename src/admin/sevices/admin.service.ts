import {
  Inject,
  Injectable,
  InternalServerErrorException, Logger,
} from '@nestjs/common';

// repo , entity and orm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entity/order.entity';
import { Account } from '../../account/entity/account.entity';

// dto
import { UpgradeToInstructorDto } from '../../account/dtos/upgrade.to.instructor.dto';

// providers
import { ApproveTransaction } from '../providers/approve.transaction';
import { OrderBacklog } from '../entity/order.backlog.entity';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderBacklog)
    private readonly orderBacklogRepository: Repository<OrderBacklog>,
    @Inject()
    private readonly approveTransaction: ApproveTransaction,
  ) {}

  async findAll(): Promise<Order[]> {
    try {
      return await this.orderRepository.find();
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error while fetching orders',
      });
    }
  }

  async findAllBacklog(state: string): Promise<OrderBacklog[]> {
    try {
      return await this.orderBacklogRepository.find({
        where: { state: state },
        relations: {
          order: true,
          account: true,
        },
        select: {
          order: {
            PaymentInfo: true,
            stripeInfo: true,
            isApproved: true,
            account: {
              email: true,
              role: true,
            },
          },
          account: {
            email: true,
            role: true,
          },
        },
      });
    } catch (error) {
      this.logger.log(error)
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

  async createOrder(order: UpgradeToInstructorDto, account: Account) {
    try {
      const newOrder = this.orderRepository.create({
        ...order,
        isApproved: false,
        account: account,
      });

      return await this.orderRepository.save(newOrder);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error while creating order',
      });
    }
  }

  async approveOrder(orderId: number, adminId: number) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['account'],
      });

      await this.approveTransaction.approveOrder(orderId, adminId, order.account.id);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error while approving order',
      });
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.orderRepository.delete({ id });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error while deleting order',
      });
    }
  }
}
