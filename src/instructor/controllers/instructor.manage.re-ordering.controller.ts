import { Body, Controller, Inject, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { MoveDataDTO } from '../dtos/re-ordering/move.data.dto';

import { ReOrderingSectionsGuard } from '../guards/re-ordering-sections.guard';
import { ReOrderingVideossGuard } from '../guards/re-ordering-videos.guard';
import { AUTH } from 'src/auth/decorators/auth.decorator';
import { AuthEnum } from 'src/auth/enums/auth.enum';

@Controller('manage-re-ordering')
export class InstructorManageReOrderingController {

    constructor(

    ) { }

    @UseGuards(ReOrderingSectionsGuard, ReOrderingVideossGuard)
    @AUTH(AuthEnum.BEARER)
    @Patch(':move_mode/:id')
    async reOrder(
        @Body() moveDataDTO: MoveDataDTO,
        @Param('id', ParseIntPipe) id: number
    ) {

        console.log(moveDataDTO);
        return 'Re-ordering';
    }
}
