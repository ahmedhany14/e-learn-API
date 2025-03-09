import { CanActivate, ConflictException, ExecutionContext, Injectable } from '@nestjs/common';

// extened guard
import { IsYourVideoGuard } from './is.your.video.guard';

// enum
import { MoveTypeENUM } from '../dtos/re-ordering/enum/move.type.enum';

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

        if (moveMode === MoveTypeENUM.VIDEO_IN_SAME_SECTION) {
            return await super.checkIfVideoBelongsToInstructor(
                id,
                request.accountId,
                request,
            );;
        }
        return true;
    }
}
