import { Controller } from '@nestjs/common';
import { Payload, MessagePattern } from '@nestjs/microservices';
import { TaskAppService } from './task-app.service';

@Controller()
export class TaskAppController {
    constructor(private readonly taskAppService: TaskAppService) {}
}
