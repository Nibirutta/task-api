import {
    Controller,
    Query,
    Get,
    Post,
    Delete,
    Body,
    UseGuards,
    Request,
    Patch,
    Param,
} from '@nestjs/common';
import { CreateTaskDto, TasksFilterDto, UpdateTaskDto } from '@app/common';
import { JwtGuard } from '../guard/jwt.guard';
import { ClientTaskService } from './client-task.service';

@UseGuards(JwtGuard)
@Controller('task')
export class ClientTaskController {
    constructor(private readonly clientTaskService: ClientTaskService) {}

    @Get()
    getTasks(@Request() req, @Query() tasksFilter: TasksFilterDto) {
        return this.clientTaskService.getTasks(req.user.sub, tasksFilter);
    }

    @Post()
    createTask(@Request() req, @Body() createTaskDto: CreateTaskDto) {
        return this.clientTaskService.createTask(req.user.sub, createTaskDto);
    }

    @Patch(':id')
    updateTask(
        @Request() req,
        @Param('id') id: string,
        @Body() updateTaskDto: UpdateTaskDto,
    ) {
        return this.clientTaskService.updateTask(
            req.user.sub,
            id,
            updateTaskDto,
        );
    }
    
    @Delete(':id')
    deleteTask(@Request() req, @Param('id') id: string) {
        return this.clientTaskService.deleteTask(req.user.sub, id);
    }
}
