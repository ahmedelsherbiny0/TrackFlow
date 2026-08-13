export const DATABASE_CONFIG = {
  type: 'postgres' as const,
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'trackflow',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
