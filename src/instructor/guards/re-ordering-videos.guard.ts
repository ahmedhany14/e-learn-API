import { CanActivate, ConflictException, ExecutionContext, Injectable } from '@nestjs/common';
import { MoveMode } from '../dtos/re-ordering/move.data.dto';
import { IsYourVideoGuard } from './is.your.video.guard';

@Injectable()
export class ReOrderingVideossGuard
    extends IsYourVideoGuard
    implements CanActivate {
    async canActivate(
        context: ExecutionContext,
    ): | Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { move_mode, id } = request.params;
        const { moveMode } = request.body;

        if (move_mode !== moveMode) {
            throw new ConflictException({
                message: 'Invalid move mode',
                details: 'Move mode does not match',
            });
        }

        if (moveMode === MoveMode.VIDEO_IN_SAME_SECTION) {
            const ret = await super.checkIfVideoBelongsToInstructor(
                id,
                request.accountId,
                request,
            );
            console.log(request)

            return ret;
        }
        return true;
    }
}
