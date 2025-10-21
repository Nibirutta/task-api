import { Injectable } from '@nestjs/common';
import { TaskService } from './task/task.service';
import { CreateTaskDto, TasksFilterDto, UpdateTaskDto } from '@app/common';

@Injectable()
export class TaskAppService {
    constructor(private readonly taskService: TaskService) {}

    async getTasks(owner: string, tasksFilterDto: TasksFilterDto) {
        const foundTasks = await this.taskService.getTasks(
            owner,
            tasksFilterDto,
        );

        return foundTasks.map((task) => task.toObject());
    }

    async createTask(owner: string, createTaskDto: CreateTaskDto) {
        const createdTask = await this.taskService.createTask(
            owner,
            createTaskDto,
        );

        return createdTask.toObject();
    }

    async updateTask(owner: string, id: string, updateTaskDto: UpdateTaskDto) {
        const updatedTask = await this.taskService.updateTask(
            owner,
            id,
            updateTaskDto,
        );

        return updatedTask.toObject();
    }

    async deleteTask(owner: string, id: string) {
        const deletedTask = await this.taskService.deleteTask(owner, id);

        return deletedTask.toObject();
    }
}
