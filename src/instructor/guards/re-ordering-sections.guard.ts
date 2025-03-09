import { CanActivate, ConflictException, ExecutionContext, Injectable } from '@nestjs/common';

// extened guard
import { IsYourSectionGuard } from './is.your.section.guard';

// enum
import { MoveTypeENUM } from '../dtos/re-ordering/enum/move.type.enum';

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

        if (moveMode === MoveTypeENUM.SECTION) {
            console.log('Checking if section belongs to instructor');
            return await super.checkIfSectionBelongsToInstructor(
                id,
                request.accountId,
            );
        }
        return true;
    }
}
