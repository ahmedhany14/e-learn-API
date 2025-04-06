import { Controller, Get, Param } from '@nestjs/common';

@Controller('plans')
export class PlansController {
    @Get()
    async findAll() {
        return 'This action returns all plans';
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return `This action returns a #${id} plan`;
    }
}
