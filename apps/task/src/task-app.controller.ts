import { Controller } from '@nestjs/common';
import { TaskAppService } from './task-app.service';

@Controller()
export class TaskAppController {
    constructor(private readonly taskAppService: TaskAppService) {}
}
