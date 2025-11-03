import { NOTIFICATION_PATTERNS, SendEmailDto } from '@app/common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailService } from './email/email.service';

@Controller()
export class NotificationAppController {
    constructor(private readonly emailService: EmailService) {}

    @MessagePattern(NOTIFICATION_PATTERNS.SEND_MAIL)
    sendEmail(@Payload() sendEmailDto: SendEmailDto) {
        return this.emailService.sendMail(sendEmailDto);
    }
}
