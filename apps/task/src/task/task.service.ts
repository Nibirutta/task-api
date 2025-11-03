import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from '../schemas/Task.schema';
import { FilterQuery, Model } from 'mongoose';
import { CreateTaskDto, TasksFilterDto, UpdateTaskDto } from '@app/common';

@Injectable()
export class TaskService {
    constructor(
        @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    ) {}

    async getTasks(owner: string, tasksFilterDto: TasksFilterDto) {
        const filter: FilterQuery<Task> = {};

        filter.owner = owner;

        if (tasksFilterDto.title) {
            filter.title = new RegExp(tasksFilterDto.title, 'i');
        }

        if (tasksFilterDto.status) {
            filter.status = tasksFilterDto.status;
        }

        if (tasksFilterDto.priority) {
            filter.priority = tasksFilterDto.priority;
        }

        if (tasksFilterDto.from || tasksFilterDto.to) {
            filter.dueDate = {};

            if (tasksFilterDto.from) {
                filter.dueDate.$gte = new Date(tasksFilterDto.from);
            }

            if (tasksFilterDto.to) {
                const toDate = new Date(tasksFilterDto.to);
                toDate.setHours(23, 59, 59, 999);
                filter.dueDate.$lte = toDate;
            }
        }

        const foundTasks = await this.taskModel
            .find(filter)
            .sort({ createdAt: -1 })
            .exec();

        return foundTasks;
    }

    async createTask(owner: string, createTaskDto: CreateTaskDto) {
        const newTask = {
            owner,
            ...createTaskDto,
        };

        const createdTask = await this.taskModel.create(newTask);

        return createdTask;
    }

    async updateTask(owner: string, id: string, updateTaskDto: UpdateTaskDto) {
        const updatedTask = await this.taskModel.findOneAndUpdate(
            { owner: owner, _id: id },
            updateTaskDto,
            { runValidators: true, new: true },
        );

        if (!updatedTask) throw new NotFoundException('Task not found!');

        return updatedTask;
    }

    async deleteTask(owner: string, id: string) {
        const deletedTask = await this.taskModel.findOneAndDelete({
            owner: owner,
            _id: id,
        });

        if (!deletedTask) throw new NotFoundException('Task not found!');

        return deletedTask;
    }

    async deleteAllTasksFromUser(owner: string) {
        await this.taskModel.deleteMany({
            owner: owner,
        });

        return {
            success: true,
        };
    }
}
