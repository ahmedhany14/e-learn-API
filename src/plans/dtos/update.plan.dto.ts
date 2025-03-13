import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

import { CreatePlanDto } from './create.plan.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePlanDto extends PartialType(CreatePlanDto) { }