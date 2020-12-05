module.exports = {
  type: "postgres",
  host: process.env.PGHOST,
  port: 5432,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.DATABASE,
  synchronize: true,
  logging: false,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  // This needed when using npm run dev
  // entities: ["src/entity/**/*.ts"],
  
  // This needed when using npm start
  entities: ["dist/entity/*.js"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
}
