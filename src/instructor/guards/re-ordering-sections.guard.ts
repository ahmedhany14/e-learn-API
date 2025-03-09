import { CanActivate, ConflictException, ExecutionContext, Injectable } from '@nestjs/common';
import { MoveMode } from '../dtos/re-ordering/move.data.dto';
import { IsYourSectionGuard } from './is.your.section.guard';
import { IsYourVideoGuard } from './is.your.video.guard';

@Injectable()
export class ReOrderingSectionsGuard
    extends IsYourSectionGuard
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

        if (moveMode === MoveMode.SECTION) {
            console.log('Checking if section belongs to instructor');
            return await super.checkIfSectionBelongsToInstructor(
                id,
                request.accountId,
            );
        }
        return true;
    }
}
