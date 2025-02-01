import { Injectable, InternalServerErrorException } from '@nestjs/common';

// repo , entity and orm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entity/order.entity';
import { UpgradeToInstructorDto } from '../../account/dtos/upgrade.to.instructor.dto';
import { Account } from '../../account/entity/account.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<Order[]> {
    try {
      return this.orderRepository.find();
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error while fetching orders',
      });
    }
  }

  async findOne(id: number): Promise<Order> {
    try {
      return this.orderRepository.findOne({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error while fetching order',
      });
    }
  }

  async createOrder(
    order: UpgradeToInstructorDto,
    account: Account,
  ) {
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

  async approveOrder(id: number): Promise<Order> {
    try {
      const order = await this.findOne(id);
      order.isApproved = true;
      return this.orderRepository.save(order);
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
