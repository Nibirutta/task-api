import { Expose, Transform } from 'class-transformer';
import { TaskPriority } from '@app/common/enums/task-priority.enum';
import { TaskStatus } from '@app/common/enums/task-status.enum';

export class TaskResponseDto {
    @Expose()
    @Transform(({ obj }) => obj._id.toString())
    id: string;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    status: TaskStatus;

    @Expose()
    priority: TaskPriority;

    @Expose()
    dueDate: Date;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}
