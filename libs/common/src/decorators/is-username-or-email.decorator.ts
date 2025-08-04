import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export function IsUsernameOrEmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsUsernameOrEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: any) {
          const obj = args.object;
          return !!(obj.username || obj.email);
        },
        defaultMessage() {
          return 'Pelo menos um dos campos (email ou username) devem ser preenchidos';
        },
      },
    });
  };
}
