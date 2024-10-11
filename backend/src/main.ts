import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const expressApp = express();

  expressApp.use(express.json());

  expressApp.get('/', (req, res) => {
    res.send('GET request to the homepage');
  });

  expressApp.post('/', (req, res) => {
    res.send('POST request to the homepage');
  });

  expressApp.put('/', (req, res) => {
    res.send('PUT request to the homepage');
  });

  expressApp.patch('/', (req, res) => {
    res.send('PATCH request to the homepage');
  });

  expressApp.delete('/', (req, res) => {
    res.send('DELETE request to the homepage');
  });

  expressApp.options('/', (req, res) => {
    res.send('OPTIONS request to the homepage');
  });

  app.use(expressApp);

  const port = process.env.PORT || 8082;
  await app.listen(port, () => console.log(`Server running on port ${port}`));
}
bootstrap();