import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsEnum,
    IsDateString,
} from 'class-validator';
import { TaskStatus } from '@app/common/enums/task-status.enum';
import { TaskPriority } from '@app/common/enums/task-priority.enum';

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status: TaskStatus.TO_DO;

    @IsOptional()
    @IsEnum(TaskPriority)
    priority: TaskPriority.MEDIUM;

    @IsNotEmpty()
    @IsDateString()
    dueDate: Date;
}
