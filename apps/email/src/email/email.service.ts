import { BadGatewayException, Injectable } from '@nestjs/common';
import { AppConfigService, ENV_KEYS, SendEmailDto } from '@app/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
    private readonly emailSender;

    constructor(private readonly configService: AppConfigService) {
        this.emailSender = new Resend(
            this.configService.getData(ENV_KEYS.EMAIL_SENDER_KEY),
        );
    }

    async sendMail(sendEmailDto: SendEmailDto) {
        try {
            await this.emailSender.emails.send({
                from: `"Task Manager" <${this.configService.getData(ENV_KEYS.EMAIL_DOMAIN_ADDRESS)}>`,
                to: sendEmailDto.receiver,
                subject: sendEmailDto.subject,
                text: sendEmailDto.message,
            });

            return {
                message: 'Email was sent',
            };
        } catch (error) {
            console.log(error);

            throw new BadGatewayException('Failed to send email');
        }
    }
}
