import { Controller } from '@nestjs/common';
import { Payload, MessagePattern } from '@nestjs/microservices';
import {
    CreateTaskDto,
    TASK_PATTERNS,
    TasksFilterDto,
    UpdateTaskDto,
    TaskResponseDto,
} from '@app/common';
import { TaskService } from './task/task.service';
import { plainToInstance } from 'class-transformer';

@Controller()
export class TaskAppController {
    constructor(private readonly taskService: TaskService) {}

    @MessagePattern(TASK_PATTERNS.FIND)
    async getTasks(
        @Payload('owner') owner: string,
        @Payload('tasksFilterDto') tasksFilterDto: TasksFilterDto,
    ) {
        const foundTasks = await this.taskService.getTasks(
            owner,
            tasksFilterDto,
        );

        return foundTasks.map((task) =>
            plainToInstance(TaskResponseDto, task, {
                excludeExtraneousValues: true,
            }),
        );
    }

    @MessagePattern(TASK_PATTERNS.CREATE)
    async createTask(
        @Payload('owner') owner: string,
        @Payload('createTaskDto') createTaskDto: CreateTaskDto,
    ) {
        const createdTask = await this.taskService.createTask(
            owner,
            createTaskDto,
        );

        return plainToInstance(TaskResponseDto, createdTask, {
            excludeExtraneousValues: true,
        });
    }

    @MessagePattern(TASK_PATTERNS.UPDATE)
    async updateTask(
        @Payload('owner') owner: string,
        @Payload('id') id: string,
        @Payload('updateTaskDto') updateTaskDto: UpdateTaskDto,
    ) {
        const updatedTask = await this.taskService.updateTask(
            owner,
            id,
            updateTaskDto,
        );

        return plainToInstance(TaskResponseDto, updatedTask, {
            excludeExtraneousValues: true,
        });
    }

    @MessagePattern(TASK_PATTERNS.DELETE)
    async deleteTask(
        @Payload('owner') owner: string,
        @Payload('id') id: string,
    ) {
        const deletedTask = await this.taskService.deleteTask(owner, id);

        return plainToInstance(TaskResponseDto, deletedTask, {
            excludeExtraneousValues: true,
        });
    }

    @MessagePattern(TASK_PATTERNS.DELETE_ALL)
    async deleteAllTasksFromUser(@Payload() owner: string) {
        return await this.taskService.deleteAllTasksFromUser(owner);
    }
}
