import { BadGatewayException, Injectable } from '@nestjs/common';
import { AppConfigService, ENV_KEYS, SendEmailDto } from '@app/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    constructor(private readonly configService: AppConfigService) {}

    private mailTransport() {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: this.configService.getData(ENV_KEYS.DEV_EMAIL),
                pass: this.configService.getData(ENV_KEYS.DEV_EMAIL_PASSWORD),
            },
        });

        return transporter;
    }

    async sendMail(sendEmailDto: SendEmailDto) {
        const transport = this.mailTransport();

        try {
            await transport.sendMail({
                from: `"Task Manager" <${this.configService.getData(ENV_KEYS.DEV_EMAIL)}>`,
                to: sendEmailDto.receiver,
                subject: sendEmailDto.subject,
                text: sendEmailDto.message,
            });

            return {
                message: 'Email was sent',
            };
        } catch (error) {
            throw new BadGatewayException('Failed to send email');
        }
    }
}
