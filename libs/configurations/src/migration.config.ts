import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config({ path: `.${process.env.NODE_ENV || 'development'}.env` });

export const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,

    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'], // Note: pointing to compiled JS files
    migrationsTableName: 'migrations',
    logger: 'advanced-console', // Use the advanced console logger
    logging: ['query', 'error', 'schema', 'warn', 'info', 'log', 'migration'],
});
