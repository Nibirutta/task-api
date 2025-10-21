import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema, Task } from '../schemas/Task.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Task.name,
                schema: TaskSchema,
            },
        ]),
    ],
    controllers: [],
    providers: [TaskService],
    exports: [TaskService],
})
export class TaskModule {}
