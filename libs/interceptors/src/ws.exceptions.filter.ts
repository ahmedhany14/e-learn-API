import { ArgumentsHost, Catch, Logger, WsExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class WsExceptionsFilter implements WsExceptionFilter {
    private readonly logger: Logger = new Logger(WsExceptionsFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const client: Socket = host.switchToWs().getClient();
        this.logger.error(`WebSocket error: ${exception}`, exception.stack);

        let message = 'Something went wrong';
        if (exception instanceof WsException) message = exception.getError().toString();
        else if (typeof exception === 'string') message = exception;
        else if (exception?.message) message = exception.message;

        client.emit('error', {
            type: 'ws_error',
            message,
        });
    }
}
