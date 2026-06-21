export const databaseConfig = {
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'wjescm',
  database: process.env.DB_NAME ?? 'supplychain_hub',
};
