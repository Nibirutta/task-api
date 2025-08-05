import { NestFactory, HttpAdapterHost } from '@nestjs/core';

import { ApiGatewayModule } from './api-gateway.module';
import { corsOptions } from './configCors';
import { AllExceptionsFilter } from './filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.enableCors(corsOptions);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.listen(process.env.GATEWAY_PORT ?? 3000);
}
bootstrap();
