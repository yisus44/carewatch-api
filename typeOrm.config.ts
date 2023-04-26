import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
const entitiesPath = join(
  __dirname,
  'src',
  '**',
  'entities',
  '*.entity{.ts,.js}',
);
const migrationPath = `${__dirname}/migrations/*.ts`;
config();
export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [entitiesPath],
  migrations: [migrationPath],
});
