import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource } from 'typeorm';
import { RequestEntity } from '../entities/request.entity';
import 'dotenv/config';

const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  entities: [RequestEntity],
  namingStrategy: new SnakeNamingStrategy(),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

export default AppDataSource;
