import { EMAIL_PATTERNS, SendEmailDto } from '@app/common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailAppService } from './email-app.service';

@Controller()
export class EmailAppController {
    constructor(private readonly emailAppService: EmailAppService) {}

    @MessagePattern(EMAIL_PATTERNS.SEND_MAIL)
    sendEmail(@Payload() sendEmailDto: SendEmailDto) {
        return this.emailAppService.sendEmail(sendEmailDto);
    }
}
