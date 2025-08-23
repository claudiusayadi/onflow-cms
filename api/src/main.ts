import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ApiConfig } from 'src/config/app.config';
import tokensConfig from 'src/config/tokens.config';
import * as pkg from '../package.json';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(bootstrap.name);
  const port = ApiConfig.API_PORT;
  const env = ApiConfig.NODE_ENV;
  const title: string = pkg?.name?.replace(/-/g, ' ').toUpperCase() ?? '';
  const versionMajor = pkg.version?.split('.')[0] ?? '1';
  const prefix = `api/v${versionMajor}`;

  app.use(helmet());
  app.enableCors({ origin: true, credentials: true });
  app.use(cookieParser());
  app.setGlobalPrefix(prefix);

  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(pkg.description)
    .addCookieAuth(tokensConfig.access)
    .addCookieAuth(tokensConfig.refresh)
    .setVersion(pkg.version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
    customSiteTitle: title,
  });

  await app.listen(port ?? 3000);
  logger.log(
    `📚 Swagger documentation available at http://localhost:${port}/${prefix}/docs`,
  );
  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${prefix}`,
  );
  logger.log(`🌍 Environment: ${env}`);
}

void bootstrap();
