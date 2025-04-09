import { Account } from 'src/account/entity/account.entity';
import { JwtPayload } from './jwt.interface';
import { Socket } from 'socket.io';
export interface SocketI extends Socket {
    data: {
        user: Account;
        userId: number;
        payload: JwtPayload;
    };
}
