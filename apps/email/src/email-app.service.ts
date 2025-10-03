import { Injectable } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { SendEmailDto } from '@app/common';

@Injectable()
export class EmailAppService {
    constructor(private readonly emailService: EmailService) {}

    async sendEmail(sendEmailDto: SendEmailDto) {
        return this.emailService.sendMail(sendEmailDto);
    }
}
