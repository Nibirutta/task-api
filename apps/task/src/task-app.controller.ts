import { Controller } from '@nestjs/common';
import { Payload, MessagePattern } from '@nestjs/microservices';
import { TaskAppService } from './task-app.service';
import {
    CreateTaskDto,
    TASK_PATTERNS,
    TasksFilterDto,
    UpdateTaskDto,
} from '@app/common';

@Controller()
export class TaskAppController {
    constructor(private readonly taskAppService: TaskAppService) {}

    @MessagePattern(TASK_PATTERNS.FIND)
    async getTasks(
        @Payload('owner') owner: string,
        @Payload('tasksFilterDto') tasksFilterDto: TasksFilterDto,
    ) {
        return this.taskAppService.getTasks(owner, tasksFilterDto);
    }

    @MessagePattern(TASK_PATTERNS.CREATE)
    async createTask(
        @Payload('owner') owner: string,
        @Payload('createTaskDto') createTaskDto: CreateTaskDto,
    ) {
        return this.taskAppService.createTask(owner, createTaskDto);
    }

    @MessagePattern(TASK_PATTERNS.UPDATE)
    async updateTask(
        @Payload('owner') owner: string,
        @Payload('id') id: string,
        @Payload('updateTaskDto') updateTaskDto: UpdateTaskDto,
    ) {
        return this.taskAppService.updateTask(owner, id, updateTaskDto);
    }

    @MessagePattern(TASK_PATTERNS.DELETE)
    async deleteTask(
        @Payload('owner') owner: string,
        @Payload('id') id: string,
    ) {
        return this.taskAppService.deleteTask(owner, id);
    }
}
