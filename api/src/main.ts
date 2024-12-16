import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { EmojiLogger } from './common/filters/logger';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new EmojiLogger(),
  });
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const options = new DocumentBuilder()
  .setTitle('Task Management Platform')
  .setDescription('Your API Description')
  .setVersion('1.0')
  .addServer('http://localhost:4000', 'Local environment')
  .addTag('Your API Tag')
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name: 'JWT',
    description: 'Enter JWT token',
    in: 'header',
  },
  'JWT-auth', ) 
  .build();

const document = SwaggerModule.createDocument(app, options);

SwaggerModule.setup('api', app, document, {
  customSiteTitle: 'Api Docs',
  customfavIcon: 'https://static-00.iconduck.com/assets.00/swagger-icon-512x512-halz44im.png',
  customJs: [
    'https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.24.0/swagger-ui-bundle.min.js',
    'https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.24.0/swagger-ui-standalone-preset.min.js',
  ],
  customCssUrl: [
    'https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.24.0/swagger-ui.min.css',
    'https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.24.0/swagger-ui-standalone-preset.min.css',
  ],
  swaggerOptions: {
    withCredentials: true,
  },
});

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
