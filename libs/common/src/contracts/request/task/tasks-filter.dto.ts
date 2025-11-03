import { IsOptional, IsString, IsEnum, IsDate } from 'class-validator';
import { TaskStatus } from '@app/common/enums/task-status.enum';
import { TaskPriority } from '@app/common/enums/task-priority.enum';

export class TasksFilterDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;

    @IsOptional()
    @IsDate()
    from?: Date;

    @IsOptional()
    @IsDate()
    to?: Date;
}
