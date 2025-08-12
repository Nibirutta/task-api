import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) return value;

        const object = plainToInstance(metatype, value);
        const errors = await validate(object, {
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
        });

        const constraints = errors.map((error) => {
            return error.constraints;
        });

        if (errors.length > 0) {
            throw new RpcException(new BadRequestException(constraints));
        }

        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
