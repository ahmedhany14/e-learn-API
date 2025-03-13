import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';

// providers and services
import { OrdersService } from '../../orders/orders.service';

@Injectable()
export class AdminService {
    private readonly logger = new Logger(AdminService.name);

    constructor(
        @Inject()
        private readonly orderService: OrdersService,
    ) {}

    // async approveOrder(orderId: number, adminId: number) {
    //     const order = await this.orderService.getOneOrder(orderId);
    //
    //     if (!order) {
    //         throw new ConflictException({
    //             message: 'Order not found',
    //             details: `Order with id: ${orderId} not found`,
    //         });
    //     }
    //
    //     if (order.is_approved) {
    //         throw new ConflictException({ message: 'Order already approved' });
    //     }
    //
    //     console.log('order', order);
    //
    //     await this.approveTransaction.approveOrder(order, adminId);
    //     return order.account.email;
    // }
    //
    // async rejectOrder(orderId: number, adminId: number) {
    //     const order = await this.orderService.getOneOrder(orderId);
    //
    //     if (order.state === 'rejected') {
    //         throw new ConflictException({ message: 'Order already rejected' });
    //     }
    //
    //     await this.rejectTransaction.rejectOrder(orderId, adminId);
    //     return order.account.email;
    // }
}
