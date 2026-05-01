import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ===== SEGURANÇA =====
  app.use(helmet());                     // Headers de segurança automáticos
  app.enableCors();                      // Permitir requisições de outras origens
  app.useGlobalFilters(new AllExceptionsFilter()); // Padronização de erros

  // ===== SWAGGER =====
  const config = new DocumentBuilder()
    .setTitle('Sistema de Gestão de Saúde Oftalmológica')
    .setDescription('API REST da Clínica MMQ – Beira, Moçambique')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
