import { Injectable, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
    CreateTaskDto,
    TASK_PATTERNS,
    TasksFilterDto,
    TRANSPORTER_PROVIDER,
    UpdateTaskDto,
    TaskResponseDto,
} from '@app/common';
import { lastValueFrom, retry, timeout } from 'rxjs';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class ClientTaskService implements OnApplicationBootstrap {
    constructor(
        @Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy,
        @InjectPinoLogger() private readonly logger: PinoLogger
    ) {}

    async onApplicationBootstrap() {
        await this.transporter.connect();
        this.logger.info('Client task connected to transporter');
    }

    async getTasks(owner: string, tasksFilterDto: TasksFilterDto) {
        try {
            return lastValueFrom<TaskResponseDto[]>(
                this.transporter
                    .send(TASK_PATTERNS.FIND, {
                        owner,
                        tasksFilterDto,
                    })
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }

    async createTask(owner: string, createTaskDto: CreateTaskDto) {
        try {
            return lastValueFrom<TaskResponseDto>(
                this.transporter
                    .send(TASK_PATTERNS.CREATE, {
                        owner,
                        createTaskDto,
                    })
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }

    async updateTask(owner: string, id: string, updateTaskDto: UpdateTaskDto) {
        try {
            return lastValueFrom<TaskResponseDto>(
                this.transporter
                    .send(TASK_PATTERNS.UPDATE, {
                        owner,
                        id,
                        updateTaskDto,
                    })
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }

    async deleteTask(owner: string, id: string) {
        try {
            return lastValueFrom<TaskResponseDto>(
                this.transporter
                    .send(TASK_PATTERNS.DELETE, {
                        owner,
                        id,
                    })
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }
}
