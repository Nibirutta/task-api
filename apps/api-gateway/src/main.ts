import { NestFactory } from '@nestjs/core';

import { ApiGatewayModule } from './api-gateway.module';
import { corsOptions } from './configCors';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.enableCors(corsOptions);

  await app.listen(process.env.GATEWAY_PORT ?? 3000);
}
bootstrap();
